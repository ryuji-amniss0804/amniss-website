import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PriceHero from "../_components/PriceHero";
import LicenseStrip from "../_components/LicenseStrip";
import PriceAccordion, { type AccordionTable } from "../_components/PriceAccordion";
import FaqTop from "../_components/FaqTop";
import LastCta from "../_components/LastCta";
import Figure from "../_components/Figure";
import { MOVING_REASONS } from "../_reasons";
import { CARGO_SIZE } from "../_cargo";
import {
  CAP,
  COEF,
  DEPART,
  DIST,
  DISASSEMBLE_FEE,
  LONG_HAUL,
  MOVING_ITEMS,
  ROUNDTRIP_MAX_KM,
  ROUNDTRIP_WORK_RATE,
  SCHEDULE_TABLE,
  SLOT_FEE,
  STAIRS_FEE,
  STAIRS_FREE_UPTO,
  TIER,
  fmt,
  itemOf,
  plainTotal,
  yen,
  type CoefKey,
} from "@/lib/pricing";

/**
 * 単身引越し。
 *
 * 【92_price_pages】トップ（90・91）と同じトーンに作り直した。
 * 見た目・動き・文言の正は参考モック（top_mock_20261008/Moving.dc.html）。
 * **料金を先に「しくみ」（5つの箱）で見せてから、細部（4つの表）へ**、という順。
 * 文章は「説明」ではなく、ページに載せる短い言葉にしてある。**長く書き戻さないこと。**
 * ほかのページと共有している部品（Hero・Split・PriceTable・Faq・Cta）はここでは使っていない。
 * あちらの見た目を変えないために、pp-* と tp-* のクラスで組んである（site.css）。
 *
 * 【料金の出どころ】**lib/pricing.ts**。
 * このページの数字（5つの箱・4つの表・代表品目・実際の金額・FAQ）は全部そこから生成している。
 * **数字をこのファイルに書き足さないこと。**
 * /simulator と同じ出どころなので、片方だけ古くなることがない。
 * 元データは D:\re'vive_toyama_marketing\moving_final.md（2026/8/4 確定）。
 * 「らくらく2時間パック15,000円」「単身引越しパック25,000円」「大盛35,000円」は廃止済み。
 *
 * 【階段】2階までは出動料に込み。3階から1フロアにつき STAIRS_FEE（2026-10-08 決定）。
 * 数え方は lib/pricing.ts の stairFloors() ひとつ。ここでは STAIRS_FREE_UPTO から文言を組む。
 *
 * 【本文に数字を埋め込まないこと】
 * `{CAP}m³を…` と書くと、React が text node の境目に `<!-- -->` を入れるため
 * ビルド後のHTMLで文字列が分断される。文字列はテンプレートリテラルで丸ごと1つにしてから出す。
 *
 * 【変えてはいけない文言】
 *  - 富山市の戸別収集の電話番号 076-428-4040
 *  - 「廃棄物を回収する許可がないため、お引き取りはできません。」（2026-10-08 に言い換えた。cc_task/92 §1-2）
 *  - 日程の「いくつか当てはまるときは、高いほうだけ。重ねがけはしません。」
 *
 * 「不用品回収」「不用品処分」「引き取り」「処分します」をサービスとして書かない。
 * 「格安」「業界最安」「絶対」「100%」「積み放題」も書かない。
 */

/**
 * ワンルーム〜1K一式・富山市内・作業員2名・平日。「実際の金額」の4枚目と同じ条件。
 * title / description / ヒーローに出す下限額。**数字を書き写さないこと。**
 */
const MOVING_FROM = plainTotal({ tier: TIER[2], crew: 2, km: 12, coefKey: "heijitsu" });

export const metadata: Metadata = {
  title: `富山の単身引越し｜最短当日・軽バン1台 ${yen(MOVING_FROM)}〜 ｜ re'vive 富山`,
  description:
    `富山県全域の単身引越し。ワンルームから1Kくらいの規模だけをやっています。軽バン1台・作業員2名で、富山市内・平日 ${yen(MOVING_FROM)}から。料金の内訳は全部公開。貨物軽自動車運送事業 届出済。`,
  alternates: { canonical: "/moving" },
  openGraph: {
    title: `富山の単身引越し｜最短当日・軽バン1台 ${yen(MOVING_FROM)}〜 ｜ re'vive 富山`,
    description:
      `富山県全域の単身引越し。ワンルームから1Kくらいの規模だけをやっています。軽バン1台・作業員2名で、富山市内・平日 ${yen(MOVING_FROM)}から。料金の内訳は全部公開。貨物軽自動車運送事業 届出済。`,
    url: "https://revive-toyama.jp/moving",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

/** 品目は id で引く。id を書き間違えたらビルドで落とす（黙って空欄にしない） */
function item(id: string) {
  const it = itemOf(id);
  if (!it) throw new Error(`品目 "${id}" が lib/pricing.ts にありません`);
  return it;
}

/** 日帰りの上限。距離表のいちばん遠い行 */
const MAX_KM = DIST[DIST.length - 1].km;
/** 日程の係数の表記（×0.85） */
const coefText = (k: CoefKey) => `×${COEF[k].coef.toFixed(2)}`;
/** 階段の料金がかかり始める階 */
const STAIRS_FROM = STAIRS_FREE_UPTO + 1;

/**
 * 「日帰りは、片道300kmまで」の一言に出す地名。**距離表（DIST）に載っている所だけを書く。**
 * 表から行が消えたのに「日帰りで」と書いたままになるのを、ビルドで止める（トップと同じ考え方）。
 */
const DAYTRIP_PLACES = ["長野", "名古屋", "京都"];
for (const place of DAYTRIP_PLACES) {
  if (!DIST.some((d) => d.area.split("・").includes(place))) {
    throw new Error(`「${place}」が距離表（DIST）の area にありません。/moving の「日帰りは…」の一言を直してください`);
  }
}

/* ============ 料金：5つの箱 ============ */

/**
 * 金額は数字と単位に分けている（単位だけ小さくするため。site.css の .pp-fx .v small）。
 * 建物の条件の「0」は、条件が何もないときの金額（定数ではない）。
 */
const FORMULA: { op?: string; name: string; value: string; unit: string; desc: string; hot?: boolean }[] = [
  { name: "出動料", value: fmt(DEPART), unit: "円", desc: "どの依頼にも共通" },
  { op: "＋", name: "荷物の量", value: fmt(TIER[0].work[1]), unit: "円〜", desc: `${TIER.length}段・作業員2名の場合` },
  { op: "＋", name: "距離", value: fmt(DIST[0].fee), unit: "円〜", desc: `${DIST[0].area}は${yen(DIST[0].fee)}` },
  { op: "＋", name: "建物の条件", value: "0", unit: "円〜", desc: `${STAIRS_FROM}階からの階段など` },
  { op: "×", name: "日程", value: coefText("omakase"), unit: "〜", desc: "おまかせが一番お得", hot: true },
];

/** 「出動料に込み：」の札 */
const INCLUDED = ["軽バン1台", "毛布・ラップ・ベルト", `${STAIRS_FREE_UPTO}階までの階段`, "搬入後の設置"];

/* ============ 料金：4つの表 ============ */

/** 荷物の量（作業料）。TIER から。大型があれば2名。2名が既定なので、2名を主にして1名を注に回す */
const VOLUME_ROWS = TIER.map((t) => ({
  name: t.name,
  desc: `〜${t.cap.toFixed(1)}m³（1名なら${yen(t.work[0])}）`,
  price: fmt(t.work[1]),
}));

/** 距離料。片道。高速代は含まない（高速を使う場合は事前のお見積りに含めて提示）。
    DIST ＋ 300km超の LONG_HAUL */
const DISTANCE_ROWS = [
  ...DIST.map((d) => ({ name: `〜${d.km}km`, desc: d.area, price: fmt(d.fee) })),
  ...LONG_HAUL.map((l) => ({ name: l.name, desc: "1泊2日", price: `${fmt(l.from)}〜` })),
];

/** 建物の条件。金額は定数から。行の説明だけがこのページの文言 */
const CONDITION_ROWS = [
  { name: "階段", desc: `${STAIRS_FROM}階から・エレベーターなし・1フロアにつき`, price: fmt(STAIRS_FEE) },
  { name: "時刻指定", desc: "◯時ちょうどに伺う", price: fmt(SLOT_FEE) },
  { name: "家具の分解・組み立て", desc: "ベッドフレームなど・1点につき", price: fmt(DISASSEMBLE_FEE) },
  { name: "有料駐車場", desc: "コインパーキングしかない場合", price: "実費" },
];

/** 日程係数。複数該当は高いほうだけ */
const SCHEDULE_ROWS = SCHEDULE_TABLE.map((s) => ({
  name: s.name,
  desc: s.desc,
  price: coefText(s.key),
}));

/** 係数のいちばん小さいものと大きいもの（「×0.85〜×1.50」） */
const COEF_KEYS = SCHEDULE_TABLE.map((s) => s.key).sort((a, b) => COEF[a].coef - COEF[b].coef);
const COEF_RANGE = `${coefText(COEF_KEYS[0])}〜${coefText(COEF_KEYS[COEF_KEYS.length - 1])}`;

const TABLES: AccordionTable[] = [
  {
    name: "荷物の量",
    sub: `${TIER.length}段`,
    rows: VOLUME_ROWS,
    note: `大型の家具・家電がなければ、作業員1名の金額になります。${CAP.toFixed(1)}m³を超える場合は、2往復のご相談に。`,
  },
  {
    name: "距離（片道）",
    sub: `${DIST[0].area}は${yen(DIST[0].fee)}`,
    rows: DISTANCE_ROWS,
    note: "高速道路を使う場合は、その分も事前のお見積りに入れます。",
  },
  {
    name: "建物の条件",
    sub: `${STAIRS_FREE_UPTO}階までは込み`,
    rows: CONDITION_ROWS,
    note: "エレベーターがあれば、何階でも階段の料金はかかりません。",
  },
  {
    name: "日程",
    sub: COEF_RANGE,
    rows: SCHEDULE_ROWS,
    note: "いくつか当てはまるときは、高いほうだけ。重ねがけはしません。",
  },
];

/* ============ 積める量 ============ */

/** 大きな数字で出す4つ。寸法は _cargo.ts、積める量は CAP */
const CARGO_SPECS = [
  { label: "幅", value: String(CARGO_SIZE.w), unit: "cm" },
  { label: "高さ", value: String(CARGO_SIZE.h), unit: "cm" },
  { label: "奥行", value: String(CARGO_SIZE.d), unit: "cm" },
  { label: "積める量", value: CAP.toFixed(1), unit: "m³" },
];

/**
 * 代表品目の容積。全29品目は載せない（/simulator が受ける）。
 * どの8品目を出すかは lib/pricing.ts の MOVING_ITEMS。寸法・容積も同じ品目定義から。
 * 寸法の欄は数字だけ（品目定義の size は、全角スペースのあとに一言が続くものがある）。
 */
const ITEM_VOLUME_ROWS = MOVING_ITEMS.map((pick) => {
  const it = item(pick.id);
  return {
    name: pick.name ?? it.short ?? it.name,
    desc: it.size.split("　")[0],
    price: `${it.m3.toFixed(2)}m³`,
  };
});

/* ============ 実際の金額 ============ */

/**
 * moving_final.md の「4. 実際の金額（検算）」の8行。どれも作業員2名・階段なし。
 * **金額は書かずに、条件から計算している。**手で書いた数字を置くと、
 * 上の表を直したときにここだけ古くなる。
 * 「1K一式」は 1.9〜2.8m³ ＝ 軽バン満載の区分。
 */
const EXAMPLE_CASES: {
  name: string;
  /** 日程。カードの2行目に出す */
  day: string;
  /** 黄色の札にする（当日・日程おまかせ） */
  hot?: boolean;
  tier: number;
  km: number;
  coef: CoefKey;
}[] = [
  { name: "冷蔵庫1点・富山市内", day: "平日", tier: 0, km: 12, coef: "heijitsu" },
  { name: "冷蔵庫1点・富山市内", day: "当日", hot: true, tier: 0, km: 12, coef: "touji" },
  { name: "1K一式・富山市内", day: "日程おまかせ", hot: true, tier: 2, km: 12, coef: "omakase" },
  { name: "1K一式・富山市内", day: "平日", tier: 2, km: 12, coef: "heijitsu" },
  { name: "1K一式・富山市内", day: "土日祝", tier: 2, km: 12, coef: "donichi" },
  // 高岡は実際の道のり（約25km）どおり、30kmまでの段。2026-10-08 本人の決定で 40km から直した。
  // lib/regions.ts の 富山市↔高岡市 と同じ値。トップの「料金の目安」と同じ金額になる
  { name: "1K一式・高岡（25km）", day: "平日", tier: 2, km: 25, coef: "heijitsu" },
  { name: "1K一式・金沢（60km）", day: "土日祝", tier: 2, km: 60, coef: "donichi" },
  { name: "1K一式・名古屋（250km）", day: "平日", tier: 2, km: 250, coef: "heijitsu" },
];

const EXAMPLES = EXAMPLE_CASES.map((c) => ({
  ...c,
  price: fmt(plainTotal({ tier: TIER[c.tier], crew: 2, km: c.km, coefKey: c.coef })),
}));

/* ============ よくあるご質問 ============ */

/** 金額・距離・係数はすべて定数から。答えは必ずテンプレートリテラルで1本にする */
const FAQ = [
  {
    q: "当日でもお願いできますか？",
    a: `空いていれば伺います。日程の係数は${coefText("touji")}です。まずは電話かLINEでご相談ください。`,
  },
  {
    q: "荷物が積みきれない場合は？",
    a: `片道${ROUNDTRIP_MAX_KM}kmまでなら、同じ日に2往復で運べます。それより遠い場合は、荷物を減らすか、買取に回すご相談になります。`,
  },
  {
    q: "お手伝いは必要ですか？",
    a: "いりません。大型の家具・家電があれば、はじめから2名で伺います。",
  },
  {
    q: "400L以上の冷蔵庫は運べますか？",
    a: `運べません。荷台の高さが${CARGO_SIZE.h}cmまでのためです。ピアノ・金庫、2トントラックが要る量もお受けできません。`,
  },
];

export default function MovingPage() {
  return (
    <div className="tp pp">
      {/* ① ヒーロー。紺の地。見出しはお客さんの言葉、リードでこちらが名乗る。
          右は荷台の断面図。実車の写真は「軽バンだ」としか言えず、
          このページで先に知りたいのは「自分の荷物が入るか」なので、寸法のほうを出す */}
      <PriceHero
        kicker="単身引越し ／ 富山県全域"
        title={["荷物、そんなに", "多くないんですけど。"]}
        lead={["その規模のお引越しだけ、やっています。", "ワンルーム〜1Kを、軽バン1台で。"]}
        actions={
          <>
            <Link href="/simulator" className="tp-btn tp-btn-y">
              自分の金額をみる
            </Link>
            <div className="pp-hero-from">
              <span>富山市内・平日</span>
              <b className="tp-num">
                {fmt(MOVING_FROM)}
                <small>円〜</small>
              </b>
            </div>
          </>
        }
        figure={<Figure name="cargo" caption="ワンルーム〜1K一式で、このくらい" />}
      />

      {/* ② 許認可の帯。91 のバッジ */}
      <LicenseStrip variant="badge" />

      {/* ③ 料金。5つの箱（しくみ）→ 込みの札 → 計算式の一文 → 4つの表（細部） */}
      <section className="pp-sec">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">PRICE</p>
            <h2 className="tp-h2">
              金額は、<span className="tp-mark pp-fill">先に決まります</span>
            </h2>
            <p className="tp-sec-lead">税込。作業のあとに増えることはありません。</p>
          </div>

          <div className="pp-formula tp-rise">
            {FORMULA.map((f) => (
              <Fragment key={f.name}>
                {f.op ? (
                  <span className="pp-fx-op tp-num" aria-hidden="true">
                    {f.op}
                  </span>
                ) : null}
                <div className={f.hot ? "pp-fx y" : "pp-fx"}>
                  <span className="k">{f.name}</span>
                  <span className="v tp-num">
                    {f.value}
                    <small>{f.unit}</small>
                  </span>
                  <span className="d">{f.desc}</span>
                </div>
              </Fragment>
            ))}
          </div>

          <ul className="pp-inc">
            <li className="h">出動料に込み：</li>
            {INCLUDED.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          {/* 計算式の一文。消さずに小さく残す（cc_task/92 §3-2） */}
          <p className="pp-fine">
            （出動料 ＋ 荷物の量 ＋ 距離 ＋ 建物の条件）× 日程。すべて税込で、100円未満は切り捨てます。お見積りは作業を始める前に確定します。
          </p>

          <PriceAccordion items={TABLES} />
        </div>
      </section>

      {/* ④ 積める量。ベージュの地 */}
      <section className="pp-sec beige">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">CARGO</p>
            <h2 className="tp-h2">これ、積めますか？</h2>
          </div>
          <div className="pp-cargo">
            <div className="pp-cargo-l">
              <dl className="pp-bigspec">
                {CARGO_SPECS.map((c) => (
                  <div key={c.label}>
                    <dt>{c.label}</dt>
                    <dd className="tp-num">
                      {c.value}
                      <small>{c.unit}</small>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="tp-sec-lead">{`冷蔵庫は高さ${CARGO_SIZE.h}cmまで。洗濯機は縦型もドラム式も積めます。`}</p>
              <div className="pp-note-box tp-rise">
                <h3>積みきれないときは、2往復</h3>
                <p>{`片道${ROUNDTRIP_MAX_KM}kmまでなら、同じ日に2回に分けて運べます。出動料はそのまま、作業料の${Math.round(
                  ROUNDTRIP_WORK_RATE * 100,
                )}%と距離料を足した金額です。`}</p>
                <p>{`${ROUNDTRIP_MAX_KM}kmより遠い場合は、荷物を減らすか、売れる物を買取に回すご相談になります。`}</p>
              </div>
              {/* ★電話番号と、許可がない旨（cc_task/92 §1-2 の言い換え）は一字一句このまま */}
              <p className="pp-fine">
                買い取れない物（マットレス・布団・ソファ・カラーボックスなど）は、富山市の戸別収集をご予約ください（
                <span className="nw">076-428-4040</span>
                ）。廃棄物を回収する許可がないため、お引き取りはできません。
              </p>
            </div>
            <div className="pp-cargo-r">
              {/* 代表品目だけ。全29品目は /simulator が受ける */}
              <table className="pp-tbl box">
                <tbody>
                  {ITEM_VOLUME_ROWS.map((r) => (
                    <tr key={r.name}>
                      <th scope="row">{r.name}</th>
                      <td className="d">{r.desc}</td>
                      <td className="p tp-num">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link href="/simulator" className="tp-btn tp-btn-n">
                全部の品目で計算する
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ⑤ 実際の金額。カード4列。「当日」「日程おまかせ」は黄色の札 */}
      <section className="pp-sec">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">EXAMPLES</p>
            <h2 className="tp-h2">だいたい、こんな金額です</h2>
            <p className="tp-sec-lead">作業員2名・階段なしの場合。</p>
          </div>
          <div className="pp-cases">
            {EXAMPLES.map((c) => (
              <div className="pp-case tp-rise" key={`${c.name}-${c.day}`}>
                <span className="t">{c.name}</span>
                <span className="d">{c.hot ? <b>{c.day}</b> : c.day}</span>
                <span className="p tp-num">
                  {c.price}
                  <small>円</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑥ 4つの約束＋日帰りの上限。4項目は ../_reasons.ts（トップと同じもの。書き写さない）。
          見た目もトップと同じ（tp-rs）。「改善基準告示…8.5時間…」の説明は 92 で外した */}
      <section className="pp-sec flush">
        <div className="tw">
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
          <div className="pp-note-box row tp-rise">
            <span className="big tp-num">
              {MAX_KM}
              <small>km</small>
            </span>
            <div>
              <h3>{`日帰りは、片道${MAX_KM}kmまで`}</h3>
              <p>{`${DAYTRIP_PLACES.join("・")}まで、日帰りで伺います。${LONG_HAUL.map((l) => l.name.replace("方面", "")).join("・")}方面は1泊2日で。`}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ⑦ よくあるご質問。トップと同じ形（FaqTop）。id="faq" は前のまま */}
      <section className="tp-faq" id="faq">
        <div className="tw tp-sec-in">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">FAQ</p>
            <h2 className="tp-h2">よくあるご質問</h2>
          </div>
          <FaqTop items={FAQ} />
        </div>
      </section>

      {/* ⑧ 最後の案内。トップと同じ黄色の帯 */}
      <LastCta title="まずは、写真を1枚。" lead="運びたい物を撮って送ってください。その場で概算をお伝えします。" />
    </div>
  );
}
