/**
 * サイト共通の定数。
 * 電話番号・許認可番号・免責の文言は表記ゆれを作らないこと。
 * とくに廃棄物の但し書き（WASTE_NOTICE）は法務確認済みの文言なので変更しない。
 */

export const TEL = "070-8450-0897";
export const TEL_HREF = `tel:${TEL.replace(/-/g, "")}`;
export const HOURS = "9:00 — 21:00　年中無休";
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
  { label: "お見積りシミュレーター", href: "/simulator" },
] as const;

export const FOOTER_COMPANY = [
  { label: "会社概要", href: "/company" },
  { label: "お役立ち情報", href: "/blog" },
  { label: "特定商取引法に基づく表記", href: "/tokushoho" },
  { label: "プライバシーポリシー", href: "/privacy" },
] as const;
