/**
 * Google アナリティクス 4（gtag.js）
 *
 * 【測定IDはリテラルで書く】
 * `.env` も Vercel の環境変数も使わない。測定IDは秘密ではなく、配信されるHTMLに
 * そのまま出るもの。基準URL（JsonLd.tsx の SITE_URL）と同じ流儀にそろえている。
 * 環境変数にすると「.env を直したのに本番が変わらない」を踏むだけで、得がない。
 *
 * 【(site) にだけ置く。/admin には置かない】
 * 管理画面は noindex で本人しか使わない。数えると本人のアクセスが混ざる。
 *
 * 【next/script は使わない】
 * このサイトは JsonLd も生の <script> を <head> に置いている。狙いは
 * 「配信されるHTMLに gtag が入っていること」だけなので、読み込み戦略を
 * 挟まずに Google が配っている形をそのまま置く。async なので描画は止めない。
 */

export const GA4_ID = "G-RXRKXM83G8";

export default function Ga4() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}');`,
        }}
      />
    </>
  );
}
