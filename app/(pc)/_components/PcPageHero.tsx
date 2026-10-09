import type { ReactNode } from "react";

type Props = {
  /** 英字の小見出し（等幅・グリーン）。`PRICE` など */
  kicker: string;
  /** 見出し（h1） */
  title: ReactNode;
  /** 見出しの下の文。省いてよい */
  children?: ReactNode;
  /** 見出しの上に置く札（事例・記事の日付やカテゴリ） */
  meta?: ReactNode;
  /** 記事・事例のページ。本文と同じ幅（760px）にそろえる */
  narrow?: boolean;
};

/**
 * 下層ページのヒーロー。紺の地に緑の方眼・英字の小見出し＋見出し（94）。
 * トップのヒーローより低く、動きも付けない（本体の PageHero と同じ考え方）。
 */
export default function PcPageHero({ kicker, title, children, meta, narrow }: Props) {
  return (
    <section className="phero">
      <div className={narrow ? "w narrow" : "w"}>
        <p className="phero-k">{kicker}</p>
        {meta ? <div className="meta on-navy">{meta}</div> : null}
        <h1 className="kp">{title}</h1>
        {children ? <p className="phero-lead">{children}</p> : null}
      </div>
    </section>
  );
}
