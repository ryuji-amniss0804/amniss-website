"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type ChoiceId = "room" | "bldg" | "out";

export type Choice = {
  id: ChoiceId;
  /** 左上の番号 */
  no: string;
  name: string;
  desc: string;
  /** 金額（3桁区切り・単位なし）と単位。**page.tsx の定数から渡す。直書きしない** */
  price: string;
  unit: string;
};

type Props = {
  choices: Choice[];
  /** 3つの説明。**サーバーで組んだものをそのまま受け取る**（最初の HTML に3つとも入る） */
  panels: Record<ChoiceId, ReactNode>;
};

/** トップの「料金の目安」で「車を使わない」を選んだときの飛び先。01 の説明の箱に付く */
const INDOOR_HASH = "tatemononai";

/** JS が動かないときは、3つの説明を全部出す。`hidden` を CSS で打ち消すだけ */
const NOSCRIPT = "<style>.rv .pp-panel[hidden]{display:block!important}</style>";

/**
 * /unpan の「どこまで動かしますか？」。3枚のカードを押すと、下の説明が切り替わる（92_price_pages）。
 *
 * - 最初は 03（建物の外へ）を選んだ状態
 * - **URL が `#tatemononai` のときは 01 を選んだ状態にして、その箱まで動かす。**
 *   閉じている箱は `display:none` で、ブラウザは隠れた要素へは飛べないので、開けてからこちらで動かす
 * - 3つの説明はどれも最初の HTML に入っている（`hidden` で隠すだけ）。JS がなければ3つとも見える
 */
export default function UnpanChoices({ choices, panels }: Props) {
  const [picked, setPicked] = useState<ChoiceId>("out");
  /** ハッシュで開けた直後だけ、箱の位置まで動かす */
  const jump = useRef(false);

  // ⚠ この effect を、下の「ハッシュを読む」effect より前に置くこと。
  //    後ろに置くと、開いた直後（まだ 01 が隠れている）に走って、動かす合図を使い切ってしまう
  useEffect(() => {
    if (!jump.current) return;
    jump.current = false;
    document.getElementById(INDOOR_HASH)?.scrollIntoView();
  }, [picked]);

  useEffect(() => {
    const read = () => {
      if (window.location.hash !== `#${INDOOR_HASH}`) return;
      jump.current = true;
      setPicked("room");
      // すでに 01 が開いているとき（state が変わらない）は、下の effect が走らないのでここで動かす
      document.getElementById(INDOOR_HASH)?.scrollIntoView();
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return (
    <>
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT }} />
      <div className="pp-choices">
        {choices.map((c) => {
          const on = picked === c.id;
          return (
            <button
              type="button"
              key={c.id}
              className={on ? "pp-ch on" : "pp-ch"}
              aria-pressed={on}
              aria-controls={`pp-panel-${c.id}`}
              onClick={() => setPicked(c.id)}
            >
              <span className="k tp-num">{c.no}</span>
              <span className="t">{c.name}</span>
              <span className="d">{c.desc}</span>
              <span className="p tp-num">
                {c.price}
                <small>{c.unit}</small>
              </span>
            </button>
          );
        })}
      </div>

      {choices.map((c) => (
        // id="tatemononai" は 01 の箱そのものに付ける（aria-controls の id は内側）
        <div
          className="pp-panel"
          key={c.id}
          id={c.id === "room" ? INDOOR_HASH : undefined}
          hidden={picked !== c.id}
        >
          <div id={`pp-panel-${c.id}`}>{panels[c.id]}</div>
        </div>
      ))}
    </>
  );
}
