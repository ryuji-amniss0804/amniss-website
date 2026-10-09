import type { Metadata } from "next";
import { PC_META } from "@/lib/pc";
import PcLastCta from "../../_components/PcLastCta";
import PcLicense from "../../_components/PcLicense";
import PcPageHero from "../../_components/PcPageHero";
import SymptomTool from "./SymptomTool";

/**
 * /pc/symptom 症状から費用の目安を出すページ。
 *
 * ⚠ このファイルはサーバーコンポーネントのまま。**`"use client"` を付けないこと。**
 *   付けると `metadata` が出せなくなる。触るのは道具の中身（`SymptomTool.tsx`）だけ。
 * ⚠ 金額はページに書かない。数字は `lib/pc.ts` の `SYMPTOMS` が持つキーから
 *   `priceOf()` が引く。**ここにも道具側にも数字を書かないこと。**
 *
 * robots はレイアウト（`app/(pc)/layout.tsx`）で一括して見ている。ここでは指定しない。
 */

export const metadata: Metadata = {
  title: "症状から費用の目安 | パソコン修理・出張診断 re'vive_doc 富山",
  description: PC_META.symptom,
  alternates: { canonical: "/pc/symptom" },
};

export default async function PcSymptomPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  /**
   * `?s=<key>` で来たら、その症状を選んだ状態で開く（78a。トップの症状から送られてくる）。
   * `?a=<段>` は伺う地域（出張費の段）。94 でトップに地域のセレクトが付いたので足した。
   * 知らない値の扱い（何も選ばない）は道具側が持つので、ここは素通しでよい。
   */
  const q = await searchParams;
  const s = q.s;
  const a = q.a;

  return (
    <>
      <PcPageHero kicker="SYMPTOM" title="症状から、費用の目安を出す">
        当てはまるものを選ぶと、考えられる原因と費用の目安がその場で出ます。
        <b>これは判定ではなく目安です。</b>
        金額が確定するのは、伺って測ったあとです。
      </PcPageHero>
      <PcLicense />

      <section className="sec">
        <div className="w">
          <SymptomTool
            initialSymptom={typeof s === "string" ? s : null}
            initialArea={typeof a === "string" ? a : null}
          />
        </div>
      </section>

      <PcLastCta />
    </>
  );
}
