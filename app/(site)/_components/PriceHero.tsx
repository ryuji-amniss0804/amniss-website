import type { ReactNode } from "react";

type Props = {
  /** 黄色の小見出し */
  kicker: string;
  /** 見出しの1行目と2行目。**2行目に黄色の塗りが付く** */
  title: [string, string];
  /** リードの1行目と2行目 */
  lead: [string, string?];
  /** ボタンなど。リードの下に並ぶ */
  actions?: ReactNode;
  /** 右に置く図版（/moving の荷台の断面図） */
  figure?: ReactNode;
  /** 見出しを一回り小さくする（/simulator。すぐ下が入力なので、ヒーローを低くする） */
  small?: boolean;
};

/**
 * 料金の3ページ（/moving・/unpan・/simulator）のヒーロー。紺の地（92_price_pages）。
 *
 * 見た目の正は参考モック（top_mock_20261008/Moving.dc.html ほか）。
 * トップの HeroTop（写真の上に文字）とも、ほかの下層ページの Hero（白地・明朝）とも別物。
 * **あちらの見た目を変えないために、部品を分けてある。**
 *
 * 見出しの2行目は、トップの「金額がわかる。」と同じ作り（黄色の塗りの上に紺の文字）。
 */
export default function PriceHero({ kicker, title, lead, actions, figure, small }: Props) {
  return (
    <section className={small ? "pp-hero sm" : figure ? "pp-hero" : "pp-hero solo"}>
      <div className="tw pp-hero-in">
        <div className="pp-hero-t">
          <p className="pp-hero-k tp-a1">{kicker}</p>
          <h1 className="pp-hero-h tp-a2">
            {title[0]}
            <br />
            <span className="tp-mark pp-fill">{title[1]}</span>
          </h1>
          <p className="pp-hero-lead tp-a3">
            {lead[0]}
            {lead[1] ? (
              <>
                <br />
                {lead[1]}
              </>
            ) : null}
          </p>
          {actions ? <div className="pp-hero-acts tp-a4">{actions}</div> : null}
        </div>
        {figure ? <div className="pp-hero-f tp-a3">{figure}</div> : null}
      </div>
    </section>
  );
}
