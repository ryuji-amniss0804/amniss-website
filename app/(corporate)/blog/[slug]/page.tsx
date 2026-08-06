import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

const LINE_URL = "https://lin.ee/845Fdsy";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts
    .filter((p) => !p.isStaticPage)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "記事が見つかりません | re'vive Blog" };
  return {
    title: `${post.meta.title} | re'vive 富山 ブログ`,
    description: post.meta.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      // og:title は <title> と同じにする（サイト名まで含めた文字列）
      title: `${post.meta.title} | re'vive 富山 ブログ`,
      description: post.meta.excerpt,
      url: `https://amniss-japan.jp/blog/${slug}`,
      siteName: "re'vive 富山",
      locale: "ja_JP",
      type: "article",
      publishedTime: post.meta.date || undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const { meta, contentHtml } = post;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* ヘッダー */}
      <header
        className="pt-28 pb-12 px-4"
        style={{
          backgroundColor: "var(--color-surface-alt)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="max-w-3xl mx-auto">

          {/* パンくず */}
          <nav
            className="text-xs font-bold mb-8 flex items-center gap-1.5 flex-wrap"
            style={{ color: "var(--color-muted)" }}
          >
            <Link href="/" className="transition-opacity hover:opacity-60">HOME</Link>
            <span className="opacity-40">›</span>
            <Link href="/blog" className="transition-opacity hover:opacity-60">ブログ</Link>
            <span className="opacity-40">›</span>
            <span>{meta.category}</span>
          </nav>

          {/* カテゴリ・日付 */}
          <div className="flex items-center gap-4 mb-5">
            <span
              className="text-[11px] font-black uppercase tracking-widest"
              style={{ color: "var(--color-primary-light)" }}
            >
              {meta.category}
            </span>
            <time
              className="text-xs font-bold"
              style={{ color: "var(--color-muted)" }}
            >
              {meta.date}
            </time>
          </div>

          {/* タイトル */}
          <h1
            className="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-6"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            {meta.title}
          </h1>

          {/* リード文 */}
          <p
            className="text-sm font-medium leading-relaxed pl-4 py-2"
            style={{
              color: "var(--color-muted)",
              borderLeft: "3px solid var(--color-primary)",
            }}
          >
            {meta.excerpt}
          </p>
        </div>
      </header>

      {/* 本文 */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div
          className={[
            "prose max-w-none",
            "prose-headings:font-black prose-headings:tracking-tight",
            "prose-strong:font-black",
            "prose-blockquote:not-italic",
            "prose-code:before:content-none prose-code:after:content-none",
            "prose-code:bg-[var(--color-surface-alt)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal",
            "prose-pre:bg-[#1b4332]",
          ].join(" ")}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </main>

      {/* LINE CTA — 全幅セクション */}
      <section
        style={{
          backgroundColor: "var(--color-surface-alt)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p
            className="text-xs font-black uppercase tracking-widest mb-3"
            style={{ color: "var(--color-primary-light)" }}
          >
            Contact
          </p>
          <p
            className="text-base font-black mb-2"
            style={{ color: "var(--color-text)", fontFamily: "'Noto Serif JP', serif" }}
          >
            この記事についてのご相談
          </p>
          <p
            className="text-sm font-medium mb-8 leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            引越し・運送・不用品の買取など、ご不明な点はLINEで気軽にご相談ください。
          </p>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg font-black text-sm hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            💬 LINEで無料相談
          </a>
        </div>
      </section>

      {/* 下部ナビ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <Link
          href="/blog"
          className="text-sm font-black transition-opacity hover:opacity-60"
          style={{ color: "var(--color-muted)" }}
        >
          ← ブログ一覧へ戻る
        </Link>
        <Link
          href="/"
          className="text-sm font-black transition-opacity hover:opacity-60"
          style={{ color: "var(--color-muted)" }}
        >
          トップページへ →
        </Link>
      </div>
    </div>
  );
}
