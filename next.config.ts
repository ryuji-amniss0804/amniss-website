import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開発中の丸いインジケーターを消す。デザイン確認のスクリーンショットに写り込むため。
  // ビルド／実行時のエラー表示はこれを切っても出る。
  devIndicators: false,

  async redirects() {
    return [
      // ※ /moving /kaitori の 301 はここから外した（2026-08-05、段階2）。
      //    実ページとして作り直すため。実体は段階3で入る。

      // 旧サイトの遺物。どこからもリンクされていなかったが公開はされていたため、
      // 404にせず 301 でトップへ逃がす（インデックス済みの分の受け皿）。
      { source: "/transport", destination: "/", permanent: true },
      { source: "/shucho-kaitori", destination: "/#kaitori", permanent: true },
      { source: "/pc-sales", destination: "/", permanent: true },

      // 旧ブログ記事。優良誤認表現と旧屋号を含んでいたため削除済み。
      // インデックス済みの分の受け皿として、内容が近いアンカーへ逃がす。
      // ※ ここに書いたスラッグで新規記事を投稿すると、記事より redirect が優先される。
      //    同じスラッグを使いたくなったら、この行を消すこと。
      { source: "/blog/how-to-pack",         destination: "/#moving",  permanent: true },
      { source: "/blog/toyama-fuyohin-tips", destination: "/#kaitori", permanent: true },
      { source: "/blog/jisaku-pc",           destination: "/",         permanent: true },
    ];
  },
};

export default nextConfig;
