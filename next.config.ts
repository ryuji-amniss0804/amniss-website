import type { NextConfig } from "next";

/* ------------------------------------------------------------------ *
 * 旧ドメイン（amniss-japan.jp）→ 新ドメイン（revive-toyama.jp）の転送
 * ------------------------------------------------------------------
 * 65 / 65a / 69。**このブロックはまるごと別プロジェクトへ持ち出せる形にしてある。**
 * 会社サイトを別の Vercel プロジェクトとして作り、amniss-japan.jp をそちらへ
 * 付け替えるときは、下の 3 つの定数と `domainRedirects` をそのまま移す。
 *
 * ⚠ Vercel の Domains 画面の `Edit` からは転送しないこと。あれは全パス一律で
 *   飛ぶため、あとから amniss-japan.jp に会社サイトを置けなくなる。
 *
 * ⚠ ルート `/` も転送する（65a）。会社サイトを公開するときは、
 *   catch-all の正規表現から `/` を外す（＝ `/:path+` に変える）のではなく、
 *   このブロックごと会社サイト側へ移す。
 *
 * ⚠ `/api/` は転送しない。vercel.json の cron（/api/cron/purge-photos）が
 *   本番ドメイン宛に走るため、転送を挟むと Authorization ヘッダごと落ちる。
 *   `/api/` に検索評価は無いので外して困らない。
 *
 * ステータスは `permanent: true` ＝ **308**。既存6本と揃える（69-3）。
 * Google は 301 と 308 を同等に扱う。
 * ------------------------------------------------------------------ */
const OLD_HOST = "amniss-japan.jp";
const NEW_ORIGIN = "https://revive-toyama.jp";

/**
 * 旧サイトの遺物と削除済みブログ記事。**新旧どちらのドメインでも同じ着地先へ送る。**
 *
 * 旧サイトの遺物（/transport /shucho-kaitori /pc-sales）はどこからもリンクされて
 * いなかったが公開はされていたため、404にせず受け皿を残している。
 * 旧ブログ記事は優良誤認表現と旧屋号を含んでいたため削除済み。内容が近い実ページへ逃がす。
 *
 * ※ ここに書いたスラッグで新規記事を投稿すると、記事より redirect が優先される。
 *    同じスラッグを使いたくなったら、その行を消すこと。
 *
 * ※ 2026-08-07（17_hero）：飛び先を `/#kaitori` `/#moving` から実ページへ変えた。
 *    アンカーはトップの先頭に着地するだけで、着地先の中身が一致しない。
 * ※ /moving /kaitori 自体の転送は 2026-08-05（段階2）に外した。実ページになったため。
 */
const legacyPaths = [
  { source: "/transport", destination: "/" },
  { source: "/shucho-kaitori", destination: "/kaitori" },
  { source: "/pc-sales", destination: "/" },
  { source: "/blog/how-to-pack", destination: "/moving" },
  { source: "/blog/toyama-fuyohin-tips", destination: "/kaitori" },
  { source: "/blog/jisaku-pc", destination: "/" },
] as const;

const onOldHost = [{ type: "host" as const, value: OLD_HOST }];

const domainRedirects = [
  // ① 旧ドメイン × 旧URL。**新ドメインの着地先へ1段で直行させる。**
  //    ここが無いと「旧ドメインの旧URL → 旧ドメインの新URL → 新ドメイン」の2段になる。
  //    ②より前に置くこと（先に一致したものが勝つ）。
  ...legacyPaths.map(({ source, destination }) => ({
    source,
    has: onOldHost,
    destination: `${NEW_ORIGIN}${destination}`,
    permanent: true,
  })),

  // ② 旧ドメインのそれ以外すべて（`/` を含む）。同じパスのまま新ドメインへ。
  //    `(?!api/)` で /api/ だけ除外する。`.*` は空文字にも一致するのでルートも通る。
  {
    source: "/:path((?!api/).*)",
    has: onOldHost,
    destination: `${NEW_ORIGIN}/:path`,
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  // 開発中の丸いインジケーターを消す。デザイン確認のスクリーンショットに写り込むため。
  // ビルド／実行時のエラー表示はこれを切っても出る。
  devIndicators: false,

  async redirects() {
    return [
      ...domainRedirects,

      // ③ 新ドメイン（および他のホスト）での旧URLの整理。移行前からの6本。
      ...legacyPaths.map(({ source, destination }) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
