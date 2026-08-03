import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ヘッダーはもともと /#moving /#kaitori のアンカーを使っている。
      // 実体のないページを残す意味がないので、アンカーへ寄せる。
      { source: "/moving", destination: "/#moving", permanent: true },
      { source: "/kaitori", destination: "/#kaitori", permanent: true },

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
