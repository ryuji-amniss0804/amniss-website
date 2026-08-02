import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { BLOG_POSTS_META, type BlogPostMeta } from "./posts-meta";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

function readMarkdownMetas(): BlogPostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const staticSlugs = new Set(BLOG_POSTS_META.map((p) => p.slug));
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .flatMap((filename) => {
      const slug = filename.replace(/\.md$/, "");
      if (staticSlugs.has(slug)) return [];
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return [
        {
          slug,
          title: data.title ?? slug,
          excerpt: data.excerpt ?? "",
          date: data.date ?? "",
          category: data.category ?? "ブログ",
          categoryBg: data.categoryBg ?? "bg-slate-50 text-slate-700 border-slate-200/50",
          accent: data.accent ?? "bg-emerald-50 text-emerald-700",
        } satisfies BlogPostMeta,
      ];
    });
}

/** 全記事を日付降順で返す（静的ページ + マークダウン記事） */
export function getAllPosts(): BlogPostMeta[] {
  return [...BLOG_POSTS_META, ...readMarkdownMetas()].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

/** content/blog/<slug>.md を読み込んで HTML に変換する。
 *  メタデータは BLOG_POSTS_META を優先し、フロントマターにフォールバック。 */
export async function getPostBySlug(
  slug: string
): Promise<{ meta: BlogPostMeta; contentHtml: string } | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkHtml).process(content);

  // posts-meta.ts を正とし、フロントマターはフォールバック
  const metaEntry = BLOG_POSTS_META.find((p) => p.slug === slug);

  return {
    meta: metaEntry ?? {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? "",
      date: data.date ?? "",
      category: data.category ?? "ブログ",
      categoryBg: data.categoryBg ?? "bg-slate-50 text-slate-700 border-slate-200/50",
      accent: data.accent ?? "bg-emerald-50 text-emerald-700",
    },
    contentHtml: processed.toString(),
  };
}
