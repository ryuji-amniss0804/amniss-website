export const metadata = {
  title: "プライバシーポリシー | re'vive",
  description:
    "AmNiss & Co. Japan / re'viveのプライバシーポリシー・免責事項。個人情報の取得・利用目的・管理方針を掲載しています。",
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
    <div
      className="min-h-screen pt-28 pb-20"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ページタイトル */}
        <div className="amn-animate mb-16" style={{ animationDelay: "0s" }}>
          <span
            className="text-xs font-black tracking-widest uppercase block mb-3"
            style={{ color: "var(--color-primary-light)" }}
          >
            Privacy Policy
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            プライバシーポリシー
          </h1>
          <div
            className="w-10 h-0.5 mt-5"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
        </div>

        {/* ポリシーセクション */}
        <div style={{ borderTop: "1px solid var(--color-border)" }}>
          {POLICY_SECTIONS.map((item, idx) => (
            <section
              key={idx}
              className="amn-animate py-8"
              style={{
                animationDelay: `${0.1 + idx * 0.08}s`,
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <h2
                className="text-base font-black mb-3"
                style={{ color: "var(--color-primary)", fontFamily: "'Noto Serif JP', serif" }}
              >
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {item.content}
              </p>
            </section>
          ))}
        </div>

        {/* 制定日 */}
        <div className="amn-animate mt-12 text-right" style={{ animationDelay: "0.7s" }}>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>AmNiss & Co. Japan</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>制定日：2026年5月30日</p>
        </div>

      </div>
    </div>
  );
}
