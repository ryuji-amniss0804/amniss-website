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
    slug: "amniss-kaitori-nagare",
    title: "【初めてでも安心】AmNissの出張買取・不用品回収の流れを完全解説！当日の手順と準備ポイント",
    excerpt: "「初めて出張買取を頼むけど何を用意すればいい？」そんな疑問にお答えします。お問い合わせから査定・回収・お支払いまでの全ステップと、事前に準備すると査定額が上がるポイントをAmNissスタッフが徹底解説！",
    date: "2026.06.08",
    category: "不用品回収・お片付け",
    categoryBg: "bg-teal-50 text-teal-700 border-teal-200/50",
    accent: "bg-teal-50 text-teal-700",
  },
  {
    slug: "jisaku-pc",
    title: "【プロ直伝】自作PC・高級ゲーミングPCを壊さずに引越しする方法！梱包手順と不用パーツ処分・新居のネットワーク設定まで完全解説",
    excerpt: "高性能グラボや水冷クーラー搭載のゲーミングPCを輸送振動から守る完璧な内部梱包5ステップ！自らPC事業を運用するからこそ分かる、余ったパーツの現金化相殺テクニックと新居での即日Wi-Fi無料開通まで徹底解説。",
    date: "2026.05.28",
    category: "ガジェット・引越しノウハウ",
    categoryBg: "bg-blue-50 text-blue-700 border-blue-200/50",
    accent: "bg-violet-50 text-violet-600",
    isStaticPage: true,
  },
  {
    slug: "how-to-pack",
    title: "【プロが直伝】単身引越しを驚くほど格安＆スムーズに終わらせる荷造り・梱包の裏ワザ5選",
    excerpt: "一人暮らしや単身赴任の方必見！軽バン引越しを限界まで安く抑えるための事前準備と、ダンボールの詰め方のコツを物流のプロが解説。",
    date: "2026.05.28",
    category: "引越し豆知識",
    categoryBg: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    accent: "bg-blue-50 text-blue-600",
    isStaticPage: true,
  },
  {
    slug: "toyama-fuyohin-tips",
    title: "【富山密着】不用品回収の費用を限界まで安く抑える5つのコツ！処分と買取を組み合わせる裏ワザとは？",
    excerpt: "富山県内で不用品回収やお片付けを安く抑える基本テクニックに加え、他社が処分とする『壊れたPC・古いカメラ・レトロゲーム』を独自の海外ルートで高価買取し、費用から直接相殺する裏ワザを公開！",
    date: "2026.05.28",
    category: "不用品回収・お片付け",
    categoryBg: "bg-amber-50 text-amber-800 border-amber-200/50",
    accent: "bg-amber-50 text-amber-700",
    isStaticPage: true,
  },
];
