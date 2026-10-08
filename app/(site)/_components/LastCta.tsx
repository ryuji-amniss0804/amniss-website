import Link from "next/link";
import { AREA, HOURS, LINE_URL, TEL, TEL_HREF } from "@/lib/site";

type Props = {
  title: string;
  lead: string;
};

/**
 * 最後の案内。黄色の帯（92_price_pages）。
 *
 * **トップの最後の節（page.tsx の tp-last）と同じ見た目・同じボタン3つ。**
 * クラスもトップのものをそのまま使っている（site.css の tp-last）。
 * ほかの下層ページの `Cta`（濃紺の帯）は変えていない。
 * `id="cta"` は、これまでの `Cta` と同じ（ページ内から飛べるように残してある）。
 */
export default function LastCta({ title, lead }: Props) {
  return (
    <section className="tp-last" id="cta">
      <div className="tw tp-last-in">
        <div className="tp-last-l">
          <h2 className="tp-h2">{title}</h2>
          <p>{lead}</p>
        </div>
        <div className="tp-last-r">
          <a className="tp-btn tp-btn-n" href={LINE_URL} target="_blank" rel="noopener noreferrer">
            LINEで写真を送る
          </a>
          <a className="tp-btn tp-btn-nw" href={TEL_HREF}>
            <span className="tp-num tp-last-tel">{TEL}</span>
          </a>
          <Link className="tp-btn tp-btn-nw sm" href="/contact">
            見積りフォーム
          </Link>
          <p className="tp-last-hrs">{`受付 ${HOURS} ／ ${AREA}`}</p>
        </div>
      </div>
    </section>
  );
}
