import { TRAVEL } from "@/lib/pc";

/**
 * 便利屋（/benriya）の金額。ページと相談フォームの両方がここを通る。
 *
 * 時間制の作業の出張費は、パソコン修理と同じ段（lib/pc.ts の `TRAVEL`）を使う。
 * **市町村の一覧と金額をここに書き写さないこと。**表と、フォームで市町村を選んだときの
 * 金額が、同じ1つの定数から出るようにしてある。
 */

/** 時間制の作業。税込・作業員1名・1時間あたり（最低1時間） */
export const HOURLY_FEE = 4000;

/** 定期訪問。月1回・60分まで・税込（富山市内） */
export const MONTHLY_FEE = 5000;

/** 出張費の表の行。1市だけの段はその市名、複数の段は「市・町・村」を落として並べる */
export const FEE_ROWS = TRAVEL.map((t) => ({
  fee: t.fee,
  name: t.cities.length === 1 ? t.cities[0] : t.cities.map((c) => c.replace(/[市町村]$/, "")).join("・"),
}));

/** フォームの市町村（15）。並びは TRAVEL の順 */
export const CITIES: { name: string; fee: number }[] = TRAVEL.flatMap((t) =>
  t.cities.map((name) => ({ name, fee: t.fee })),
);
