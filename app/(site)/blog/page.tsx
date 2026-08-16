import type { Metadata } from "next";
import Link from "next/link";
import Hero from "../_components/Hero";
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
    <>
      <Hero
        size="md"
        kicker="記 事"
        title="AmNiss 公式ブログ"
        lead="富山のお客様へ届ける、引越し・お片付け・不用品の買取に関する役立つ情報をお届けします。"
      />

      <section className="sec first">
        <div className="w">
          {BLOG_POSTS.length === 0 ? (
            <>
              {/* 【43】記事0件のときの導線。フォーム・LINE・電話の3本を出す。
                  元の3文目「写真を送っていただくだけで見積もりが可能です。」は消してある。
                  「写真を送って」が1つ目のボタンの文字に入っていて意味が落ちないのと、
                  この1文だけ「見積もり」でサイトの標準（見積り）とずれていたため。 */}
              <p className="lead" style={{ marginTop: 0 }}>
                現在、公開中の記事はありません。<br />
                引越しや買取でお困りのことがあれば、記事をお待ちいただかなくてもご相談いただけます。
              </p>
              {/* ヒーローの `.acts` と同じ組み方（960px 以下で縦積み・幅いっぱい）。
                  `.acts` の指定は .hero / .ht-txt / .cta の中でしか効かないので、
                  site.css に `.sec .acts` を足してある */}
              <div className="acts">
                <Link className="btn btn-fill" href="/contact">
                  写真を送って見積りを依頼
                </Link>
                <a className="btn" href={LINE_URL} target="_blank" rel="noopener noreferrer">
                  LINEで無料相談
                </a>
              </div>
              {/* 電話。全角空白は文字列リテラルで書く（JSX が改行の空白を消すため。指示 34 §2）。
                  白地の面で電話を出しているのは /contact の `.tl` なので、その形に合わせた
                  （`.cta` の大きい電話は濃紺の帯専用の CSS で、白地では効かない） */}
              <p className="lead">
                {"お電話　"}
                <a className="tl" href={TEL_HREF}>
                  {TEL}
                </a>
                　（受付 {HOURS}）
              </p>
            </>
          ) : (
            <div className="plist">
              {BLOG_POSTS.map((post) => (
                <article key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="d">
                      <time>{post.date}</time>
                      <span>{post.category}</span>
                    </div>
                    <div>
                      <h2 className="mincho">{post.title}</h2>
                      <p>{post.excerpt}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
