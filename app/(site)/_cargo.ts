/**
 * 軽バンの荷室の内寸（cm）と最大積載（kg）。スズキ・エブリイ（ハイルーフ）のカタログ表記。
 *
 * /moving と /unpan の「積める量」で大きな数字として出す。**ページに数字を書き写さないこと。**
 * 実際に積める量の目安（2.8m³）は lib/pricing.ts の CAP。
 *
 * ⚠ 同じ寸法が、_reasons.ts の「サイズを公開」の根拠と、lib/pricing.ts の品目の注記
 *    （「高さ142cmまで」など）にも文字列で入っている。変えるときは `git grep` で全部見ること。
 */
export const CARGO_SIZE = { w: 140, h: 142, d: 190, kg: 350 } as const;
