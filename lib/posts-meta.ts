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
  {
    slug: "20260813-gwu2",
    title: "富山市で家具・家電を手放すときの順番",
    excerpt: "まだ使えるけれど、自分ではもう使わない。捨てるには大きすぎる。富山市の場合、その答えは物によって3つに分かれます。家電4品目なのか、売れるのか、市に出すのか。見る順番を間違えると、払わなくてよかったお金を払うことになります。制度の数字は富山市の公式ページで確認しました。",
    date: "2026.08.13",
    category: "不用品の買取・お片付け",
    categoryBg: "bg-amber-50 text-amber-800 border-amber-200/50",
    accent: "bg-amber-50 text-amber-700",
  },
];
