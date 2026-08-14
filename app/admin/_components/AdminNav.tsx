import Link from "next/link";
import LogoutButton from "./LogoutButton";

/**
 * 管理画面の上の帯。【63／段階5】
 *
 * 以前は `posts/page.tsx` と `PostForm.tsx` に**同じものが2つ写してあった。**
 * 片方だけ直すと、画面を移った瞬間に帯の形が変わる。1か所にまとめてある。
 *
 * ⚠ **360px で折り返させないこと。**折り返すと「記事一／覧」「新規投／稿」と
 * 1文字ずつ縦に割れて、帯が3行になる（改修前の 360px で実測）。
 * `.ad-hd-in` を `flex-wrap: nowrap`、リンクを `white-space: nowrap` にして、
 * **入りきらないときは屋号の文字（`<b>`）だけを畳む**（admin.css の 560px）。
 *
 * `right` は右端に足すもの。投稿・編集の画面だけ「プレビューを隠す」が入る。
 */
export default function AdminNav({
  current,
  right,
}: {
  current: "list" | "new";
  right?: React.ReactNode;
}) {
  return (
    <header className="ad-hd">
      <div className="ad-w-wide ad-hd-in">
        <span className="ad-brand">
          <i>A</i>
          <b>AmNiss Admin</b>
        </span>

        <nav className="ad-nav">
          <Link href="/admin/posts" className={current === "list" ? "on" : undefined}>
            記事一覧
          </Link>
          <Link href="/admin/posts/new" className={current === "new" ? "on" : undefined}>
            新規投稿
          </Link>
        </nav>

        <div className="ad-hd-r">
          {right}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
