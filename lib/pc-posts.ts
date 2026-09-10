import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

/**
 * /pc のお知らせ・記事の読み出し。
 *
 * 【なぜ `lib/posts.ts` と共有しないか（88で決定）】
 * 作りはほとんど同じだが、**共有しない。**片方の frontmatter を変えたときに
 * もう片方が黙って壊れるため。引越し側は管理画面（`app/admin/`）と投稿API、
 * `lib/posts-meta.ts` の静的ページ枠まで背負っていて、こちらはそのどれも要らない。
 * **記事が数本のうちは、重複しているほうが安全。**5本10本と増えて、
 * 本当に同じ形だと分かってからまとめれば足りる。
 *
 * ⚠ `lib/posts.ts` `content/blog/` `app/(site)/blog/` は**変更しないこと。**
 *   いま動いている引越し側の記事一覧。
 *
 * 【frontmatter の項目】title / excerpt / date / category の4つだけ。
 * ⚠ 引越し側にある `categoryBg` `accent` は**持たない。**あれは Tailwind の
 *   クラス名で、`(pc)` は Tailwind を読み込まない（見た目は `app/(pc)/pc.css`）。
 *   そもそも引越し側でも読んでいるのは投稿フォームだけで、表示側は使っていない。
 * ⚠ `date` は **`"2026.09.10"` と引用符付きの点区切り**で書くこと。
 *   引用符を外すと YAML が Date オブジェクトとして読み、並び順が狂う
 *   （引越し側で実際に起きた。`toDateString()` はその後始末）。
 */

const CONTENT_DIR = path.join(process.cwd(), "content/pc-blog");

export type PcPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
};

/**
 * frontmatter の `date:` を必ず文字列にする。
 * 引用符なしで書かれた日付を YAML が Date オブジェクトとして読むことがあり、
 * そのまま React の子として描画すると落ちる。日付の降順ソートも狂う。
 */
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

/**
 * マークダウンを記事本文の HTML にする。
 *
 * ⚠ **`{ sanitize: false }` で生HTMLを通している。**
 *   記事を書くのは私たちだけで、`content/pc-blog/` はリポジトリの中にしか無い。
 *   外から文字列が入ってくる経路が1つも無いので、いまは安全。
 *
 * ⚠ **管理画面から投稿できるようにするときは、必ずここを見直すこと。**
 *   安全なのは「投稿者がこちらだけ」という前提に乗っているだけで、
 *   **前提のほうが先に変わる。**引越し側（`app/admin/`）と同じ形で
 *   投稿を受けるようになった時点で、ここは投稿者の書いた HTML を
 *   そのままページに出す穴になる。
 *
 * 【なぜ生HTMLが要るか】
 * 1. **表。**`remark-gfm` を入れていないので、パイプ表（`| a | b |`）は表にならない。
 *    入れない理由は `lib/markdown.ts`（50で決定）。引越し側のプレビューと本番が
 *    同じレンダラーを共有していて、`.rv .post` には表の CSS が無い。
 *    表1つのために依存を足すのは割に合わないので、記事側で `.tw` の生HTMLを書く。
 * 2. **外部リンクの `target` / `rel`。**マークダウンのリンク記法では属性を書けない。
 *
 * ⚠ `lib/markdown.ts`（引越し側）はこの関数を通さない。あちらは管理画面の
 *   プレビューと本番で1本に揃えてあるので、こちらの都合で触らないこと。
 */
function renderPcMarkdown(markdown: string): string {
  return remark().use(remarkHtml, { sanitize: false }).processSync(markdown).toString();
}

/** 記事の一覧を日付の降順で返す */
export function getAllPcPosts(): PcPostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        excerpt: data.excerpt ?? "",
        date: toDateString(data.date),
        category: data.category ?? "お知らせ",
      } satisfies PcPostMeta;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** `content/pc-blog/<slug>.md` を読んで、メタと本文の HTML を返す */
export function getPcPostBySlug(
  slug: string
): { meta: PcPostMeta; contentHtml: string } | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? "",
      date: toDateString(data.date),
      category: data.category ?? "お知らせ",
    },
    contentHtml: renderPcMarkdown(content),
  };
}
