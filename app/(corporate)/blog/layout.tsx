import type { Metadata } from "next";

/**
 * `/blog`（一覧）は "use client" なので、ページから metadata を出せない。
 * レイアウトに置かないと (corporate)/layout.tsx のものが降りてきて、
 * canonical が無いまま og:url だけトップを指す状態になる。
 *
 * ここは `/blog/[slug]` にも降りるが、記事側は generateMetadata で
 * alternates と openGraph を自分のものに差し替えているので上書きされる。
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

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
