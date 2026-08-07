import type { Metadata } from "next";
import Link from "next/link";
import Hero from "../_components/Hero";
import { BLOG_POSTS_META } from "@/lib/posts-meta";
import { LINE_URL } from "@/lib/site";

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
 * 記事の一覧は `lib/posts-meta.ts`。管理画面（`app/api/admin/posts/route.ts`）が
 * GitHub API でこの配列と `content/blog/<slug>.md` を1コミットで足す。
 * **配列の形と `BLOG_POSTS_META: BlogPostMeta[] = [` の行を変えないこと。**
 * route.ts がこの文字列を目印に挿入位置を探している。
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
    url: "https://amniss-japan.jp/blog",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

const BLOG_POSTS = [...BLOG_POSTS_META].sort((a, b) => b.date.localeCompare(a.date));

export default function BlogIndex() {
  return (
    <>
      <Hero
        size="md"
        kicker="Official Blog"
        title="AmNiss 公式ブログ"
        lead="富山のお客様へ届ける、引越し・お片付け・不用品の買取に関する役立つ情報をお届けします。"
      />

      <section className="sec first">
        <div className="w">
          {BLOG_POSTS.length === 0 ? (
            <>
              <p className="lead" style={{ marginTop: 0 }}>
                現在、公開中の記事はありません。<br />
                引越しや不用品の買取でお困りのことがあれば、記事をお待ちいただかなくても
                LINEで直接ご相談いただけます。写真を送っていただくだけで見積もりが可能です。
              </p>
              <div className="go">
                <a
                  className="btn btn-fill"
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LINEで無料相談
                </a>
              </div>
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
