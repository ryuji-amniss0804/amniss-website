/**
 * サイトで使う画像の一元管理。
 *
 * ここに定義していない画像をコンポーネントに直書きしないこと。
 * next/image の width / height はレイアウトシフトを止めるために必須なので、
 * 実ファイルの実寸を入れてある（差し替えたら必ず更新すること）。
 *
 * treatment は「見た目の趣味」ではなく「散らかった背景を消すための道具」。
 *  - "plain" … 何もしない。背景が既に整理されている写真（PC内部など）。
 *              暗くすると SSD やマザーボードの情報が潰れる
 *  - "muted" … 彩度と明度を少しだけ落とす。青空・駐車場の白線の主張を消す。
 *              単体で見せる写真はこれ。文字は乗らない
 *  - "dark"  … 強く落として濃紺を重ねる。上に白い文字を乗せて初めて成立する数字なので、
 *              文字が乗る場所でだけ使う。
 *              単体で当てると「露出に失敗した写真」になる。
 *              Photo 側で、dark には必ず可読性のオーバーレイが入る
 *              **この値を使っている画像は1枚もない。**
 *              17_hero でトップのヒーローからも文字を外したので、
 *              **写真の上に文字が乗る場所はサイト内に1つも無い。**
 *              定義と CSS は、そういう場所がまた出てきたときのために残してある
 *
 * 元ファイルは D:\re'vive_toyama_marketing\images\ にある。
 * public/images へは ASCII 名にリネームして取り込んでいる（対応は originalName）。
 */

export type ImageTreatment = "plain" | "muted" | "dark";

export type SiteImage = {
  /** public/ からのパス。エンコードが必要なものは定義済みの状態で入れる */
  src: string;
  alt: string;
  width: number;
  height: number;
  treatment: ImageTreatment;
  /**
   * object-fit で切り取るときの位置。既定（中央）でよければ書かない。
   *
   * treatment と同じで、**切り取り位置は写真ごとの性質**なので、
   * 使う側（Hero や本文）ではなくここに持たせる。
   * 置き場所を Photo 側にすると、1枚のために全ページの見え方が動く。
   */
  objectPosition?: string;
  /** 取り込み元のファイル名（リネームしたものだけ） */
  originalName?: string;
};

export const images = {
  // ─── ブランド ───
  logo: {
    src: "/images/amniss-logo.png",
    alt: "AmNiss & Co. Japan ロゴ",
    width: 1000,
    height: 1000,
    treatment: "plain",
  },

  // ─── トップのヒーロー（画面幅いっぱい・写真の下に濃紺パネル） ───
  /*
   * 呉羽山からの立山連峰と富山市街。**軽バン・立山連峰・市街地の3つが
   * 写っていることに意味がある写真。**（image_decision.md の枠A＝証拠）
   *
   * treatment は "plain"。**filter は当てない。オーバーレイも無い。**
   * 17_hero で写真の上から文字を外したので、減光する理由がそもそも無くなった。
   * treatment: "dark" を当ててはいけない。
   *
   * objectPosition の縦75%について。
   * デスクトップでは1画面に収めるため、枠の高さを 21:9 より詰める（site.css）。
   * cover なので**切れるのは上下だけ**だが、中央（既定の50%）で切ると
   * 下の軽バンの足元が先に落ちる。画（3000×1286）の中身は縦位置で
   *   0.17 銅像の手 ／ 0.23 立山連峰の稜線 ／ 0.34-0.46 富山市街 ／ 0.28-0.95 軽バン
   * で、下側のほうが余白が無い。75%まで下げると、枠が下限（縦79%）まで
   * 詰まっても [0.148, 0.951] が残り、4つとも切れない。
   */
  heroTop: {
    src: "/images/hero-top.jpg",
    alt: "呉羽山から見た立山連峰と富山市街。手前に軽バン（スズキ・エブリイ）",
    width: 3000,
    height: 1286,
    treatment: "plain",
    objectPosition: "center 75%",
    originalName: "hero_top.jpg",
  },

  // ─── 精密機器（そのまま。背景が整理されているため暗くしない） ───
  pcDellSsd: {
    src: "/images/pc-dell-ssd.jpg",
    alt: "Dell製ノートパソコンを分解し、SSDを換装している様子",
    width: 2000,
    height: 2000,
    treatment: "plain",
    originalName: "seimitsu_Dell内部_SSD換装.jpg",
  },
  pcBlackCase: {
    src: "/images/pc-black-case.jpg",
    alt: "デスクトップPCの内部",
    width: 2000,
    height: 2000,
    treatment: "plain",
    originalName: "seimitsu_黒ケース内部.jpg",
  },
  pcAsus: {
    src: "/images/pc-asus.jpg",
    alt: "ASUS製パソコンの内部",
    width: 2000,
    height: 2000,
    treatment: "plain",
    originalName: "seimitsu_ASUS内部.jpg",
  },

  // ─── 旧デザインから使用中のもの ───
  // ファイル名に半角スペースと括弧が入っている。URL としてはエンコードが必要なので、
  // ここでエンコード済みの状態で持っておく（利用側で encodeURI しないこと）。
  daihyou: {
    src: "/images/face%20(2).jpg",
    alt: "代表 小川 竜司",
    width: 643,
    height: 730,
    treatment: "plain",
  },
  gallery1438: {
    src: "/images/IMG_1438.JPG",
    alt: "作業風景",
    width: 6000,
    height: 4000,
    treatment: "muted",
  },
  logisticsCar: {
    src: "/images/logistics-car.png",
    alt: "軽貨物運送のイメージ",
    width: 2816,
    height: 1536,
    treatment: "plain",
  },
  gadgetsClean: {
    src: "/images/gadgets-clean.png",
    alt: "買取対象のガジェット",
    width: 1080,
    height: 1080,
    treatment: "plain",
  },
} as const satisfies Record<string, SiteImage>;

export type SiteImageKey = keyof typeof images;

/**
 * 保管のみ。このサイトでは使わない。
 *
 * **public/images からファイルは消していない。**参照を外しただけ。
 * next/image は images に定義がある画像しかビルドしないので、
 * 参照が無ければ配信も最適化も走らない。復活させるときは
 * ここから images へ戻せば、ファイルを探し直さずに済む。
 *
 * 原本は D:\re'vive_toyama_marketing\images\。
 */
export const UNUSED_ARCHIVE = [
  // 一度も使っていないもの
  "seimitsu_自作PC_RGB_未使用.jpg",

  // ─── 14_top でサイトから外したもの ───
  // 実写の軽バン・養生・積込は**ブログへ移す。**サイト本体では図版に置き換えた。
  // van_外観02 は /moving のヒーローだったが、荷室の断面図（fig_cargo.svg）に差し替え。
  // これでナンバープレートの写り込みの件も一緒に消えている。
  "van_外観01.jpg", // public/images/van-exterior-01.jpg
  "van_外観02.jpg", // public/images/van-exterior-02.jpg
  "youjou_養生01.jpg", // public/images/youjou-01.jpg
  "sagyou_積込01.jpg（下端をクロップ済み）", // public/images/sagyou-loading-01.jpg
] as const;

/** ヒーローなど、幅いっぱいに敷く画像の sizes */
export const SIZES_FULL = "100vw";
/** 本文カラム（最大 1060px）に収まる画像の sizes */
export const SIZES_CONTENT = "(max-width: 1060px) 100vw, 1060px";
/** Split の本文列（840px以下は全幅、それ以上は約664px）に置く画像の sizes */
export const SIZES_BODY = "(max-width: 840px) 100vw, 680px";
/** 2カラムに並ぶ画像の sizes */
export const SIZES_HALF = "(max-width: 840px) 100vw, 530px";
