/**
 * 「押したのに、まだ変わらない」を先に説明しておくための表示。【55／段階4】
 *
 * 投稿・編集・削除は GitHub にコミットするところまでで、**公開ページはそのあと
 * Vercel が作り直して、はじめて変わる。**実測で2分半かかったことがある。
 * ここを出さないと「効いていない」と思って、もう一度押すことになる。
 *
 * ⚠ **3か所（投稿・編集・削除）で同じ文言にしてある。**片方だけ直さないこと。
 */
export default function DeployNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left">
      <p className="text-xs font-black text-amber-800 leading-relaxed">{children}</p>
      <p className="text-[11px] text-amber-700 font-medium leading-relaxed mt-1">
        公開ページを作り直しています。<strong className="font-black">もう一度押す必要はありません。</strong>
      </p>
    </div>
  );
}
