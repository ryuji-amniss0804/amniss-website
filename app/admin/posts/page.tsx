import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import LogoutButton from "../_components/LogoutButton";
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
    <div className="min-h-screen bg-slate-50">

      {/* 管理ナビゲーション */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2 mr-4">
            <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">A</span>
            </div>
            <span className="text-white font-black text-sm tracking-tight">AmNiss Admin</span>
          </div>
          <Link href="/admin/posts" className="text-white text-xs font-black border-b-2 border-emerald-500 pb-0.5">
            記事一覧
          </Link>
          <Link href="/admin/posts/new" className="text-slate-400 hover:text-white text-xs font-black transition-colors">
            新規投稿
          </Link>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ヘッダー */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">記事一覧</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {posts.length} 件の記事
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all duration-200 shadow-sm hover:-translate-y-0.5"
          >
            ＋ 新規投稿
          </Link>
        </div>

        <PostsTable posts={posts} />
      </main>
    </div>
  );
}
