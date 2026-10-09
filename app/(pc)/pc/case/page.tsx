import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CASES, PC_META } from "@/lib/pc";
import PcLastCta from "../../_components/PcLastCta";
import PcLicense from "../../_components/PcLicense";
import PcPageHero from "../../_components/PcPageHero";

/**
 * /pc/case 修理事例の一覧。
 *
 * 【94】カードはトップ（/pc）の事例の節と同じ、横長の大きなカード。文は前のまま。
 *
 * ⚠ **実在する事例だけを出す。**「準備中」のダミーを本番に出さない。
 *   いま出るのは1枚だけで、それでよい。
 *   事例が増えたら `lib/pc.ts` の `CASES` に足すだけで、ここは触らなくてよい。
 *
 * robots はレイアウト（`app/(pc)/layout.tsx`）で一括して見ている。ここでは指定しない。
 */

export const metadata: Metadata = {
  title: "修理事例 | パソコン修理・出張診断 re'vive_doc 富山",
  description: PC_META.cases,
  alternates: { canonical: "/pc/case" },
};

export default function PcCasePage() {
  return (
    <>
      <PcPageHero kicker="CASE" title="修理事例">
        実際にお受けした作業を、診断報告書とあわせて公開しています。お客様が特定されないよう、機体の情報は匿名化しています。
      </PcPageHero>
      <PcLicense />

      <section className="sec">
        <div className="w">
          <div className="cases">
            {CASES.map((c) => (
              <Link key={c.slug} className="case" href={`/pc/case/${c.slug}`}>
                <Image
                  src={c.image}
                  alt={c.imageAlt}
                  width={c.imageW}
                  height={c.imageH}
                  sizes="(max-width: 860px) 100vw, 560px"
                />
                <div className="case-b">
                  <div className="meta">
                    <span>{c.date}</span>
                    <span>{`${c.area} ／ ${c.machine}`}</span>
                    {c.hasReport && <span className="ok">診断報告書あり</span>}
                  </div>
                  <h2>{c.title}</h2>
                  <p>{c.summary}</p>
                  <span className="case-go">読む →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PcLastCta />
    </>
  );
}
