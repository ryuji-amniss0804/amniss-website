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
 * 全ブログ記事のメタデータ。
 *
 * ── 新しい記事の追加手順 ──────────────────────────────
 * 1. この配列の先頭に新しいオブジェクトを追加する
 * 2. content/blog/<slug>.md を作成してマークダウン本文を書く
 *    （フロントマター不要。メタデータはここで一元管理）
 * 3. isStaticPage は不要（省略 = マークダウン記事として扱う）
 * ──────────────────────────────────────────────────────
 */
export const BLOG_POSTS_META: BlogPostMeta[] = [
];
