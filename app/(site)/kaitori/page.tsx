import type { Metadata } from "next";
import Link from "next/link";
import Hero from "../_components/Hero";
import LicenseStrip from "../_components/LicenseStrip";
import Split from "../_components/Split";
import ItemList from "../_components/ItemList";
import Spec from "../_components/Spec";
import ReasonList from "../_components/ReasonList";
import Faq from "../_components/Faq";
import Cta from "../_components/Cta";
import Photo from "../_components/Photo";
import { images, SIZES_BODY } from "@/lib/images";
import { TEL, TEL_HREF } from "@/lib/site";

/**
 * 出張買取。Search Console のクリックがほぼ買取なので、このサイトで一番読まれるページ。
 *
 * 文言を変えないこと。とくに次の3つは法務確認済みで、言い換えると意味が変わる。
 *  - 「査定額が0円になった物をお引き取りすることはできません」
 *  - 「一般廃棄物収集運搬業の許可がないため」
 *  - 古物営業法の本人確認・18歳未満の記載
 *
 * 「不用品回収」「不用品処分」「引き取り」「処分します」は書かない。
 * 買取価格の具体例・相場も書かない（査定してみないと分からないため）。
 */

export const metadata: Metadata = {
  title: "富山の出張買取｜壊れたパソコン・カメラも査定 ｜ re'vive 富山",
  description:
    "富山県全域へ出張買取に伺います。デジタルカメラ・レンズ、パソコン、精密機器を中心に、ジャンク・動作未確認・他店で断られた物も査定します。査定無料・出張費無料。古物商許可 富山県公安委員会 第501310007877号。",
  alternates: { canonical: "/kaitori" },
  openGraph: {
    title: "富山の出張買取｜壊れたパソコン・カメラも査定 ｜ re'vive 富山",
    description:
      "富山県全域へ出張買取に伺います。デジタルカメラ・レンズ、パソコン、精密機器を中心に、ジャンク・動作未確認・他店で断られた物も査定します。査定無料・出張費無料。古物商許可 富山県公安委員会 第501310007877号。",
    url: "https://revive-toyama.jp/kaitori",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

/** 買い取れる物。11行。増やさない・減らさない */
const CAN_BUY = [
  { name: "デジタルカメラ・レンズ", note: "ジャンク・カビ・曇り・動作未確認も" },
  { name: "パソコン・ノートパソコン", note: "起動しない物も" },
  { name: "その他の精密機器", note: "他店で断られた物こそ見せてください" },
  { name: "家電・AV機器", note: "不動品も査定します" },
  { name: "ゲーム機・ゲームソフト", note: "旧型・箱なしも" },
  { name: "ベビー用品", note: "ベビーカー、チャイルドシートなど" },
  { name: "電動工具・農機具" },
  { name: "時計", note: "電池切れ・止まっている物も" },
  { name: "アウトドア用品・楽器" },
  { name: "ブランド家具・食器" },
  { name: "未使用の生活用品ストック" },
];

/** お受けできない物。7行。ここを削ると断る根拠がサイト上から消える */
const CANNOT_BUY = [
  { name: "廃棄物の有料回収", note: "一般廃棄物収集運搬業の許可がないため" },
  {
    name: "マットレス、布団、使用済みの寝具",
    note: "中古の需要がなく、衛生面でお預かりできません",
  },
  { name: "ソファ、カラーボックスなど、中古で値のつかない家具" },
  { name: "リサイクル料が必要な家電4品目（エアコン・テレビ・冷蔵庫・洗濯機）の処分" },
  { name: "危険物、生き物" },
  { name: "他人名義の物、盗品の疑いがある物" },
  { name: "本人確認書類をご提示いただけない場合" },
];

export default function KaitoriPage() {
  return (
    <>
      {/* ① ヒーロー。写真は plain のまま。文字を重ねない。
          リードは JSX で折らずに文字列1本で渡す。行末で折ると半角スペースが1つ入る */}
      <Hero
        size="md"
        kicker="出 張 買 取 ／ 富 山 県 全 域"
        title="捨てるつもりだった物ほど、見せてほしいんです。"
        lead="動かなくなったカメラ、起動しないパソコン、レンズのカビや曇り。他店で断られた物こそ、部品として値がつくことがあります。見るだけで終わっても、費用はいただきません。"
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
        image={images.pcDellSsd}
        caption="精密機器の分解・修理に対応しています"
      />

      {/* ② 許認可。このページでは古物商許可が一番効くので上に置く */}
      <LicenseStrip />

      {/* ③④⑤ 対象品目 */}
      <Split kicker="対 象 品 目" title="買い取れる物" first>
        <ItemList items={CAN_BUY} />
        <ItemList title="お受けできない物" items={CANNOT_BUY} deny />

        {/* ⑤ この一文が肝。枠で独立させる。一字一句このまま */}
        <Spec
          label="査 定 と お 引 き 取 り"
          value="壊れている物も査定します。ただし査定額が0円になった物をお引き取りすることはできません。一般廃棄物収集運搬業の許可がないためです。"
          small
        />
      </Split>

      {/* ⑥ 考え方 */}
      <Split kicker="考 え 方" title="買取について、先に書いておきます" tint>
        <ReasonList
          items={[
            {
              title: "他店で断られた物から見ます",
              body: "動かないカメラ、起動しないパソコン。部品として値がつくことがあります。見てもいないうちに「買えません」とは言いません。",
              evidence: "査定は無料。出張費もいただきません",
            },
            {
              title: "その場で現金でお支払いします",
              body: "査定額にご納得いただけたら、その場で現金でお渡しします。後日振込ではありません。",
              evidence: "古物商許可 富山県公安委員会 第501310007877号",
            },
            {
              title: "引越しと同じ日にできます",
              body: "引越しの作業中に査定して、買取額をその日の引越し代から差し引きます。運ぶ物が減るぶん、引越し代自体も下がります。",
              evidence: "買取額は引越し代から差し引きます",
            },
            {
              title: "買い取れない物は、その場でそう言います",
              body: "査定額が0円の物をお引き取りすることはできません。廃棄物の許可がないためです。処分が必要な物は、許可のある業者をご案内します。",
              evidence: "一般廃棄物収集運搬業の許可は受けていません",
            },
          ]}
        />
        <Photo
          image={images.pcBlackCase}
          sizes={SIZES_BODY}
          caption="カメラとパソコンの修理は自分で行っています"
          className="mt"
        />
      </Split>

      {/* ⑦⑧ 流れ */}
      <Split kicker="流 れ" title="買取までの流れ">
        <ReasonList
          items={[
            { title: "LINEで写真を送る", body: "型番が写っていれば、その場で概算をお伝えできます" },
            { title: "訪問の日時を決める", body: "最短で当日。富山県全域に伺います" },
            { title: "その場で査定する", body: "1点ずつ金額をお伝えします。ご納得いただけた物だけ" },
            { title: "現金でお支払い", body: "買取書類にご記入いただきます" },
          ]}
        />

        {/* ⑧ 古物営業法の必要事項。文言を変えない */}
        <Spec
          label="お 持 ち い た だ く も の"
          value="運転免許証・マイナンバーカード・保険証など、ご本人を確認できる書類。"
          small
        >
          古物営業法により、買取時のご提示が必要です。18歳未満の方からは買い取れません。
        </Spec>
      </Split>

      {/* ⑨ よくある質問 */}
      <Split kicker="質 問" title="よくあるご質問" id="faq" tint>
        <Faq
          items={[
            {
              q: "査定だけでも来てもらえますか？",
              a: "はい。査定のみで終わっても費用はいただきません。出張費も無料です。",
            },
            {
              q: "動かない物でも値がつきますか？",
              a: "つくことがあります。特にカメラ・レンズ・パソコン・精密機器は、部品として需要があります。まずは写真を送ってください。",
            },
            {
              q: "買取と引越しを同じ日にできますか？",
              a: "できます。引越し当日に査定して、買取額をその日の引越し代から差し引きます。",
            },
            {
              q: "買い取れない物は引き取ってもらえますか？",
              a: "できません。一般廃棄物収集運搬業の許可を受けていないためです。処分が必要な物は、許可のある業者をご案内します。",
            },
          ]}
        />
      </Split>

      {/* ⑩ */}
      <Cta
        title="まずは、写真を1枚。"
        lead="型番が写っていれば、その場で概算をお伝えできます。査定だけのご相談も歓迎です。"
      />
    </>
  );
}
