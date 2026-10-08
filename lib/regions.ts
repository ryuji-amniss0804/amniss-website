/**
 * トップの「料金の目安」で選ぶ地域と、地域どうしの片道の距離（km）。
 *
 * **ここに金額を書かないこと。**距離の料金は lib/pricing.ts の `distOf(km)` で引く。
 * km は地域の中心どうしで見た目安で、実際の道のりではない
 * （詳しい距離は /simulator で km を直接入れてもらう）。
 *
 * 【出どころ】cc_task/90_top_renewal.md §5
 *  - 富山市を含む9組 … 本人確認済み（2026-10-08）
 *  - 富山市を含まない36組 … 地域の位置から近似で出した値
 *  - 同じ地域どうしは片道10km（富山市内扱い）
 */

export const REGIONS = [
  // 舟橋村は富山市と同じ地域として扱う（10km・富山市内扱い）。2026-10-08 本人の決定
  { id: "toyama", name: "富山市・舟橋村" },
  { id: "imizu", name: "射水市" },
  { id: "namerikawa", name: "滑川市・上市町・立山町" },
  { id: "takaoka", name: "高岡市" },
  { id: "uozu", name: "魚津市" },
  { id: "tonami", name: "砺波市・小矢部市" },
  { id: "himi", name: "氷見市" },
  { id: "kurobe", name: "黒部市・入善町・朝日町" },
  { id: "nanto", name: "南砺市" },
  { id: "kanazawa", name: "金沢市" },
] as const;

export type RegionId = (typeof REGIONS)[number]["id"];

/** 表にない行き先。金額を出さず、/simulator へ送る */
export const OUTSIDE = { id: "kengai", name: "それ以外（県外）" } as const;

export type PlaceId = RegionId | typeof OUTSIDE.id;

/** セレクトに出す並び */
export const PLACES: readonly { id: PlaceId; name: string }[] = [...REGIONS, OUTSIDE];

/** 同じ地域どうしの片道 */
export const SAME_REGION_KM = 10;

/** A→B と B→A は同じ値なので、片方だけ書く */
const KM: [RegionId, RegionId, number][] = [
  // 富山市 ↔（本人確認済み）
  ["toyama", "imizu", 18],
  ["toyama", "namerikawa", 18],
  ["toyama", "takaoka", 25],
  ["toyama", "uozu", 30],
  ["toyama", "tonami", 35],
  ["toyama", "himi", 40],
  ["toyama", "kurobe", 40],
  ["toyama", "nanto", 45],
  ["toyama", "kanazawa", 60],
  // 富山市を含まない組み合わせ（近似）
  ["imizu", "namerikawa", 35],
  ["imizu", "takaoka", 10],
  ["imizu", "uozu", 45],
  ["imizu", "tonami", 25],
  ["imizu", "himi", 25],
  ["imizu", "kurobe", 60],
  ["imizu", "nanto", 40],
  ["imizu", "kanazawa", 45],
  ["namerikawa", "takaoka", 45],
  ["namerikawa", "uozu", 15],
  ["namerikawa", "tonami", 55],
  ["namerikawa", "himi", 55],
  ["namerikawa", "kurobe", 25],
  ["namerikawa", "nanto", 60],
  ["namerikawa", "kanazawa", 75],
  ["takaoka", "uozu", 55],
  ["takaoka", "tonami", 20],
  ["takaoka", "himi", 25],
  ["takaoka", "kurobe", 70],
  ["takaoka", "nanto", 35],
  ["takaoka", "kanazawa", 35],
  ["uozu", "tonami", 65],
  ["uozu", "himi", 65],
  ["uozu", "kurobe", 15],
  ["uozu", "nanto", 75],
  ["uozu", "kanazawa", 90],
  ["tonami", "himi", 40],
  ["tonami", "kurobe", 80],
  ["tonami", "nanto", 15],
  ["tonami", "kanazawa", 30],
  ["himi", "kurobe", 75],
  ["himi", "nanto", 55],
  ["himi", "kanazawa", 50],
  ["kurobe", "nanto", 90],
  ["kurobe", "kanazawa", 105],
  ["nanto", "kanazawa", 25],
];

const KM_BY_PAIR = new Map<string, number>();
for (const [a, b, km] of KM) {
  KM_BY_PAIR.set(`${a}|${b}`, km);
  KM_BY_PAIR.set(`${b}|${a}`, km);
}

// 地域を足して距離を書き忘れると、その組だけ金額が出なくなる。ビルドで止める
for (const a of REGIONS) {
  for (const b of REGIONS) {
    if (a.id !== b.id && !KM_BY_PAIR.has(`${a.id}|${b.id}`)) {
      throw new Error(`lib/regions.ts に ${a.name}↔${b.name} の距離がありません`);
    }
  }
}

function isRegion(id: string): id is RegionId {
  return REGIONS.some((r) => r.id === id);
}

/** 片道の距離（km）。どちらかが表にない行き先（県外）なら null */
export function kmBetween(a: string, b: string): number | null {
  if (!isRegion(a) || !isRegion(b)) return null;
  if (a === b) return SAME_REGION_KM;
  return KM_BY_PAIR.get(`${a}|${b}`) ?? null;
}
