import type { ReactNode } from "react";

/**
 * 図版。**SVG をインラインで埋める。**
 *
 * next/image で読み込むと、SVG の中の色が currentColor / CSS 変数を見られなくなり、
 * 拡大したときにラスタライズされてぼやける。図版は寸法を読むためのものなので、
 * どちらも困る。画像として置かず、DOM に展開する。
 *
 * 色は site.css の `.figv` 側に持たせてある（`fg-` 始まりのクラス）。
 * SVG の中に色を直書きしないこと。トークン（--ink / --ink-4 / --paper-2）を
 * 変えたときに図版だけ取り残される。
 *
 * 原本は D:\re'vive_toyama_marketing\fig_cargo.svg。
 * viewBox と座標は原本のまま。色指定だけをクラスに置き換えてある。
 */

/** 荷室の断面図。奥行190 × 高さ142cm を実寸比で描いてある */
function Cargo() {
  return (
    <svg viewBox="0 0 460 372" role="img" aria-labelledby="fig-cargo-t fig-cargo-d">
      <title id="fig-cargo-t">軽バンの荷室断面図</title>
      <desc id="fig-cargo-d">
        奥行190cm・高さ142cmの荷室に、冷蔵庫・洗濯機・段ボール大8箱を積んだ状態。ワンルーム〜1K一式の目安。
      </desc>

      {/* 寸法線 上（奥行190cm）。線の上に紙色の帯を敷いてから文字を置く */}
      <line className="fg-ln" x1="40" y1="26" x2="440" y2="26" />
      <line className="fg-ln" x1="40" y1="20" x2="40" y2="32" />
      <line className="fg-ln" x1="440" y1="20" x2="440" y2="32" />
      <rect className="fg-mask" x="196" y="15" width="88" height="22" />
      <text className="fg-tb" x="240" y="30" textAnchor="middle">
        奥行 190cm
      </text>

      {/* 荷室 */}
      <rect className="fg-bx" x="40" y="46" width="400" height="299" />

      {/* 冷蔵庫 60×140 */}
      <rect className="fg-it" x="40" y="51" width="126" height="294" />
      <text className="fg-t" x="103" y="196" textAnchor="middle">
        冷蔵庫
      </text>
      <text className="fg-t" x="103" y="214" textAnchor="middle">
        60 × 140
      </text>

      {/* 洗濯機 60×100 */}
      <rect className="fg-it" x="166" y="135" width="126" height="210" />
      <text className="fg-t" x="229" y="234" textAnchor="middle">
        洗濯機
      </text>
      <text className="fg-t" x="229" y="252" textAnchor="middle">
        60 × 100
      </text>

      {/* 段ボール大 35×35 を 2列 × 4段 */}
      <g className="fg-gd">
        <rect x="292" y="271" width="74" height="74" />
        <rect x="366" y="271" width="74" height="74" />
        <rect x="292" y="197" width="74" height="74" />
        <rect x="366" y="197" width="74" height="74" />
        <rect x="292" y="123" width="74" height="74" />
        <rect x="366" y="123" width="74" height="74" />
        <rect x="292" y="49" width="74" height="74" />
        <rect x="366" y="49" width="74" height="74" />
      </g>
      <text className="fg-t" x="366" y="367" textAnchor="middle">
        段ボール（大）8箱
      </text>

      {/* 寸法線 右（高さ142cm） */}
      <line className="fg-ln" x1="452" y1="46" x2="452" y2="345" />
      <line className="fg-ln" x1="446" y1="46" x2="458" y2="46" />
      <line className="fg-ln" x1="446" y1="345" x2="458" y2="345" />
      <text className="fg-tb" x="452" y="200" textAnchor="middle" transform="rotate(90 452 200)">
        高さ 142cm
      </text>
    </svg>
  );
}

const FIGURES: Record<string, () => ReactNode> = {
  cargo: Cargo,
};

export type FigureName = keyof typeof FIGURES;

/**
 * 荷室の断面図のキャプション。**`/moving` のヒーローとトップの⑤で共通。**
 * 2つのページで別々に書くと、片方だけ古くなる。
 */
export const CARGO_CAPTION =
  "軽バン（スズキ・エブリイ ハイルーフ）の荷室を実寸の比率で描いています。図の中身は冷蔵庫・洗濯機・段ボール大8箱で、ちょうど1Kぶんです。";

type Props = {
  name: FigureName;
  caption?: string;
  className?: string;
};

export default function Figure({ name, caption, className }: Props) {
  const Svg = FIGURES[name];
  if (!Svg) throw new Error(`図版 "${name}" が Figure.tsx にありません`);

  return (
    <figure className={["figv", className].filter(Boolean).join(" ")}>
      <Svg />
      {caption ? <figcaption className="cap">{caption}</figcaption> : null}
    </figure>
  );
}
