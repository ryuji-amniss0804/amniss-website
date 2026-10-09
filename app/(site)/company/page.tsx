import { Fragment } from "react";
import Image from "next/image";
import PageHero from "../_components/PageHero";
import LastCta from "../_components/LastCta";
import { images } from "@/lib/images";
import { COMPANY, HOURS_RANGE, LICENSES, LINE_URL, TEL } from "@/lib/site";

/**
 * 会社概要。
 *
 * 【21_corporate で (corporate) から (site) へ移した】
 * 移したのはレイアウトだけ。**文言は1字も変えていない。**
 * 許認可番号・電話・住所は法務まわりの表示なので、ここで書き換えないこと
 * （番号は `lib/site.ts` の LICENSES にもあるが、**この表の文言のほうが先にあった**もの。
 *  21では突き合わせだけにして、統合はしていない。まとめるなら別便で）。
 *
 * 代表の写真は `lib/images.ts` の daihyou。
 *
 * 【75 で代表のリード文を差し替えた】
 * 元は物販の年数と海外向けの売り先を並べ、そこを根拠に高値を言い切っていた。
 * **売り先を買取の根拠にしない。買取額を約束しない。**
 * 根拠は ①古物商許可 ②精密機器の分解・修理の経験 の2つだけ。値がつくかは
 * 「現物を見て正直にお伝えします」と書く（2026/8/19 決定）。
 * 古物商許可は下の事業概要の表に番号で載るので、リード文では繰り返さない。
 * 旧文言をこのコメントに書き写さないこと。次に全文検索したとき誤ってヒットする。
 *
 * 【93_other_pages】トップと同じトーンに作り直した。見た目の正は参考モック
 * （top_mock_20261008/Others.dc.html の1つ目）。
 *  - 代表の文章を3行に差し替えた（cc_task/93 §1-2。前の4行目が2名での作業と食い違っていたため）。
 *    **文言は指示のとおり。ここで言い換えないこと。**
 *  - 写真は角丸・下に黄色の影。21 で外した装飾を、新しいトーンに合わせて戻した形。
 *  - **表の中身（TABLE_ROWS）は変えていない。**電話番号と古物商許可の番号だけ、
 *    同じ文字列を `lib/site.ts` から引くようにした（出る文字は同じ）。
 */

/** 古物商許可の番号は lib/site.ts の LICENSES から引く。書き写さない */
const KOBUTSU = (() => {
  const l = LICENSES.find((x) => x.label === "古物商許可");
  if (!l) throw new Error('許認可 "古物商許可" が lib/site.ts の LICENSES にありません');
  return l;
})();

/** 代表の名前のローマ字。名刺と同じ並び（名・姓） */
const REP_LATIN = "RYUJI OGAWA";

/** 代表の文章。1行が1文（cc_task/93 §1-2） */
const REP_MESSAGE = [
  "軽貨物の運送と、カメラ・パソコンの修理をしています。",
  "動かない物も、値がつくかどうかは現物を見て正直にお伝えします。",
  "お問い合わせから当日の作業まで、小川が担当します。",
];

export const metadata = {
  title: "会社概要 | re'vive 富山",
  description:
    "re'vive 富山（運営：AmNiss&Co. Japan）の会社概要。代表・小川竜司が直接対応。富山県富山市を拠点に県内全域の単身引越し・出張買取・軽貨物運送。古物商許可、貨物軽自動車運送事業届出済、富山県SDGs宣言企業。",
  alternates: { canonical: "/company" },
  // og:title は <title> と、og:description は description と同じにする。
  // 書かないとレイアウトのもの（トップの文）がそのまま継承される
  openGraph: {
    title: "会社概要 | re'vive 富山",
    description:
      "re'vive 富山（運営：AmNiss&Co. Japan）の会社概要。代表・小川竜司が直接対応。富山県富山市を拠点に県内全域の単身引越し・出張買取・軽貨物運送。古物商許可、貨物軽自動車運送事業届出済、富山県SDGs宣言企業。",
    url: "https://revive-toyama.jp/company",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

const TABLE_ROWS = [
  { label: "屋号", value: "re'vive 富山（リバイブ富山）" },
  { label: "運営事業者", value: "AmNiss&Co. Japan" },
  { label: "代表者", value: "小川 竜司" },
  { label: "所在地", value: "富山県富山市" },
  { label: "電話番号", value: `${TEL}（受付 ${HOURS_RANGE}）` },
  { label: "営業時間", value: `${HOURS_RANGE}（年中無休）` },
  { label: "対応エリア", value: "富山県全域（即日対応可）" },
  {
    label: "事業内容",
    value: (
      <>
        <span>
          単身引越し・軽貨物運送・出張買取・不用品の買取・遺品整理（仕分け／買取／形見分けの配送）
        </span>
        <span className="nt">
          ※ 一般廃棄物収集運搬業の許可がないため、廃棄物の回収・運搬・処分は行っておりません。
          処分が必要な場合は、許可のある業者をご案内します。
        </span>
      </>
    ),
  },
  {
    label: "古物商許可",
    value: KOBUTSU.value,
  },
  {
    label: "運送事業",
    value: "貨物軽自動車運送事業 届出済",
  },
  {
    label: "SDGs",
    value: "富山県SDGs宣言企業（2026年5月宣言）",
  },
];

export default function CompanyPage() {
  return (
    <div className="tp pp op">
      <PageHero kicker="COMPANY" title="会社概要" />

      <section className="op-sec">
        <div className="tw op-stack">
          {/* 代表。左に写真、右に名前と3行 */}
          <div className="op-rep">
            <div className="op-rep-ph">
              <Image
                src={images.daihyou.src}
                alt={images.daihyou.alt}
                width={images.daihyou.width}
                height={images.daihyou.height}
                sizes="240px"
              />
            </div>
            <div className="op-rep-t">
              <h2 className="op-rep-n">
                <b>{COMPANY.representative}</b>
                <span className="tp-num">{REP_LATIN}</span>
              </h2>
              <p className="op-rep-msg">
                {REP_MESSAGE.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </Fragment>
                ))}
              </p>
            </div>
          </div>

          {/* 事業概要。白い枠の表（ラベルは深緑）。中身は前のまま */}
          <dl className="op-dl">
            {TABLE_ROWS.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <a className="tp-btn tp-btn-n op-self-start" href={LINE_URL} target="_blank" rel="noopener noreferrer">
            LINEで相談する
          </a>
        </div>
      </section>

      {/* 最後の案内。文はトップと同じ（93a） */}
      <LastCta title="まずは、写真を1枚。" lead="運びたい物、売りたい物を撮って送ってください。型番が写っていれば、その場で概算をお伝えします。" />
    </div>
  );
}
