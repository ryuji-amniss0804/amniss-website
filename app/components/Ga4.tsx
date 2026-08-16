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
 *
 * 【本番のドメインから開いたときだけ数える】61_ga4_fix ／ 69
 * 検証でローカルの公開ページを開くたびに page_view が本番の数字へ混ざる。
 * 8/20〜8/27 に「8/6の刷新は効いたのか」を見るとき、それが判断を狂わせる。
 *
 * ⚠ `NODE_ENV` では判別できない。`next build` → `next start` はローカルでも
 *   production なので、本番ビルドで検証すると素通りする（実際にそうなった）。
 *   見分けられるのは**ブラウザが開いているホスト名**だけなので、それで見る。
 *
 * ⚠ gtag/js の <script> をサーバー側で出すのをやめ、ホスト名が合ったときだけ
 *   この場で作って <head> に足す形にした。「読み込まない」まで含めて止めるため。
 *   src を後から入れても取りに行かないので、空の <script> を置いておく手は使えない。
 *
 * www は Vercel 側で apex へ 308／307 されるため、訪問者のホスト名は常に apex になる。
 * だから apex だけを見ればよい（実測で確認済み）。`www.` は書かない。
 *
 * ⚠ 旧ドメイン `amniss-japan.jp` も残してある（69）。
 *   移行後は旧ドメインが 308 で新ドメインへ飛ぶので、旧ドメインで描画されること自体が
 *   **転送の漏れ**を意味する。そのとき計測に出たほうが気づける。会社サイトを
 *   amniss-japan.jp に載せる段になったら、この行から旧ドメインを外すこと。
 */

export const GA4_ID = "G-RXRKXM83G8";

/** ここから開いたときだけ計測する。プレビューURLも localhost も数えない */
export const GA4_HOSTS = ["amniss-japan.jp", "revive-toyama.jp"];

export default function Ga4() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `if (${JSON.stringify(GA4_HOSTS)}.indexOf(location.hostname) !== -1) {
var s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA4_ID}';
document.head.appendChild(s);
window.dataLayer = window.dataLayer || [];
window.gtag = function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}');
}`,
      }}
    />
  );
}
