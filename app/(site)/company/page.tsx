import Hero from "../_components/Hero";
import Photo from "../_components/Photo";
import Split from "../_components/Split";
import { images } from "@/lib/images";
import { LINE_URL } from "@/lib/site";

/**
 * 会社概要。
 *
 * 【21_corporate で (corporate) から (site) へ移した】
 * 移したのはレイアウトだけ。**文言は1字も変えていない。**
 * 許認可番号・電話・住所は法務まわりの表示なので、ここで書き換えないこと
 * （番号は `lib/site.ts` の LICENSES にもあるが、**この表の文言のほうが先にあった**もの。
 *  21では突き合わせだけにして、統合はしていない。まとめるなら別便で）。
 *
 * 代表の写真は `lib/images.ts` の daihyou。丸く切り抜いていたのをやめて素の矩形にした。
 * (site) は角丸・影を使わないデザインで、**丸は写真の切り取りではなく装飾**だから。
 *
 * 英語のラベル `Company Profile` `Representative` と `Ryuji Ogawa` は、
 * (site) の流儀（字間を開けた日本語）とは違うが**表示文言なので触っていない。**
 *
 * 【75 で代表のリード文を差し替えた】
 * 元は物販の年数と海外向けの売り先を並べ、そこを根拠に高値を言い切っていた。
 * **売り先を買取の根拠にしない。買取額を約束しない。**
 * 根拠は ①古物商許可 ②精密機器の分解・修理の経験 の2つだけ。値がつくかは
 * 「現物を見て正直にお伝えします」と書く（2026/8/19 決定）。
 * 古物商許可は下の事業概要の表に番号で載るので、リード文では繰り返さない。
 * 旧文言をこのコメントに書き写さないこと。次に全文検索したとき誤ってヒットする。
 *
 * <br> の位置は文節の切れ目に合わせてある。360px では .lead が 288px まで縮んで
 * 折り返しが増えるので、2文目を「動かないカメラやパソコンも、」で切っている。
 * ここを切らずに1行にすると、360px で「どうかは」の4文字だけが行に残る。
 */

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

const TEL = "070-8450-0897";

const TABLE_ROWS = [
  { label: "屋号", value: "re'vive 富山（リバイブ富山）" },
  { label: "運営事業者", value: "AmNiss&Co. Japan" },
  { label: "代表者", value: "小川 竜司" },
  { label: "所在地", value: "富山県富山市" },
  { label: "電話番号", value: `${TEL}（受付 9:00〜21:00）` },
  { label: "営業時間", value: "9:00〜21:00（年中無休）" },
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
    value: "富山県公安委員会 第501310007877号",
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
    <>
      <Hero size="md" kicker="会 社" title="会社概要" />

      {/* 代表。kicker / 見出し / その下の1行 が、そのまま
          Representative / 小川 竜司 / Ryuji Ogawa の並びになる */}
      <Split kicker="Representative" title="小川 竜司" note="Ryuji Ogawa" first>
        {/* 643×730 の縦位置の写真。本文列いっぱいに流すと主役を食うので幅で止める */}
        <div style={{ maxWidth: "220px", marginBottom: "26px" }}>
          <Photo image={images.daihyou} sizes="220px" />
        </div>
        <p className="lead" style={{ marginTop: 0 }}>
          軽貨物運送を本業に、精密機器の分解・修理を自分で行っています。<br />
          動かないカメラやパソコンも、<br />
          値がつくかどうかは現物を見て正直にお伝えします。<br />
          引越しから買取まで、すべて一人で責任を持って対応します。
        </p>
      </Split>

      <Split title="事業概要" tint>
        <dl className="dl">
          {TABLE_ROWS.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="go">
          <a
            className="btn btn-fill"
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            LINEで無料相談・お問い合わせ
          </a>
        </div>
      </Split>
    </>
  );
}
