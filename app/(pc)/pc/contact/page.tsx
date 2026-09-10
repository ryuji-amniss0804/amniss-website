import type { Metadata } from "next";
import Image from "next/image";
import { PC_LINE_URL, PC_META } from "@/lib/pc";
import { HOURS, TEL, TEL_HREF } from "@/lib/site";
import PcContactForm from "./PcContactForm";

/**
 * /pc/contact ご相談フォーム。
 * 手本：D:\revive_toyama_marketing\mockup_pc_site_v1.html の `#/contact`
 *
 * **`/pc` `/pc/price` `/pc/symptom` `/pc/case` のCTAは、すべてここを指している。**
 * ここが無いあいだ、サイト上のあらゆる導線が行き止まりになっていた。
 *
 * 【なぜサーバーコンポーネントなのか】
 * ページごと `"use client"` にすると metadata を出せなくなる。
 * 入力を持つのはフォームだけなので、`PcContactForm.tsx` だけをクライアントにしている
 * （`/pc/symptom` と同じ形）。右側の連絡先カードは動かないのでこちらに置く。
 *
 * ⚠ LINEのカードは `PC_LINE_URL` が入るまで出さない。パソコン専用の公式アカウントが
 *   未開設のため。`lib/site.ts` の `LINE_URL`（引越し・買取用）で代用しないこと。
 *   URLが出れば、この `PC_LINE_URL &&` の1行でそのまま描画される。
 * ⚠ 電話番号と受付時間は `lib/site.ts` から引く。引越しと共通の番号なので書き写さない。
 *
 * noindex はレイアウト（`app/(pc)/layout.tsx`）の `robots` が効いている。
 * ここでは指定しない（外すのは82）。
 */

export const metadata: Metadata = {
  title: "ご相談・お見積り | パソコン修理・出張診断 re'vive_doc 富山",
  description: PC_META.contact,
  alternates: { canonical: "/pc/contact" },
};

export default function PcContactPage() {
  return (
    <section className="sec">
      <div className="w">
        <p className="eyebrow">CONTACT</p>
        <h1>ご相談・お見積り</h1>
        <p className="lead">
          <b>ご相談とお見積りは無料です。</b>
          写真を送っていただけると、伺う前におおよその見当がつきます。
          わかる範囲で構いません。書ける項目だけで送ってください。
        </p>

        <div className="cwrap">
          <PcContactForm />

          <aside className="cside">
            {/* ⚠ パソコン専用のLINEは未開設。`PC_LINE_URL` が null のあいだは出さない */}
            {PC_LINE_URL && (
              <div className="card">
                <div className="body">
                  <h3>パソコン専用のLINEがあります</h3>
                  <p>
                    フォームより気軽です。写真もそのまま送れます。
                    <b>引越し・買取とは別のアカウント</b>
                    なので、パソコンの話だけがここに届きます。
                  </p>
                  <a
                    className="btn p"
                    href={PC_LINE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LINEで相談する
                  </a>
                </div>
              </div>
            )}

            <div className="card">
              <div className="body">
                <h3>お電話</h3>
                {/* 番号そのものがリンクの文字なので、読み上げ用のラベルは足さない */}
                <p className="cside-tel num">
                  <a href={TEL_HREF}>{TEL}</a>
                </p>
                <p>
                  受付 {HOURS}
                  <br />
                  作業中は折り返しになります。
                </p>
              </div>
            </div>

            <div className="card">
              <div className="body">
                <Image
                  className="cside-face"
                  src="/pc/owner.jpg"
                  alt="代表 小川 竜司"
                  width={520}
                  height={520}
                  sizes="64px"
                />
                <h3>代表 小川 竜司</h3>
                <p>
                  富山県内を1台ずつ回っています。ご相談の内容は、私が直接見ています。
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
