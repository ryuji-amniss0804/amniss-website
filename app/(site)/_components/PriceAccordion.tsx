"use client";

import { useState } from "react";

/** 文字はすべて**1本の文字列**で渡す（JSX で割ると React が境目に `<!-- -->` を入れる） */
export type AccordionTable = {
  /** 見出し */
  name: string;
  /** 見出しの右の小さい字 */
  sub: string;
  rows: { name: string; desc?: string; price: string }[];
  /** 表の下の一言 */
  note: string;
};

type Props = { items: AccordionTable[] };

/**
 * JS が動かないときは、閉じている表も全部出す。
 * `hidden` を CSS で打ち消すだけなので、HTML は JS の有無で変わらない。
 */
const NOSCRIPT = "<style>.rv .pp-acc-b[hidden]{display:block!important}</style>";

/**
 * /moving の料金の4つの表。開け閉めできる（92_price_pages）。
 *
 * - 最初の1つだけ開いておく。開くのは1つだけ（モックのとおり）
 * - `<button aria-expanded>` なので、Tab で移って Enter／Space で開け閉めできる
 * - **閉じている表も HTML には出している**（`hidden`）。検索エンジンが読める
 * - **JS がないときは4つとも見える**（上の NOSCRIPT）
 *
 * `<details>` にしなかったのは、JS なしで4つとも見せる方法がないため
 * （閉じた `<details>` の中身は CSS では開けない。最初から全部開けて JS で閉じると、読み込みのたびに表が動く）。
 */
export default function PriceAccordion({ items }: Props) {
  const [open, setOpen] = useState(0);

  return (
    <div className="pp-acc">
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT }} />
      {items.map((t, i) => {
        const on = open === i;
        return (
          <div className={on ? "pp-acc-i open" : "pp-acc-i"} key={t.name}>
            <h3>
              <button
                type="button"
                className="pp-acc-q"
                aria-expanded={on}
                aria-controls={`pp-acc-b${i}`}
                onClick={() => setOpen(on ? -1 : i)}
              >
                <span className="t">{t.name}</span>
                <small>{t.sub}</small>
                <span className="tp-fq-pm" aria-hidden="true" />
              </button>
            </h3>
            <div className="pp-acc-b" id={`pp-acc-b${i}`} hidden={!on}>
              <table className="pp-tbl">
                <tbody>
                  {t.rows.map((r) => (
                    <tr key={r.name}>
                      <th scope="row">{r.name}</th>
                      <td className="d">{r.desc ?? ""}</td>
                      <td className="p tp-num">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="pp-tbl-note">{t.note}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
