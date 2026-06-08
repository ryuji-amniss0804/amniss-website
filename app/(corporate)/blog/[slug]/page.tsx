import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

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
  if (!post) return { title: "記事が見つかりません | AmNiss Blog" };
  return {
    title: `${post.meta.title} | AmNiss Blog`,
    description: post.meta.excerpt,
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
    <div className="bg-slate-50 min-h-screen font-sans antialiased">

      {/* ─── ヘッダー ─── */}
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          {/* パンくずナビ */}
          <nav className="text-xs text-slate-400 font-bold mb-8 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-emerald-600 transition-colors">HOME</Link>
            <span className="opacity-40">›</span>
            <Link href="/blog" className="hover:text-emerald-600 transition-colors">ブログ</Link>
            <span className="opacity-40">›</span>
            <span className="text-slate-500">{meta.category}</span>
          </nav>

          {/* カテゴリー＆日付 */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className={`${meta.accent} text-[11px] font-black px-3 py-1.5 rounded-full`}>
              {meta.category}
            </span>
            <time className="text-xs font-bold text-slate-400">{meta.date}</time>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight mb-6">
            {meta.title}
          </h1>

          {/* リード文 */}
          <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-4 border-emerald-500 pl-5 py-1 bg-emerald-50/50 rounded-r-xl pr-4">
            {meta.excerpt}
          </p>
        </div>
      </header>

      {/* ─── 本文 ─── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div
          className={[
            "bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12",
            "prose prose-slate max-w-none",
            "prose-headings:font-black prose-headings:tracking-tight",
            "prose-a:text-emerald-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline",
            "prose-strong:font-black prose-strong:text-slate-900",
            "prose-blockquote:border-emerald-500",
            "prose-code:before:content-none prose-code:after:content-none",
            "prose-code:bg-slate-100 prose-code:text-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal",
            "prose-pre:bg-slate-800",
          ].join(" ")}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* ─── LINE CTA ─── */}
        <div className="mt-10 bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            この記事についてのご相談
          </p>
          <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed">
            引越し・買取・不用品回収など、ご不明な点はLINEで気軽にご相談ください。
          </p>
          <a
            href="https://line.me/R/ti/p/@022lhymn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#06C755] text-white px-8 py-4 rounded-xl font-black text-sm hover:brightness-110 transition-all shadow-lg hover:-translate-y-0.5"
          >
            <span className="text-lg">💬</span> LINEで無料相談
          </a>
        </div>

        {/* ─── 下部ナビ ─── */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-200 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-black text-slate-500 hover:text-emerald-600 transition-colors"
          >
            ← ブログ一覧へ戻る
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-emerald-600 transition-colors"
          >
            トップページへ →
          </Link>
        </div>
      </main>
    </div>
  );
}
