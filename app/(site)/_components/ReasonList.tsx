import type { ReactNode } from "react";

export type Reason = {
  title: string;
  body: ReactNode;
  /** 根拠。左に縦罫を引いた1行 */
  evidence?: ReactNode;
  /** 番号を明示したいとき。既定は 一二三四… */
  n?: string;
};

const KANJI = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

type Props = { items: Reason[] };

/**
 * 一二三四のぶら下げ番号リスト。箱を使わない。
 * 項目の区切りは罫線1本。560px 以下で番号が上に回る。
 */
export default function ReasonList({ items }: Props) {
  return (
    <div className="reasons">
      {items.map((item, i) => (
        <div className="it" key={item.title}>
          <div className="n">{item.n ?? KANJI[i] ?? String(i + 1)}</div>
          <div>
            <h3 className="mincho">{item.title}</h3>
            <p>{item.body}</p>
            {item.evidence ? <div className="ev">{item.evidence}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
