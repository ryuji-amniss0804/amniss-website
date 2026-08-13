import { remark } from "remark";
import remarkHtml from "remark-html";

/**
 * マークダウンを記事本文の HTML にする。**本番と管理画面のプレビューで、これ1本を使う。**
 *
 * 【なぜ1本にまとめたか —— 47_admin で測った食い違い】
 * 以前はプレビューが `marked`（`gfm: true, breaks: true`）、本番が `remark` + `remark-html` と
 * **別のレンダラー**だった。同じ文字列を通すと **6例中5例で出力が違っていた。**
 * とくに「Enter 1回の改行」は、プレビューでは改行され本番では改行されない。
 * **表よりずっと日常的に踏む食い違い**だった。
 *
 * 呼ぶ場所が2つあるかぎり、片方だけ設定が変わって静かにズレ直す。
 * **同じ関数を呼ぶ形にして、ズレようがなくしてある。**
 *
 * ⚠ **`remark-gfm` は入れないこと**（50で決定）。表・取り消し線・チェックリストは使わない方針で、
 * `.rv .post` には表の CSS も無い（`app/(site)/site.css`）。
 * 入れるなら **CSS とプレビューと本番の3つを同時に**動かすこと。
 *
 * ⚠ **`breaks` は付けないこと。**付けるとプレビューだけが改行し、本番と食い違う。
 *
 * `process`（非同期）ではなく `processSync` を使うのは、**プレビューがブラウザ側の
 * 描画中に呼ぶため**。remark-html は同期プラグインなので `processSync` で通る。
 */
export function renderMarkdown(markdown: string): string {
  return remark().use(remarkHtml).processSync(markdown).toString();
}
