import type { Metadata } from "next";
import Split from "../_components/Split";
import Cta from "../_components/Cta";
import { AREA, HOURS, LINE_URL, TEL, TEL_HREF } from "@/lib/site";

/**
 * お問い合わせ。
 *
 * **フォームのUIはまだ入っていない。**この段階で作っているのは、
 * `/kaitori` を公開したときにリンク切れを残さないため。
 * モバイルではヘッダーのCTAが唯一のフォーム導線なので、
 * 404 のまま公開する状態を作らない。
 *
 * フォーム本体（Web3Forms）は次の段階で入れる。送信の疎通確認は最後。
 */

export const metadata: Metadata = {
  title: "お問い合わせ ｜ re'vive 富山",
  description:
    "re'vive 富山へのお問い合わせ。入力フォームは準備中です。お急ぎの方は、お電話かLINEでご連絡ください。富山県全域、受付9:00〜21:00・年中無休。",
  alternates: { canonical: "/contact" },
  // openGraph を書かないとレイアウトのもの（トップの文）がそのまま継承される。
  // og:title は <title> と、og:description は description と同じにする。
  openGraph: {
    title: "お問い合わせ ｜ re'vive 富山",
    description:
      "re'vive 富山へのお問い合わせ。入力フォームは準備中です。お急ぎの方は、お電話かLINEでご連絡ください。富山県全域、受付9:00〜21:00・年中無休。",
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
          {"入力フォームは準備中です。お急ぎの方は、お電話かLINEでご連絡ください。"}
        </p>
        <p className="lead">
          電話
          <a className="tl" href={TEL_HREF}>
            {TEL}
          </a>
          　（受付 {HOURS}）
        </p>
        <p className="lead">
          LINE
          <a className="tl" href={LINE_URL} target="_blank" rel="noopener noreferrer">
            LINEで相談する
          </a>
        </p>
        <p className="lead">対応エリア　{AREA}</p>
      </Split>

      <Cta />
    </>
  );
}
