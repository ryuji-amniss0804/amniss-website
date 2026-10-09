import Link from "next/link";
import { AREA, HOURS } from "@/lib/site";

/**
 * 最後の案内。緑の帯（上に紺の3pxの線）。ボタンは紺（94）。
 *
 * 見出し・本文・ボタンの文字は 94 より前のトップのもの。**言い換えないこと。**
 * LINE のボタンは出さない。最後の案内は `/pc/contact` の1本に絞る
 * （入口を増やすと、どれを押せばよいかが薄まる）。LINEの入口は `/pc/contact` のカードとフッターにある。
 *
 * 受付時間は `lib/site.ts` の `HOURS`（「9:00 — 18:00　年中無休」）の前半を使う。
 * 時刻を書き写さない。
 */
const HOURS_ONLY = HOURS.split("　")[0];

export default function PcLastCta() {
  return (
    <section className="cta" id="cta">
      <div className="w cta-in">
        <div className="cta-l">
          <h2 className="kp">
            まずは、状態を
            <br />
            聞かせてください
          </h2>
          <p className="kp">
            ご相談とお見積りは無料です。写真を送っていただければ、伺う前におおよその見当をお伝えできます。
          </p>
        </div>
        <div className="cta-r">
          <Link className="btn btn-n" href="/pc/contact">
            無料で相談する
          </Link>
          <p className="cta-hrs">{`受付 ${HOURS_ONLY}（フォーム・LINEは24時間） ／ ${AREA}`}</p>
        </div>
      </div>
    </section>
  );
}
