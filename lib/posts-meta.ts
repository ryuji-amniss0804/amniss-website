export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  /** ホームページのカードに使うバッジスタイル */
  categoryBg: string;
  /** ブログ一覧カードに使うアクセントスタイル */
  accent: string;
  /** true = 既存の静的ページ (blog/[slug]/page.tsx) が存在する */
  isStaticPage?: boolean;
};

/**
 * 静的ページとして手書きしてある記事のメタデータ。
 *
 * ⚠ **【50】ここは空にした。記事のメタデータは `.md` のフロントマターへ移した。**
 * 記事が増えるたびにこのファイルが伸び、投稿APIが文字列で書き換える対象にもなっていた。
 * いまは `content/blog/<slug>.md` の先頭に書く。読むのは `lib/posts.ts` の
 * `readMarkdownMetas()`。**一覧・記事ページ・サイトマップは全部 `getAllPosts()` を通る。**
 *
 * ── 新しい記事の追加手順 ──────────────────────────────
 * 1. content/blog/<slug>.md を作る
 * 2. 先頭にフロントマターを書く（title / excerpt / date / category /
 *    categoryBg / accent。**日付は `date: "2026.08.13"` と引用符付きの点区切り**。
 *    引用符を外すと YAML が日付オブジェクトとして読み、並び順が狂う）
 * 3. その下に本文を書く
 * ──────────────────────────────────────────────────────
 *
 * この配列と `BlogPostMeta` 型は残してある。`isStaticPage: true` の記事
 * （`blog/[slug]/page.tsx` を手書きした記事）を将来また置くための枠で、
 * **ここに載せた slug は `.md` 側より優先される**（`lib/posts.ts`）。
 */
export const BLOG_POSTS_META: BlogPostMeta[] = [];
