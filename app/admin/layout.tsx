import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
/* ⚠ **読むだけ。1バイトも書き換えない。**
   トークン（--ink / --rule / --paper / --accent …）と本文の土台は
   このファイルの `.rv` にある。**唯一の出どころ。**
   admin で読み込んでも公開ページの CSS チャンクは動かない（47で実測、63で再確認）。
   同じチャンク（site.css だけの1本）を共有するだけで、中身は変わらない。 */
import "../(site)/site.css";
import "./admin.css";

/**
 * 管理画面のルートレイアウト。(site) とは別のルートグループ。
 *
 * 【63／段階5】**Tailwind をやめて、公開ページと同じ `.rv` のトークンに乗せた。**
 * 以前は `globals.css`（Tailwind）を読み、色も余白も admin だけの別物だった。
 * 竜司さんが毎日見る画面なので、**サイトと同じ字面・同じ色**で読めるほうがよい。
 *
 * <body> に付けている2つのクラスの役目：
 * - `.rv` … site.css のトークン・リセット・本文フォントを引く（値の出どころ）
 * - `.ad` … admin.css がぶら下がる目印
 *
 * ⚠ `.rv` を付けたので、`.rv .btn` や `.rv .post` が管理画面でもそのまま使える。
 * admin 側で新しく作るクラスは **すべて `ad-` で始める。**
 * 前置きを付けないと、site.css 側のクラス名とぶつかったときに気づけない。
 *
 * フォントは (site) と同じ設定を同じ変数名で読み込む（`app/(site)/layout.tsx:22-36`）。
 * 変数が無いと `var(--rv-font-serif)` が外れ、見出しが明朝にならない。
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
    <html lang="ja" className={`rv-html ${notoSans.variable} ${notoSerif.variable}`}>
      <body className="rv ad">{children}</body>
    </html>
  );
}
