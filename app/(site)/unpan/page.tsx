import type { Metadata } from "next";
import Link from "next/link";
import Hero from "../_components/Hero";
import LicenseStrip from "../_components/LicenseStrip";
import Split from "../_components/Split";
import PriceTable from "../_components/PriceTable";
import Spec from "../_components/Spec";
import ItemList from "../_components/ItemList";
import Cta from "../_components/Cta";
import { INDOOR_FEE } from "../_fees";
import { TEL, TEL_HREF } from "@/lib/site";
import { CAP, TIER, plainTotal, yen } from "@/lib/pricing";

/**
 * 運搬・配送。
 *
 * このページが言いたいのは1つだけ。
 * **「車が動くかどうか」で料金の決まり方が変わる。**
 * 動かすなら引越しと同じ計算式、動かさない（室内作業だけ）なら 8,000円。
 * これが先に分かれば、8,000円と12,000円が同じページに並んでいても混乱しない。
 *
 * 【料金の出どころ】
 *  - 「運ぶ場合」の3行は **lib/pricing.ts** から算出している。手で書かない。
 *  - 計算式そのものは /moving に全部載っているので、ここでは繰り返さずリンクする。
 *  - 「運ばない場合」の 8,000円 だけは式から出ない。理由は _fees.ts の INDOOR_FEE。
 *    **同じ数字をトップのFAQも出すので、定義はこのファイルに戻さないこと。**
 *
 * 【ヒーローに画像を置かない】
 * image_decision.md の枠C（雰囲気）は画像を使わない。
 * **`/moving` の荷室断面図（fig_cargo）をここに流用しないこと。**
 * 同じ図が2ページに出ると、図が「そのページの証拠」ではなく飾りになる。
 *
 * 【本文に数字を埋め込まないこと】
 * `{CAP}m³を…` と書くと React が text node の境目に `<!-- -->` を入れるので、
 * 文字列はテンプレートリテラルで1本にしてから渡す。
 *
 * 「不用品回収」「不用品処分」「引き取り」「処分します」をサービスとして書かない。
 * 「格安」「業界最安」「絶対」「100%」「積み放題」、口コミ、他社比較も書かない。
 */

/* ============ lib/pricing.ts から引く数字 ============ */

/** 富山市内。/moving の検算表・トップと同じ 12km を代表値にしている */
const CITY_KM = 12;

/** 運ぶ場合（富山市内・平日・作業員1名・階段なし）。荷物の量だけが違う3行 */
const CARRY_CASES: { name: string; tier: number }[] = [
  { name: "冷蔵庫・洗濯機・テレビ・机など1〜3点", tier: 0 },
  { name: "ソファ（2人掛け）・自転車1台", tier: 1 },
  { name: "軽バン満載くらいの量", tier: 2 },
];

const CARRY_ROWS = CARRY_CASES.map((c) => {
  const t = TIER[c.tier];
  return {
    name: c.name,
    desc: `${t.name}　〜${t.cap.toFixed(1)}m³`,
    price: yen(plainTotal({ tier: t, crew: 1, km: CITY_KM, coefKey: "heijitsu" })),
  };
});

/** 表のいちばん上の行。1点だけの運搬の下限を、料金の決まり方の表でも使う */
const CARRY_FROM = CARRY_ROWS[0].price;

/* ============ 積める量 ============ */

/**
 * 荷室の内寸（cm）。スズキ・エブリイ（ハイルーフ）のカタログ表記。
 * /moving の「積めるサイズ」と同じ数字。
 * 74% は書かずに CAP から出している（CAP を変えたらここも動く）。
 */
const CARGO = { w: 140, h: 142, d: 190 };
const CARGO_M3 = (CARGO.w * CARGO.h * CARGO.d) / 1_000_000;
const CARGO_PCT = Math.round((CAP / CARGO_M3) * 100);

export const metadata: Metadata = {
  title: `富山の家具・家電の運搬｜1点から ${CARRY_FROM}・室内の移動 ${yen(INDOOR_FEE)} ｜ re'vive 富山`,
  description: `富山県全域。冷蔵庫1台でも、部屋の中で家具を動かすだけでも伺います。運ぶ場合は引越しと同じ計算式で富山市内・平日 ${CARRY_FROM}から、運ばない室内作業（家具移動・模様替え・組み立て・設置）は${yen(INDOOR_FEE)}。金額は運ぶ前に確定します。貨物軽自動車運送事業 届出済。`,
  alternates: { canonical: "/unpan" },
  openGraph: {
    title: `富山の家具・家電の運搬｜1点から ${CARRY_FROM}・室内の移動 ${yen(INDOOR_FEE)} ｜ re'vive 富山`,
    description: `富山県全域。冷蔵庫1台でも、部屋の中で家具を動かすだけでも伺います。運ぶ場合は引越しと同じ計算式で富山市内・平日 ${CARRY_FROM}から、運ばない室内作業（家具移動・模様替え・組み立て・設置）は${yen(INDOOR_FEE)}。金額は運ぶ前に確定します。貨物軽自動車運送事業 届出済。`,
    url: "https://amniss-japan.jp/unpan",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

/** ① 料金の決まり方。この2行がこのページの主題 */
const HOW_ROWS = [
  {
    name: "運ぶ",
    desc: "1点配送・お部屋からの搬出・自転車など、車を出して動かすもの",
    price: "引越しと同じ計算式",
  },
  {
    name: "運ばない",
    desc: "室内での家具移動・模様替え・家具の組み立て・設置だけ",
    price: yen(INDOOR_FEE),
  },
];

/** お受けできないこと。許可の話なので、理由まで書く */
const CANNOT = [
  { name: "廃棄物の運搬、処分場への持込", note: "一般廃棄物収集運搬業の許可がないため" },
];

export default function UnpanPage() {
  return (
    <>
      {/* ① ヒーロー。**画像を置かない。**
          見出しはお客さんの言葉。リードでこちらが答える、という組み立て。
          リードは JSX で折らずに文字列1本で渡す（行末で折ると半角スペースが1つ入る） */}
      <Hero
        size="md"
        kicker="運 搬 ・ 配 送 ／ 富 山 県 全 域"
        title="1点だけなんですけど、いいですか。"
        lead="冷蔵庫1台でも、部屋の中で家具を動かすだけでも伺います。金額は、運ぶ前に確定します。"
        actions={
          <>
            <Link className="btn btn-fill" href="/contact">
              写真を送って見積りを依頼
            </Link>
            <a className="btn" href={TEL_HREF}>
              {TEL}
            </a>
          </>
        }
      />

      {/* ② 許認可 */}
      <LicenseStrip />

      {/* ③ 料金。決まり方 → 運ぶ場合 → 運ばない場合 の順。
          この順番でないと、8,000円と12,000円が並んでいる理由が分からない */}
      <Split kicker="料 金" title="「運ぶ」か「運ばない」かで分かれます" first>
        <PriceTable head={["ご依頼の内容", "料金の決まり方"]} rows={HOW_ROWS} />

        {/* 運ぶ場合。金額は lib/pricing.ts から算出している。ここに書かない */}
        <div className="pt">
          <PriceTable
            head={["運ぶ場合（富山市内・平日・作業員1名・階段なし）", "お支払額"]}
            rows={CARRY_ROWS}
            note={
              <>
                市外・土日祝・当日・階段には加算があります。計算式は
                <Link className="tl" href="/moving">
                  単身引越し
                </Link>
                に全部載せています。ご自身の条件での金額は
                <Link className="tl" href="/simulator">
                  お見積りシミュレーター
                </Link>
                で出せます。
              </>
            }
          />
        </div>

        {/* 運ばない場合。車を出さないので距離料が発生しない＝式に載らない金額 */}
        <Spec
          label="運 ば な い 場 合"
          value={`室内での家具移動・模様替え・家具の組み立て・設置だけ　${yen(INDOOR_FEE)}`}
          small
        >
          {"お住まいの中だけで完結する作業です。車を出さないぶん、距離の加算がありません。大型家具の位置替え、レイアウト変更、通販で届いた家具の組み立て、洗濯機や冷蔵庫の設置だけ、といったご依頼が入ります。"}
        </Spec>
      </Split>

      {/* ④ 積める量。**断面図は使わない**（/moving のものを流用しない）。
          寸法と実効値だけを文字で出す */}
      <Split kicker="積 め る 量" title="軽バン1台ぶんが上限です" tint>
        <Spec
          label="積 め る サ イ ズ"
          value={`幅${CARGO.w}cm × 高さ${CARGO.h}cm × 奥行${CARGO.d}cm ＝ ${CARGO_M3.toFixed(2)}m³ ／ 最大積載350kg`}
        >
          {`隙間ができるぶんを引いて、実際に積める量は ${CAP.toFixed(1)}m³（荷室の${CARGO_PCT}%）を目安にしています。これを超える場合は、往復プランにするか、荷物を減らすご相談になります。冷蔵庫は高さ${CARGO.h}cmまで、洗濯機は縦型・ドラム式とも積めます。`}
        </Spec>
        <p className="pnote">
          品目を選ぶと、積めるかどうかと金額がその場で出ます →{" "}
          <Link className="tl" href="/simulator">
            お見積りシミュレーター
          </Link>
        </p>
      </Split>

      {/* ⑤ お受けできないこと。許可がないことを先に書く */}
      <Split kicker="お 断 り" title="お受けできないこと">
        <ItemList items={CANNOT} deny />
      </Split>

      {/* ⑥ */}
      <Cta
        title="運ぶ物の写真を、1枚。"
        lead="運びたい物と、行き先を教えてください。金額は運ぶ前に確定します。室内で動かすだけのご依頼でも構いません。"
      />
    </>
  );
}
