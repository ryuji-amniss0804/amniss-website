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
 *
 * 【93_other_pages】ヘッダー（紺の地）・本文の幅・見出しの書体を、ほかのページにそろえた。
 * **記事の本文（contentHtml）は触っていない。**テンプレートの文言もそのまま
 * （記事末のラベルだけ、ほかのページと同じ英字の小見出しにした）。
 * 本文の見た目は site.css の `.op .post`（書体と見出しだけを上書きしている）。
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
    <div className="tp pp op">
      {/* 見出しまわり。小さいページのヒーローと同じ紺の地（写真は無い） */}
      <section className="op-phero art">
        <div className="tw op-narrow">
          <nav className="op-bc" aria-label="パンくず">
            <Link href="/">ホーム</Link>
            <span aria-hidden="true">›</span>
            <Link href="/blog">ブログ</Link>
            <span aria-hidden="true">›</span>
            {meta.category}
          </nav>

          <p className="op-phero-k">
            {meta.category}
            <time className="tp-num">{meta.date}</time>
          </p>

          <h1>{meta.title}</h1>

          <p className="op-phero-lead">{meta.excerpt}</p>
        </div>
      </section>

      {/* 本文 */}
      <section className="op-sec">
        <div className="tw op-narrow">
          <div className="post" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </section>

      {/* 記事末のご案内。最後の案内（LastCta）とは文言が別なので、共通の部品に寄せていない。
          見出し・本文・ボタンの文字は移設前のまま。 */}
      <section className="op-sec beige">
        <div className="tw op-narrow">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">CONTACT</p>
            <h2 className="tp-h2 op-h2-sm">この記事についてのご相談</h2>
            {/* 【48-A】窓口を1つに絞らない言い方。「引越し・運送・不用品の買取など」は一字も変えていない。 */}
            <p className="tp-sec-lead">
              引越し・運送・不用品の買取など、ご不明な点はお気軽にご相談ください。写真を1枚送っていただければ、概算をお伝えできます。
            </p>
          </div>
          {/* 【46-B】`/contact` が主、LINE が従。**LINE のボタンは文言も href もそのまま。** */}
          <div className="op-acts">
            <Link className="tp-btn tp-btn-n" href="/contact">
              写真を送って見積りを依頼
            </Link>
            <a className="tp-btn tp-btn-nw" href={LINE_URL} target="_blank" rel="noopener noreferrer">
              💬 LINEで無料相談
            </a>
          </div>
          <div className="op-back">
            <Link href="/blog">← ブログ一覧へ戻る</Link>
            <Link href="/">トップページへ →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
