import type { Metadata } from "next";
import { PC_META } from "@/lib/pc";
import SymptomTool from "./SymptomTool";

/**
 * /pc/symptom 症状から費用の目安を出すページ。
 * 手本：D:\revive_toyama_marketing\mockup_pc_doc_v4.html の「症状の目安（選択式）」
 *
 * ⚠ このファイルはサーバーコンポーネントのまま。**`"use client"` を付けないこと。**
 *   付けると `metadata` が出せなくなる。触るのは道具の中身（`SymptomTool.tsx`）だけ。
 * ⚠ 金額はページに書かない。数字は `lib/pc.ts` の `SYMPTOMS` が持つキーから
 *   `priceOf()` が引く。**ここにも道具側にも数字を書かないこと。**
 * ⚠ `.pc-top` を付けないこと。付けるとセクション番号（01 ／ …）が出る。
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
   * `?s=<key>` で来たら、その症状を選んだ状態で開く。
   * 78a でトップページの症状カードからここへ送るときに使う。
   * 知らないキーの扱い（何も選ばない）は道具側が持つので、ここは素通しでよい。
   */
  const s = (await searchParams).s;

  return (
    <section className="sec">
      <div className="w">
        <p className="eyebrow">SYMPTOM</p>
        <h1>症状から、費用の目安を出す</h1>
        <p className="lead">
          当てはまるものを選ぶと、考えられる原因と費用の目安がその場で出ます。
          <b>これは判定ではなく目安です。</b>
          金額が確定するのは、伺って測ったあとです。
        </p>

        <SymptomTool initialSymptom={typeof s === "string" ? s : null} />
      </div>
    </section>
  );
}
