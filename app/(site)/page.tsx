import type { Metadata } from "next";
import Link from "next/link";
import HeroTop from "./_components/HeroTop";
import LicenseStrip from "./_components/LicenseStrip";
import Split from "./_components/Split";
import PriceTable from "./_components/PriceTable";
import Spec from "./_components/Spec";
import ReasonList from "./_components/ReasonList";
import Cta from "./_components/Cta";
import Faq from "./_components/Faq";
import Figure, { CARGO_CAPTION } from "./_components/Figure";
import { MOVING_REASONS } from "./_reasons";
import { INDOOR_FEE, SPOT_FEE } from "./_fees";
import { AREA, HOURS, LICENSES, TEL, TEL_HREF, WASTE_NOTICE } from "@/lib/site";
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
 * 【料金の出どころ】**lib/pricing.ts**。
 * 引ける数字は引く。**このファイルに金額を書き足さないこと。**
 * 式から出ない8,000円（法人スポット便・室内作業）だけは _fees.ts から引く。
 * /unpan /houjin と同じ定数を見ているので、3ページでずれることがない。
 *
 * 【③ やっていること と ⑧ FAQ は、同じ数字を2回出す】
 * 12,000／8,000／20,000／30,000 は、どちらの節でも同じ定数から組んでいる。
 * **片方だけ手で書き換えられる状態を作らないこと。**1円ずれたらそこで終わる。
 *
 * 【本文に数字を埋め込まないこと】
 * `{CAP}m³を…` と書くと React が text node の境目に `<!-- -->` を入れるので、
 * 文字列はテンプレートリテラルで1本にしてから渡す。
 *
 * 【変えてはいけない文言】
 *  - WASTE_NOTICE（一般廃棄物収集運搬業の許可がない旨）
 *  - ReasonList の4項目（_reasons.ts。/moving と共通）
 *
 * 「不用品回収」「不用品処分」「引き取り」「処分します」をサービスとして書かない。
 * 「格安」「業界最安」「絶対」「100%」「積み放題」、口コミ、他社比較も書かない。
 * 住所は富山県富山市まで。番地を出さない。
 */

export const metadata: Metadata = {
  title: "富山の単身引越しと出張買取｜軽バン1台 20,000円〜 ｜ re'vive 富山",
  description:
    "富山県全域。軽バン1台でできる範囲だけをやっています。ワンルームから1Kくらいの単身引越しが富山市内・平日 20,000円から、家具1点の運搬、出張買取は査定無料。積める量も日帰りの上限も先に公開しています。貨物軽自動車運送事業 届出済／古物商許可。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "富山の単身引越しと出張買取｜軽バン1台 20,000円〜 ｜ re'vive 富山",
    description:
      "富山県全域。軽バン1台でできる範囲だけをやっています。ワンルームから1Kくらいの単身引越しが富山市内・平日 20,000円から、家具1点の運搬、出張買取は査定無料。積める量も日帰りの上限も先に公開しています。貨物軽自動車運送事業 届出済／古物商許可。",
    url: "https://amniss-japan.jp",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

/* ============ lib/pricing.ts から引く数字 ============ */

/** ワンルーム〜1K・富山市内・作業員1名・平日。/moving の検算表の4行目と同じ条件 */
const MOVING_FROM = plainTotal({ tier: TIER[2], crew: 1, km: 12, coefKey: "heijitsu" });
/** 家具・家電1〜3点（小口）・富山市内・作業員1名・平日 */
const CARRY_FROM = plainTotal({ tier: TIER[0], crew: 1, km: 12, coefKey: "heijitsu" });
/**
 * 当日のお引越し。ワンルーム〜1K一式・富山市内・作業員1名。
 * MOVING_FROM と条件は同じで、日程係数だけが平日(×1.00)→当日(×1.50)。
 * (5,000 ＋ 15,000 ＋ 0) × 1.50 ＝ 30,000。**ベタ書きしない。**
 */
const TOUJI_FULL = plainTotal({ tier: TIER[2], crew: 1, km: 12, coefKey: "touji" });
/** 日帰りの上限。距離表のいちばん遠い行 */
const MAX_KM = DIST[DIST.length - 1].km;

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

/** ③ やっていること */
const SERVICE_ROWS = [
  {
    name: "単身引越し",
    desc: "ワンルーム〜1K　富山市内・作業員1名・平日",
    price: `${yen(MOVING_FROM)}〜`,
  },
  {
    name: "家具・家電の運搬",
    desc: "1〜3点　富山市内・平日",
    price: `${yen(CARRY_FROM)}〜`,
  },
  {
    // ここは14では「県外へのお引越し（長距離）30,000円〜」だった。
    // 30,000円は実在するが（1K一式・1名・当日）、**富山市内の額**で、
    // 距離表はそもそも「片道◯kmで＋◯円」の加算表であり県内／県外の境目を持たない。
    // ラベルと数字が結び付いていなかったので、17_hero で当日の行に差し替えた。
    // **「〜」を付けない。**条件が固まった確定額で、pricing.ts から1つに決まる。
    // 長距離は ④「日帰りの上限 300km」がすでに言っているので、ここでは重ねない。
    name: "当日のお引越し",
    desc: "市内・ワンルーム〜1K一式・作業員1名",
    price: yen(TOUJI_FULL),
  },
  {
    // 8,000円は式から出ない（_fees.ts の SPOT_FEE）。/houjin と同じ定数。
    // 14の「富山県内・1配送　時間チャーターは1時間8,000円（2時間〜）」は、
    // 料金が決まる前の文言で、8/6の決定（1時間から・割増なし）と矛盾していた。
    name: "法人スポット便",
    desc: "富山市内・1時間まで　当日でも土日祝でも割増なし",
    price: `${yen(SPOT_FEE)}〜`,
  },
  {
    name: "出張買取",
    desc: "査定のみで終わっても費用はいただきません",
    price: "査定無料",
  },
];

/**
 * ④ 先に出している数字。
 * 数字と単位を分けているのは、単位だけ 22px に落とすため（site.css の .nums .u）。
 */
const NUMBERS = [
  {
    label: "積 め る 量",
    value: CAP.toFixed(1),
    unit: "m³",
    note: "荷室3.78m³のうち、隙間を引いた実効値。品目ごとの容積も全部出しています。",
  },
  {
    label: "富 山 市 内 ・ 平 日",
    value: fmt(MOVING_FROM),
    unit: "円",
    note: "ワンルーム〜1K、作業員1名。出動料・養生・運送保険・搬入後の設置まで込みです。",
  },
  {
    label: "日 帰 り の 上 限",
    value: String(MAX_KM),
    unit: "km",
    note: "拘束13時間から積込・搬入・休憩を引いた運転可能時間で計算しています。",
  },
];

export default function TopPage() {
  return (
    <>
      {/* ① ヒーロー。**写真 → 濃紺パネルにテキスト**（17_hero で作り直した。
          どの幅でも同じ順で、写真の上に文字は乗らない）。
          見出しは2行で組む。<br /> で折らないと「軽バン1台ぶんの、引越しと買取。」が
          幅によって3行になったり1行になったりして、行数が安定しない。
          リードは JSX で折らずに文字列1本で渡す（行末で折ると半角スペースが入る） */}
      <HeroTop
        kicker="富 山 県 全 域 ／ 軽 貨 物"
        title={
          <>
            軽バン1台ぶんの、
            <br />
            引越しと買取。
          </>
        }
        lead="ワンルームから1Kくらいのお引越し、家具1点の運搬、出張買取。軽バン1台でできる範囲だけを、代表が直接伺ってやっています。最短で当日。"
        actions={
          <>
            <Link className="btn btn-w" href="/contact">
              写真を送って見積りを依頼
            </Link>
            <a className="btn btn-line" href={TEL_HREF}>
              {TEL}
            </a>
          </>
        }
      />

      {/* ② 許認可 */}
      <LicenseStrip />

      {/* ③ やっていること */}
      <Split kicker="事 業" title="やっていること" first>
        <PriceTable head={["サービス", "料金の目安"]} rows={SERVICE_ROWS} />
        {/* 表の並び（単身引越し → 運搬 → 当日 → 法人 → 買取）と同じ順で出す。
            /unpan /houjin は段階4でできたので、17_hero で足した */}
        <p className="pnote">
          くわしくは
          <Link className="tl" href="/moving">
            単身引越し
          </Link>
          {" ／ "}
          <Link className="tl" href="/unpan">
            家具・家電の運搬
          </Link>
          {" ／ "}
          <Link className="tl" href="/houjin">
            法人のお客様
          </Link>
          {" ／ "}
          <Link className="tl" href="/kaitori">
            出張買取
          </Link>
        </p>
      </Split>

      {/* ④ 先に出している数字。3つ横並び。罫線で区切る。箱で囲まない */}
      <Split kicker="先 に 出 し て い る 数 字" title="積める量も、上限も、先に書いてあります" tint>
        <div className="nums">
          {NUMBERS.map((n) => (
            <div className="it" key={n.label}>
              <div className="k">{n.label}</div>
              <div className="v mincho">
                {n.value}
                <span className="u">{n.unit}</span>
              </div>
              <p>{n.note}</p>
            </div>
          ))}
        </div>
      </Split>

      {/* ⑤ 図版。シミュレーター本体は埋めない（トップが重くなる）。導線だけ */}
      <Split kicker="お 見 積 り" title="これ、積めますか？">
        <Figure name="cargo" caption={CARGO_CAPTION} />
        <p className="pnote">運ぶ物を選ぶと、積めるかどうかと金額がその場で出ます。</p>
        <div className="go">
          <Link className="btn" href="/simulator">
            お見積りシミュレーター
          </Link>
        </div>
      </Split>

      {/* ⑥ 考え方。/moving と同じ4項目（_reasons.ts） */}
      <Split kicker="考 え 方" title="あとから困らないように" tint>
        <ReasonList items={MOVING_REASONS} />
      </Split>

      {/* ⑦ 会社。トップに来る人は「ちゃんとした業者か」を見に来るので、そこに答える */}
      <Split kicker="会 社" title="お問い合わせの前に">
        <Spec label="対 応 エ リ ア と 受 付" value={`${AREA}　${HOURS}`}>
          {`富山県富山市を拠点に、県内全域へ伺います。県外へのお引越しは片道${MAX_KM}kmまで日帰り、大阪・東京方面は1泊2日で承ります。`}
        </Spec>

        {/* 許認可の文言は lib/site.ts の LICENSES から組む。番号を書き写さない。
            番号は .nw で束ねて、行末で「第」と数字に割れないようにしている。
            下の一文（WASTE_NOTICE）は法務確認済み。変えないこと */}
        <Spec
          label="許 認 可"
          value={
            <>
              {`${LICENSES[0].label} ${LICENSES[0].value}　／　${LICENSES[1].label} ${KOBUTSU_ISSUER} `}
              <span className="nw">{KOBUTSU_NO}</span>
            </>
          }
          small
        >
          {`${LICENSES[2].label}は${LICENSES[2].value}に加入しています。${WASTE_NOTICE}`}
        </Spec>

        <div className="go">
          <Link className="tl" href="/company">
            会社概要をみる
          </Link>
        </div>
      </Split>

      {/* ⑧ よくあるご質問。**id="faq" はヘッダーとフッターの「よくある質問」の飛び先。**
          14の時点でこの節が無く、`/#faq` が2か所からトップの先頭に着地していた。

          /moving にも FAQ はあるが、そちらへ寄せない。**買取を見に来た人が
          引越しのFAQに着地するのは、リンク切れより悪い。**着地はするので、
          壊れていることに誰も気づかない。

          金額はすべて定数から。③やっていること と同じ数字を2回出しているので、
          **本文に書かないこと。**（12,000 ＝ CARRY_FROM、8,000 ＝ INDOOR_FEE、
          30,000 ＝ TOUJI_FULL、5,000 ＝ DEPART、1.50 ＝ COEF.touji、75km ＝ ROUNDTRIP_MAX_KM）

          文字列は必ずテンプレートリテラルで1本にする。
          JSX で `{yen(x)}です。` と割ると、React が境目に `<!-- -->` を入れる */}
      <Split kicker="質 問" title="よくあるご質問" id="faq" tint>
        <Faq
          items={[
            {
              q: "見積りはどうやって出ますか。",
              a: `計算式を全部公開しています。出動料${yen(DEPART)}に、荷物の量と距離と建物の条件を足して、日程で掛けるだけです。お見積りシミュレーターで、ご自身の条件のまま金額が出せます。`,
            },
            {
              q: "1点だけでもお願いできますか。",
              a: `お受けします。富山市内・平日・作業員1名で${yen(CARRY_FROM)}です。室内で動かすだけ（車を出さない場合）は${yen(INDOOR_FEE)}です。`,
            },
            {
              q: "当日でもお願いできますか。",
              a: `空きがあればお受けします。当日のご依頼は日程係数が${COEF.touji.coef.toFixed(2)}になります。富山市内・ワンルーム〜1K一式・作業員1名で${yen(TOUJI_FULL)}です。`,
            },
            {
              q: "荷物が積みきれるか分かりません。",
              a: `お見積りシミュレーターで品目を選ぶと、軽バンに積めるかどうかが出ます。積みきれない場合は、片道${ROUNDTRIP_MAX_KM}kmまでなら、同じ日に2回に分けて運ぶ往復プランをご案内します。`,
            },
            {
              // 許可がないことを先に言う。富山市の戸別収集の番号は変えてはいけない文言
              q: "不用品の処分もお願いできますか。",
              a: "できません。当社は一般廃棄物収集運搬業の許可を受けていないためです。買取のご相談はお受けします。処分は富山市の戸別収集をご予約ください（076-428-4040）。",
            },
            {
              q: "法人ですが、請求書払いはできますか。",
              a: "可能です。月締めに対応しています。",
            },
          ]}
        />
      </Split>

      {/* ⑨ CTA。既定の文言。id="cta" はヘッダーの「見積りを依頼」の飛び先 */}
      <Cta />
    </>
  );
}
