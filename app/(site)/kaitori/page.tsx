import type { Metadata } from "next";
import PriceHero from "../_components/PriceHero";
import LicenseStrip from "../_components/LicenseStrip";
import FaqTop, { type FaqTopItem } from "../_components/FaqTop";
import LastCta from "../_components/LastCta";
import { LICENSES, LINE_URL, TEL, TEL_HREF } from "@/lib/site";

/**
 * 出張買取。Search Console のクリックがほぼ買取なので、このサイトで一番読まれるページ。
 *
 * 【93_other_pages】トップ（90・91）・料金の3ページ（92）と同じトーンに作り直した。
 * 見た目・文言の正は参考モック（top_mock_20261008/Kaitori.dc.html）と cc_task/93 §4-2 の表。
 * **文言はそこに書かれたとおり。ここで言い換えないこと。**
 *
 * 廃棄物の許可がない旨は、93 で短い言い方に替えた（「廃棄物を回収する許可がないため」。
 * /moving・/unpan と同じ）。正式な言い方はフッターの WASTE_NOTICE が受けている。
 * 次の2つは残してある。削ると断る根拠がサイト上から消える。
 *  - 0円の物はお引き取りできない（4つの約束の4つ目・よくあるご質問の4問目）
 *  - 古物営業法の本人確認・18歳未満の記載（流れの下の箱）
 *
 * 本人確認書類から「保険証」を外した（2026-10-09 決定。従来の保険証は2025年12月までに使えなくなったため）。
 *
 * 【写真】93 の前はヒーローと本文に修理中の写真を1枚ずつ置いていた（lib/images.ts の2枚）。
 * モックに合わせて外してある。戻すかどうかは cc_log/93 で確認中。
 *
 * 「不用品回収」「不用品処分」「引き取り」「処分します」は書かない。
 * 買取価格の具体例・相場も書かない（査定してみないと分からないため）。
 */

/** 許認可の番号は lib/site.ts の LICENSES から引く。このファイルに書き写さない */
const KOBUTSU = (() => {
  const l = LICENSES.find((x) => x.label === "古物商許可");
  if (!l) throw new Error('許認可 "古物商許可" が lib/site.ts の LICENSES にありません');
  return l;
})();

const TITLE = "富山の出張買取｜壊れたパソコン・カメラも査定 ｜ re'vive 富山";
const DESCRIPTION = `富山県全域へ出張買取に伺います。デジタルカメラ・レンズ、パソコン、精密機器を中心に、ジャンク・動作未確認・他店で断られた物も査定します。査定無料・出張費無料。${KOBUTSU.label} ${KOBUTSU.value}。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/kaitori" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://revive-toyama.jp/kaitori",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

/** ヒーローの黄色の札 */
const HERO_BADGES = ["査定無料", "出張費無料", "その場で現金"];

/**
 * 買い取れる物。11枚。増やさない・減らさない。
 * **先頭の3つ（カメラ・パソコン・精密機器）が黄色**（STRONG）。特に強い品目。
 */
const CAN_BUY: { name: string; note?: string }[] = [
  { name: "デジタルカメラ・レンズ", note: "ジャンク・カビ・曇り・動作未確認も" },
  { name: "パソコン・ノートパソコン", note: "起動しない物も" },
  { name: "その他の精密機器", note: "他店で断られた物こそ" },
  { name: "家電・AV機器", note: "動かない物も査定します" },
  { name: "ゲーム機・ゲームソフト", note: "旧型・箱なしも" },
  { name: "時計", note: "電池切れ・止まっている物も" },
  { name: "ベビー用品", note: "ベビーカー、チャイルドシートなど" },
  { name: "電動工具・農機具" },
  { name: "アウトドア用品・楽器" },
  { name: "ブランド家具・食器" },
  { name: "未使用の生活用品ストック" },
];
const STRONG = 3;

/** お受けできない物。7行。ここを削ると断る根拠がサイト上から消える */
const CANNOT_BUY: { name: string; note?: string }[] = [
  { name: "廃棄物の有料回収", note: "廃棄物を回収する許可がないため" },
  { name: "マットレス、布団、使用済みの寝具", note: "衛生面でお預かりできません" },
  { name: "ソファ、カラーボックスなど値のつかない家具" },
  { name: "家電4品目（エアコン・テレビ・冷蔵庫・洗濯機）の処分" },
  { name: "危険物、生き物" },
  { name: "他人名義の物、盗品の疑いがある物" },
  { name: "本人確認書類をお見せいただけない場合" },
];

/** 4つの約束。cc_task/93 §4-2 の表のとおり */
const PROMISES: { title: string; body: string }[] = [
  {
    title: "断られた物こそ",
    body: "動かないカメラ、起動しないパソコン。見る前に「買えません」とは言いません。",
  },
  {
    title: "その場で現金",
    body: "金額に納得いただけたら、その場でお支払いします。後日振込ではありません。",
  },
  {
    title: "引越しと同じ日に",
    body: "買取額を、その日の引越し代から差し引きます。運ぶ物が減るぶん、引越し代も下がります。",
  },
  {
    title: "値がつかない物は、その場で",
    body: "0円の物はお引き取りできません。処分の行き先をご案内します。",
  },
];

/** 流れ。4枚 */
const FLOW: { title: string; body: string }[] = [
  { title: "LINEで写真を送る", body: "型番が写っていれば、その場で概算をお伝えします。" },
  { title: "日時を決める", body: "最短で当日。富山県全域に伺います。" },
  { title: "その場で査定", body: "1点ずつ金額をお伝えします。" },
  { title: "現金でお支払い", body: "納得いただけた物だけ。買取書類にご記入いただきます。" },
];

/** よくあるご質問。4問。cc_task/93 §4-2 の表のとおり。答えは文字列1本 */
const FAQ: FaqTopItem[] = [
  {
    q: "査定だけでも来てもらえますか？",
    a: "はい。査定だけで終わっても、費用はかかりません。出張費も無料です。",
  },
  {
    q: "動かない物でも値がつきますか？",
    a: "つくことがあります。カメラ・レンズ・パソコンは、部品として需要があります。まずは写真を送ってください。",
  },
  {
    q: "買取と引越しを同じ日にできますか？",
    a: "できます。買取額を、その日の引越し代から差し引きます。",
  },
  {
    q: "買い取れない物は引き取ってもらえますか？",
    a: "できません。廃棄物を回収する許可がないためです。処分の行き先をご案内します。",
  },
];

export default function KaitoriPage() {
  return (
    <div className="tp pp op">
      {/* ① ヒーロー。紺の地。見出しはこちらの言葉（このページだけ、お客さんの言葉ではない） */}
      <PriceHero
        kicker="出張買取 ／ 富山県全域"
        title={["捨てるつもりだった物ほど、", "見せてほしいんです。"]}
        lead={["動かないカメラも、起動しないパソコンも。", "部品として値がつくことがあります。"]}
        badges={HERO_BADGES}
        actions={
          <>
            <a className="tp-btn tp-btn-y" href={LINE_URL} target="_blank" rel="noopener noreferrer">
              LINEで写真を送る
            </a>
            <a className="tp-btn tp-btn-o op-btn-o" href={TEL_HREF}>
              <span className="tp-num op-btn-tel">{TEL}</span>
            </a>
          </>
        }
      />

      {/* ② 許認可の帯。このページでは古物商許可が一番効くので、ヒーローのすぐ下 */}
      <LicenseStrip variant="badge" />

      {/* ③ 買い取れる物（カード）と、お受けできない物（紺の箱） */}
      <section className="pp-sec">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">ITEMS</p>
            <h2 className="tp-h2">買い取れる物</h2>
            <p className="tp-sec-lead">黄色は、特に強い品目です。</p>
          </div>
          <ul className="op-buy">
            {CAN_BUY.map((c, i) => (
              <li className={i < STRONG ? "top tp-rise" : "tp-rise"} key={c.name}>
                <b>{c.name}</b>
                {c.note ? <span>{c.note}</span> : null}
              </li>
            ))}
          </ul>

          <div className="op-no tp-rise">
            <h3>お受けできない物</h3>
            <ul>
              {CANNOT_BUY.map((c) => (
                <li key={c.name}>
                  <span>
                    {c.name}
                    {c.note ? <small>{c.note}</small> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ④ 4つの約束。見た目はトップ・/moving と同じ（tp-rs）。中身は買取のもの */}
      <section className="pp-sec beige">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">POLICY</p>
            <h2 className="tp-h2">{`買取の${PROMISES.length}つの約束`}</h2>
          </div>
          <ol className="tp-rs-list">
            {PROMISES.map((r, i) => (
              <li className="tp-rs tp-rise" key={r.title}>
                <span className="tp-rs-n tp-num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="tp-rs-b">
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ⑤ 流れ（4枚）と、本人確認書類。古物営業法の必要事項なので消さない */}
      <section className="pp-sec">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">FLOW</p>
            <h2 className="tp-h2">買取までの流れ</h2>
          </div>
          <ol className="op-flow">
            {FLOW.map((f, i) => (
              <li className="tp-rise" key={f.title}>
                <span className="n tp-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <b>{f.title}</b>
                <span>{f.body}</span>
              </li>
            ))}
          </ol>
          <div className="op-idbox">
            <b>本人確認書類をご用意ください</b>
            <p>
              運転免許証・マイナンバーカードなど。古物営業法で、買取のときに確認が必要です。18歳未満の方からは買い取れません。
            </p>
          </div>
        </div>
      </section>

      {/* ⑥ よくあるご質問。トップと同じ形（FaqTop）。id="faq" は前のまま */}
      <section className="tp-faq" id="faq">
        <div className="tw tp-sec-in">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">FAQ</p>
            <h2 className="tp-h2">よくあるご質問</h2>
          </div>
          <FaqTop items={FAQ} />
        </div>
      </section>

      {/* ⑦ 最後の案内。トップと同じ黄色の帯 */}
      <LastCta
        title="まずは、写真を1枚。"
        lead="型番が写っていれば、その場で概算をお伝えします。査定だけでも大丈夫です。"
      />
    </div>
  );
}
