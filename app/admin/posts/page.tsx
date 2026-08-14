import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import AdminNav from "../_components/AdminNav";
import PostsTable from "../_components/PostsTable";

/**
 * 記事一覧。
 *
 * 【55／段階4】表そのものは `PostsTable.tsx`（クライアント側）へ移した。
 * 削除の確認を**画面の中**でやるため（`confirm` は使わない）、状態が要る。
 *
 * ⚠ **このページはビルド時に作り置きされる。**投稿・編集・削除をしても、
 * Vercel が作り直すまでの約2分間、この一覧は古いまま。
 * `dynamic = "force-dynamic"` を足しても直らない —— 読んでいる `content/blog/` は
 * **配られた瞬間のファイル**で、GitHub へのコミットでは変わらないため。
 * だから「2分ほどかかります」を画面に出している（`DeployNotice`）。
 */
export default function AdminPostsList() {
  // 【50】以前は `BLOG_POSTS_META` の直読み。メタデータを .md のフロントマターへ
  // 移したので、ここも `getAllPosts()` を通す（日付の降順は中で済んでいる）。
  const posts = getAllPosts();

  return (
    <>
      <AdminNav current="list" />

      <main className="ad-w ad-main">
        <div className="ad-head">
          <div>
            <h1 className="ad-h1">記事一覧</h1>
            <p className="ad-sub">{posts.length} 件の記事</p>
          </div>
          <Link href="/admin/posts/new" className="btn btn-fill">
            新規投稿
          </Link>
        </div>

        <PostsTable posts={posts} />
      </main>
    </>
  );
}
