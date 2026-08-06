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
    "re'vive 富山へのお問い合わせ。電話・LINEで承っています。富山県全域、9:00〜21:00 年中無休。運びたい物・売りたい物の写真があれば、その場で金額をお出しします。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Split kicker="お 問 い 合 わ せ" title="お問い合わせ" first>
        <p className="lead" style={{ marginTop: 0 }}>
          お電話かLINEで承っています。運びたい物・売りたい物の写真があれば、
          その場で金額をお出しします。見積りだけのご相談も歓迎です。
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
        {/* 1つづきの文なので、JSX で折らずに文字列1本で渡す */}
        <p className="pnote">
          {"入力フォームは準備中です。お急ぎの方は、お電話かLINEでご連絡ください。"}
        </p>
      </Split>

      <Cta />
    </>
  );
}
