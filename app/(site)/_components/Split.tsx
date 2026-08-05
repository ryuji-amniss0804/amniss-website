import type { ReactNode } from "react";

type Props = {
  /** 字間を開けた日本語のラベル。`事 業` `料 金` など。英語は使わない */
  kicker?: string;
  title: ReactNode;
  /** 見出し列の下に置く短い補足 */
  note?: ReactNode;
  children: ReactNode;
  id?: string;
  /** 背景を --paper-2 にする */
  tint?: boolean;
  /** ページ最初のセクション。上の罫線を消す */
  first?: boolean;
};

/**
 * 見出し列（284px・sticky）＋本文列の非対称2カラム。
 * セクションの外枠（罫線1本での区切り）ごと引き受ける。箱では囲まない。
 * 840px 以下で1カラムに落ち、見出し列の sticky も解除される。
 */
export default function Split({ kicker, title, note, children, id, tint, first }: Props) {
  const cls = ["sec", tint ? "tint" : "", first ? "first" : ""].filter(Boolean).join(" ");

  return (
    <section className={cls} id={id}>
      <div className="w">
        <div className="split">
          <div className="hd">
            {kicker ? <div className="kicker">{kicker}</div> : null}
            <h2 className="t mincho">{title}</h2>
            {note ? (
              <p className="lead" style={{ fontSize: "13px" }}>
                {note}
              </p>
            ) : null}
          </div>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
