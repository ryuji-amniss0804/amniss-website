/**
 * 引越しの式（lib/pricing.ts）に載らない金額。
 *
 * lib/pricing.ts の式は「出動料 ＋ 荷物の量 ＋ 距離 ＋ 建物の条件」に日程係数を掛けるもので、
 * **車を出さない作業**と**法人のスポット便**はどちらもその形に載らない（距離料が出ない）。
 * ページごとに書くと同じ数字が散らばるので、出どころを1つにしてある。
 *
 * lib/pricing.ts には入れない。あちらは「引越しの計算式」の唯一の出どころで、
 * 式に載らない金額を混ぜると、式から出た数字と出ていない数字の区別がつかなくなる。
 *
 * 【どこまで動かすかで3つに分かれる】2026-09-24 改訂
 *   ① 同じ部屋の中だけ        … INDOOR_FEE 8,000円（定額）
 *   ② 建物の中（階・部屋をまたぐ・車は出さない）… inBuildingTotal()
 *   ③ 建物の外へ（車を出す）  … lib/pricing.ts の式
 *
 * ②は 2026-09-24 に新設した。それまで①と②の区別がなく、同じマンション内の階移動で
 * 3点・作業員2名・26,000円で受けた案件が、サイト上は 8,000円 に落ちていた。
 * 判断の基準を「車が動くかどうか」から「どこまで動かすか」に変えている
 * （元の基準は 2026/8/6 決定。pricing_unpan_houjin）。
 */

import { DEPART, DISASSEMBLE_FEE, STAIRS_FEE, TIER, distOf, plainTotal } from "@/lib/pricing";

/**
 * 室内での作業だけ（運ばない）の料金。
 *
 * 出動料5,000 ＋ 作業3,000。**距離料が発生しないため式に載らない。**
 * 家具の移動・模様替え・組み立て・設置など、お住まいの中だけで終わるもの。
 */
export const INDOOR_FEE = 8000;

/**
 * 法人スポット便の最低料金（富山市内・1時間まで）。
 *
 * 個人の式（出動料5,000 ＋ 作業7,000 ＝ 12,000）から、
 * **養生・設置・階段作業を外したぶん4,000円安い。**
 * 個人向けの日程係数（土日1.20・当日1.50）は法人には掛けない。
 */
export const SPOT_FEE = 8000;

/**
 * 法人スポット便の延長。1時間を超えたぶんを、SPOT_EXTEND_MIN 分ごとに。
 *
 * 2026-10-09 新設（cc_task/93 §1-1）。それまでは「超えたぶんはお見積り」で、金額が先に分からなかった。
 * ⚠ スポット便は**作業員1名だけ。**2人がかりの重い物はお受けしない（/houjin のお断りに書いてある）。
 */
export const SPOT_EXTEND_FEE = 1500;
/** 延長のきざみ（分）。端数は切り上げる（1時間15分は30分ぶん） */
export const SPOT_EXTEND_MIN = 30;
/** 最初の料金（SPOT_FEE）に入っている時間（分） */
const SPOT_BASE_MIN = 60;

/**
 * 法人スポット便の合計。**日程係数は掛けない**（当日も土日祝も同じ）。
 *
 * SPOT_FEE ＋ 1時間を超えたぶん（30分単位で切り上げ）× SPOT_EXTEND_FEE ＋ 距離料。
 * 距離料は個人と同じ距離表（lib/pricing.ts の DIST）。富山市内は 0。
 * 画面に金額を書かず、ここを通すこと。
 */
export function spotTotal(p: {
  /** 作業の時間（分） */
  minutes: number;
  /** 片道の距離（km） */
  km: number;
}): number {
  const dist = distOf(p.km);
  if (!dist) throw new Error(`スポット便：片道${p.km}kmは距離表の外です`);
  const over = Math.max(0, p.minutes - SPOT_BASE_MIN);
  return SPOT_FEE + Math.ceil(over / SPOT_EXTEND_MIN) * SPOT_EXTEND_FEE + dist.fee;
}

/**
 * 建物の中での移動（車を出さない）。1点につき。
 *
 * ⚠ この 4,000 と下の INSTALL_FEE 6,000 は、2026-09-24 の実績2件
 *   （ドラム式1点＝15,000円／3点＝26,000円、いずれもエレベーターあり・作業員2名）から
 *   逆算した値。ただし**未知数3つに対して式は2本しかなく、一意には決まらない。**
 *   「解体・組み立ては引越しと同じ DISASSEMBLE_FEE（3,000円）にする」という前提を
 *   置いたうえでの解である。同じベッドの解体組立が引越しと建物内で違う額になるのを
 *   避けるための選択で、データがこの値を証明しているわけではない。
 */
export const INBUILDING_MOVE_FEE = 4000;

/**
 * 取り外し・設置。1点につき。洗濯機（縦型・ドラム式）、据置型の食洗機。
 *
 * 縦型とドラム式を同額にしている。やることは給水・排水・アース・水平出しで同じで、
 * 違うのは重さだけ。重さは「大型は2名」（lib/pricing.ts の crewFor）で吸収済み。
 * ⚠ 冷蔵庫には付けない。置いて水平を見るだけで水栓をさわらないため、移動料だけ。
 * ⚠ ガス機器・エアコンは対象外（お断りしている）。
 */
export const INSTALL_FEE = 6000;

/**
 * 建物内作業の上限。軽バン満載・作業員2名・富山市内・平日と同額。
 *
 * ⚠ これが無いと、点数が増えたときに建物内作業のほうが引越しより高くなる
 *   （7点で 33,000円 ＞ 引越し 29,000円）。上限に当たったら
 *   「引越しとして承ったほうがお安くなります」と案内する。
 */
export const INBUILDING_CAP = plainTotal({
  tier: TIER[TIER.length - 1],
  crew: 2,
  km: 12,
  coefKey: "heijitsu",
});

/**
 * 建物内作業（車を出さない）の合計。**日程係数は掛けない。**
 * INDOOR_FEE が係数なしなので、車を出さない作業は定額、という形をそろえている。
 */
export function inBuildingTotal(p: {
  /** 動かす点数 */
  items: number;
  /** 階段のフロア数（エレベーターがあれば 0） */
  floors: number;
  /** 解体・組み立てをする点数 */
  disassembles: number;
  /** 取り外し・設置をする点数 */
  installs: number;
}): number {
  const raw =
    DEPART +
    p.items * INBUILDING_MOVE_FEE +
    p.floors * STAIRS_FEE +
    p.disassembles * DISASSEMBLE_FEE +
    p.installs * INSTALL_FEE;
  return Math.min(raw, INBUILDING_CAP);
}
