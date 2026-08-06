import type { Metadata } from "next";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://amniss-japan.jp"),
  title: "re'vive 富山 | 単身引越し・出張買取・軽貨物運送",
  description:
    "富山県の単身引越しと出張買取ならre'vive 富山（リバイブ）。単身引越し20,000円〜・出張買取 査定無料。富山県全域、当日対応可。引越し費用を不用品買取で実質削減。古物商許可・貨物軽自動車運送事業届出済。富山県SDGs宣言企業。",
  // canonical はレイアウトに置かない。
  // App Router では alternates が子ページに継承されるため、
  // ここに canonical: "/" を書くとブログ記事まで全部トップに正規化されてしまう。
  // 各ページ側で個別に指定すること。
  openGraph: {
    title: "re'vive 富山 | 単身引越し・出張買取・軽貨物運送",
    description:
      "富山県の単身引越しと出張買取ならre'vive 富山（リバイブ）。単身引越し20,000円〜・出張買取 査定無料。富山県全域、当日対応可。引越し費用を不用品買取で実質削減。古物商許可・貨物軽自動車運送事業届出済。富山県SDGs宣言企業。",
    url: "https://amniss-japan.jp",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function CorporateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <JsonLd />
      </head>
      <body
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
