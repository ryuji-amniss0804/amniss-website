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
 * ⚠ LINEのカードは**電話のカードより下**に置く。電話は受付時間が限られ、
 *   LINEとフォームは24時間受け付ける。**時間の制約が強いほうを上**に置く。
 * ⚠ リンク先は `lib/pc.ts` の `PC_LINE_URL`（パソコン専用のアカウント）。
 *   `lib/site.ts` の `LINE_URL`（引越し・買取用）で代用しないこと。
 *   アカウントを止めて `PC_LINE_URL` を null に戻せば、このカードごと消える。
 * ⚠ 電話番号と受付時間は `lib/site.ts` から引く。引越しと共通の番号なので書き写さない。
 *
 * robots はレイアウト（`app/(pc)/layout.tsx`）で一括して見ている。ここでは指定しない。
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
                {/* 電話の受付を 18:00 までに短くした（84）。**短くなったことだけが見えると閉じた印象になる**ので、
                    受け皿が24時間あることを電話番号のすぐ下で同時に見せる。 */}
                <p>フォームとLINEは24時間受け付けています。</p>
              </div>
            </div>

            {/* 電話より下。電話は受付が限られ、LINEは24時間受け付ける。制約の強いほうを上に置く。
                ⚠ 「24時間対応」と書かないこと。受け付けるのは24時間だが、返事は営業時間になる。 */}
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
