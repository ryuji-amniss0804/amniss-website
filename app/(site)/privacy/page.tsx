import Hero from "../_components/Hero";
import Split from "../_components/Split";

/**
 * プライバシーポリシー（法定表示に準じる）。
 *
 * 【21_corporate で (corporate) から (site) へ移した】
 * 移したのはレイアウトだけ。**文言は1字も変えていない。**
 * 条文は Split（左に見出し・右に本文）で1条ずつ置いている。
 * 見出しの「1.」「2.」は文字列の一部なので、`.reasons` のぶら下げ番号には
 * 割らないこと（「1.」と「基本方針」に分けると、そこで文言が動く）。
 *
 * 英語のラベル `Privacy Policy` も、(site) の流儀（字間を開けた日本語）とは
 * 違うが**表示文言なので触っていない。**
 */

export const metadata = {
  title: "プライバシーポリシー | re'vive",
  description:
    "AmNiss & Co. Japan / re'viveのプライバシーポリシー・免責事項。個人情報の取得・利用目的・管理方針を掲載しています。",
  // canonical はレイアウトに置けない（子に継承されるため）。各ページで自分自身を指す。
  alternates: { canonical: "/privacy" },
  // og:title は <title> と、og:description は description と同じにする。
  // 書かないとレイアウトのもの（トップの文）がそのまま継承される
  openGraph: {
    title: "プライバシーポリシー | re'vive",
    description:
      "AmNiss & Co. Japan / re'viveのプライバシーポリシー・免責事項。個人情報の取得・利用目的・管理方針を掲載しています。",
    url: "https://amniss-japan.jp/privacy",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

const POLICY_SECTIONS = [
  {
    title: "1. 基本方針",
    content:
      "AmNiss & Co. Japan（以下「当社」）は、個人情報の保護を重要な責務と認識し、「個人情報の保護に関する法律」に基づき、お客様の個人情報を適切に管理・保護いたします。",
  },
  {
    title: "2. 個人情報の取得と利用目的",
    content:
      "当社は、以下の目的のために必要な範囲で個人情報を取得し、利用いたします。・単身引越し・運送・買取サービス等の提供・連絡　・お問い合わせに対する回答および資料送付　・サービス改善のための分析・マーケティング",
  },
  {
    title: "3. 個人情報の管理・安全対策",
    content:
      "当社は、個人情報の漏洩、紛失、破壊、改ざんを防ぐため、適切なセキュリティ対策を講じます。また、従業者に対しても必要かつ適切な監督を行い、情報の安全管理を徹底いたします。",
  },
  {
    title: "4. 第三者への提供禁止",
    content:
      "当社は、法令に基づく場合を除き、お客様の同意を得ることなく個人情報を第三者に提供・開示することはいたしません。",
  },
  {
    title: "5. 免責事項",
    content:
      "当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。",
  },
  {
    title: "6. お問い合わせ先",
    content:
      "当社のプライバシーポリシーに関するお問い合わせは、お問い合わせフォームまたは公式LINEよりご連絡ください。",
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Hero size="md" kicker="個 人 情 報" title="プライバシーポリシー" />

      {POLICY_SECTIONS.map((item, i) => (
        <Split key={item.title} title={item.title} first={i === 0} tint={i % 2 === 1}>
          <p className="lead" style={{ marginTop: 0 }}>
            {item.content}
          </p>
        </Split>
      ))}

      <section className="sec">
        <div className="w">
          <p className="pnote" style={{ marginTop: 0, textAlign: "right" }}>
            AmNiss &amp; Co. Japan
            <br />
            制定日：2026年5月30日
          </p>
        </div>
      </section>
    </>
  );
}
