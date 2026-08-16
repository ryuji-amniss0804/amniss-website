import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { LINE_URL } from "@/lib/site";

/**
 * 記事ページ。
 *
 * 【21_corporate で (corporate) から (site) へ移した】
 * 移したのはレイアウトだけ。**記事本文もテンプレートの文言も1字も変えていない。**
 *
 * ⚠ **本文は Tailwind の `prose` に載っていた。**(site) は Tailwind を読み込まないので、
 * そのままだと素の HTML（余白ゼロ）で出る。`site.css` の `.post` に組み直してある。
 * 足したのは 見出し・段落・リスト・引用・画像・リンク と code / pre / hr だけ。
 * **記事本文の書き方（マークダウン）は変えていない。**
 *
 * 本文は `dangerouslySetInnerHTML` で入る素のタグ列なので、
 * 1要素ずつクラスを付けられない。`.post` の子孫セレクタで当てること。
 */

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts
    .filter((p) => !p.isStaticPage)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "記事が見つかりません | re'vive Blog" };
  return {
    title: `${post.meta.title} | re'vive 富山 ブログ`,
    description: post.meta.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      // og:title は <title> と同じにする（サイト名まで含めた文字列）
      title: `${post.meta.title} | re'vive 富山 ブログ`,
      description: post.meta.excerpt,
      url: `https://revive-toyama.jp/blog/${slug}`,
      siteName: "re'vive 富山",
      locale: "ja_JP",
      type: "article",
      publishedTime: post.meta.date || undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const { meta, contentHtml } = post;

  return (
    <>
      {/* 見出しまわり。下層ページのヒーローと同じ組み方（写真は無い） */}
      <section className="hero md">
        <div className="w in">
          <nav className="bc">
            <Link href="/">ホーム</Link>
            <span>›</span>
            <Link href="/blog">ブログ</Link>
            <span>›</span>
            {meta.category}
          </nav>

          <div className="pmeta">
            {meta.category}
            <time>{meta.date}</time>
          </div>

          <h1 className="mincho" style={{ marginTop: "18px" }}>
            {meta.title}
          </h1>

          <p className="sub">{meta.excerpt}</p>
        </div>
      </section>

      {/* 本文 */}
      <section className="sec first">
        <div className="w">
          <div className="post" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </section>

      {/* 記事末のご案内。トップや下層の Cta（濃紺の帯）とは文言が別なので、
          共通コンポーネントに寄せていない。
          **23_contact でラベル（kicker）だけを日本語にした。**見出し・本文・ボタンは移設前のまま。
          字間は (site) の既存ラベルと同じ半角スペース1つ区切り
          （`/contact` の `お 問 い 合 わ せ` と同じ文字列）。 */}
      <section className="sec tint">
        <div className="w">
          <div className="kicker">お 問 い 合 わ せ</div>
          <h2 className="t mincho">この記事についてのご相談</h2>
          {/* 【48-A】46-B で主ボタンを `/contact` にしたのに、この文が LINE を名指ししたま
              まだった。窓口を1つに絞らない言い方に変え、主ボタン（写真を送って見積りを依頼）
              の理由を1文足す。「引越し・運送・不用品の買取など」は一字も変えていない。 */}
          <p className="lead">
            引越し・運送・不用品の買取など、ご不明な点はお気軽にご相談ください。写真を1枚送っていただければ、概算をお伝えできます。
          </p>
          {/* 【46-B】ここは LINE の1本だけだった。`/contact` を主にして2本にする。
              組み方は `cd3f701` で /blog に入れた導線と同じ（`.sec .acts` ＋
              `btn-fill` ＋ 枠線の `btn`）。960px 以下で縦積み・幅いっぱいになる。
              **LINE のボタンは文言も href もそのまま。**塗り→枠線に変えただけ。 */}
          <div className="acts">
            <Link className="btn btn-fill" href="/contact">
              写真を送って見積りを依頼
            </Link>
            <a
              className="btn"
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 LINEで無料相談
            </a>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w" style={{ display: "flex", gap: "26px", flexWrap: "wrap" }}>
          <Link className="tl" href="/blog">
            ← ブログ一覧へ戻る
          </Link>
          <Link className="tl" href="/">
            トップページへ →
          </Link>
        </div>
      </section>
    </>
  );
}
