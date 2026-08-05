import type { ReactNode } from "react";

export type Item = {
  name: string;
  /** 補足。無い行のほうが多い */
  note?: ReactNode;
};

type Props = {
  /** 見出し。セクションの見出し（Split 側）と重なるときは省く */
  title?: string;
  items: Item[];
  /** 受けられない物の一覧。行頭の記号が × になる */
  deny?: boolean;
};

/**
 * 品目のリスト。
 *
 * 840px より広いときは「品目 ／ 補足」の2カラム、600px以下では補足が品目名の下に落ちる。
 * `note` が無い行では、余白も罫線も追加しない（半分以上の行が note なしのため、
 * そこに空の枠が残ると、抜けているように見える）。
 *
 * 箱では囲まない。行の区切りは罫線1本。
 */
export default function ItemList({ title, items, deny }: Props) {
  const cls = ["items", deny ? "deny" : "", title ? "" : "no-title"].filter(Boolean).join(" ");

  return (
    <div className={cls}>
      {title ? <h3>{title}</h3> : null}
      <ul>
        {items.map((item) => (
          <li key={item.name}>
            <span className="nm">{item.name}</span>
            {item.note ? <span className="nt">{item.note}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
