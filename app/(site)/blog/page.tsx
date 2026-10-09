import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../_components/PageHero";
import { getAllPosts } from "@/lib/posts";
import { HOURS, LINE_URL, TEL, TEL_HREF } from "@/lib/site";

/**
 * お役立ち情報（記事一覧）。
 *
 * 【21_corporate で (corporate) から (site) へ移した】
 * 移したのはレイアウトだけ。**文言は1字も変えていない。**
 *
 * (corporate) 側は `"use client"` で、IntersectionObserver を使った
 * スクロール連動のフェードインが入っていた。**(site) にその演出は無い**ので
 * 落としてある。クライアント側の処理が要らなくなったので、
 * `blog/layout.tsx` に逃がしていた metadata もこのファイルに戻した
 * （あのレイアウトは「一覧が client component だから metadata を出せない」
 *  という理由だけで存在していた。21で削除済み）。
 *
 * 【50】記事の一覧は `getAllPosts()`（`lib/posts.ts`）から採る。
 * **以前はここが `lib/posts-meta.ts` の配列を直接読んでいた。**メタデータを
 * `content/blog/<slug>.md` のフロントマターへ移したので、直読みのままだと
 * 記事がこの一覧から消える。**見た目と文言は1字も変えていない**
 * （`getAllPosts()` は同じ `BlogPostMeta[]` を日付の降順で返すので、
 *  ここでの並べ替えが要らなくなっただけ）。
 *
 * 【93_other_pages】トップと同じトーンに作り直した。見た目の正は参考モック
 * （top_mock_20261008/Others.dc.html の3つ目）。
 *  - 見出しを「お役立ち情報」に（フッターの呼び名に合わせた）。リードも cc_task/93 §1-4 のとおり。
 *  - 記事はカード（3列・860px以下1列）。上の色の帯は、記事ごとに黄色・深緑を交互。
 *    帯の中の文字は記事のカテゴリ。**日付・見出し・抜粋は記事のものをそのまま出している。**
 *  - 記事の本文（content/blog/*.md）は触っていない。
 */

export const metadata: Metadata = {
  title: "お役立ち情報 | re'vive 富山",
  description:
    "引越し・買取・片付けのお役立ち情報。re'vive 富山（リバイブ）が、富山県での単身引越しと出張買取の実務から書いています。",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "お役立ち情報 | re'vive 富山",
    description:
      "引越し・買取・片付けのお役立ち情報。re'vive 富山（リバイブ）が、富山県での単身引越しと出張買取の実務から書いています。",
    url: "https://revive-toyama.jp/blog",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

export default function BlogIndex() {
  // 日付の降順は `getAllPosts()` の中で済んでいる。
  // モジュールの外ではなく中で呼ぶのは、記事ファイルを読むのがここだから
  // （モジュール読み込み時に1回だけ読むと、開発中に .md を足しても反映されない）。
  const BLOG_POSTS = getAllPosts();

  return (
    <div className="tp pp op">
      <PageHero kicker="COLUMN" title="お役立ち情報" lead="引越し・片付け・買取の、知っておくと得する話。" />

      <section className="op-sec">
        <div className="tw">
          {BLOG_POSTS.length === 0 ? (
            <div className="op-empty">
              {/* 【43】記事0件のときの導線。フォーム・LINE・電話の3本を出す。文は前のまま */}
              <p>
                現在、公開中の記事はありません。
                <br />
                引越しや買取でお困りのことがあれば、記事をお待ちいただかなくてもご相談いただけます。
              </p>
              <div className="op-acts">
                <Link className="tp-btn tp-btn-n" href="/contact">
                  写真を送って見積りを依頼
                </Link>
                <a className="tp-btn tp-btn-nw" href={LINE_URL} target="_blank" rel="noopener noreferrer">
                  LINEで無料相談
                </a>
              </div>
              {/* 電話。ラベルと番号がくっつかないよう、全角空白は文字列リテラルで書く（指示 34 §2） */}
              <p>
                {"お電話　"}
                <a className="tp-num op-tel" href={TEL_HREF}>
                  {TEL}
                </a>
                {`　（受付 ${HOURS}）`}
              </p>
            </div>
          ) : (
            <div className="op-posts">
              {BLOG_POSTS.map((post, i) => (
                <article key={post.slug}>
                  <Link className="op-post" href={`/blog/${post.slug}`}>
                    {/* 上の色の帯。黄色・深緑を交互。中の文字はカテゴリ */}
                    <div className={i % 2 === 1 ? "op-post-band g" : "op-post-band"}>
                      <span>{post.category}</span>
                    </div>
                    <div className="op-post-b">
                      <time className="tp-num">{post.date}</time>
                      <h2>{post.title}</h2>
                      <p>{post.excerpt}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
