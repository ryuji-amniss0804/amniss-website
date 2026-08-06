import type { ReactNode } from "react";
import Photo from "./Photo";
import { images, SIZES_FULL } from "@/lib/images";

type Props = {
  /** 字間を開けた日本語のラベル */
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
};

/**
 * トップだけのヒーロー。**写真の上に文字を置かない。**
 *
 * 【17_hero で作り直した】
 * 14では写真に文字を重ね、左端にだけ濃紺のグラデーションを敷いていた。
 * 実測でリード1.61・電話ボタン2.38（1280px）と読めておらず、
 * かといって濃くすると立山連峰と富山市街が沈む。
 *
 * 原因は写真の使い方のほうだった。image_decision.md の枠は3つあり、
 * この写真は**枠A（証拠）** ——「軽バン・立山連峰・富山市街が写っていること」が
 * 証拠になっている1枚で、テキストの背景（枠C）に使うものではない。
 * **840px以下がもともと正しく組めていた**ので、デスクトップをそれに合わせた。
 *
 *   写真（全幅・無加工・左右を切らない） → 濃紺（--ink）のパネルにテキスト
 *
 * 縦の順序はどの幅でも同じ。減光もオーバーレイも無い。
 * 下層ページの Hero は「文字が先、写真が後」でこれとは別物なので、別部品のまま。
 *
 * 【.ht-grid について】
 * デスクトップ（1061px以上）だけ、パネルの中を2カラムにする（見出し／リードとボタン）。
 * **縦に積むと、パネルだけで400px使って写真の取り分が無くなる。**
 * 1060px以下では `display: contents` で消えるので、DOM の並びがそのまま流れる
 * （＝390px の見え方は14のときと1pxも変わらない）。
 */
export default function HeroTop({ kicker, title, lead, actions }: Props) {
  return (
    <section className="hero-top">
      <Photo image={images.heroTop} sizes={SIZES_FULL} priority className="ht-fig" />
      <div className="ht-txt">
        <div className="w">
          <div className="ht-grid">
            <div className="ht-a">
              {kicker ? <div className="kicker">{kicker}</div> : null}
              <h1 className="mincho">{title}</h1>
            </div>
            <div className="ht-b">
              {lead ? <p className="sub">{lead}</p> : null}
              {actions ? <div className="acts">{actions}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
