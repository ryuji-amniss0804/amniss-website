/**
 * パソコン修理（/pc）の構造化データ（schema.org / JSON-LD）。
 *
 * 【なぜ `app/components/JsonLd.tsx` に足さないのか】
 * あちらは `(site)` 用の `MovingCompany`（引越し・買取）の宣言で、
 * Googleビジネスプロフィールとの照合に効いている。**修理業を混ぜると引越し側の意味まで壊れる。**
 * ルートグループが別なら名乗る業種も別、で分けている。`@id` も `/#business` と
 * `/pc#business` で別物にしてある。
 *
 * ⚠ **画面に出ていないことを書かないこと。**構造化データは「目に見える内容の機械可読版」で、
 *   食い違うと無視されるか、最悪は手動対策の対象になる。ここに書いてよいのは、
 *   /pc 配下のどこかに人の目で読める形で出ているものだけ。
 *
 * 【意図的に書いていないもの — 足したくなったら、まずここを読むこと】
 * - `priceRange` … うちの料金は「出張診断＋作業工賃＋出張費＋**部品代**」で、部品代に上限がない。
 *   `¥3,000〜¥20,000` と書くと**部品代を含んだ総額の上限として読まれる。**
 *   料金は `/pc/price` に人が読める形で全部出ている。**そちらが正。**
 * - `hasOfferCatalog` / `Offer.price` … 上と同じ理由。`lib/pc.ts` の `LABOR` `MENU` から
 *   機械的に出せてしまうが、部品代を含まない金額が「総額」として一人歩きする。
 * - `Review` `AggregateRating` `ratingValue` … **自社サイトに自社の評価を書く形は
 *   Googleが明確に非推奨としている。**星が出るどころか構造化データ全体が無視されうる。
 *   評価の出どころはGoogleビジネスプロフィールで、そちらに本物がある。
 *   事例ページ（`CASES[].voice`）のクチコミは**人が読むための引用のまま**にする。
 * - `FAQPage` … /pc 配下にQ&Aの節が無い。**節を作るまで書かない。**
 * - `BreadcrumbList` … パンくずを画面に出していない。**UIを作るまで書かない。**
 * - `sameAs` の LINE … `PC_LINE_URL` は友だち追加リンクであって公式プロフィールのURLではない。
 *
 * 値は `lib/site.ts` `lib/pc.ts` から引く。直書きすると、料金や受付時間を変えたときに
 * ここだけ古い数字が残る（84aで受付時間を1か所にまとめたのと同じ理由）。
 */

import { PC_META } from "@/lib/pc";
import { AREA, COMPANY, HOURS_CLOSE, HOURS_OPEN, TEL } from "@/lib/site";

/** 基準URL。`robots.ts` `sitemap.ts` と同じ流儀で、モジュールごとに持つ */
const SITE_URL = "https://revive-toyama.jp";
const PC_URL = `${SITE_URL}/pc`;

/**
 * 所在地と対応エリア。
 * `lib/site.ts` に県名だけの export が無いのでここに持つ（`AREA` は表示用の「富山県全域」、
 * `COMPANY.address` は「富山県富山市」の1文字列で、どちらもこの形では使えない）。
 * ⚠ 番地は書かない。**サイトに出していない。**出すならまず画面に出すこと。
 */
const REGION = "富山県";
const LOCALITY = "富山市";

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${PC_URL}#business`,
  name: "re'vive_doc",
  alternateName: ["re'vive_doc 富山", "リバイブドック"],
  description: PC_META.topOg,
  url: PC_URL,
  telephone: TEL,
  image: `${SITE_URL}/pc/report-1.jpg`,
  currenciesAccepted: "JPY",
  address: {
    "@type": "PostalAddress",
    addressCountry: "JP",
    addressRegion: REGION,
    addressLocality: LOCALITY,
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: REGION,
  },
  parentOrganization: {
    "@type": "Organization",
    name: COMPANY.legal,
    url: SITE_URL,
  },
  // 電話に出られる時間。フォームは24時間受けられるが、それは別のこと（混ぜて書かない）
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
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PC_URL}#service`,
  name: "パソコンの修理・出張診断",
  serviceType: "パソコン修理",
  description: PC_META.topOg,
  url: PC_URL,
  provider: { "@id": `${PC_URL}#business` },
  areaServed: {
    "@type": "AdministrativeArea",
    name: REGION,
    description: AREA,
  },
};

/** JSON の中の `<` は `\u003c` に逃がす（Next.js の JSON-LD ガイドの指示） */
function ld(data: object): string {
  return JSON.stringify(data).replace(/</g, "\u003c");
}

export default function PcJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(serviceJsonLd) }}
      />
    </>
  );
}
