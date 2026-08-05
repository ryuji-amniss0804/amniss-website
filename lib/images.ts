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
 *              ヒーローの背景のように文字が乗る場所でだけ使う。
 *              単体で当てると「露出に失敗した写真」になる。
 *              Photo 側で、dark には必ず可読性のオーバーレイが入る
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

  // ─── 軽バン・養生（単体で見せる。青空と白線の主張だけ落とす） ───
  vanExterior01: {
    src: "/images/van-exterior-01.jpg",
    alt: "スズキ・エブリイ（ハイルーフ）の外観",
    width: 1600,
    height: 1067,
    treatment: "muted",
    originalName: "van_外観01.jpg",
  },
  vanExterior02: {
    src: "/images/van-exterior-02.jpg",
    alt: "軽バンの外観",
    width: 1600,
    height: 1261,
    treatment: "muted",
    originalName: "van_外観02.jpg",
  },
  youjou01: {
    src: "/images/youjou-01.jpg",
    alt: "毛布と養生材で保護した荷物",
    width: 1600,
    height: 1511,
    treatment: "muted",
    originalName: "youjou_養生01.jpg",
  },

  // ─── ヒーローの背景用（上に文字が乗る前提） ───
  // 元は 1050x1400。下端にナンバープレートが写っていて、暗い画面の中で
  // 黄色が一番先に目に入るため、下 350px を切って 1050x1050 にしてある。
  // 未加工の原本は D:\re'vive_toyama_marketing\images\sagyou_積込01.jpg。
  sagyouLoading01: {
    src: "/images/sagyou-loading-01.jpg",
    alt: "軽バンの荷室。毛布と養生材で保護した家具を積み込んだ状態",
    width: 1050,
    height: 1050,
    treatment: "dark",
    originalName: "sagyou_積込01.jpg（下端をクロップ済み）",
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
 * D:\re'vive_toyama_marketing\images\seimitsu_自作PC_RGB_未使用.jpg
 * → 使わないものを public/ に置くと配信対象になるので、リポジトリには取り込んでいない。
 */
export const UNUSED_ARCHIVE = ["seimitsu_自作PC_RGB_未使用.jpg"] as const;

/** ヒーローなど、幅いっぱいに敷く画像の sizes */
export const SIZES_FULL = "100vw";
/** 本文カラム（最大 1060px）に収まる画像の sizes */
export const SIZES_CONTENT = "(max-width: 1060px) 100vw, 1060px";
/** Split の本文列（840px以下は全幅、それ以上は約664px）に置く画像の sizes */
export const SIZES_BODY = "(max-width: 840px) 100vw, 680px";
/** 2カラムに並ぶ画像の sizes */
export const SIZES_HALF = "(max-width: 840px) 100vw, 530px";
