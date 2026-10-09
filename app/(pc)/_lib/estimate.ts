import { SYMPTOMS, TRAVEL, priceOf, yen } from "@/lib/pc";

/**
 * 症状の目安の計算。**トップ（/pc）の「症状を押すと、費用の目安が出ます」と
 * /pc/symptom の道具が、同じ関数を通る。**
 *
 * 94 でトップにも目安が出るようになった。計算を2か所に書くと、片方だけ直ったときに
 * 「トップで見た金額と、押した先の金額が違う」になる。だからここ1か所に置く。
 *
 * ⚠ 金額の数字をここに書かないこと。`SYMPTOMS` が持つのはキー（"std" など）で、
 *   数字は `priceOf()` が `LABOR` / `MENU` から引く。出張費は `TRAVEL` から引く。
 */

export type Symptom = (typeof SYMPTOMS)[number];

/** 作業工賃の下限と上限。`lo === null` は「要見積り」、`hi === null` は上限を示さない */
export function laborOf(s: Symptom): { lo: number | null; hi: number | null } {
  return {
    lo: s.lo === null ? null : priceOf(s.lo),
    hi: s.hi === null ? null : priceOf(s.hi),
  };
}

/** 金額の範囲。`hi === null` は上限を示さない、`hi === lo` は1つの数字 */
export function range(lo: number, hi: number | null, add = 0): string {
  if (hi === null) return `${yen(lo + add)}円〜`;
  if (hi === lo) return `${yen(lo + add)}円`;
  return `${yen(lo + add)}〜${yen(hi + add)}円`;
}

/**
 * 伺う地域（出張費の段）。トップのセレクトに出す。**一覧を書かず、`TRAVEL` から作る。**
 * 1市だけの段は `label`（富山市内）、複数の段は市町村名の「市・町・村」を落として並べる。
 */
export const AREAS = TRAVEL.map((t, i) => ({
  index: i,
  fee: t.fee,
  name: t.cities.length === 1 ? t.label : t.cities.map((c) => c.replace(/[市町村]$/, "")).join("・"),
  /** この段の市町村が1つだけなら、その名前。/pc/symptom へ地域を引き継ぐときに使う */
  onlyCity: t.cities.length === 1 ? t.cities[0] : null,
}));
