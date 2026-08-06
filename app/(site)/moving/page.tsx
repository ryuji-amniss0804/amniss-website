import type { Metadata } from "next";
import Link from "next/link";
import Hero from "../_components/Hero";
import LicenseStrip from "../_components/LicenseStrip";
import Split from "../_components/Split";
import PriceTable from "../_components/PriceTable";
import Spec from "../_components/Spec";
import ReasonList from "../_components/ReasonList";
import Faq from "../_components/Faq";
import Cta from "../_components/Cta";
import Photo from "../_components/Photo";
import { images, SIZES_BODY } from "@/lib/images";
import { TEL, TEL_HREF } from "@/lib/site";
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
  TIER,
  itemOf,
  plainTotal,
  yen,
  type CoefKey,
} from "@/lib/pricing";

/**
 * 単身引越し。
 *
 * 【料金の出どころ】**lib/pricing.ts**。
 * このページの表（荷物の量・距離・建物の条件・日程・代表品目・実際の金額）は
 * 全部そこから生成している。**数字をこのファイルに書き足さないこと。**
 * /simulator と同じ出どころなので、片方だけ古くなることがない。
 * 元データは D:\re'vive_toyama_marketing\moving_final.md（2026/8/4 確定）。
 * mockup_v2.html の料金表は旧パック料金のままなので、そちらから数字を写さないこと。
 * 「らくらく2時間パック15,000円」「単身引越しパック25,000円」「大盛35,000円」は廃止済み。
 *
 * 【本文に数字を埋め込まないこと】
 * `{CAP}m³を…` と書くと、React が text node の境目に `<!-- -->` を入れるため
 * ビルド後のHTMLで文字列が分断される。文字列の属性（note / value / q など）は
 * テンプレートリテラルで丸ごと1つにしてから渡している。
 *
 * 【変えてはいけない文言】
 *  - 富山市の戸別収集の電話番号 076-428-4040
 *  - 「当社は一般廃棄物収集運搬業の許可がないため、お引き取りできません。」
 *  - 日程係数の「複数に当てはまる場合は、高いほうだけを適用します。重ねがけはしません。」
 *
 * 「不用品回収」「不用品処分」「引き取り」「処分します」をサービスとして書かない。
 * 「格安」「業界最安」「絶対」「100%」「積み放題」も書かない。
 */

export const metadata: Metadata = {
  title: "富山の単身引越し｜最短当日・軽バン1台 20,000円〜 ｜ re'vive 富山",
  description:
    "富山県全域の単身引越し。ワンルームから1Kくらいの規模だけをやっています。軽バン1台・作業員1名で、富山市内・平日 20,000円から。料金の内訳は全部公開。貨物軽自動車運送事業 届出済。",
  alternates: { canonical: "/moving" },
  openGraph: {
    title: "富山の単身引越し｜最短当日・軽バン1台 20,000円〜 ｜ re'vive 富山",
    description:
      "ワンルーム〜1Kを軽バン1台・作業員1名、富山市内・平日 20,000円から。料金の出し方を全部公開しています。最短当日対応。",
    url: "https://amniss-japan.jp/moving",
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

/** ② 作業料（荷物の量 × 人員）。TIER から */
const VOLUME_ROWS = TIER.map((t) => ({
  name: t.name,
  desc: `〜${t.cap.toFixed(1)}m³　作業員2名なら${yen(t.work[1])}`,
  price: yen(t.work[0]),
}));

/** ③ 距離料。片道。高速代と燃料を含む。DIST ＋ 300km超の LONG_HAUL */
const DISTANCE_ROWS = [
  ...DIST.map((d) => ({ name: `〜${d.km}km`, desc: d.area, price: yen(d.fee) })),
  ...LONG_HAUL.map((l) => ({ name: l.name, desc: "1泊2日", price: `${yen(l.from)}〜` })),
];

/** ④ 条件加算。金額は定数から。行の説明だけがこのページの文言 */
const CONDITION_ROWS = [
  { name: "階段", desc: "エレベーターなし・1フロアにつき", price: yen(STAIRS_FEE) },
  { name: "時刻指定", desc: "◯時ちょうどのご指定", price: yen(SLOT_FEE) },
  { name: "家具の分解・組み立て", desc: "ベッドフレームなど", price: yen(DISASSEMBLE_FEE) },
  { name: "有料駐車場代", desc: "コインパーキングしかない場合", price: "実費" },
];

/** ⑤ 日程係数。複数該当は高いほうだけ */
const SCHEDULE_ROWS = SCHEDULE_TABLE.map((s) => ({
  name: s.name,
  desc: s.desc,
  price: `×${COEF[s.key].coef.toFixed(2)}`,
}));

/**
 * 代表品目の容積。全29品目は載せない（/simulator が受ける）。
 * どの8品目を出すかは lib/pricing.ts の MOVING_ITEMS。寸法・容積も同じ品目定義から。
 */
const ITEM_VOLUME_ROWS = MOVING_ITEMS.map((pick) => {
  const it = item(pick.id);
  return { name: pick.name ?? it.name, desc: it.size, price: `${it.m3.toFixed(2)}m³` };
});

/**
 * ⑦ 実際の金額。moving_final.md の「4. 実際の金額（検算）」の8行。
 * **金額は書かずに、条件から計算している。**検算表に手で書いた数字を置くと、
 * 上の表を直したときにここだけ古くなる。
 * 「1K一式」は 1.9〜2.8m³ ＝ 軽バン満載の区分。
 */
const EXAMPLE_CASES: {
  name: string;
  cond: string;
  /** 強調する条件（日程）。desc の末尾に <b> で付く */
  strong?: string;
  tier: number;
  km: number;
  crew: 1 | 2;
  coef: CoefKey;
}[] = [
  { name: "冷蔵庫1点・富山市内", cond: "作業員1名・平日", tier: 0, km: 12, crew: 1, coef: "heijitsu" },
  { name: "冷蔵庫1点・富山市内", cond: "作業員1名・", strong: "当日", tier: 0, km: 12, crew: 1, coef: "touji" },
  { name: "1K一式・富山市内", cond: "作業員1名・", strong: "日程おまかせ", tier: 2, km: 12, crew: 1, coef: "omakase" },
  { name: "1K一式・富山市内", cond: "作業員1名・平日", tier: 2, km: 12, crew: 1, coef: "heijitsu" },
  { name: "1K一式・富山市内", cond: "作業員1名・土日祝", tier: 2, km: 12, crew: 1, coef: "donichi" },
  { name: "1K一式・高岡（40km）", cond: "作業員1名・平日", tier: 2, km: 40, crew: 1, coef: "heijitsu" },
  { name: "1K一式・金沢（60km）", cond: "作業員1名・土日祝", tier: 2, km: 60, crew: 1, coef: "donichi" },
  { name: "1K一式・名古屋（250km）", cond: "作業員1名・平日", tier: 2, km: 250, crew: 1, coef: "heijitsu" },
];

const EXAMPLE_ROWS = EXAMPLE_CASES.map((c) => ({
  name: c.name,
  desc: c.strong ? (
    <>
      {c.cond}
      <b>{c.strong}</b>
    </>
  ) : (
    c.cond
  ),
  price: yen(plainTotal({ tier: TIER[c.tier], crew: c.crew, km: c.km, coefKey: c.coef })),
}));

export default function MovingPage() {
  return (
    <>
      {/* ① ヒーロー。写真は muted。文字を重ねない。
          van-exterior-02 を使う（01 はナンバープレートと駐車枠が写り込んでいる）。
          見出しはお客さんの言葉、リードの一言目でこちらが名乗る、という組み立て。
          ダッシュは全角2倍ダーシ（——）。ハイフンやマイナス記号にしない。
          リードは JSX で折らずに文字列1本で渡す。行末で折ると半角スペースが1つ入る */}
      <Hero
        size="md"
        kicker="単 身 引 越 し ／ 富 山 県 全 域"
        title="荷物、そんなに多くないんですけど。"
        lead="——という規模のお引越しだけ、やっています。ワンルームから1Kくらいを、軽バン1台と作業員1名で。富山市内・平日で20,000円から。予定が空いていれば、今日でも明日でも伺います。"
        actions={
          <>
            <Link className="btn btn-fill" href="/contact">
              写真を送って見積りを依頼
            </Link>
            <a className="btn" href={TEL_HREF}>
              {TEL}
            </a>
          </>
        }
        image={images.vanExterior02}
        caption="荷室は 幅140cm × 高さ142cm × 奥行190cm ／ 最大積載350kg"
      />

      {/* ② 許認可 */}
      <LicenseStrip />

      {/* ③④ 金額の出し方。計算式 → 出動料 → 4つの表 */}
      <Split kicker="考 え 方" title="いくらかかるのか、先に分かります" first>
        <Spec label="計 算 式" value="（ 出動料 ＋ 荷物の量 ＋ 距離 ＋ 建物の条件 ）× 日程" small>
          {/* 1つづきの文なので <br /> で割らず、文字列を1本にして渡す */}
          {"すべて税込で、100円未満は切り捨てます。お見積りは作業を始める前に確定します。作業後に金額が増えることはありません。"}
        </Spec>

        {/* ラベルに金額を入れると、5,000円がページでいちばん小さい字（11.5px・灰色）に
            なってしまう。ラベル＝短い名前／本文＝いちばん大事な事実ひとつ／補足＝説明、
            という Spec 本来の形に戻した。文言は1文字も足していない */}
        <Spec label="出 動 料" value={yen(DEPART)}>
          {/* JSX の行末で折ると、そこに半角スペースが1つ入る。
              1つづきの文なので、文字列を1本にして渡す */}
          {"全案件に共通してかかります。軽バン1台／毛布・養生材・ラップ／ラッシングベルト／運送保険（補償上限500万円）／2階までの階段作業／搬入後の設置。ここまで含めた金額です。"}
        </Spec>

        {/* 表の見出しは thead に置いてある。表の外にもう1段見出しを足すと、
            罫線だけで組んだ表の上に太い行が増えて、表が箱に見え始める */}
        <div className="pt">
          <PriceTable
            head={["荷物の量", "金額"]}
            rows={VOLUME_ROWS}
            note={`${CAP.toFixed(1)}m³を超える場合は、往復プランか、荷物を減らすご相談になります。`}
          />
        </div>

        <div className="pt">
          <PriceTable head={["距離（片道・高速代と燃料込み）", "金額"]} rows={DISTANCE_ROWS} />
        </div>

        <div className="pt">
          <PriceTable head={["建物の条件", "金額"]} rows={CONDITION_ROWS} />
        </div>

        <div className="pt">
          <PriceTable
            head={["日程", "係数"]}
            rows={SCHEDULE_ROWS}
            note={
              <>
                <b>複数に当てはまる場合は、高いほうだけを適用します。</b>
                重ねがけはしません。
              </>
            }
          />
        </div>
      </Split>

      {/* ⑤⑥ 積める量と、積みきれない場合 */}
      <Split kicker="積 め る 量" title="これ、積めますか？" tint>
        {/* 2.8 は CAP から。JSX の本文に {CAP} を混ぜると text node が割れて
            HTML に <!-- --> が入るので、文字列を1つに組んでから渡す */}
        <Spec label="積 め る サ イ ズ" value="幅140cm × 高さ142cm × 奥行190cm ／ 最大積載350kg">
          {`スズキ・エブリイ（ハイルーフ）のカタログ表記です。 隙間ができるぶんを引いて、実際に積める量は ${CAP.toFixed(
            1,
          )}m³ を目安にしています。 冷蔵庫は高さ142cmまで、洗濯機は縦型・ドラム式とも積めます。`}
        </Spec>

        {/* 代表品目だけ。全29品目は /simulator が受ける */}
        <div className="pt">
          <PriceTable
            head={["品目（寸法 cm）", "容積"]}
            rows={ITEM_VOLUME_ROWS}
            note={
              <>
                全品目を選んで自動で計算できます →{" "}
                <Link className="tl" href="/simulator">
                  お見積りシミュレーター
                </Link>
              </>
            }
          />
        </div>

        {/* ⑥ 電話番号と但し書きは一字一句このまま */}
        <Spec
          label="積 み き れ な い 場 合"
          value={`片道${ROUNDTRIP_MAX_KM}kmまでは、往復プランをご提案します。出動料は1回分のまま、作業料${Math.round(
            ROUNDTRIP_WORK_RATE * 100,
          )}%と距離料を加算します。`}
          small
        >
          75kmを超える場合は往復が現実的ではないので、
          荷物を減らすか、買い取れる物を買取に回すご相談になります。
          買い取れない物（マットレス・布団・ソファ・カラーボックスなど）は、
          富山市の戸別収集をご予約ください（076-428-4040）。
          当社は一般廃棄物収集運搬業の許可がないため、お引き取りできません。
        </Spec>
      </Split>

      {/* ⑦ 実際の金額 */}
      <Split kicker="実 際 の 金 額" title="だいたい、こんな金額です">
        <PriceTable head={["ケース", "お支払額"]} rows={EXAMPLE_ROWS} />
        <Photo
          image={images.youjou01}
          sizes={SIZES_BODY}
          caption="毛布と養生材での保護、ラッシングベルトでの固定まで含んだ金額です"
          className="mt"
        />
      </Split>

      {/* ⑧⑨ 考え方と、日帰りの上限 */}
      <Split kicker="考 え 方" title="あとから困らないように" tint>
        <ReasonList
          items={[
            {
              title: "積める寸法を、先に出しています",
              body: "荷室の内寸と最大積載量を明記しています。「行ってみたら運べませんでした」が一番ご迷惑をおかけするので、先に潰しています。",
              evidence: "幅140cm × 高さ142cm × 奥行190cm ／ 最大積載350kg",
            },
            {
              title: "お手伝いをお願いしません",
              body: "大型家具の積み下ろしをお客様に手伝っていただくことはありません。2名必要と判断した内容は2名で伺います。",
              evidence: "人数が増えても追加料金はいただきません",
            },
            {
              title: "養生と保険を別料金にしません",
              body: "毛布・養生材・ラップでの保護、ラッシングベルトでの固定、運送保険。安く見せるために外す、という考え方は取っていません。",
              evidence: "運送保険 補償上限500万円に加入済み",
            },
            {
              title: "できないことを先に伝えます",
              body: "400L以上の大型冷蔵庫、2トントラックが必要な物量、ピアノ・金庫。そして廃棄物の有料回収は、許可がないため行っていません。",
              evidence: "一般廃棄物収集運搬業の許可は受けていません",
            },
          ]}
        />

        {/* ⑨ 「できないことを先に伝えます」の続き。距離の上限がどこから来ているか */}
        <Spec
          label="日 帰 り は 片 道 300km ま で"
          value="国土交通省の改善基準告示により、1日の拘束時間は原則13時間です。"
          small
        >
          積込1.5時間・搬入1.5時間・休憩1時間を引くと、運転できるのは8.5時間。
          高速道路の平均速度から、片道およそ300kmが限界になります。
          大阪・東京へのお引越しは1泊2日で承ります。
        </Spec>
      </Split>

      {/* ⑩ よくある質問 */}
      <Split kicker="質 問" title="よくあるご質問" id="faq">
        <Faq
          items={[
            {
              q: "当日でもお願いできますか？",
              a: `空いていれば伺います。当日は日程係数が${COEF.touji.coef.toFixed(1)}倍になります。まずはお電話かLINEでご相談ください。`,
            },
            {
              q: `荷物が${CAP.toFixed(1)}m³に入りきらない場合は？`,
              a: `片道${ROUNDTRIP_MAX_KM}kmまでなら往復プランをご提案します。それ以上の距離では、荷物を減らすか、買い取れる物を買取に回すご相談になります。`,
            },
            {
              q: "お手伝いは必要ですか？",
              a: "必要ありません。2名必要と判断した内容は2名で伺います。人数が増えても追加料金はいただきません。",
            },
            {
              q: "400L以上の冷蔵庫は運べますか？",
              a: "運べません。荷室の高さが142cmまでのためです。2トントラックが必要な物量、ピアノ、金庫も対応できません。",
            },
          ]}
        />
      </Split>

      {/* ⑪ */}
      <Cta />
    </>
  );
}
