import type { ReactNode } from "react";

export type FaqItem = { q: string; a: ReactNode };

type Props = { items: FaqItem[] };

/**
 * `<details>` ベースの FAQ。JavaScript を使わない。
 * 1問目だけ open で開いておく。
 */
export default function Faq({ items }: Props) {
  return (
    <div className="faq">
      {items.map((item, i) => (
        <details key={item.q} open={i === 0}>
          <summary>{item.q}</summary>
          <div className="a">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
