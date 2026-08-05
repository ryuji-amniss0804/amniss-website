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

/**
 * 単身引越し。
 *
 * 【料金の出どころ】D:\re'vive_toyama_marketing\moving_final.md（2026/8/4 確定）。
 * mockup_v2.html の料金表は旧パック料金のままなので、そちらから数字を写さないこと。
 * 「らくらく2時間パック15,000円」「単身引越しパック25,000円」「大盛35,000円」は廃止済み。
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
    "富山県全域の単身引越し。ワンルーム〜1Kを軽バン1台・作業員1名、富山市内・平日 20,000円から。料金の出し方を全部公開しています。最短当日対応。貨物軽自動車運送事業 届出済。",
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

/** ② 作業料。moving_final.md の「② 作業料（荷物の量 × 人員）」 */
const VOLUME_ROWS = [
  { name: "小口", desc: "〜0.9m³　作業員2名なら16,000円", price: "7,000円" },
  { name: "軽バン半分", desc: "〜1.9m³　作業員2名なら20,000円", price: "11,000円" },
  { name: "軽バン満載", desc: "〜2.8m³　作業員2名なら24,000円", price: "15,000円" },
];

/** ③ 距離料。片道。高速代と燃料を含む */
const DISTANCE_ROWS = [
  { name: "〜15km", desc: "富山市内", price: "0円" },
  { name: "〜30km", desc: "射水・滑川", price: "3,000円" },
  { name: "〜50km", desc: "高岡・氷見・黒部・南砺", price: "6,000円" },
  { name: "〜75km", desc: "金沢", price: "12,000円" },
  { name: "〜100km", desc: "七尾・上越・飛騨高山", price: "16,000円" },
  { name: "〜150km", desc: "長野・松本", price: "28,000円" },
  { name: "〜200km", desc: "福井・新潟市", price: "38,000円" },
  { name: "〜250km", desc: "名古屋・岐阜", price: "48,000円" },
  { name: "〜300km", desc: "京都・彦根", price: "56,000円" },
  { name: "大阪方面", desc: "1泊2日", price: "120,000円〜" },
  { name: "東京方面", desc: "1泊2日", price: "150,000円〜" },
];

/** ④ 条件加算 */
const CONDITION_ROWS = [
  { name: "階段", desc: "エレベーターなし・1フロアにつき", price: "2,000円" },
  { name: "時刻指定", desc: "◯時ちょうどのご指定", price: "2,000円" },
  { name: "家具の分解・組み立て", desc: "ベッドフレームなど", price: "3,000円" },
  { name: "有料駐車場代", desc: "コインパーキングしかない場合", price: "実費" },
];

/** ⑤ 日程係数。複数該当は高いほうだけ */
const SCHEDULE_ROWS = [
  { name: "日程おまかせ", desc: "平日のうち、当社が日を選びます", price: "×0.85" },
  { name: "平日・4日以上先", desc: "基準になる日程です", price: "×1.00" },
  { name: "平日・3日以内", price: "×1.15" },
  { name: "土日祝", price: "×1.20" },
  { name: "翌日", price: "×1.30" },
  { name: "当日", price: "×1.50" },
];

/**
 * 代表品目の容積。全29品目は載せない（シミュレーターが受ける。段階3-3）。
 * 寸法・容積は moving_final.md の「2. 積載の判定」から。
 */
const ITEM_VOLUME_ROWS = [
  { name: "マットレス（シングル）", desc: "97×195×20　最後に一番上へ載せます", price: "0.40m³" },
  {
    name: "マットレス（セミダブル）",
    desc: "120×195×20　荷室の3分の1を使います",
    price: "0.90m³",
  },
  { name: "ソファ（3人掛け）", desc: "185×88×85", price: "1.38m³" },
  {
    name: "冷蔵庫（2ドア・高さ142cmまで）",
    desc: "48×60×140　400L以上の大型は積めません",
    price: "0.40m³",
  },
  { name: "洗濯機（縦型）", desc: "57×60×100", price: "0.34m³" },
  {
    name: "自転車（26〜27インチ）",
    desc: "190×60×105　駐輪場1台分。荷室の奥行をまるごと使います",
    price: "1.20m³",
  },
  { name: "段ボール 大", desc: "50×35×35　引越し業者が配る大サイズ", price: "0.06m³" },
  { name: "段ボール 小", desc: "33×35×32　みかん箱・スーパーの箱くらい", price: "0.04m³" },
];

/** ⑦ 実際の金額。moving_final.md の「4. 実際の金額（検算）」から */
const EXAMPLE_ROWS = [
  { name: "冷蔵庫1点・富山市内", desc: "作業員1名・平日", price: "12,000円" },
  {
    name: "冷蔵庫1点・富山市内",
    desc: (
      <>
        作業員1名・<b>当日</b>
      </>
    ),
    price: "18,000円",
  },
  {
    name: "1K一式・富山市内",
    desc: (
      <>
        作業員1名・<b>日程おまかせ</b>
      </>
    ),
    price: "17,000円",
  },
  { name: "1K一式・富山市内", desc: "作業員1名・平日", price: "20,000円" },
  { name: "1K一式・富山市内", desc: "作業員1名・土日祝", price: "24,000円" },
  { name: "1K一式・高岡（40km）", desc: "作業員1名・平日", price: "26,000円" },
  { name: "1K一式・金沢（60km）", desc: "作業員1名・土日祝", price: "38,400円" },
  { name: "1K一式・名古屋（250km）", desc: "作業員1名・平日", price: "68,000円" },
];

export default function MovingPage() {
  return (
    <>
      {/* ① ヒーロー。写真は muted。文字を重ねない。
          van-exterior-02 を使う（01 はナンバープレートと駐車枠が写り込んでいる） */}
      <Hero
        size="md"
        kicker="単 身 引 越 し ／ 富 山 県 全 域"
        title="今日決めた引越しにも、行けます。"
        lead={
          <>
            ワンルーム〜1K を、軽バン1台と作業員1名で。富山市内・平日 20,000円から。
            最短で当日に伺います。
          </>
        }
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
      <Split kicker="考 え 方" title="金額の出し方を、全部公開しています" first>
        <Spec label="計 算 式" value="（ 出動料 ＋ 荷物の量 ＋ 距離 ＋ 建物の条件 ）× 日程" small>
          100円未満は切り捨て。すべて税込です。
          <br />
          見積りは作業前に確定します。あとから増えることはありません。
        </Spec>

        <Spec label="出 動 料　5,000円" value="全案件に共通してかかります。" small>
          軽バン1台／毛布・養生材・ラップ／ラッシングベルト／運送保険（補償上限500万円）／
          2階までの階段作業／搬入後の設置。ここまで含めた金額です。
        </Spec>

        {/* 表の見出しは thead に置いてある。表の外にもう1段見出しを足すと、
            罫線だけで組んだ表の上に太い行が増えて、表が箱に見え始める */}
        <div className="pt">
          <PriceTable
            head={["荷物の量", "金額"]}
            rows={VOLUME_ROWS}
            note="2.8m³を超える場合は、往復プランか、荷物を減らすご相談になります。"
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
      <Split kicker="積 め る 量" title="積める寸法を公開しています" tint>
        <Spec label="積 め る サ イ ズ" value="幅140cm × 高さ142cm × 奥行190cm ／ 最大積載350kg">
          スズキ・エブリイ（ハイルーフ）のカタログ表記です。
          隙間ができるぶんを引いて、実際に積める量は 2.8m³ を目安にしています。
          冷蔵庫は高さ142cmまで、洗濯機は縦型・ドラム式とも積めます。
        </Spec>

        {/* 代表品目だけ。全29品目は /simulator が受ける（段階3-3）。
            シミュレーターへの導線は、ページができるまで書かない */}
        <div className="pt">
          <PriceTable head={["品目（寸法 cm）", "容積"]} rows={ITEM_VOLUME_ROWS} />
        </div>

        {/* ⑥ 電話番号と但し書きは一字一句このまま */}
        <Spec
          label="積 み き れ な い 場 合"
          value="片道75kmまでは、往復プランをご提案します。出動料は1回分のまま、作業料70%と距離料を加算します。"
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
      <Split kicker="実 際 の 金 額" title="こうなります">
        <PriceTable head={["ケース", "お支払額"]} rows={EXAMPLE_ROWS} />
        <Photo
          image={images.youjou01}
          sizes={SIZES_BODY}
          caption="毛布と養生材での保護、ラッシングベルトでの固定まで含んだ金額です"
          className="mt"
        />
      </Split>

      {/* ⑧⑨ 考え方と、日帰りの上限 */}
      <Split kicker="考 え 方" title="安い業者との違い" tint>
        <ReasonList
          items={[
            {
              title: "積める寸法を公開しています",
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
              a: "空いていれば伺います。当日は日程係数が1.5倍になります。まずはお電話かLINEでご相談ください。",
            },
            {
              q: "荷物が2.8m³に入りきらない場合は？",
              a: "片道75kmまでなら往復プランをご提案します。それ以上の距離では、荷物を減らすか、買い取れる物を買取に回すご相談になります。",
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
