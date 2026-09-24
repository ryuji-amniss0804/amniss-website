/**
 * 構造化データ（schema.org / JSON-LD）
 *
 * Googleビジネスプロフィールとの照合に使われる。
 * ここに書く 名称・住所・電話（NAP）は、
 * GBP と Footer.tsx と一字一句そろえること。ずれると裏取りに失敗する。
 */

import { HOURS_CLOSE, HOURS_OPEN } from "@/lib/site";
import { TIER, fmt, plainTotal, yen } from "@/lib/pricing";

/**
 * 金額は lib/pricing.ts から出す。**ここに書き写さないこと。**
 * 大型がひとつでもあれば作業員2名なので、目安も2名で出す（crewFor と同じ考え方）。
 */
/** ワンルーム〜1K一式・富山市内・作業員2名・平日 */
const MOVING_FROM = plainTotal({ tier: TIER[2], crew: 2, km: 12, coefKey: "heijitsu" });
/** 家具・家電1〜2点（小口）・富山市内・作業員2名・平日 */
const CARRY_FROM = plainTotal({ tier: TIER[0], crew: 2, km: 12, coefKey: "heijitsu" });

export const SITE_URL = "https://revive-toyama.jp";
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
    `富山県全域の単身引越し・出張買取・軽貨物運送。軽バンでの単身引越しは${yen(MOVING_FROM)}から。不用品はその場で買取査定し、引越し費用から差し引きます。古物商許可・貨物軽自動車運送事業届出済。`,
  url: SITE_URL,
  telephone: BIZ_TEL,
  image: `${SITE_URL}/favicon.png`,
  priceRange: `¥${fmt(CARRY_FROM)}〜¥150,000`,
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
      opens: HOURS_OPEN,
      closes: HOURS_CLOSE,
    },
  ],
  sameAs: ["https://lin.ee/845Fdsy"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "サービスと料金",
    itemListElement: [
      {
        "@type": "Offer",
        name: "出張買取",
        description:
          "ご自宅・事業所まで伺って査定します。出張費・査定費は無料です",
      },
      {
        "@type": "Offer",
        name: "単身引越し",
        description: "富山市内・ワンルーム〜1K・平日の目安",
        price: String(MOVING_FROM),
        priceCurrency: "JPY",
      },
      {
        "@type": "Offer",
        name: "家具・家電の運搬",
        description: "富山市内・大型1〜2点・作業員2名・平日の目安",
        price: String(CARRY_FROM),
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
