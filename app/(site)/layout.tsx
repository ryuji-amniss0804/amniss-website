import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./site.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import MobileBar from "./_components/MobileBar";
import JsonLd from "../components/JsonLd";

/**
 * 新デザインのルートグループ。
 *
 * (corporate) とは別のルートレイアウトなので、Tailwind（globals.css）は
 * ここでは読み込まない。design_tokens.css 由来のリセットが Preflight と
 * 衝突するのを、そもそも同居させないことで避けている。
 * ブログは (corporate) 側に残るため、どちらの CSS も相手側に漏れない。
 *
 * フォントは next/font/google で自己ホストする。weight は 400 と 600 のみ。
 * 見出し・価格・電話番号は Noto Serif JP（明朝）。
 */

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--rv-font-sans",
  preload: false,
});

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--rv-font-serif",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amniss-japan.jp"),
  title: "re'vive 富山 | 単身引越し・出張買取・軽貨物運送",
  description:
    "富山県の単身引越しと出張買取ならre'vive 富山（リバイブ）。単身引越し20,000円〜・出張買取 査定無料。富山県全域、当日対応可。引越し費用を不用品買取で実質削減。古物商許可・貨物軽自動車運送事業届出済。富山県SDGs宣言企業。",
  // canonical はレイアウトに置かない。子ページに継承されるため、各ページ側で指定すること。
  openGraph: {
    title: "re'vive 富山 | 単身引越し・出張買取・軽貨物運送",
    description:
      "富山県全域対応。単身引越し20,000円〜・出張買取 査定無料。養生材・運送保険込み。不用品はその場で買取査定。",
    url: "https://amniss-japan.jp",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`rv-html ${notoSans.variable} ${notoSerif.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="rv">
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}
