import type { ReactNode } from "react";

export type PriceRow = {
  name: string;
  /** 条件・内訳。空でもよい */
  desc?: ReactNode;
  /** 「20,000円〜」「査定無料」「×1.15」など、文字列のまま入れる */
  price: string;
};

type Props = {
  /** 見出し行。既定は「サービス」「料金の目安」 */
  head?: [string, string];
  rows: PriceRow[];
  /** 表の下の注記 */
  note?: ReactNode;
};

/**
 * 罫線だけの仕様表。枠線・背景・角丸は使わない。
 * 600px 以下では横並びをやめ、名称 → 説明 → 金額 の縦積みになる
 * （site.css の `@media (max-width:600px)` 側で thead を落として tr をブロック化）。
 */
export default function PriceTable({ head = ["サービス", "料金の目安"], rows, note }: Props) {
  return (
    <>
      <table className="price">
        <thead>
          <tr>
            <th>{head[0]}</th>
            <th className="r">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {/* 名称は一意とは限らない（「1K一式・富山市内」が日程違いで3行並ぶなど）ので
              key に使わない */}
          {rows.map((row, i) => (
            <tr key={`${row.name}-${i}`}>
              <td>
                <div className="nm">{row.name}</div>
                {row.desc ? <div className="ds">{row.desc}</div> : null}
              </td>
              <td className="r">{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {note ? <p className="pnote">{note}</p> : null}
    </>
  );
}
