import type { Metadata } from "next";
import PageHero from "../_components/PageHero";
import LastCta from "../_components/LastCta";
import QuoteForm from "./QuoteForm";
import { AREA, HOURS, HOURS_RANGE, LINE_URL, TEL, TEL_HREF } from "@/lib/site";

/**
 * お問い合わせ。
 *
 * **見積り依頼フォームが入っている。**送信は自前で、
 * 写真は Vercel Blob へブラウザから直接、通知は Resend で竜司さんのメールへ。
 * 中身は QuoteForm.tsx（クライアント側）。Web3Forms は使わない。
 *
 * 電話とLINEはフォームより速いので、フォームの横（860px以下では下）に並べて残してある。
 * 「お急ぎの方は」という代替扱いにしないこと。
 *
 * 【93_other_pages】トップと同じトーンに作り直した。見た目の正は参考モック
 * （top_mock_20261008/Others.dc.html の2つ目）。
 * **フォームの項目・入力チェック・送信の動き・送信先は変えていない。**変えたのは見た目だけで、
 * QuoteForm.tsx に足したのは「任意」の印を見分けるクラス1つ（site.css の `.op-form` が色を付ける）。
 *
 * 【読み上げ】前は「電話　070-…」「LINE　相談する」と1行に並べていて、ラベルと値がくっつかないよう
 * 全角空白を文字列で入れ、LINE のリンクには aria-label を付けていた（指示 34・36）。
 * 新しい形では、ラベルは見出し（h2）、値はその下の別の段落なので、くっつかない。
 * LINE のボタンは文字そのものが「LINEで相談する」になったので、aria-label は要らなくなった。
 */

// 受付時間を書き写さない。検索結果の文章だけ古い時間が残る事故を防ぐ（lib/site.ts から組み立てる）
const DESCRIPTION = `re'vive 富山へのお問い合わせ。お荷物の写真を送るだけで、お見積りをお返しします。お電話・公式LINEでも承ります。富山県全域、受付${HOURS_RANGE}・年中無休。`;

export const metadata: Metadata = {
  title: "お問い合わせ ｜ re'vive 富山",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  // openGraph を書かないとレイアウトのもの（トップの文）がそのまま継承される。
  // og:title は <title> と、og:description は description と同じにする。
  openGraph: {
    title: "お問い合わせ ｜ re'vive 富山",
    description: DESCRIPTION,
    url: "https://revive-toyama.jp/contact",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="tp pp op">
      <PageHero kicker="CONTACT" title="お問い合わせ" />

      <section className="op-sec">
        <div className="tw op-ct">
          {/* 左：フォーム（白い枠） */}
          <div className="op-form">
            <p className="op-form-lead">
              写真を送っていただければ、金額を確定してお返しします。
              <br />
              「冷蔵庫と洗濯機とベッド」くらいの書き方で大丈夫です。
            </p>
            <QuoteForm />
          </div>

          {/* 右：電話とLINE（紺のカード2枚）。フォームより速い */}
          <aside className="op-side">
            <div className="op-sc">
              <h2>電話</h2>
              <p>
                <a className="tp-num op-sc-tel" href={TEL_HREF}>
                  {TEL}
                </a>
              </p>
              <p>{`受付 ${HOURS}`}</p>
            </div>
            <div className="op-sc">
              <h2>LINE</h2>
              <p>フォームより早くお返事できます。写真もそのまま送れます。</p>
              <a className="tp-btn tp-btn-y" href={LINE_URL} target="_blank" rel="noopener noreferrer">
                LINEで相談する
              </a>
            </div>
            {/* 電話の受付を 18:00 までに短くした（84）。**短くなったことだけが見えると閉じた印象になる**ので、
                受け皿が24時間あることを電話番号のすぐ近くで同時に見せる。 */}
            <p className="op-side-n">{`フォームとLINEは24時間受け付けています。対応エリア：${AREA}`}</p>
          </aside>
        </div>
      </section>

      {/* 最後の案内。文はトップと同じ */}
      <LastCta title="まずは、写真を1枚。" lead="運びたい物、売りたい物を撮って送ってください。型番が写っていれば、その場で概算をお伝えします。" />
    </div>
  );
}
