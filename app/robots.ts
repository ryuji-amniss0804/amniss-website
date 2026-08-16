import type { MetadataRoute } from 'next'

const SITE_URL = 'https://revive-toyama.jp'

/**
 * /robots.txt
 *
 * **目的は sitemap の場所を伝えることだけ。**それ以外を足さない。
 * これまで robots.txt は無かった（`public/robots.txt` も `app/robots.ts` も無し）。
 * 無くてもクロールは既定で許可なので、**足りていなかったのは `Sitemap:` の1行だけ**。
 *
 * ⚠ **ここを間違えるとサイトが検索から消える。**次の4つを必ず守ること。
 *  1. `Disallow: /` を**絶対に書かない**（全ページのクロールが止まる）
 *  2. `userAgent` は `'*'` のまま。**特定のクローラーだけを許可する形にしない**
 *     （`Googlebot` だけ書くと、それ以外のボットの扱いが宣言から漏れる）
 *  3. `Sitemap:` は本番の絶対URL。プレビューURLを入れない
 *  4. `disallow` に足すのは、**公開ページを1つも含まないパスだけ**
 *
 * `/admin` は認証（proxy.ts のミドルウェア）の後ろにあり、`app/admin/layout.tsx` で
 * `robots: { index: false, follow: false }` も付いている。ここに書くのは念のため。
 * `/preview` は本番ビルドで 404 になるので書いていない。
 *
 * robots.txt はクロールを止めるだけで、インデックスは止められない
 * （止めたいものは noindex を使う。ここに足しても意味がない）。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
