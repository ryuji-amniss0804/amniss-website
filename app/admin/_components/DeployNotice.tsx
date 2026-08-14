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
    <div className="ad-note">
      <p>{children}</p>
      <p className="ad-note-s">
        公開ページを作り直しています。<strong>もう一度押す必要はありません。</strong>
      </p>
    </div>
  );
}
