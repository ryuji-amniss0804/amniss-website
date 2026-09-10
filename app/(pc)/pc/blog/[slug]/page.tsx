import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPcPosts, getPcPostBySlug } from "@/lib/pc-posts";

/**
 * /pc/blog/<slug> 記事の本文。
 *
 * 見た目は `/pc/case/01-raiden` と同じ組み方（`.article`）。**新しいCSSは足していない。**
 * 7段の文字サイズの外に新しいサイズを作らないこと。色を敷くのも増やさないこと（79d）。
 *
 * ⚠ **`.article` を2つに分けているのは、見た目の都合ではない。**
 *   `pc.css` の本文の段落は `.pc .article > p`（子セレクタ）で当たっている。
 *   マークダウンから来る HTML を `.article` の中でさらに1枚囲むと、段落が
 *   その指定から外れて余白ゼロ（`.pc p { margin: 0 }`）になる。だから見出しまわりと
 *   本文で `.article` を2つ並べている。`.article` は幅（720px・中央寄せ）だけの器なので、
 *   2つ並べても同じ1本の段のまま見える。
 *
 * ⚠ 本文は `dangerouslySetInnerHTML` で入る素のタグ列なので、1要素ずつクラスを
 *   付けられない。表（`.tw`）と但し書き（`.note`）は**記事側（.md）に生HTMLで書いてある。**
 *   なぜ生HTMLでよいのか・いつ見直すのかは `lib/pc-posts.ts` の `renderPcMarkdown()` に書いた。
 *
 * ⚠ 構造化データ（`Article` など）はここに足さないこと。89のあとに別で入れる。
 * ⚠ `.pc-top` を付けないこと。付けるとセクション番号（01 ／ …）が出る。
 *
 * robots はレイアウト（`app/(pc)/layout.tsx`）で一括して見ている。ここでは指定しない。
 */

/** 記事は `content/pc-blog/` にあるものが全部。生成しなかった slug は 404 でよい */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPcPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPcPostBySlug(slug);
  if (!post) return { title: "記事が見つかりません | re'vive_doc 富山" };
  return {
    title: `${post.meta.title} | re'vive_doc 富山`,
    description: post.meta.excerpt,
    alternates: { canonical: `/pc/blog/${slug}` },
    openGraph: {
      title: `${post.meta.title} | re'vive_doc 富山`,
      description: post.meta.excerpt,
      url: `https://revive-toyama.jp/pc/blog/${slug}`,
      siteName: "re'vive_doc",
      locale: "ja_JP",
      type: "article",
      publishedTime: post.meta.date || undefined,
    },
  };
}

export default async function PcBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPcPostBySlug(slug);
  if (!post) notFound();
  const { meta, contentHtml } = post;

  return (
    <section className="sec">
      <div className="w">
        <header className="article">
          <div className="card-meta">
            <span>{meta.date}</span>
            <span className="tag">{meta.category}</span>
          </div>
          <h1>{meta.title}</h1>
          <p className="ld">{meta.excerpt}</p>
        </header>

        {/* 本文。`.article` の直下に置くこと（上の ⚠ を読むこと） */}
        <article className="article" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        <div className="center article-cta">
          <Link className="btn p" href="/pc/contact">
            パソコンのことを相談する
          </Link>
          <Link className="btn s" href="/pc/blog">
            お知らせの一覧へ
          </Link>
        </div>
      </div>
    </section>
  );
}
