import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, Roboto_Mono } from "next/font/google";
import "./pc.css";
import PcHeader from "./_components/PcHeader";
import PcFooter from "./_components/PcFooter";
import Ga4 from "../components/Ga4";
import { PC_META } from "@/lib/pc";

/**
 * パソコン修理（/pc）のルートレイアウト。
 * `(site)` `admin` に続く3つ目のルートグループ。URL には `(pc)` は出ない。
 *
 * 【なぜ (site) に相乗りしないのか】
 * 1. ヘッダーとフッターが別物。`(site)/layout.tsx` は引越し・買取の Header / Footer /
 *    MobileBar を全ページに描画する。こちらは re'vive_doc のロゴと、
 *    症状・料金・事例・中古PC・お知らせのナビを持つ。
 * 2. CSSトークンが別物。`site.css` の `--ink` は #16202b（青系）、
 *    `pc.css` は #131310（診断報告書に合わせた暖色系）。**同じ変数名で値が違う。**
 * 3. フォントのウェイトが足りない。`(site)` は Noto Sans / Serif を 400 と 600 だけで
 *    読んでいる。こちらは 700 を使い（太字・マーカー・金額・ボタン）、
 *    さらに等幅（数字と英字ラベル）が要る。
 *
 * ⚠ `app/(site)/site.css` をここから読み込まないこと。
 *   読み込むと `.rv` のリセットまで付いてきて、どちらが勝つかが読み込み順で決まる。
 * ⚠ ルートレイアウトをまたぐ移動（`/` ↔ `/pc`）はフルリロードになる。
 *   これは Next.js の仕様で、トークンが混ざらないことの裏返しでもある。
 *
 * 【82】noindex は外した。/pc 配下は検索に出る。sitemap は app/sitemap.ts にある。
 *
 * 【フォント】`(site)` の 400/600 とは別に読む。変数名も `--pc-` で分ける。
 * 等幅（Roboto Mono）は「計測器」のトーンの核。金額・測定値・エリア名・
 * セクション番号・タグに使う。
 */

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--pc-font-sans",
  preload: false,
});

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--pc-font-serif",
  preload: false,
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--pc-font-mono",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://revive-toyama.jp"),
  title: "re'vive_doc | 富山のパソコン修理・出張診断",
  description: PC_META.top,
  // canonical はレイアウトに置かない。子ページに継承されるため、各ページ側で指定すること。
  openGraph: {
    title: "re'vive_doc | 富山のパソコン修理・出張診断",
    description: PC_META.topOg,
    url: "https://revive-toyama.jp/pc",
    siteName: "re'vive_doc",
    locale: "ja_JP",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function PcLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`pc-html ${notoSans.variable} ${notoSerif.variable} ${robotoMono.variable}`}
    >
      <head>
        {/* JsonLd は載せない。あちらは MovingCompany の宣言で、修理業の記述ではない。
            /pc 用の構造化データは、中身のあるページが揃ってから（79以降）足す。 */}
        <Ga4 />
      </head>
      <body className="pc">
        <PcHeader />
        <main>{children}</main>
        <PcFooter />
      </body>
    </html>
  );
}
