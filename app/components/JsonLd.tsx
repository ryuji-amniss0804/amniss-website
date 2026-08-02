/**
 * 構造化データ（schema.org / JSON-LD）
 *
 * Googleビジネスプロフィールとの照合に使われる。
 * ここに書く 名称・住所・電話（NAP）は、
 * GBP と Footer.tsx と一字一句そろえること。ずれると裏取りに失敗する。
 */

export const SITE_URL = "https://amniss-japan.jp";
export const BIZ_NAME = "re'vive 富山";
export const BIZ_TEL = "+81-70-8450-0897";

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "@id": `${SITE_URL}/#business`,
  name: BIZ_NAME,
  alternateName: [
    "re'vive（リバイブ）富山",
    "リバイブ富山",
    "re'vive by AmNiss&Co.Japan",
  ],
  legalName: "AmNiss&Co. Japan",
  description:
    "富山県全域の単身引越し・出張買取・軽貨物運送。軽バンでの単身引越しは15,000円から。不用品はその場で買取査定し、引越し費用から差し引きます。古物商許可・貨物軽自動車運送事業届出済。",
  url: SITE_URL,
  telephone: BIZ_TEL,
  image: `${SITE_URL}/favicon.png`,
  priceRange: "¥8,000〜¥35,000",
  currenciesAccepted: "JPY",
  paymentAccepted: "現金",
  address: {
    "@type": "PostalAddress",
    addressCountry: "JP",
    addressRegion: "富山県",
    addressLocality: "富山市",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "富山県",
  },
  founder: {
    "@type": "Person",
    name: "小川 竜司",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
  ],
  sameAs: ["https://lin.ee/845Fdsy"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "サービスと料金",
    itemListElement: [
      {
        "@type": "Offer",
        name: "らくらく2時間パック",
        description: "軽バン1台＋作業員1名／2時間／富山県内",
        price: "15000",
        priceCurrency: "JPY",
      },
      {
        "@type": "Offer",
        name: "単身引越しパック（3時間）",
        description: "積込〜搬入・養生材・運送保険込み",
        price: "25000",
        priceCurrency: "JPY",
      },
      {
        "@type": "Offer",
        name: "単身引越しパック 大盛（4時間）",
        description: "2往復まで対応",
        price: "35000",
        priceCurrency: "JPY",
      },
      {
        "@type": "Offer",
        name: "家具・家電1点配送",
        description: "同一市内・階段なしの場合",
        price: "8000",
        priceCurrency: "JPY",
      },
      {
        "@type": "Offer",
        name: "不用品処分（軽トラ積み放題）",
        description: "リサイクルセンター持込。処分費は別途実費",
        price: "15000",
        priceCurrency: "JPY",
      },
      {
        "@type": "Offer",
        name: "法人スポット便",
        description: "当日・緊急便。時間チャーターは1時間6,000円",
        price: "8000",
        priceCurrency: "JPY",
      },
    ],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: BIZ_NAME,
  inLanguage: "ja",
  publisher: { "@id": `${SITE_URL}/#business` },
};

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </>
  );
}
