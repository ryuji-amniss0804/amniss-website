import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "../globals.css";

/**
 * 管理画面のルートレイアウト。(site) とは別のルートグループで、Tailwind はこちらだけが読む。
 *
 * フォントは **(site) と同じ設定を同じ変数名で**読み込む（`app/(site)/layout.tsx:21-35` と同じ）。
 * 新規投稿ページのプレビューが `.rv .post` の CSS を使うようになり、その中で
 * `var(--rv-font-serif)` を参照するため。**変数が無いと見出しだけ明朝にならず、
 * 「本番と同じ」に見えなくなる。**
 *
 * ⚠ 管理画面そのものの見た目は変わらない。`<body>` は Tailwind の `font-sans` のままで、
 * ここで足しているのは **CSS 変数の定義だけ**。
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
  title: "AmNiss Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen bg-slate-50 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
