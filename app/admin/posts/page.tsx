import Link from "next/link";
import { BLOG_POSTS_META } from "@/lib/posts-meta";
import LogoutButton from "../_components/LogoutButton";

export default function AdminPostsList() {
  const posts = [...BLOG_POSTS_META].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">記事一覧</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {posts.length} 件の記事
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all duration-200 shadow-sm hover:-translate-y-0.5"
          >
            ＋ 新規投稿
          </Link>
        </div>

        {/* 記事テーブル */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {posts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-medium text-sm">
              まだ記事がありません
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">日付</th>
                  <th className="text-left px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">カテゴリ</th>
                  <th className="text-left px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">タイトル</th>
                  <th className="text-left px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">種別</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">リンク</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr
                    key={post.slug}
                    className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "" : "bg-slate-50/30"} hover:bg-emerald-50/30 transition-colors`}
                  >
                    <td className="px-5 py-4 text-slate-500 font-bold text-xs whitespace-nowrap">
                      {post.date}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`${post.accent} text-[10px] font-black px-2 py-0.5 rounded-full`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 text-xs max-w-md">
                      <span className="line-clamp-2">{post.title}</span>
                    </td>
                    <td className="px-5 py-4">
                      {post.isStaticPage ? (
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">静的ページ</span>
                      ) : (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">マークダウン</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        表示 →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
