import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CASES, PC_META } from "@/lib/pc";

/**
 * /pc/case 修理事例の一覧。
 * 手本：D:\revive_toyama_marketing\mockup_pc_site_v1.html の `#/case`
 *
 * ⚠ **実在する事例だけを出す。**モックアップには「準備中」のダミーが3枚あるが、
 *   本番に出さない。いま出るのは1枚だけで、それでよい。
 *   事例が増えたら `lib/pc.ts` の `CASES` に足すだけで、ここは触らなくてよい。
 * ⚠ `.pc-top` を付けないこと。付けるとセクション番号（01 ／ …）が出る。
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
    <section className="sec">
      <div className="w">
        <p className="eyebrow">CASE</p>
        <h1>修理事例</h1>
        <p className="lead">
          実際にお受けした作業を、診断報告書とあわせて公開しています。お客様が特定されないよう、機体の情報は匿名化しています。
        </p>

        <div className="grid g2">
          {CASES.map((c) => (
            <Link key={c.slug} className="card" href={`/pc/case/${c.slug}`}>
              <Image
                className="thumb"
                src={c.image}
                alt={c.imageAlt}
                width={c.imageW}
                height={c.imageH}
                sizes="(max-width: 640px) 100vw, 520px"
              />
              <div className="body">
                <div className="card-meta">
                  <span>{c.date}</span>
                  <span className="tag">
                    {c.area} ／ {c.machine}
                  </span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.summary}</p>
                <div className="foot-of-card">
                  {c.hasReport && <span className="tag ok">診断報告書あり</span>}
                  <span className="read-on">読む →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
