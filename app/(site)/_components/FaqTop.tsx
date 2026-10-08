"use client";

import { Fragment, useState } from "react";
import Link from "next/link";

/** 答えは**文字列1本**で渡す（JSX で割ると React が境目に `<!-- -->` を入れる） */
export type FaqTopItem = { q: string; a: string };

type Props = { items: FaqTopItem[] };

/** 答えの中のこの語を /simulator へのリンクにする */
const SIM = "シミュレーター";
/** 答えを「リンクにする語」と「電話番号」で割る。電話番号は行末で割らせない（`.nw`） */
const PARTS = /(シミュレーター|\d{2,4}-\d{2,4}-\d{4})/;

function Answer({ text }: { text: string }) {
  // 割った結果は 文字・区切り・文字… と交互に並ぶ（奇数番目が区切り）。
  // 文字どうしが隣り合わないので、React が境目に `<!-- -->` を入れない
  return (
    <>
      {text.split(PARTS).map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        if (part === SIM) {
          return (
            <Link href="/simulator" key={i}>
              {part}
            </Link>
          );
        }
        return (
          <span className="nw" key={i}>
            {part}
          </span>
        );
      })}
    </>
  );
}

/**
 * トップだけの FAQ。開け閉めできる形（91_top_lower）。
 * 下層ページの `Faq`（`<details>`・JS なし）とは別物で、あちらの見た目は変えていない。
 *
 * - 最初の1問だけ開いておく。開くのは1つだけ（モックのとおり）
 * - `<button aria-expanded>` なので、Tab で移って Enter／Space で開け閉めできる
 * - **閉じている答えも HTML には出している**（`hidden`）。検索エンジンが読める
 */
export default function FaqTop({ items }: Props) {
  const [open, setOpen] = useState(0);

  return (
    <div className="tp-fqs">
      {items.map((item, i) => {
        const on = open === i;
        return (
          <div className={on ? "tp-fq open" : "tp-fq"} key={item.q}>
            <h3>
              <button
                type="button"
                className="tp-fq-q"
                aria-expanded={on}
                aria-controls={`tp-fq-a${i}`}
                onClick={() => setOpen(on ? -1 : i)}
              >
                <span className="tp-num tp-fq-mark" aria-hidden="true">
                  Q
                </span>
                <span className="tp-fq-t">{item.q}</span>
                <span className="tp-fq-pm" aria-hidden="true" />
              </button>
            </h3>
            <p className="tp-fq-a" id={`tp-fq-a${i}`} hidden={!on}>
              <Answer text={item.a} />
            </p>
          </div>
        );
      })}
    </div>
  );
}
