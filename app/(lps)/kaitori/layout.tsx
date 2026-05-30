import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ─── 【重要】re'vive専用のSEO・メタデータ設定 ───
export const metadata: Metadata = {
  title: "富山の出張買取・不用品回収なら re'vive（リバイブ）",
  description: "富山県全域対応。古いカメラ、PC、ジャンクPC、ゲーム機から押し入れのガラクタまで、出張・査定0円で即日現金買取！あなたがゴミだと思っているモノに世界基準の価値を見出します。",
  keywords: ["富山 買取", "出張買取 富山", "不用品回収 富山", "カメラ 買取 富山", "パソコン 処分 富山", "ジャンクPC 買取 富山", "リバイブ 富山"],

  // LINEやSNSでURLを貼ったときにリッチに表示させる設定（OGP）
  openGraph: {
    title: "富山の出張買取・不用品回収なら re'vive（リバイブ）",
    description: "古いカメラ、PC、壊れたゲーム機まで出張査定0円で即日現金買取！押し入れのガラクタ、実はお宝かも？！",
    url: "https://revive-lp-eight.vercel.app/", // ※実際の公開URLに合わせて最適化しておきました
    siteName: "re'vive（リバイブ）",
    images: [
      {
        url: "/images/IMG_1438.JPG", // LINEで共有したときに表示されるエブリイの画像
        width: 1200,
        height: 630,
        alt: "re'vive 出張買取・不用品回収",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },

  // 👇 【ココを追加！】Googleサーチコンソールの認証設定
  verification: {
    google: "_pNUoPPmmA1sI3aZLNk07IiSAD5PKyi0UGmhT5oMvwg",
  },
};

// 💡 画面の表示最適化（viewportはmetadataの外に出すのが最新のNext.jsのルールなのでここに移動しました）
export const viewport = "width=device-width, initial-scale=1, maximum-scale=1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 💡 lang="en" から lang="ja" に修正して検索エンジンに日本語サイトだと認識させます
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}