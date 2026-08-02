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
    ];
  },
};

export default nextConfig;
