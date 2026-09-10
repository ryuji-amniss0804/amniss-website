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
 * ⚠ `ready: false` のものは**描画しないこと。**まだページが無いので404になる。
 *   押せるのに行き止まり、は中身の無いページより悪い。
 *   ページを作ったらここを true にする。ヘッダーとフッターの両方に同時に反映される。
 */
export const PC_NAV = [
  { label: "症状から探す", href: "/pc/symptom", ready: true },
  { label: "料金", href: "/pc/price", ready: true },
  { label: "修理事例", href: "/pc/case", ready: true },
  { label: "中古PC", href: "/pc/used", ready: false }, // 80で作る（在庫データ待ち）
  { label: "お知らせ", href: PC_JOURNAL_HREF, ready: false }, // 記事が出たら
] as const satisfies ReadonlyArray<{ label: string; href: string; ready: boolean }>;

/** 金額の表記。3桁区切りだけを付ける（「円」は出す側が書く） */
export function yen(n: number): string {
  return n.toLocaleString("ja-JP");
}

/**
 * 個別メニュー。工賃の3段（LABOR）に当てはまらないもの。
 *
 * ⚠ `price` が null のものは「要見積り」と表示する。**金額を勝手に決めないこと。**
 *   データ移行は容量別の金額が未決、BTOは構成次第で変わるため、どちらも見積り扱い。
 *
 * `key` は `priceOf()` から引くためのもの。症状ツール（/pc/symptom）が
 * 「新入生セットアップパック」の金額をキーで参照する。**表示には使わない**ので、
 * 足しても /pc/price の見た目は変わらない。
 */
export const MENU = [
  { key: "setup", name: "新入生セットアップパック", note: "初期設定・セキュリティ・保護者設定まで", price: 12000 },
  { key: "migrate", name: "データ移行・取り出し", note: "容量に応じて", price: null },
  { key: "erase", name: "データ消去（証明書つき）", note: "買取と同時なら無料", price: 5000 },
  { key: "remote", name: "リモートサポート", note: "30分", price: 5000 },
  { key: "bto", name: "BTO・組み立て代行", note: "構成のご相談は無料", price: null },
] as const satisfies ReadonlyArray<{
  key: string;
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

/**
 * metadata の description に金額を直書きしないための組み立て。
 *
 * 料金を変えたときに検索結果の文章だけ古い金額が残る事故を防ぐため、
 * **ページ側で「3,000円」などと書かず、必ずここを経由すること。**
 */
export const PC_META = {
  /** /pc。ルートグループの入り口なので、これが /pc の description になる */
  top: `富山県全域に伺う出張型のパソコン修理・診断。買い替える前にご相談ください。まず測って、直せるか直せないかを診断報告書でお出しします。出張診断${yen(DIAGNOSIS_FEE)}円、ご相談とお見積りは無料。`,

  /** /pc の OGP。金額を出さない短い版 */
  topOg: "富山県全域に伺う出張型のパソコン修理・診断。まず測って、直せるか直せないかを診断報告書でお出しします。",

  /** /pc/price */
  price: `出張診断${yen(DIAGNOSIS_FEE)}円＋作業工賃＋出張費＋部品代。作業工賃は本体を開けるかどうかで3段（${LABOR.map((l) => yen(l.price) + "円").join("／")}）。出張費は富山県内どこでも${yen(TRAVEL_MAX)}円が上限です。直せないときは診断料と出張費のみ。`,

  /** /pc/symptom */
  symptom: `症状を選ぶと、考えられる原因と費用の目安がその場で出ます。出張診断${yen(DIAGNOSIS_FEE)}円、ご相談とお見積りは無料。富山県全域に伺います。`,

  /** /pc/contact */
  contact:
    "ご相談とお見積りは無料です。写真を送っていただけると、伺う前におおよその見当がつきます。富山県全域に伺うパソコン修理・出張診断。",

  /** /pc/case */
  cases:
    "実際にお受けした修理を、診断報告書とあわせて公開しています。何を測って、何をして、いくらだったか。富山県全域に伺うパソコン修理・出張診断。",
} as const;

/* ============================================================
   症状の目安（/pc/symptom）
   手本：D:\revive_toyama_marketing\mockup_pc_doc_v4.html の「症状の目安（選択式）」

   ⚠ ここは**判定ではなく目安**。「直る／直らない」を断定する文章を書かないこと。
     確定するのは伺って測ったあと、という前提でひとまとまりになっている。
   ============================================================ */

/**
 * 症状の金額は「数字」ではなく「どの料金か」で持つ。
 * ここを通すことで、料金を変えたときに症状ツールの目安も一緒に直る。
 */
export type PriceKey = (typeof LABOR)[number]["key"] | (typeof MENU)[number]["key"];

export function priceOf(key: PriceKey): number | null {
  const l = LABOR.find((x) => x.key === key);
  if (l) return l.price;
  const m = MENU.find((x) => x.key === key);
  return m ? m.price : null;
}

/**
 * 症状の一覧。トップページの症状カードと /pc/symptom の選択肢を、ここ1か所から出す。
 *
 * ⚠ `lo` / `hi` に数字を直接書かないこと。必ず `PriceKey` で持ち、`priceOf()` で解決する。
 *   - `hi: null` … 上限を示さない（「14,000円〜」と出す）
 *   - `lo: null` … 見て測らないと出せない（「要見積り」と出す。金額を勝手に決めない）
 *
 * card / cardNote はトップページの症状カード用（78aで使う）。
 * t は「そのまま送れる文」の書き出し、c は考えられる原因、k は当日測るところ。
 */
export const SYMPTOMS = [
  { key: "power", icon: "pw", card: "電源が入らない", cardNote: "ボタンを押しても反応がない",
    t: "パソコンの電源が入りません。",
    lo: "std", hi: "heavy",
    n: "標準作業〜重作業。部品が必要な場合は別途お見積りします",
    c: "電源ユニットの劣化、起動ドライブの不良、マザーボードのボタン電池切れ。",
    k: "通電と各部の電圧、起動ドライブの健全性、ボタン電池の電圧を測ります。" },

  { key: "slow", icon: "slow", card: "起動しない・動作が遅い", cardNote: "ロゴから進まない／起動に何分もかかる",
    t: "パソコンの起動が遅く、動きが重いです。",
    lo: "std", hi: "std",
    n: "標準作業。SSDへ交換する場合は部品代が別途かかります",
    c: "ハードディスクの劣化、空き容量の不足、常駐ソフトの増えすぎ。",
    k: "ディスクの健全性と消耗度、起動にかかる時間、空き容量を測ります。" },

  { key: "display", icon: "disp", card: "画面が映らない", cardNote: "真っ暗・線が入る",
    t: "画面が映りません（線が入る・真っ暗）。",
    lo: "std", hi: null,
    n: "標準作業。液晶パネルやグラフィックボードの交換は別途お見積りします",
    c: "接続ケーブル、グラフィックボード、ノートの場合は液晶パネル。",
    k: "別のモニタでの表示、グラフィックボードの動作、内部の接続を確認します。" },

  { key: "heat", icon: "heat", card: "異音がする・熱くて落ちる", cardNote: "ファンの音、使ううちに電源が切れる",
    t: "ファンの音が大きく、本体が熱くなります。",
    lo: "std", hi: "std",
    n: "標準作業。内部清掃＋グリス塗り替え＋健康診断が含まれます",
    c: "内部のほこり、CPUグリスの劣化、ファンの寿命。",
    k: "負荷をかけたときの温度と回転数を測り、清掃の前後で比べます。" },

  { key: "game", icon: "game", card: "ゲーム中に落ちる", cardNote: "FPSが出ない・強制終了する",
    t: "ゲーム中に落ちます。FPSが出ません。",
    lo: "std", hi: "std",
    n: "標準作業。部品の交換が必要な場合は別途お見積りします",
    c: "熱による保護動作、電源ユニットの容量不足、グラフィックボードの劣化。",
    k: "負荷試験での温度と電圧、グラフィックボードの動作、電源の容量を確認します。" },

  { key: "device", icon: "wifi", card: "周辺機器がつながらない", cardNote: "Wi-Fi・プリンタなど",
    t: "Wi-Fi・プリンタなどの周辺機器がつながりません。",
    lo: "light", hi: "light",
    n: "軽作業。複数の機器をまとめて設定する場合もこの範囲です",
    c: "ルーター側の設定、ドライバ、機器が認識されていない。",
    k: "パソコン側とルーター側のどちらに原因があるかを切り分けます。" },

  { key: "virus", icon: "shield", card: "ウイルスの警告が消えない", cardNote: "画面に警告が出続ける",
    t: "ウイルスの警告が消えません。",
    lo: "std", hi: "std",
    n: "標準作業。偽の警告だった場合も同じ料金です",
    c: "偽の警告（広告）、ブラウザの設定を変えられている、実際のマルウェア。",
    k: "警告の出どころ、ブラウザとスタートアップの状態を確認します。" },

  { key: "setup", icon: "setup", card: "新しいパソコンの設定", cardNote: "初期設定・データ移行",
    t: "新しいパソコンの設定とデータ移行をお願いしたいです。",
    lo: "light", hi: "setup",
    n: "軽作業〜新入生セットアップパック。移行するデータの量によります",
    c: "初期設定、Wi-Fi、Office、プリンタ、前の機械からのデータ移行。",
    k: "移行するデータの量を確認してから、作業の順番をお伝えします。" },

  { key: "water", icon: "water", card: "水をこぼした", cardNote: "キーボードに飲み物",
    t: "水（飲み物）をこぼしました。",
    lo: null, hi: null,
    n: "内部の状態を見ないと金額が出せません。伺って測ってからお伝えします",
    c: "基板の腐食、キーボード、内部の部品。こぼした量と経過時間で大きく変わります。",
    k: "分解して内部の腐食を確認します。通電したままにせず、すぐご連絡ください。" },

  { key: "rescue", icon: "data", card: "データを取り出したい", cardNote: "壊れた機体から取り出す",
    t: "壊れたパソコンからデータを取り出したいです。",
    lo: null, hi: null,
    n: "ディスクの状態と容量によります。伺って測ってからお伝えします",
    c: "ディスクの物理的な故障、論理的な破損、OSが起動しないだけの場合もあります。",
    k: "まずディスクの健全性を測り、取り出せる見込みがあるかをお伝えします。" },
] as const satisfies ReadonlyArray<{
  key: string;
  icon: string;
  card: string;
  cardNote: string;
  t: string;
  lo: PriceKey | null;
  hi: PriceKey | null;
  n: string;
  c: string;
  k: string;
}>;

/** いつからか */
export const SYMPTOM_WHEN = ["昨日から急にです。", "ここ数週間で少しずつ悪くなりました。", "以前からずっとです。"] as const;

/** 使用年数。最後の1つは「わからない」で、選んでも文章には入れない */
export const SYMPTOM_AGE = [
  { label: "3年未満", text: "3年未満です。" },
  { label: "3〜6年", text: "3〜6年ほど使っています。" },
  { label: "7年以上", text: "7年以上使っています。", old: true },
  { label: "わからない", text: "" },
] as const;

/** 中のデータ */
export const SYMPTOM_DATA = [
  { label: "必要", text: "中のデータは必要です。", needed: true },
  { label: "どちらでもよい", text: "中のデータはどちらでも構いません。" },
  { label: "不要", text: "中のデータは不要です。" },
] as const;

/* ============================================================
   修理事例（/pc/case）
   ============================================================ */

/**
 * 修理事例。一覧に出す情報はここ、本文は各ページの TSX。
 *
 * 【なぜ markdown（`content/blog/`）に載せないか】
 * 事例がまだ1本しかなく、本文は表と写真が多い。`/pc/price` と同じ TSX で書けば
 * いまのPCサイトと見た目がそろう。**3〜5本たまった時点で markdown に移す。**
 * そのとき困らないよう、一覧に出す情報（題・日付・地域・要約・写真）はここに持たせ、
 * 本文だけを TSX に書いている。
 *
 * ⚠ **金額を持たせないこと。**事例の金額は当時の請求額で、いまの料金表とは別物。
 *   `LABOR` / `priceOf()` から引くと、料金改定のときに過去の記録まで書き換わる。
 * ⚠ `voice` は Google のクチコミ。**お客様が書いた文そのまま。**
 *    整えたり短くしたりしないこと。直した瞬間に「お客様の声」ではなくなる。
 *    抜いた箇所は「（中略）」で残す。名前は転記しない（本文も報告書画像も匿名化してある）。
 *    null のあいだは「お客様の声」の節ごと描画しないこと。
 *    空の引用枠を本番に出すと、作りかけに見える。
 * ⚠ 「準備中」のダミー事例をここに足さないこと。一覧は実在するものだけを出す。
 */
export const CASES = [
  {
    slug: "01-raiden",
    title: "落雷で起動しなくなった1台が、部品交換なしで戻った",
    date: "2026.09",
    area: "富山市",
    machine: "デスクトップ",
    summary:
      "電源を入れても反応しない。落雷のあとだったので基板の損傷を疑いましたが、測ってみるとコントローラの一時停止でした。",
    image: "/pc/case-cooler.jpg",
    imageAlt: "取り外したCPUクーラー",
    imageW: 760,
    imageH: 760,
    hasReport: true,
    voice:
      "落雷後パソコンが起動できなくなってしまい困っていたのですが、丁寧に診断していただき原因を特定して無事に復旧していただきました。（中略）診断結果も紙にまとめて渡してくださりどこに問題があったのか、どのような対応をしたのかが後から見返せるのもありがたかったです。（中略）料金についても事前に分かりやすく説明していただけました。明朗会計で良心的な業者さんだと思います。",
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  title: string;
  date: string;
  area: string;
  machine: string;
  summary: string;
  image: string;
  imageAlt: string;
  imageW: number;
  imageH: number;
  hasReport: boolean;
  voice: string | null;
}>;
