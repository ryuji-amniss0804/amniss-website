import Link from "next/link";
import AdminNav from "../../../_components/AdminNav";
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
    <>
      <AdminNav current="list" />
      <main className="ad-w ad-res">
        <div className="ad-res-in">
          <h2 className="ad-res-t">{title}</h2>
          <p className="ad-res-s">{detail}</p>
          <div className="ad-res-acts">
            <Link href="/admin/posts" className="btn btn-fill">
              記事一覧へ戻る
            </Link>
          </div>
        </div>
      </main>
    </>
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
