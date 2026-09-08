/**
 * パソコン修理（/pc）の数字の出どころ。
 *
 * 【ここに置く理由】
 * 引越しの料金は `lib/pricing.ts` と `app/(site)/_fees.ts` にある計算式の出どころで、
 * 距離・積載・オプションを掛け合わせて金額を出す。パソコンの料金はその式に載らない。
 * 「本体を開けるかどうか」で3段に分かれるだけの、掛け算のない表なので、混ぜない。
 *
 * 【ページに金額を直接書かないこと】
 * 料金はトップ・料金ページ・お問い合わせの3か所に出る。
 * 数字を書き写すと、値上げのときに片方だけ直って静かにズレる。必ずここから import する。
 *
 * 電話番号・受付時間・エリアは引越しと共通なので `lib/site.ts` の TEL / HOURS / AREA を使う。
 * ここには持ってこない（同じ値を2か所に置かない）。
 */

/** 出張診断。作業を依頼された場合は作業工賃に充当する */
export const DIAGNOSIS_FEE = 3000;

/** 作業工賃。段の分かれ目は「本体を開けるかどうか」 */
export const LABOR = [
  {
    key: "light",
    name: "軽作業",
    price: 8000,
    rule: "開けずにできること",
    items: [
      "設定の見直し・初期設定",
      "ソフトの不具合、ウイルス対応",
      "周辺機器の接続と設定",
      "外側の清掃",
    ],
  },
  {
    key: "std",
    name: "標準作業",
    price: 14000,
    popular: true,
    rule: "開けて、中を触ること",
    items: [
      "分解清掃とグリスの塗り替え",
      "SSD・メモリの交換",
      "電源ユニットの交換",
      "OSの再インストールと復元",
    ],
  },
  {
    key: "heavy",
    name: "重作業",
    price: 20000,
    rule: "全部ばらす必要があること",
    items: [
      "ノートの分解が必要な修理",
      "液晶パネル・キーボード交換",
      "基板まわりの点検と対応",
      "複数箇所の同時対応",
    ],
  },
] as const;

/** 出張費。県内は最大 6,000円 */
export const TRAVEL = [
  { fee: 0, label: "富山市内", cities: ["富山市"] },
  { fee: 2000, label: "近郊", cities: ["射水市", "滑川市", "立山町", "上市町", "舟橋村"] },
  { fee: 4000, label: "県西・県東", cities: ["高岡市", "砺波市", "魚津市", "黒部市"] },
  { fee: 6000, label: "遠方", cities: ["氷見市", "小矢部市", "南砺市", "入善町", "朝日町"] },
] as const;

export const TRAVEL_MAX = 6000;

/**
 * パソコン専用のLINE公式アカウント。開設待ちのため未定。
 *
 * ⚠ `lib/site.ts` の `LINE_URL`（引越し・買取用）で代用しないこと。
 *   問い合わせをパソコンと引越しで分けるために、別アカウントを作る。
 * ⚠ `null` のあいだは **LINEのボタンを描画しない。**
 *   リンク先の無いボタンを置かない。URLが出たらこの1行を差し替えるだけで全ページに反映される。
 */
export const PC_LINE_URL: string | null = null;

/**
 * お知らせ・記事の置き場所。
 *
 * ⚠ **未決。**既存ブログ（`content/blog/`）にパソコンのカテゴリを足すか、
 *   `content/pc/` を別に作るかが決まっていない。決まるまではここが 404 になる。
 *   決まったらこの1行を差し替えるだけで、ヘッダー・フッター・トップの3か所に反映される。
 */
export const PC_JOURNAL_HREF = "/pc/blog";

/**
 * /pc のヘッダーとフッターのナビ。
 *
 * ⚠ `lib/site.ts` の `NAV` / `FOOTER_SERVICES` は引越し・買取の導線。**変更しない。**
 *   そちらにパソコンを混ぜず、こちらに別で持つ。
 *
 * 実ページは 77 以降で作るので、いまはリンク先が 404 になるものがある（想定どおり）。
 */
export const PC_NAV = [
  { label: "症状から探す", href: "/pc/symptom" },
  { label: "料金", href: "/pc/price" },
  { label: "修理事例", href: "/pc/case" },
  { label: "中古PC", href: "/pc/used" },
  { label: "お知らせ", href: PC_JOURNAL_HREF },
] as const;

/** 金額の表記。3桁区切りだけを付ける（「円」は出す側が書く） */
export function yen(n: number): string {
  return n.toLocaleString("ja-JP");
}

/**
 * 個別メニュー。工賃の3段（LABOR）に当てはまらないもの。
 *
 * ⚠ `price` が null のものは「要見積り」と表示する。**金額を勝手に決めないこと。**
 *   データ移行は容量別の金額が未決、BTOは構成次第で変わるため、どちらも見積り扱い。
 */
export const MENU = [
  { name: "新入生セットアップパック", note: "初期設定・セキュリティ・保護者設定まで", price: 12000 },
  { name: "データ移行・取り出し", note: "容量に応じて", price: null },
  { name: "データ消去（証明書つき）", note: "買取と同時なら無料", price: 5000 },
  { name: "リモートサポート", note: "30分", price: 5000 },
  { name: "BTO・組み立て代行", note: "構成のご相談は無料", price: null },
] as const satisfies ReadonlyArray<{
  name: string;
  note: string;
  price: number | null;
}>;

/**
 * お支払い方法。
 *
 * ⚠ カードとQRは**まだ開通していない。**`ready: false` のものは「準備中」と表示し、
 *   使えるかのように書かないこと。開通したらこの1行を true にするだけで直る。
 */
export const PAYMENTS = [
  { name: "現金", ready: true },
  { name: "銀行振込", ready: true },
  { name: "クレジットカード", ready: false },
  { name: "QRコード決済", ready: false },
] as const satisfies ReadonlyArray<{ name: string; ready: boolean }>;
