import type { Metadata } from "next";
import Split from "../_components/Split";
import Cta from "../_components/Cta";
import QuoteForm from "./QuoteForm";
import { AREA, HOURS, LINE_URL, TEL, TEL_HREF } from "@/lib/site";

/**
 * お問い合わせ。
 *
 * **見積り依頼フォームが入っている。**送信は自前で、
 * 写真は Vercel Blob へブラウザから直接、通知は Resend で竜司さんのメールへ。
 * 中身は QuoteForm.tsx（クライアント側）。Web3Forms は使わない。
 *
 * 電話とLINEはフォームより速いので、フォームの下に並べて残してある。
 * 「お急ぎの方は」という代替扱いにしないこと。
 */

const DESCRIPTION =
  "re'vive 富山へのお問い合わせ。お荷物の写真を送るだけで、お見積りをお返しします。お電話・公式LINEでも承ります。富山県全域、受付9:00〜21:00・年中無休。";

export const metadata: Metadata = {
  title: "お問い合わせ ｜ re'vive 富山",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  // openGraph を書かないとレイアウトのもの（トップの文）がそのまま継承される。
  // og:title は <title> と、og:description は description と同じにする。
  openGraph: {
    title: "お問い合わせ ｜ re'vive 富山",
    description: DESCRIPTION,
    url: "https://amniss-japan.jp/contact",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <Split kicker="お 問 い 合 わ せ" title="お問い合わせ" first>
        {/* 1つづきの文なので、JSX で折らずに文字列1本で渡す */}
        <p className="lead" style={{ marginTop: 0 }}>
          {"写真を送っていただければ、金額を確定してお返しします。"}
        </p>
        <p className="lead">
          {
            "荷物の量がはっきりしなくても大丈夫です。「6畳の部屋ひとつ分」「冷蔵庫と洗濯機とベッド」くらいの伝え方で見積もれます。"
          }
        </p>

        <QuoteForm />
      </Split>

      <Split kicker="お 電 話 ・ L I N E" title="話して決めることもできます" tint>
        <p className="lead" style={{ marginTop: 0 }}>
          {"フォームより速くお返事できます。写真はLINEでもお送りいただけます。"}
        </p>
        {/* ラベルと値のあいだの全角空白は、**必ず文字列リテラルで書く**（指示 34 §2）。
            JSX は、テキストと要素のあいだにある「改行を含む半角の空白」を消す。
            `電話` と `<a>` を改行で分けて書くと、消された結果くっついて
            「電話070-8450-0897」になる。全角空白（U+3000）は消されないので、
            `{"電話　"}` と書けば残る。「対応エリア　{AREA}」が崩れていなかったのは、
            全角空白が同じ行の文字列の中にあったため。 */}
        <p className="lead">
          {"電話　"}
          <a className="tl" href={TEL_HREF}>
            {TEL}
          </a>
          　（受付 {HOURS}）
        </p>
        <p className="lead">
          {"LINE　"}
          <a className="tl" href={LINE_URL} target="_blank" rel="noopener noreferrer">
            相談する
          </a>
        </p>
        <p className="lead">対応エリア　{AREA}</p>
      </Split>

      <Cta />
    </>
  );
}
