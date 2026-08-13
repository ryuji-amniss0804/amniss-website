"use client";

import { useSyncExternalStore } from "react";

/* ────────────────────────────────────────────────────────────────────────
   「ブラウザで動き出したか」を、ハイドレートとズレずに知るための仕掛け。

   【なぜ要るか —— 47_admin で特定したバグ（A-4）】
   管理画面はビルド時に作り置きされる静的ページ（ビルドログの `○ /admin/posts` など）。
   作り置きの HTML は**先に画面に出るが、まだ何も繋がっていない。**
   React はハイドレートの瞬間に入力欄の中身を自分の状態で**警告なしに上書き**するので、
   **JS が追いつく前に打ち込んだ内容が黙って消える。**
   押しても何も起きないボタンも同じで、「押したのに効かない」に見える。

   対策は、**動き出すまで入力欄とボタンを `disabled` にする**こと。
   ⚠ **新規投稿・編集・削除の3か所すべてに効かせること。**
   1か所でも素通しだと、同じバグをそこに作り直すことになる。だからこの1ファイルにしてある。

   `useSyncExternalStore` を使うのは、サーバー用とブラウザ用の値を明示的に分けられて、
   ハイドレートのズレが原理的に起きないため（`useEffect` + `setState` だと
   「効果の中で setState するな」の規則にも触れる）。
   ──────────────────────────────────────────────────────────────────────── */

/** 変化を購読する必要はないので、解除関数だけ返す */
const subscribeNothing = () => () => {};
const getReadyOnClient = () => true;
const getReadyOnServer = () => false;

/** 作り置きの HTML（＝まだ触れない状態）では false、ブラウザで動き出すと true。 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNothing, getReadyOnClient, getReadyOnServer);
}
