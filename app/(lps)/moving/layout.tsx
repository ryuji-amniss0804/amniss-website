import type { Metadata } from "next";
import "../../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://amniss-japan.jp"),
  title: "富山の単身引越しなら re'vive 富山 | 15,000円〜・養生と保険込み",
  description:
    "富山県内の単身引越しに特化。軽バン（エブリイ）で機動力高く対応。らくらく2時間パック15,000円、単身引越しパック（3時間）25,000円。毛布・養生材・運送保険込みで当日の追加請求なし。不用品はその場で買取査定し、引越し費用から差し引きます。",
  alternates: {
    canonical: "/moving",
  },
  openGraph: {
    title: "富山の単身引越しなら re'vive 富山",
    description:
      "単身引越しパック25,000円（3時間・養生材と運送保険込み）。その場買取で引越し費用を実質削減。富山県全域対応。",
    url: "https://amniss-japan.jp/moving",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function MovingLayout({
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
        className="min-h-screen flex flex-col antialiased"
        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
