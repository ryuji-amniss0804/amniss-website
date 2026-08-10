/**
 * お見積り依頼フォームの共有部分。
 *
 * **画面（/contact）とメール（/api/quote）は、同じ関数から同じ文字列を作る。**
 * 片方だけを直せる状態にすると、お客様が見た内容と竜司さんが見る内容がずれる。
 * とくに金額は /simulator が lib/pricing.ts で計算した文字列を**そのまま運ぶ**。
 * ここで計算し直さない（計算し直した瞬間にずれる余地ができる）。
 *
 * 日付は**必ず日本時間**で出す。Vercel の関数は UTC で動くので、
 * サーバーで素の Date を整形すると、9時間ずれた削除予定日がメールに載る。
 */

/* ============ 定数 ============ */

/** 写真の保管日数。/privacy の条文・メールの削除予定日・Cron の3つがこれを見る */
export const PHOTO_RETENTION_DAYS = 90;

/** 一度に送れる写真の枚数 */
export const MAX_PHOTOS = 5;

/** 写真1枚の上限（10MB） */
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/** Blob のパス。Cron の削除もこの prefix だけを見る */
export const PHOTO_PREFIX = "quote/";

/** ブラウザで縮小するときの長辺（px）。見積りに使う写真なのでこれで足りる */
export const SHRINK_LONG_EDGE = 2000;

/** /simulator → /contact の引き継ぎに使う sessionStorage のキー */
export const HANDOFF_KEY = "rv:quote-handoff";

/**
 * 「通行証」の有効期間（秒）。
 *
 * **サーバー（署名の期限）とブラウザ（取り直しの目安）が同じ数字を見る。**
 * 片方だけ直せる状態にすると、ブラウザが「まだ使える」と思っている通行証を
 * サーバーが切れたものとして弾く、という食い違いができる。
 *
 * 30分にしている理由は**写真のアップロードに耐えること**。
 * 5枚×10MB＝50MB を細い回線（300kbps 程度）で上げると 20分以上かかる。
 * ここを短くすると、上げている最中に通行証が切れる。
 * 逆に長くしても、お客様には見えない（切れたらブラウザが黙って取り直す）だけで、
 * 1回の認証で写真の口を叩ける時間が延びるので、伸ばす利点はない。
 */
export const PASS_TTL_SEC = 30 * 60;

/**
 * 通行証を前もって取り直す余裕（秒）。
 * 残りがこれを切っていたら、送信を始める前に取り直す。
 * **写真を上げている最中に切れないための幅**なので、上げる時間より長くとる。
 */
export const PASS_RENEW_MARGIN_SEC = 10 * 60;

/* ============ 引き継ぎ ============ */

/**
 * /simulator が sessionStorage に置き、/contact が読む。
 * **数字は文字列にして運ぶものと、数値のまま運ぶものがある。**
 * 金額（amount）だけは文字列。/simulator の画面に出ていた文字列そのものを入れる。
 */
export type QuoteHandoff = {
  /** 形が変わったときに古い引き継ぎを捨てるための版番号 */
  v: 1;
  /** 計算した日時（ISO） */
  at: string;
  items: { name: string; n: number }[];
  m3: number;
  pct: number;
  /** 積める区分の名前。軽バン1台に積み切れないときは null */
  tier: string | null;
  crew: 1 | 2;
  km: number;
  /** 距離の区分。片道300kmを超えて日帰りができないときは null */
  dist: { km: number; area: string } | null;
  floors: number;
  slot: boolean;
  /** 分解・組み立てを依頼する品目 */
  disassembles: string[];
  coefLabel: string;
  coef: number;
  /** 画面に出ていた金額の文字列。lib/pricing.ts が出した値そのまま */
  amount: string;
  /** 往復プラン（同じ日に2回に分けて運ぶ）の金額かどうか */
  roundtrip: boolean;
};

/* ============ 日付（日本時間） ============ */

function jstParts(d: Date): { y: number; m: number; d: number; hh: string; mm: string } {
  // en-CA は YYYY-MM-DD 固定なので、部品を取り出すのに都合がいい
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
    // 時刻は 0 埋めのまま（23:04 の 04 を 4 にしない）
    hh: get("hour") === "24" ? "00" : get("hour"),
    mm: get("minute"),
  };
}

/** 2026年11月8日 */
export function dateJa(d: Date): string {
  const p = jstParts(d);
  return `${p.y}年${p.m}月${p.d}日`;
}

/** 2026年11月8日 23:14 */
export function dateTimeJa(d: Date): string {
  const p = jstParts(d);
  return `${dateJa(d)} ${p.hh}:${p.mm}`;
}

/** 写真の削除予定日。メール本文と Cron が同じ PHOTO_RETENTION_DAYS を見る */
export function deleteOn(uploadedAt: Date): Date {
  return new Date(uploadedAt.getTime() + PHOTO_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

/* ============ 引き継ぎの整形 ============ */

export type HandoffLine = { label: string; value: string };

/**
 * 画面にもメールにも、**この関数が作った同じ行**を出す。
 * 金額は最後の1行に入れる（指示 24 §2 の並び）。
 */
export function handoffLines(h: QuoteHandoff): HandoffLine[] {
  const lines: HandoffLine[] = [];

  lines.push({
    label: "運ぶ物",
    value: h.items.map((i) => `${i.name} × ${i.n}`).join("　／　") || "（選択なし）",
  });

  lines.push({
    label: "積載",
    value: h.tier
      ? `${h.m3.toFixed(2)}m³　積載率 ${h.pct}%（${h.tier}）`
      : `${h.m3.toFixed(2)}m³　積載率 ${h.pct}%（軽バン1台に積み切れません）`,
  });

  lines.push({ label: "作業員", value: `${h.crew}名` });

  lines.push({
    label: "距離",
    value: h.dist
      ? `片道 ${h.km}km（${h.dist.area}・〜${h.dist.km}km の区分）`
      : `片道 ${h.km}km（距離表の外・1泊2日での個別お見積り）`,
  });

  const building: string[] = [];
  if (h.floors > 0) building.push(`階段 ${h.floors}フロア`);
  if (h.slot) building.push("時刻指定");
  lines.push({ label: "建物", value: building.join("　／　") || "階段なし・時刻指定なし" });

  if (h.disassembles.length) {
    lines.push({ label: "分解・組み立て", value: h.disassembles.join("　／　") });
  }

  lines.push({ label: "日程", value: `${h.coefLabel}（×${h.coef.toFixed(2)}）` });

  lines.push({
    label: h.roundtrip ? "お支払額（往復プラン）" : "お支払額",
    value: h.amount,
  });

  return lines;
}

/** 「（2026年8月7日 23:14 に計算）」。at が壊れていたら空文字 */
export function handoffCalcAt(h: QuoteHandoff): string {
  const d = new Date(h.at);
  return Number.isNaN(d.getTime()) ? "" : `${dateTimeJa(d)} に計算`;
}

/** メール本文に入れる形。画面と同じ行を、字下げして並べるだけ */
export function handoffText(h: QuoteHandoff): string {
  const at = handoffCalcAt(h);
  const head = at ? `■ お見積りの内容（${at}）` : "■ お見積りの内容";
  const body = handoffLines(h).map((l) => `　${l.label}　${l.value}`);
  if (h.roundtrip) {
    body.push("　※ 軽バン1台に積み切れないため、同じ日に2回に分けて運ぶ往復プランの金額です。");
  }
  return [head, ...body].join("\n");
}

/* ============ 受け取り側の検証 ============ */

const MAX_TEXT = 200;

function str(v: unknown, max = MAX_TEXT): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

function num(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

/**
 * ブラウザから戻ってきた引き継ぎを検証する。
 * **中身はお客様の手元を通ってくるので、そのままメールに載せない。**
 * 形が違えば null を返し、呼び出し側は引き継ぎなしとして扱う。
 */
export function parseHandoff(v: unknown): QuoteHandoff | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (o.v !== 1) return null;

  const items = Array.isArray(o.items)
    ? o.items.slice(0, 60).map((raw) => {
        const it = (raw ?? {}) as Record<string, unknown>;
        return { name: str(it.name, 60), n: Math.max(0, Math.min(99, Math.floor(num(it.n)))) };
      })
    : [];

  const dist =
    o.dist && typeof o.dist === "object"
      ? {
          km: Math.max(0, Math.min(9999, Math.floor(num((o.dist as Record<string, unknown>).km)))),
          area: str((o.dist as Record<string, unknown>).area, 60),
        }
      : null;

  return {
    v: 1,
    at: str(o.at, 40),
    items,
    m3: Math.max(0, Math.min(999, num(o.m3))),
    pct: Math.max(0, Math.min(9999, Math.floor(num(o.pct)))),
    tier: typeof o.tier === "string" ? str(o.tier, 40) : null,
    crew: o.crew === 2 ? 2 : 1,
    km: Math.max(0, Math.min(9999, Math.floor(num(o.km)))),
    dist,
    floors: Math.max(0, Math.min(99, Math.floor(num(o.floors)))),
    slot: o.slot === true,
    disassembles: Array.isArray(o.disassembles)
      ? o.disassembles.slice(0, 30).map((d) => str(d, 60))
      : [],
    coefLabel: str(o.coefLabel, 40),
    coef: Math.max(0, Math.min(9, num(o.coef))),
    amount: str(o.amount, 60),
    roundtrip: o.roundtrip === true,
  };
}
