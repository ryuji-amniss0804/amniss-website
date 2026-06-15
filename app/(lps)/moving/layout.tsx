import type { Metadata } from "next";
import "../../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "富山の単身引越しなら re'vive | 引越し費用を買取で相殺",
  description:
    "富山県内の単身引越しに特化。軽バン（エブリイ）で機動力高く対応。不用品はその場で買取査定。引越し費用を実質削減。富山県SDGs宣言企業。",
  openGraph: {
    title: "富山の単身引越しなら re'vive",
    description:
      "単身引越し＋その場買取で引越し費用を実質削減。富山県全域対応。",
    url: "https://revive-lp-eight.vercel.app/moving",
    type: "website",
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
