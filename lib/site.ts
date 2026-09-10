/**
 * サイト共通の定数。
 * 電話番号・許認可番号・免責の文言は表記ゆれを作らないこと。
 * とくに廃棄物の但し書き（WASTE_NOTICE）は法務確認済みの文言なので変更しない。
 */

export const TEL = "070-8450-0897";
export const TEL_HREF = `tel:${TEL.replace(/-/g, "")}`;

/**
 * 電話の受付時間。**ここだけを直せば、サイト全体とJSON-LDが追随する。**
 *
 * ⚠ 2026-09-10 に 21:00 → 18:00 に短縮した。理由は、20:00〜21:30 は
 *   手が離せず電話に出られないため。書いてあるのに出ないほうが損が大きい。
 * ⚠ 電話番号は1本しかないので、パソコンだけ別の時間にはできない。
 * ⚠ フォームは24時間受けられる。**電話の時間と混ぜて書かないこと。**
 * ⚠ content/blog/ の記事2本にも受付時間が直書きされている（Markdownなので
 *   ここを直しても追随しない）。時間を変えるときは `git grep` で確認すること。
 */
const TEL_OPEN = "9:00";
const TEL_CLOSE = "18:00";

/** ヘッダー・フッターなどの表示用。全角スペースとダッシュはこの形を保つこと */
export const HOURS = `${TEL_OPEN} — ${TEL_CLOSE}　年中無休`;

/** 文中に書くとき用（「9:00〜18:00の間に、いただいたご連絡先へお返事します」など） */
export const HOURS_RANGE = `${TEL_OPEN}〜${TEL_CLOSE}`;

/** 文中に終わりの時刻だけを書くとき用（「18:00を過ぎている場合は」など） */
export const HOURS_CLOSE_TEXT = TEL_CLOSE;

/**
 * 構造化データ（JsonLd の opens / closes）用。
 * schema.org は hh:mm を期待するので、表示用（"9:00"）と違い**0埋めする。**
 */
export const HOURS_OPEN = TEL_OPEN.padStart(5, "0");
export const HOURS_CLOSE = TEL_CLOSE.padStart(5, "0");

export const LINE_URL = "https://lin.ee/845Fdsy";
export const AREA = "富山県全域";

export const COMPANY = {
  brand: "re'vive 富山",
  latin: "AMNISS & CO. JAPAN",
  legal: "AmNiss&Co. Japan",
  representative: "小川 竜司",
  address: "富山県富山市",
} as const;

/** 許認可の帯に出す項目 */
export const LICENSES = [
  { label: "貨物軽自動車運送事業", value: "届出済" },
  { label: "古物商許可", value: "富山県公安委員会 第501310007877号" },
  { label: "運送保険", value: "補償上限500万円" },
  { label: "富山県SDGs宣言企業", value: "" },
] as const;

/** フッター1行版 */
export const LICENSE_LINE =
  "古物商許可 富山県公安委員会 第501310007877号／貨物軽自動車運送事業 届出済／富山県SDGs宣言企業";

/** 一般廃棄物収集運搬業の許可がないことの明示。文言は変更しないこと */
export const WASTE_NOTICE =
  "当社は一般廃棄物収集運搬業の許可を受けていないため、廃棄物の有料回収は行っておりません。";

/** ヘッダーのナビ。実ページは段階3以降で作る */
export const NAV = [
  { label: "出張買取", href: "/kaitori" },
  { label: "単身引越し", href: "/moving" },
  { label: "運搬・配送", href: "/unpan" },
  { label: "法人のお客様", href: "/houjin" },
  { label: "よくある質問", href: "/#faq" },
] as const;

export const FOOTER_SERVICES = [
  { label: "出張買取", href: "/kaitori" },
  { label: "単身引越し", href: "/moving" },
  { label: "家具・家電の運搬", href: "/unpan" },
  { label: "法人のお客様", href: "/houjin" },
  // 【82】パソコン修理（/pc）。別ルートグループだが同じドメインなので普通のリンクでよい。
  { label: "パソコン修理", href: "/pc" },
  // 見積りの入口の2本。サービスのあとに並べる（指示 43 回答2）。
  // 「見積りフォーム」は Cta.tsx と /houjin で使っている文字列そのまま。
  // ヘッダーの「見積りを依頼」は行き先が /#cta なので、同じ文字にしない。
  { label: "見積りフォーム", href: "/contact" },
  { label: "お見積りシミュレーター", href: "/simulator" },
] as const;

// サービス列は7行、こちらは5行（43 で見積りフォーム、82 でパソコン修理を足した）。
// 減らすときは両方見ること
export const FOOTER_COMPANY = [
  { label: "会社概要", href: "/company" },
  { label: "よくある質問", href: "/#faq" },
  { label: "お役立ち情報", href: "/blog" },
  { label: "特定商取引法に基づく表記", href: "/tokushoho" },
  { label: "プライバシーポリシー", href: "/privacy" },
] as const;
