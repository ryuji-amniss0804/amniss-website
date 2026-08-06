/**
 * 引越し料金の唯一の出どころ。
 *
 * /moving の表（荷物の量・距離・建物の条件・日程・代表品目）と、
 * /simulator の計算は、どちらもこのファイルから出る。
 * **ここを直せば両方が同時に変わる。片方だけ直せる状態を作らないこと。**
 *
 * 【出どころ】
 *  - D:\re'vive_toyama_marketing\price_simulator.html（本人承認済み・計算はこれが正）
 *  - D:\re'vive_toyama_marketing\moving_final.md（料金表）
 *
 * 品目（CAT）・注意文（ITEMWARN）・買取対象外（NOBUY）・段ボール除外（SKIP）は
 * price_simulator.html からそのまま移した。29品目、寸法の文字列も1字も変えていない。
 * 元は配列（タプル）だったが、TypeScript で添字アクセスが読めなくなるため、
 * 入れ物だけオブジェクトにしてある。**値は1つも変えていない。**
 *
 * 【丸め】合計は Math.floor(base * 係数 / 100) * 100（100円未満切り捨て）。
 * 元の price_simulator.html は Math.round だったが、moving_final.md とサイトの表記が
 * 「100円未満切り捨て」なので、原典（price_simulator.html）ごと Math.floor に直してある。
 */

/* ============ 定数 ============ */

/** 積める目安。荷室3.78m³ × 積み合わせ効率74% */
export const CAP = 2.8;
/** 出動料。全案件に共通 */
export const DEPART = 5000;
/** 家具の分解・組み立て。1点につき */
export const DISASSEMBLE_FEE = 3000;
/** 往復プランを提案できる上限。これを超える距離での往復は現実的でない */
export const ROUNDTRIP_MAX_KM = 75;
/** 階段。1フロアにつき */
export const STAIRS_FEE = 2000;
/** 時刻指定 */
export const SLOT_FEE = 2000;
/** 積み切れないときの往復プランで、作業料に掛ける割合 */
export const ROUNDTRIP_WORK_RATE = 0.7;

/* ============ 荷物の量（作業料） ============ */

export type Tier = {
  /** この容積までが該当する（m³） */
  cap: number;
  /** [作業員1名, 作業員2名] */
  work: [number, number];
  name: string;
};

export const TIER: Tier[] = [
  { cap: 0.9, work: [7000, 16000], name: "小口" },
  { cap: 1.9, work: [11000, 20000], name: "軽バン半分" },
  { cap: 2.8, work: [15000, 24000], name: "軽バン満載" },
];

/* ============ 距離（片道・高速代と燃料込み） ============ */

export type Dist = {
  /** この km までが該当する */
  km: number;
  fee: number;
  /** /moving の距離表に出す代表的な行き先 */
  area: string;
};

export const DIST: Dist[] = [
  { km: 15, fee: 0, area: "富山市内" },
  { km: 30, fee: 3000, area: "射水・滑川" },
  { km: 50, fee: 6000, area: "高岡・氷見・黒部・南砺" },
  { km: 75, fee: 12000, area: "金沢" },
  { km: 100, fee: 16000, area: "七尾・上越・飛騨高山" },
  { km: 150, fee: 28000, area: "長野・松本" },
  { km: 200, fee: 38000, area: "福井・新潟市" },
  { km: 250, fee: 48000, area: "名古屋・岐阜" },
  { km: 300, fee: 56000, area: "京都・彦根" },
];

/** 片道300kmを超える距離。日帰りができないので個別お見積り（1泊2日） */
export const LONG_HAUL = [
  { name: "大阪方面", place: "大阪・神戸", from: 120000 },
  { name: "東京方面", place: "東京・横浜", from: 150000 },
];

/* ============ 日程係数 ============ */

export type CoefKey = "omakase" | "heijitsu" | "d3" | "donichi" | "yoku" | "touji";

/** 係数と、明細に出す表示名 */
export const COEF: Record<CoefKey, { coef: number; label: string }> = {
  omakase: { coef: 0.85, label: "日程おまかせ（平日）" },
  heijitsu: { coef: 1.0, label: "平日・4日以上先" },
  d3: { coef: 1.15, label: "平日・3日以内" },
  donichi: { coef: 1.2, label: "土日祝" },
  yoku: { coef: 1.3, label: "翌日" },
  touji: { coef: 1.5, label: "当日" },
};

/** /simulator の選択肢。price_simulator.html の radio の文言そのまま */
export const COEF_OPTIONS: { key: CoefKey; label: string; note?: string }[] = [
  { key: "omakase", label: "日程おまかせ", note: "平日・当社が日を選ぶ" },
  { key: "heijitsu", label: "平日", note: "4日以上先" },
  { key: "d3", label: "平日・3日以内" },
  { key: "donichi", label: "土日祝" },
  { key: "yoku", label: "翌日" },
  { key: "touji", label: "当日", note: "空きを電話で確認します" },
];

/** /moving の日程表。係数は COEF から引く（数字をここに書かない） */
export const SCHEDULE_TABLE: { key: CoefKey; name: string; desc?: string }[] = [
  { key: "omakase", name: "日程おまかせ", desc: "平日のうち、当社が日を選びます" },
  { key: "heijitsu", name: "平日・4日以上先", desc: "基準になる日程です" },
  { key: "d3", name: "平日・3日以内" },
  { key: "donichi", name: "土日祝" },
  { key: "yoku", name: "翌日" },
  { key: "touji", name: "当日" },
];

/* ============ 品目 ============ */

export type Item = {
  id: string;
  name: string;
  /** 品目名の下に出す寸法など */
  size: string;
  m3: number;
  /** 分解・組み立てを選べる品目 */
  disassemble?: true;
  /** LINE に貼るテキストで使う短い名前。無ければ name を使う */
  short?: string;
};

export type ItemGroup = { id: string; name: string; items: Item[] };

export const CAT: ItemGroup[] = [
  {
    id: "kagu",
    name: "大 型 家 具",
    items: [
      { id: "mattress-s", name: "マットレス（シングル）", size: "97×195×20　最後に一番上へ載せます", m3: 0.4 },
      { id: "mattress-sd", name: "マットレス（セミダブル）", size: "120×195×20　荷室の3分の1を使います", m3: 0.9 },
      { id: "bedframe-s", name: "ベッドフレーム（シングル）", size: "分解後 97×195×15", m3: 0.3, disassemble: true },
      { id: "bedframe-sd", name: "ベッドフレーム（セミダブル）", size: "分解後 120×195×15", m3: 0.38, disassemble: true },
      { id: "sofa-2", name: "ソファ（2人掛け）", size: "150×85×82", m3: 1.05 },
      { id: "sofa-3", name: "ソファ（3人掛け）", size: "185×88×85", m3: 1.38 },
      { id: "tansu", name: "タンス・チェスト", size: "100×45×120", m3: 0.54, disassemble: true },
      { id: "shokki", name: "食器棚", size: "90×45×180", m3: 0.73, disassemble: true },
      { id: "hondana", name: "本棚", size: "90×30×180", m3: 0.49, disassemble: true },
      { id: "desk", name: "学習机・パソコンデスク", size: "100×60×70 ＋ 引き出し", m3: 0.5, disassemble: true },
      { id: "dining", name: "ダイニングテーブル", size: "120×75×70", m3: 0.63, disassemble: true },
      { id: "colorbox", name: "カラーボックス", size: "42×30×88", m3: 0.11 },
      { id: "isu", name: "椅子", size: "45×50×85", m3: 0.19 },
    ],
  },
  {
    id: "kaden",
    name: "家 電",
    items: [
      {
        id: "fridge",
        name: "冷蔵庫（2ドア・高さ142cmまで）",
        size: "48×60×140　400L以上の大型は積めません",
        m3: 0.4,
        short: "冷蔵庫（2ドア）",
      },
      { id: "washer-top", name: "洗濯機（縦型）", size: "57×60×100", m3: 0.34 },
      { id: "washer-drum", name: "洗濯機（ドラム式）", size: "60×65×105", m3: 0.41 },
      { id: "tv-42", name: "テレビ（〜42型）", size: "梱包 100×20×65", m3: 0.13 },
      { id: "tv-55", name: "テレビ（43〜55型）", size: "梱包 130×22×80", m3: 0.23 },
      { id: "renji", name: "電子レンジ・オーブン", size: "50×45×35", m3: 0.08 },
      { id: "souji", name: "掃除機・小型家電", size: "炊飯器、ケトルなど", m3: 0.06 },
    ],
  },
  {
    id: "sonota",
    name: "そ の 他",
    items: [
      { id: "futon", name: "布団一式", size: "袋入り 70×70×50", m3: 0.24 },
      { id: "ishou", name: "衣装ケース", size: "50×74×30", m3: 0.11 },
      {
        id: "bike",
        name: "自転車（26〜27インチ）",
        size: "190×60×105　駐輪場1台分。荷室の奥行をまるごと使います",
        m3: 1.2,
      },
      { id: "bike-kids", name: "子供用自転車（16〜24インチ）", size: "150×50×90", m3: 0.68 },
      { id: "sugata", name: "姿見・鏡", size: "55×12×165", m3: 0.11 },
      { id: "carpet", name: "カーペット・ラグ", size: "巻いた状態 35×35×190", m3: 0.23 },
      { id: "plant", name: "観葉植物", size: "鉢の大きさによります", m3: 0.15 },
    ],
  },
  {
    id: "danbo-ru",
    name: "段 ボ ー ル",
    items: [
      {
        id: "box-s",
        name: "小（3辺合計100cmくらい）",
        size: "33×35×32　みかん箱・スーパーの箱くらい",
        m3: 0.04,
        short: "段ボール 小",
      },
      {
        id: "box-l",
        name: "大（3辺合計120cmくらい）",
        size: "50×35×35　引越し業者が配る大サイズ",
        m3: 0.06,
        short: "段ボール 大",
      },
    ],
  },
];

/** CAT を平らにしたもの。表示・集計の順序はここが基準 */
export const ALL_ITEMS: Item[] = CAT.flatMap((g) => g.items);

const ITEM_BY_ID = new Map(ALL_ITEMS.map((it) => [it.id, it]));

export function itemOf(id: string): Item | undefined {
  return ITEM_BY_ID.get(id);
}

/**
 * /moving の代表品目の表に出す8品目。
 * 段ボールだけ、表では「段ボール 大／小」と呼んでいる（品目リストの中では
 * 「段 ボ ー ル」の見出しの下にあるので、名前に段ボールが要らない）。
 */
export const MOVING_ITEMS: { id: string; name?: string }[] = [
  { id: "mattress-s" },
  { id: "mattress-sd" },
  { id: "sofa-3" },
  { id: "fridge" },
  { id: "washer-top" },
  { id: "bike" },
  { id: "box-l", name: "段ボール 大" },
  { id: "box-s", name: "段ボール 小" },
];

/* ============ 品目ごとの注意（ラベル前方一致） ============ */

export const ITEMWARN: [string, string][] = [
  [
    "マットレス（シングル）",
    "マットレスは荷室（奥行190cm）より5cm長いので、最後に一番上へ載せます。下の荷物を潰さないよう、軽い物の上に置きます。",
  ],
  [
    "マットレス（セミダブル）",
    "セミダブル（幅120cm）は、荷室の幅140cmに対して斜めにしか入らず、荷室のおよそ3分の1を使います。1Kぶんのお荷物と一緒だと、多くの場合そのままでは積み切れません。往復にするか、ほかの物を減らすかのご相談になります。",
  ],
  [
    "ベッドフレーム",
    "ベッドフレームは分解した状態での容積です。ご自身で分解される場合は追加料金はかかりません。当社でやる場合は、品目のすぐ下にある「分解・組み立ても依頼する」にチェックしてください。",
  ],
  [
    "自転車（26〜27インチ）",
    "自転車は駐輪場1台分（幅60×奥行190cm）の場所を使います。荷室の奥行とほぼ同じなので、1台積むと長い物がもう入りません。前輪を外していただけると、その分ほかの荷物が積めます。",
  ],
];

/** 買取の対象外（中古で値がつかない・衛生面でお預かりできない） */
export const NOBUY = [
  "マットレス",
  "ベッドフレーム",
  "ソファ",
  "カラーボックス",
  "椅子",
  "布団",
  "衣装ケース",
  "姿見",
  "カーペット",
  "観葉植物",
  "小（3辺",
  "大（3辺",
];

/** 段ボールは買取の話に出さない */
export const SKIP = ["小（3辺", "大（3辺"];

/* ============ 表示 ============ */

/** 3桁区切り。toLocaleString は環境差が出るので使わない */
export function fmt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function yen(n: number): string {
  return `${fmt(n)}円`;
}

/* ============ 計算 ============ */

/** 品目 id → 個数 */
export type Counts = Record<string, number>;
/** 品目 id → 分解を依頼するか */
export type Disassembles = Record<string, boolean>;

export type Load = {
  /** 合計容積（m³・小数第2位まで） */
  m3: number;
  /** 点数の合計 */
  items: number;
  /** 積載率（%） */
  pct: number;
  over: boolean;
};

export function load(counts: Counts): Load {
  let m3 = 0;
  let items = 0;
  for (const it of ALL_ITEMS) {
    const n = counts[it.id] ?? 0;
    if (n > 0) {
      m3 += it.m3 * n;
      items += n;
    }
  }
  m3 = Math.round(m3 * 100) / 100;
  return { m3, items, pct: Math.round((m3 / CAP) * 100), over: m3 > CAP };
}

export function tierOf(m3: number): Tier | null {
  return TIER.find((t) => m3 <= t.cap) ?? null;
}

/** 片道300kmを超えると null（＝日帰りができない） */
export function distOf(km: number): Dist | null {
  return DIST.find((d) => km <= d.km) ?? null;
}

/** 選ばれている品目を CAT の並び順で返す */
export function pickedItems(counts: Counts): { item: Item; n: number }[] {
  return ALL_ITEMS.filter((it) => (counts[it.id] ?? 0) > 0).map((it) => ({
    item: it,
    n: counts[it.id],
  }));
}

export function itemWarnings(counts: Counts): string[] {
  const picked = pickedItems(counts);
  return ITEMWARN.filter(([prefix]) => picked.some((p) => p.item.name.startsWith(prefix))).map(
    ([, text]) => text,
  );
}

/** 買取の提案に出す品目。段ボールは出さない */
export function buyable(counts: Counts): { buy: string[]; no: string[] } {
  const buy: string[] = [];
  const no: string[] = [];
  for (const { item } of pickedItems(counts)) {
    if (SKIP.some((p) => item.name.startsWith(p))) continue;
    (NOBUY.some((p) => item.name.startsWith(p)) ? no : buy).push(item.name);
  }
  return { buy, no };
}

export type Row = { name: string; note?: string; amount: number };

export type Quote = {
  rows: Row[];
  /** 係数を掛ける前の合計 */
  base: number;
  coef: number;
  coefLabel: string;
  total: number;
};

export type QuoteInput = {
  tier: Tier;
  m3: number;
  crew: 1 | 2;
  km: number;
  dist: Dist;
  floors: number;
  slot: boolean;
  counts: Counts;
  disassembles: Disassembles;
  coefKey: CoefKey;
  /** 往復プランの加算など */
  extra?: Row[];
};

/**
 * 明細を組み立てて合計を出す。price_simulator.html の build() と同じ。
 * 丸めは Math.floor(base * 係数 / 100) * 100（100円未満は切り捨て）。
 */
export function buildQuote(p: QuoteInput): Quote {
  const rows: Row[] = [
    {
      name: "出動料",
      note: "軽バン1台・養生材・運送保険（上限500万円）・搬入後の設置",
      amount: DEPART,
    },
    {
      name: `${p.tier.name}（${p.m3.toFixed(2)}m³）／ 作業員${p.crew}名`,
      amount: p.tier.work[p.crew === 1 ? 0 : 1],
    },
    { name: `距離 片道${p.km}km`, note: "高速代・燃料込み", amount: p.dist.fee },
  ];

  if (p.floors > 0) {
    rows.push({
      name: `階段 ${p.floors}フロア`,
      note: `1フロアにつき${yen(STAIRS_FEE)}`,
      amount: p.floors * STAIRS_FEE,
    });
  }
  if (p.slot) rows.push({ name: "時刻指定", amount: SLOT_FEE });

  let dn = 0;
  const dnames: string[] = [];
  for (const { item, n } of pickedItems(p.counts)) {
    if (p.disassembles[item.id]) {
      dn += n;
      dnames.push(item.name);
    }
  }
  if (dn > 0) {
    rows.push({
      name: `分解・組み立て ${dn}点`,
      note: dnames.join("、"),
      amount: dn * DISASSEMBLE_FEE,
    });
  }

  for (const r of p.extra ?? []) rows.push(r);

  const base = rows.reduce((a, r) => a + r.amount, 0);
  const { coef, label } = COEF[p.coefKey];

  return { rows, base, coef, coefLabel: label, total: applyCoef(base, p.coefKey) };
}

/**
 * 係数を掛けて100円単位にする。price_simulator.html の
 * `Math.floor(base * c[0] / 100) * 100` と同じ。**100円未満は切り捨て。**
 * 丸め方を書いてよいのはここだけ。
 */
export function applyCoef(base: number, coefKey: CoefKey): number {
  return Math.floor((base * COEF[coefKey].coef) / 100) * 100;
}

/**
 * 階段・時刻指定・分解のない、いちばん単純な条件の合計。
 * /moving の「実際の金額」の8例で使う。
 */
export function plainTotal(p: { tier: Tier; crew: 1 | 2; km: number; coefKey: CoefKey }): number {
  const dist = distOf(p.km);
  if (!dist) throw new Error(`片道${p.km}km は距離表（〜${DIST[DIST.length - 1].km}km）の外です`);
  return applyCoef(DEPART + p.tier.work[p.crew === 1 ? 0 : 1] + dist.fee, p.coefKey);
}

/** 往復プランで加算する額（2回目の積み下ろしと走行ぶん） */
export function roundtripExtra(crew: 1 | 2, dist: Dist): number {
  const full = TIER[TIER.length - 1];
  const addWork = Math.floor((full.work[crew === 1 ? 0 : 1] * ROUNDTRIP_WORK_RATE) / 100) * 100;
  return addWork + dist.fee;
}
