import type { Metadata } from "next";
import Link from "next/link";
import HeroTop from "./_components/HeroTop";
import LicenseStrip from "./_components/LicenseStrip";
import QuickEstimate from "./_components/QuickEstimate";
import CountUp from "./_components/CountUp";
import FaqTop from "./_components/FaqTop";
import { MOVING_REASONS } from "./_reasons";
import { INDOOR_FEE, SPOT_FEE } from "./_fees";
import { AREA, COMPANY, HOURS, LICENSES, LINE_URL, TEL, TEL_HREF, WASTE_NOTICE } from "@/lib/site";
// 「できること」の re'vive_doc のカードに出す出張診断の金額。**ここに数字を書き写さないこと**（/pc /pc/price と同じ出どころ）。
// lib/pc.ts はデータだけで CSS もコンポーネントも持たないので、(site) から読んでよい。
// yen は lib/pricing にも同名の別物（あちらは「円」まで付ける）があるので必ず別名で入れる。
import { DIAGNOSIS_FEE, yen as pcYen } from "@/lib/pc";
import {
  CAP,
  COEF,
  DEPART,
  DIST,
  ROUNDTRIP_MAX_KM,
  TIER,
  fmt,
  plainTotal,
  yen,
} from "@/lib/pricing";

/**
 * トップページ。
 *
 * 旧 (corporate)/page.tsx を捨てて、こちらに作り直したもの（14_top 段階3-4）。
 * (site) 側に来たので、Tailwind ではなく site.css、
 * ヘッダー・フッター・モバイルバーも (site) のものになる。
 *
 * 【90_top_renewal】上の4つ（ヒーロー・流れる帯・料金の目安・料金のしくみ）を新しく組んだ。
 * 見た目・動き・文言の正は参考モック（top_mock_20261008/Main.dc.html）。
 *
 * 【91_top_lower】その下（許認可の帯から最後の案内まで）も同じモックで組み直した。
 * 文章は「説明」ではなく、ページに載せる短い言葉にしてある（本人の指摘）。**長く書き戻さないこと。**
 * ほかのページと共有している部品（Cta・Faq・Split・ReasonList）はここでは使っていない。
 * あちらの既定の見た目を変えないために、トップ用は tp-* のクラスでこのファイルに組んである。
 * LicenseStrip だけは `variant="badge"` を足して共有している。
 *
 * 【料金の出どころ】**lib/pricing.ts**。
 * 引ける数字は引く。**このファイルに金額を書き足さないこと。**
 * 式から出ない8,000円（法人スポット便・室内作業）だけは _fees.ts から引く。
 * /unpan /houjin と同じ定数を見ているので、3ページでずれることがない。
 *
 * 【「できること」と FAQ は、同じ数字を2回出す】
 * 運搬（CARRY_FROM）と当日（TOUJI_FULL）の金額は、どちらの節でも同じ定数から組んでいる。
 * **片方だけ手で書き換えられる状態を作らないこと。**1円ずれたらそこで終わる。
 *
 * 【本文に数字を埋め込まないこと】
 * `{CAP}m³を…` と書くと React が text node の境目に `<!-- -->` を入れるので、
 * 文字列はテンプレートリテラルで1本にしてから渡す。
 *
 * 【変えてはいけない文言】
 *  - WASTE_NOTICE（一般廃棄物収集運搬業の許可がない旨。会社の節に**1回だけ**そのまま出す）
 *  - 「4つの約束」の4項目（_reasons.ts。/moving と共通。直すなら向こうで）
 *  - FAQ「不用品の処分」の答えの電話番号（富山市の戸別収集）
 *
 * 「不用品回収」「不用品処分」「引き取り」「処分します」をサービスとして書かない。
 * 「格安」「業界最安」「絶対」「100%」「積み放題」、口コミ、他社比較も書かない。
 * 住所は富山県富山市まで。番地を出さない。
 */

/* ============ lib/pricing.ts から引く数字 ============ */

/** ワンルーム〜1K・富山市内・作業員2名・平日。/moving の検算表の4行目と同じ条件 */
const MOVING_FROM = plainTotal({ tier: TIER[2], crew: 2, km: 12, coefKey: "heijitsu" });
/** 家具・家電1〜2点（小口・〜0.9m³）・富山市内・作業員2名・平日
 *  ⚠ 段は点数ではなく体積で決まる。3点以上とソファ・自転車は次の段（軽バン半分）。
 *     点数の幅でラベルを付け直すときは注意。3点を小口に含めると4,000円足りない。 */
const CARRY_FROM = plainTotal({ tier: TIER[0], crew: 2, km: 12, coefKey: "heijitsu" });
/**
 * 当日のお引越し。ワンルーム〜1K一式・富山市内・作業員2名。
 * MOVING_FROM と条件は同じで、日程係数だけが平日(×1.00)→当日(×1.50)。
 * (5,000 ＋ 15,000 ＋ 0) × 1.50 ＝ 30,000。**ベタ書きしない。**
 */
const TOUJI_FULL = plainTotal({ tier: TIER[2], crew: 2, km: 12, coefKey: "touji" });
/** 日帰りの上限。距離表のいちばん遠い行 */
const MAX_KM = DIST[DIST.length - 1].km;

/**
 * 「先に出している数字」の一言に出す地名。**距離表（DIST）に載っている所だけを書く。**
 * 表から行が消えたのに「日帰りで」と書いたままになるのを、ビルドで止める。
 */
const DAYTRIP_PLACES = ["長野", "名古屋"];
for (const place of DAYTRIP_PLACES) {
  if (!DIST.some((d) => d.area.split("・").includes(place))) {
    throw new Error(`「${place}」が距離表（DIST）の area にありません。トップの「日帰りの上限」の一言を直してください`);
  }
}

export const metadata: Metadata = {
  title: `富山の単身引越しと出張買取｜軽バン1台 ${yen(MOVING_FROM)}〜 ｜ re'vive 富山`,
  description:
    `富山県全域。軽バン1台でできる範囲だけをやっています。ワンルームから1Kくらいの単身引越しが富山市内・平日 ${yen(MOVING_FROM)}から、家具1点の運搬、出張買取は査定無料。積める量も日帰りの上限も先に公開しています。貨物軽自動車運送事業 届出済／古物商許可。`,
  alternates: { canonical: "/" },
  openGraph: {
    title: `富山の単身引越しと出張買取｜軽バン1台 ${yen(MOVING_FROM)}〜 ｜ re'vive 富山`,
    description:
      `富山県全域。軽バン1台でできる範囲だけをやっています。ワンルームから1Kくらいの単身引越しが富山市内・平日 ${yen(MOVING_FROM)}から、家具1点の運搬、出張買取は査定無料。積める量も日帰りの上限も先に公開しています。貨物軽自動車運送事業 届出済／古物商許可。`,
    url: "https://revive-toyama.jp",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

/**
 * 古物商許可の「富山県公安委員会 第501310007877号」を、発行者と番号に割る。
 *
 * 番号だけ `.nw`（折り返し禁止）で束ねたい。そのままだと本文列の幅しだいで
 * **「…公安委員会第 ／ 501310007877号」と、第と数字が別の行に割れる。**
 * word-break: auto-phrase は「第」と数字を別の文節と見るので、これでは直らない。
 * 番号をこのファイルに書き写さないために、lib/site.ts の値から割っている。
 */
const [KOBUTSU_ISSUER, KOBUTSU_NO] = (() => {
  const v: string = LICENSES[1].value;
  const i = v.indexOf(" ");
  if (i < 0) throw new Error(`古物商許可の value に半角スペースがありません: ${v}`);
  return [v.slice(0, i), v.slice(i + 1)];
})();

/**
 * できること（カード6枚）。
 *
 * 金額は数字と単位に分けている（単位だけ小さくするため。site.css の .tp-svc-card .p small）。
 * ⚠ 当日の行は「〜」を外さないこと。式から一意に出るのは建物の条件が0のときだけで、
 *    3階以上の階段や時刻指定にも当日の係数が掛かる。
 * ⚠ 法人スポット便と出張診断は式から出ない（_fees.ts の SPOT_FEE、lib/pc.ts の DIAGNOSIS_FEE）。
 *    /houjin /pc と同じ定数。pcYen は「円」を付けないので、単位の側で付ける。
 */
type ServiceRow = {
  /** 左上の番号。re'vive_doc のカードだけは名前を出す */
  no: string;
  name: string;
  desc: string;
  href: string;
  /** 金額（3桁区切り・単位なし）と単位。金額でない行は free を使う */
  price?: string;
  unit?: string;
  /** 金額の代わりに出す言葉（深緑）。数字の書体にしない */
  free?: string;
  /** re'vive_doc のカード。紺の地・グリーン（--rv-doc）の影 */
  doc?: boolean;
};

const SERVICE_ROWS: ServiceRow[] = [
  {
    no: "01",
    name: "単身引越し",
    desc: "ワンルーム〜1K一式。富山市内・平日の場合",
    price: fmt(MOVING_FROM),
    unit: "円〜",
    href: "/moving",
  },
  {
    no: "02",
    name: "家具・家電の運搬",
    desc: "冷蔵庫や洗濯機を1〜2点。富山市内・平日の場合",
    price: fmt(CARRY_FROM),
    unit: "円〜",
    href: "/unpan",
  },
  {
    no: "03",
    name: "当日のお引越し",
    desc: "空きがあれば、その日のうちに伺います。",
    price: fmt(TOUJI_FULL),
    unit: "円〜",
    href: "/moving",
  },
  {
    no: "04",
    name: "法人スポット便",
    desc: "1時間まで。当日も土日祝も同じ料金です。",
    price: fmt(SPOT_FEE),
    unit: "円〜",
    href: "/houjin",
  },
  {
    no: "05",
    name: "出張買取",
    desc: "査定だけでも無料です。",
    free: "査定無料",
    href: "/kaitori",
  },
  {
    doc: true,
    no: "re'vive_doc",
    name: "パソコンの修理・診断",
    desc: "出張で診断して、直せるかどうかを報告書でお渡しします。",
    price: pcYen(DIAGNOSIS_FEE),
    unit: "円　出張診断",
    href: "/pc",
  },
];

/**
 * 先に出している数字。画面に入ったら 0 から数え上げる（CountUp）。
 * 数字と単位を分けているのは、単位だけ小さくするため（site.css の .tp-nb-v small）。
 */
const NUMBERS: { label: string; to: number; digits?: number; unit: string; note: string }[] = [
  {
    label: "積める量",
    to: CAP,
    digits: 1,
    unit: "m³",
    note: "ワンルーム〜1Kの荷物が、1台に収まります。",
  },
  {
    label: "富山市内・平日",
    to: MOVING_FROM,
    unit: "円",
    note: "ワンルーム〜1K一式。養生と設置まで込み。",
  },
  {
    label: "日帰りの上限",
    to: MAX_KM,
    unit: "km",
    note: `${DAYTRIP_PLACES.join("・")}も、日帰りで。`,
  },
];

/**
 * よくあるご質問。金額と距離はすべて定数から。**本文に数字を書かないこと。**
 * 「できること」と同じ数字を2回出している（CARRY_FROM・TOUJI_FULL）。
 * 答えは必ずテンプレートリテラルで1本にする。「シミュレーター」の語は FaqTop がリンクにする。
 */
const FAQ = [
  {
    q: "見積りはどうやって出ますか。",
    a: `出動料${yen(DEPART)}＋荷物＋距離に、日程を掛けた金額です。シミュレーターで、そのまま出せます。`,
  },
  {
    q: "1点だけでもお願いできますか。",
    a: `はい。冷蔵庫1点なら、富山市内・平日で${yen(CARRY_FROM)}です。同じ部屋の中で動かすだけなら${yen(INDOOR_FEE)}です。`,
  },
  {
    q: "当日でもお願いできますか。",
    a: `空きがあればお受けします。ワンルーム〜1K一式・富山市内で${yen(TOUJI_FULL)}からです。`,
  },
  {
    q: "荷物が積みきれるか分かりません。",
    a: `シミュレーターで品目を選ぶと、積めるかどうかがわかります。積みきれなければ、同じ日に2回に分けて運べます（片道${ROUNDTRIP_MAX_KM}kmまで）。`,
  },
  {
    // 許可がないことを先に言う。★富山市の戸別収集の番号は変えてはいけない
    q: "不用品の処分もお願いできますか。",
    a: "できません。廃棄物を回収する許可がないためです。売れる物は買取でご相談ください。処分は富山市の戸別収集（076-428-4040）へ。",
  },
  {
    q: "法人ですが、請求書払いはできますか。",
    a: "できます。月締めです。",
  },
];

/** カードの「くわしく」の矢印 */
function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M3 8h9M8 3.5L12.5 8 8 12.5" />
    </svg>
  );
}

/** 流れる帯 */
const MARQUEE = [
  "富山県全域",
  "軽バン1台",
  "作業員の人数は荷物で決まります",
  "金額は先に公開",
  "出張買取も同時に",
];

/** 料金のしくみ。大きな字・見出し・説明 */
const HOW = [
  {
    big: fmt(DEPART),
    title: "出動料",
    body: "軽バン1台・養生・搬入後の設置。どの依頼にも共通です。",
  },
  {
    big: "＋ 荷物",
    title: "量と人数",
    body: `荷台に占める量で${TIER.length}段。冷蔵庫など大型が1点でもあれば作業員2名です。`,
  },
  {
    big: "＋ 距離",
    title: "片道の距離",
    body: `富山市内は${DIST[0].fee}円。遠くなるほど段で上がります。`,
  },
  {
    big: "× 日程",
    title: "日にちの決め方",
    body: `おまかせ×${COEF.omakase.coef.toFixed(2)}から当日×${COEF.touji.coef.toFixed(
      2,
    )}まで。日にちに余裕があるほど安くなります。`,
  },
];

export default function TopPage() {
  return (
    <div className="top">
      {/* ① ヒーロー。写真の上に紺を重ねて文字を置く（90_top_renewal で作り直した）。
          金額は MOVING_FROM から渡す。**直書きしない** */}
      <HeroTop from={fmt(MOVING_FROM)} />

      {/* 流れる帯。飾りなので読み上げない。同じ並びを2回置いて、半分ずれたところで頭に戻す */}
      <div className="tp tp-marq" aria-hidden="true">
        <div className="tp-marq-in">
          {[0, 1].map((n) =>
            MARQUEE.map((t) => (
              <span key={`${n}-${t}`}>
                <b>{t}</b>
                <i>／</i>
              </span>
            )),
          )}
        </div>
      </div>

      {/* 料金の目安。⑤図版（シミュレーターへの導線）の代わり。
          **シミュレーター本体は埋めない（トップが重くなる）。**これは軽い別部品 */}
      <QuickEstimate />

      {/* 料金のしくみ。数字は DEPART と COEF から。本文に書かない */}
      <section className="tp tp-how" id="how">
        <div className="tw tp-sec-in">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">HOW IT WORKS</p>
            <h2 className="tp-h2">金額は、この4つの足し算と掛け算だけ</h2>
          </div>
          <div className="tp-flow">
            {HOW.map((h) => (
              <div key={h.title}>
                <span className="tp-num v">{h.big}</span>
                <b>{h.title}</b>
                <p>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 許認可の帯。紺の地にバッジ3つ。料金のしくみ（紺）と地続きになる */}
      <LicenseStrip variant="badge" />

      {/* できること。カード6枚。文中リンクの一覧と「パソコンの修理・診断もしています」の節は、
          このカードが代わりになるので外した（91_top_lower） */}
      <section className="tp tp-svc" id="svc">
        <div className="tw tp-sec-in">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">SERVICE</p>
            <h2 className="tp-h2">できること</h2>
            <p className="tp-sec-lead">{`軽バン1台で、${AREA}へ。`}</p>
          </div>
          <div className="tp-cards">
            {SERVICE_ROWS.map((r) => (
              <Link href={r.href} className={r.doc ? "tp-svc-card doc tp-rise" : "tp-svc-card tp-rise"} key={r.name}>
                <span className={r.doc ? "no" : "no tp-num"}>{r.no}</span>
                <span className="t">{r.name}</span>
                <span className="d">{r.desc}</span>
                {r.free ? (
                  <span className="p free">{r.free}</span>
                ) : (
                  <span className="p tp-num">
                    {r.price}
                    <small>{r.unit}</small>
                  </span>
                )}
                <span className="go">
                  {r.doc ? "専用ページへ" : "くわしく"}
                  <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 先に出している数字。黄色の地。数字は CAP・MOVING_FROM・MAX_KM。**直書きしない** */}
      <section className="tp tp-nums">
        <div className="tw tp-sec-in">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">NUMBERS</p>
            <h2 className="tp-h2">
              積める量も、上限も、
              <br />
              ぜんぶ先に。
            </h2>
          </div>
          <div className="tp-nbs">
            {NUMBERS.map((n) => (
              <div className="tp-nb" key={n.label}>
                <span className="tp-nb-k">{n.label}</span>
                <span className="tp-nb-v tp-num">
                  <CountUp to={n.to} digits={n.digits} />
                  <small>{n.unit}</small>
                </span>
                <span className="tp-nb-d">{n.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4つの約束。/moving と同じ4項目（_reasons.ts）を、トップの見た目で出す。
          ReasonList は使わない（あちらの見た目を変えないため） */}
      <section className="tp tp-pol">
        <div className="tw tp-sec-in">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">POLICY</p>
            <h2 className="tp-h2">
              当日、困らないための
              <br />
              {`${MOVING_REASONS.length}つの約束`}
            </h2>
          </div>
          <ol className="tp-rs-list">
            {MOVING_REASONS.map((r, i) => (
              <li className="tp-rs tp-rise" key={r.title}>
                <span className="tp-rs-n tp-num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="tp-rs-b">
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                  {r.evidence ? <span className="tp-rs-e">{r.evidence}</span> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 会社。トップに来る人は「ちゃんとした業者か」を見に来るので、そこに答える。
          許認可の文言は lib/site.ts の LICENSES から組む。番号を書き写さない。
          番号は .nw で束ねて、行末で「第」と数字に割れないようにしている。
          ★いちばん下の一文（WASTE_NOTICE）は法務確認済み。**消さない・変えない** */}
      <section className="tp tp-co-sec">
        <div className="tw">
          <div className="tp-co tp-rise">
            <div className="tp-co-hd">
              <p className="tp-eyebrow tp-num">COMPANY</p>
              <h2 className="tp-h2">来るのは、こんな業者です</h2>
              <Link href="/company" className="tp-btn tp-btn-o">
                会社概要をみる
              </Link>
            </div>
            <div className="tp-co-body">
              <dl className="tp-co-dl">
                <div>
                  <dt>対応エリア</dt>
                  <dd>
                    {`${AREA}。県外は片道${MAX_KM}kmまで日帰り。`}
                    <br />
                    大阪・東京方面は1泊2日で。
                  </dd>
                </div>
                <div>
                  <dt>受付</dt>
                  <dd>{HOURS}</dd>
                </div>
                <div>
                  <dt>許認可</dt>
                  <dd>
                    {`${LICENSES[0].label} ${LICENSES[0].value}`}
                    <br />
                    {`${LICENSES[1].label} ${KOBUTSU_ISSUER} `}
                    <span className="nw">{KOBUTSU_NO}</span>
                  </dd>
                </div>
                <div>
                  <dt>運営</dt>
                  <dd>{`${COMPANY.legal}（${LICENSES[2].label}）`}</dd>
                </div>
              </dl>
              <p className="tp-co-note">{WASTE_NOTICE}</p>
            </div>
          </div>
        </div>
      </section>

      {/* よくあるご質問。**id="faq" はヘッダーとフッターの「よくある質問」の飛び先。変えないこと。**
          /moving にも FAQ はあるが、そちらへ寄せない。買取を見に来た人が
          引越しの FAQ に着地するのは、リンク切れより悪い */}
      <section className="tp tp-faq" id="faq">
        <div className="tw tp-sec-in">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">FAQ</p>
            <h2 className="tp-h2">よくあるご質問</h2>
          </div>
          <FaqTop items={FAQ} />
        </div>
      </section>

      {/* 最後の案内。**id="cta" はヘッダーの「見積りを依頼」の飛び先。**
          下層ページの Cta（濃紺の帯）とは別に組んである。あちらの見た目と文言は変えていない */}
      <section className="tp tp-last" id="cta">
        <div className="tw tp-last-in">
          <div className="tp-last-l">
            <h2 className="tp-h2">まずは、写真を1枚。</h2>
            <p>運びたい物、売りたい物を撮って送ってください。型番が写っていれば、その場で概算をお伝えします。</p>
          </div>
          <div className="tp-last-r">
            <a className="tp-btn tp-btn-n" href={LINE_URL} target="_blank" rel="noopener noreferrer">
              LINEで写真を送る
            </a>
            <a className="tp-btn tp-btn-nw" href={TEL_HREF}>
              <span className="tp-num tp-last-tel">{TEL}</span>
            </a>
            <Link className="tp-btn tp-btn-nw sm" href="/contact">
              見積りフォーム
            </Link>
            <p className="tp-last-hrs">{`受付 ${HOURS} ／ ${AREA}`}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
