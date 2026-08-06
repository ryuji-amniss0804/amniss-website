import type { ReactNode } from "react";
import { AREA, HOURS, LINE_URL, TEL, TEL_HREF } from "@/lib/site";

type Props = {
  title?: ReactNode;
  lead?: ReactNode;
  id?: string;
};

/**
 * 濃紺（--ink）の帯。電話・LINE・フォーム。
 * グラデーションや装飾は入れない。差し色（--accent）もここでは使わない。
 */
export default function Cta({
  title = "まずは、写真を1枚。",
  lead = "運びたい物、売りたい物の写真を送ってください。型番が写っていれば、その場で概算をお伝えできます。お見積りだけのご相談でも構いません。",
  id = "cta",
}: Props) {
  return (
    <div className="cta" id={id}>
      <div className="w">
        <div>
          <h2 className="mincho">{title}</h2>
          <p>{lead}</p>
        </div>
        <div>
          <a className="tel" href={TEL_HREF}>
            {TEL}
          </a>
          <div className="hrs">
            受付 {HOURS} ／ {AREA}
          </div>
          <div className="acts">
            <a className="btn btn-line" href={LINE_URL} target="_blank" rel="noopener noreferrer">
              LINEで写真を送る
            </a>
            <a className="btn btn-line" href="/contact">
              見積りフォーム
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
