import type { Metadata } from "next";
import Link from "next/link";
import { PC_META } from "@/lib/pc";
import { getAllPcPosts } from "@/lib/pc-posts";
import PcLastCta from "../../_components/PcLastCta";
import PcLicense from "../../_components/PcLicense";
import PcPageHero from "../../_components/PcPageHero";

/**
 * /pc/blog お知らせ・記事の一覧。
 *
 * 記事は `content/pc-blog/<slug>.md`、読み出しは `lib/pc-posts.ts`。
 * ⚠ 引越し側の `/blog`（`lib/posts.ts` `content/blog/` `app/(site)/blog/`）とは
 *   別物で、**共有していない。**理由は `lib/pc-posts.ts` の冒頭に書いた。
 *
 * 【94】本体の /blog（93）と同じ形にした：記事はカード（3列・860px以下1列）で、
 * 上に色の帯（グリーン・紺を交互）。帯の中の文字は記事のカテゴリ。
 * **日付・見出し・抜粋は記事のものをそのまま出している。**
 * トップ（/pc）の「記事」の節も、94 でここと同じ `getAllPcPosts()` から出すようにした。
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

  return (
    <>
      <PcPageHero kicker="JOURNAL" title="お知らせ・記事">
        パソコンの困りごとについて、実際にお受けした作業から書いています。測った数値はそのまま出します。
      </PcPageHero>
      <PcLicense />

      <section className="sec">
        <div className="w">
          <div className="bposts">
            {posts.map((post, i) => (
              <article key={post.slug}>
                <Link className="bpost" href={`/pc/blog/${post.slug}`}>
                  {/* 上の色の帯。グリーン・紺を交互。中の文字はカテゴリ */}
                  <div className={i % 2 === 1 ? "bpost-band n" : "bpost-band"}>
                    <span>{post.category}</span>
                  </div>
                  <div className="bpost-b">
                    <time className="num">{post.date}</time>
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    <span className="case-go">読む →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PcLastCta />
    </>
  );
}
