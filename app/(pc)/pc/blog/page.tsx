import type { Metadata } from "next";
import Link from "next/link";
import { PC_META } from "@/lib/pc";
import { getAllPcPosts } from "@/lib/pc-posts";

/**
 * /pc/blog お知らせ・記事の一覧。
 *
 * 記事は `content/pc-blog/<slug>.md`、読み出しは `lib/pc-posts.ts`。
 * ⚠ 引越し側の `/blog`（`lib/posts.ts` `content/blog/` `app/(site)/blog/`）とは
 *   別物で、**共有していない。**理由は `lib/pc-posts.ts` の冒頭に書いた。
 * ⚠ `.pc-top` を付けないこと。付けるとセクション番号（01 ／ …）が出る。
 *
 * ⚠ **トップ（/pc）の「お知らせ」の節は戻さないこと。**`app/(pc)/pc/page.tsx` の
 *   `HAS_JOURNAL` は false のまま。記事1本のために節を増やすと、79aで直したこと
 *   （1件しかないのにグリッドで枠を並べる）に戻る。3本たまったら戻す。
 *   いまの入口はヘッダーとフッターの「お知らせ」（`lib/pc.ts` の `PC_NAV`）。
 *
 * robots はレイアウト（`app/(pc)/layout.tsx`）で一括して見ている。ここでは指定しない。
 */

export const metadata: Metadata = {
  title: "お知らせ・記事 | パソコン修理・出張診断 re'vive_doc 富山",
  description: PC_META.blog,
  alternates: { canonical: "/pc/blog" },
};

export default function PcBlogIndexPage() {
  const posts = getAllPcPosts();

  /**
   * 器は件数で変わる。**79aで事例に対して決めたのと同じ。**
   * 3列に1枚だけ置くと2枚ぶんが空いて欠けて見えるので、3件に満たないあいだは
   * 3列に置かない（1件＝`.g1` ／ 2件＝`.g2`）。記事が増えれば勝手に広がる。
   */
  const count: number = posts.length;
  const gridClass = count >= 3 ? "g3" : count === 2 ? "g2" : "g1";

  return (
    <section className="sec">
      <div className="w">
        <p className="eyebrow">JOURNAL</p>
        <h1>お知らせ・記事</h1>
        <p className="lead">
          パソコンの困りごとについて、実際にお受けした作業から書いています。測った数値はそのまま出します。
        </p>

        <div className={`grid ${gridClass}`}>
          {posts.map((post) => (
            <Link key={post.slug} className="card" href={`/pc/blog/${post.slug}`}>
              <div className="body">
                <div className="card-meta">
                  <span>{post.date}</span>
                  <span className="tag">{post.category}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="foot-of-card">
                  <span className="read-on">読む →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
