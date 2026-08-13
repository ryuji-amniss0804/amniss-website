import Link from "next/link";
import PostForm from "../../../_components/PostForm";
import { readPostFromRepo } from "@/lib/admin-github";

/**
 * 記事の編集。【55／段階4】
 *
 * ⚠ **中身は GitHub から読む。ビルド時のファイル（`content/blog/`）ではない。**
 * Vercel に配られているファイルはビルドした瞬間のもので、投稿・編集の直後 約2分間は古い。
 * その古い本文を編集画面に出すと、**保存した瞬間に直前の変更が巻き戻る。**
 *
 * そのため、このページは**毎回サーバーで作る**（下の `dynamic`）。
 * 作り置きにすると、ビルドした瞬間の本文が焼き付く。
 */
export const dynamic = "force-dynamic";

function ErrorPanel({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10">
          <div className="text-5xl mb-5">🔍</div>
          <h2 className="text-xl font-black text-slate-900 mb-3">{title}</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">{detail}</p>
          <Link
            href="/admin/posts"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-sm transition-all mt-8"
          >
            記事一覧へ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await readPostFromRepo(slug);

  if (!result.ok) {
    return (
      <ErrorPanel
        title={result.status === 404 ? "記事が見つかりません" : "記事を読み込めませんでした"}
        detail={
          result.status === 404
            ? `/blog/${slug} は存在しません。既に削除されたか、URLが違います。`
            : `${result.error}。少し時間をおいて、もう一度開いてください。`
        }
      />
    );
  }

  const { post } = result;

  return (
    <PostForm
      mode="edit"
      initial={{
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        category: post.category,
        content: post.content,
        sha: post.sha,
      }}
    />
  );
}
