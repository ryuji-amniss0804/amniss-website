import type { Metadata } from "next";
import { Barlow_Condensed, Roboto_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import "./pc.css";
import PcHeader from "./_components/PcHeader";
import PcFooter from "./_components/PcFooter";
import Ga4 from "../components/Ga4";
import PcJsonLd from "./_components/PcJsonLd";
import { PC_META } from "@/lib/pc";

/**
 * パソコン修理（/pc）のルートレイアウト。
 * `(site)` `admin` に続く3つ目のルートグループ。URL には `(pc)` は出ない。
 *
 * 【なぜ (site) に相乗りしないのか】
 * 1. ヘッダーとフッターが別物。`(site)/layout.tsx` は引越し・買取の Header / Footer /
 *    MobileBar を全ページに描画する。こちらは re'vive_doc のロゴと、
 *    症状・料金・事例・お知らせのナビを持つ。
 * 2. CSSトークンが別物。本体は紺×黄色、こちらは**同じ紺の地×診断のグリーン**（94）。
 *    トークンは `pc.css` の `.pc` に `--doc-*` で持つ。
 *
 * ⚠ `app/(site)/site.css` をここから読み込まないこと。
 *   読み込むと `.rv` のリセットまで付いてきて、どちらが勝つかが読み込み順で決まる。
 * ⚠ ルートレイアウトをまたぐ移動（`/` ↔ `/pc`）はフルリロードになる。
 *   これは Next.js の仕様で、トークンが混ざらないことの裏返しでもある。
 *
 * 【82】noindex は外した。/pc 配下は検索に出る。sitemap は app/sitemap.ts にある。
 *
 * 【フォント】94 で本体（re'vive）と同じ2書体にそろえた。変数名は `--pc-` で分ける。
 * - 本文・見出し：Zen Kaku Gothic New
 * - 金額：Barlow Condensed
 * - **計測値・診断報告書まわりの数字だけ Roboto Mono**（事例の表・測定値・英字の小見出し）
 * Noto Sans JP / Noto Serif JP は /pc で使わなくなったので読み込みから外した。
 */

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
  variable: "--pc-font-zen",
  preload: false,
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--pc-font-num",
  preload: false,
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
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
      className={`pc-html ${zenKaku.variable} ${barlow.variable} ${robotoMono.variable}`}
    >
      <head>
        {/* `app/components/JsonLd.tsx` は載せない。あちらは MovingCompany の宣言で、
            修理業の記述ではない。/pc 用は PcJsonLd（LocalBusiness / Service）を出す。【83】 */}
        <Ga4 />
        <PcJsonLd />
      </head>
      <body className="pc">
        <PcHeader />
        <main>{children}</main>
        <PcFooter />
      </body>
    </html>
  );
}
