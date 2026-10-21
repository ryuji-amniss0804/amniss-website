import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_URL } from "@/app/components/JsonLd";
import { images, type SiteImage } from "@/lib/images";
import { COMPANY, LICENSES, TEL, TEL_HREF } from "@/lib/site";
import { TIER, plainTotal, yen as yenWithUnit } from "@/lib/pricing";
import { DIAGNOSIS_FEE, yen } from "@/lib/pc";
import BenriyaForm from "./BenriyaForm";
import { FEE_ROWS, HOURLY_FEE, MONTHLY_FEE } from "./_benriya";

/**
 * 便利屋（/benriya）。
 *
 * 文言・構成・配色の正はモックアップ（benriya_handoff/benriya_mockup.html）。
 * **言い回しを整えたり、足したり削ったりしないこと。**
 *
 * 配色はこのページの中だけ（site.css の `.bn` 配下）。サイト全体の色は変えていない。
 * ヘッダー・フッターはサイト共通のもの。モックアップのヘッダー・フッターは見た目の参考なので使っていない。
 *
 * 金額は書き写さない：時間制・定期訪問・出張費は ./_benriya.ts、単身引越しは lib/pricing.ts、
 * 出張診断は lib/pc.ts から引く。
 */

const TITLE = `便利屋 re'vive 富山｜組み立て・片付け・パソコン設定・買取 1時間${yen(HOURLY_FEE)}円〜`;
const DESCRIPTION = `富山県の便利屋 re'vive 富山。家具の組み立て、片付け、パソコン・スマホの設定、出張買取、雪かきまで。作業の前に金額をお出しします。富山市内は出張費0円。`;

/** SNS で共有されたときの画像。ヒーロー画像（hero-living.jpg）を 1200×630 に切り出したもの */
const OG_IMAGE = {
  url: "/images/benriya/og.jpg",
  width: 1200,
  height: 630,
  alt: images.benriyaHero.alt,
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/benriya" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://revive-toyama.jp/benriya",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * このページの構造化データ。提供元はサイト共通の #business（app/components/JsonLd.tsx）を @id で参照する。
 * 金額は ./_benriya.ts の HOURLY_FEE から引く。
 */
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/benriya#service`,
  name: "便利屋（暮らしのお手伝い）",
  url: `${SITE_URL}/benriya`,
  provider: { "@id": `${SITE_URL}/#business` },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "富山県",
  },
  serviceType: ["家具の組み立て", "家具・家電の移動", "パソコン・スマホの設定", "出張買取", "雪かき・草むしり"],
  offers: {
    "@type": "Offer",
    price: String(HOURLY_FEE),
    priceCurrency: "JPY",
    description: "1時間あたり（税込・作業員1名・出張費別）",
  },
};

/** 許認可は lib/site.ts の LICENSES から引く。番号をこのファイルに書き写さない */
const KOBUTSU = (() => {
  const l = LICENSES.find((x) => x.label === "古物商許可");
  if (!l) throw new Error('許認可 "古物商許可" が lib/site.ts の LICENSES にありません');
  return l;
})();

/** ワンルーム〜1K・富山市内・作業員2名・平日。app/(site)/page.tsx の MOVING_FROM と同じ条件 */
const MOVING_FROM = plainTotal({ tier: TIER[2], crew: 2, km: 12, coefKey: "heijitsu" });

const ICON = {
  yen: (
    <path d="M7 4l5 7 5-7M12 11v9M8 13h8M8 16.5h8" />
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
};

const PROMISES: { icon: keyof typeof ICON; title: string; sub: string }[] = [
  { icon: "yen", title: "金額は作業の前に", sub: "お見積りは無料です" },
  { icon: "pin", title: "富山県全域に伺います", sub: "富山市内は出張費0円" },
  { icon: "clock", title: "空きがあれば当日も", sub: "ご都合に合わせて日程を調整します" },
  { icon: "shield", title: "古物商許可あり", sub: KOBUTSU.value },
];

/** 「たとえば、こんなご相談も。」の6枚。並びはこの順 */
const REI: { image: SiteImage; tag: string; title: string; body: string }[] = [
  {
    image: images.benriyaHakobu,
    tag: "運ぶ",
    title: "冷蔵庫を2階に上げたい",
    body: "家具・家電の移動、模様替え。お店で買った物をご自宅まで運ぶこともできます。",
  },
  {
    image: images.benriyaPrinter,
    tag: "直す・設定する",
    title: "プリンターが急に動かない",
    body: "パソコンの修理、Wi-Fi・プリンターの設定、テレビの配線まで。",
  },
  {
    image: images.benriyaSmartphone,
    tag: "直す・設定する",
    title: "スマホのデータを移せない",
    body: "機種変更のあとの移し替えや、LINE・写真の引き継ぎをお手伝いします。",
  },
  {
    image: images.benriyaKumitate,
    tag: "組み立てる・取り付ける",
    title: "説明書を見ても組み立てられない",
    body: "家具の組み立て、カーテンレール・棚の取り付け。",
  },
  {
    image: images.benriyaKaitori,
    tag: "買い取る・片付ける",
    title: "実家を片付けたい",
    body: "仕分けをお手伝いして、売れる物はその場で買い取ります。",
  },
  {
    image: images.benriyaYukikaki,
    tag: "季節のこと",
    title: "雪で玄関から出られない",
    body: "冬の雪かき、夏の草むしりなど、季節の困りごとにも。",
  },
];

/** 1時間いくらでお受けする作業 */
const HOURLY_WORK: { head: string; items: string[] }[] = [
  {
    head: "組み立てる・取り付ける",
    items: ["家具の組み立て", "カーテンレール・棚の取り付け", "照明の付け替え（天井の差し込み口に付けるもの）"],
  },
  { head: "片付ける", items: ["片付けの手伝い（売れる物はその場で買取）", "年末の片付け"] },
  { head: "季節のこと", items: ["雪かき", "草むしり"] },
];

/** 作業ごとの料金でお受けする作業。料金はそれぞれのページに載っている */
const PER_JOB: { href: string; name: string; detail: string; price: string }[] = [
  {
    href: "/unpan",
    name: "運ぶ",
    detail: "家具・家電の移動、2階への上げ下ろし、お店からの配送、建物内の移動",
    price: "出動料＋1点ごと →",
  },
  {
    href: "/moving",
    name: "単身の引越し",
    detail: "ワンルーム〜1K（一式・富山市内・平日の場合）",
    price: `${yenWithUnit(MOVING_FROM)}〜 →`,
  },
  {
    href: "/pc/price",
    name: "直す・設定する",
    detail: "パソコンの修理・診断、Wi-Fi・プリンターの設定、スマホの機種変更、テレビの配線、事務所パソコンの定期点検",
    price: `出張診断${yen(DIAGNOSIS_FEE)}円〜 →`,
  },
  {
    href: "/kaitori",
    name: "出張買取",
    detail: "カメラ・パソコン・家電など。動かない物も査定します",
    price: "査定・出張無料 →",
  },
  { href: "/houjin", name: "お店・事務所のスポット便", detail: "1時間から", price: "料金を見る →" },
];

const TEIKI_EXAMPLES = ["電球・電池の交換", "重い物の移動", "テレビ・スマホの設定", "季節の物の出し入れ"];

const DEKINAI: { title: string; body: string }[] = [
  {
    title: "不用品の回収・処分",
    body: "許可が必要なため、お引き取りはしておりません。売れる物は買取で、捨て方のご相談はお受けします。",
  },
  {
    title: "エアコンのクリーニング",
    body: "専用の道具と技術が要るため、専門の業者さんへのご相談をおすすめしています。",
  },
  {
    title: "電気の配線工事・壁掛けテレビ",
    body: "資格が必要な工事と、落ちたときの被害が大きい作業はお受けしていません。",
  },
  {
    title: "スマホ本体の修理",
    body: "画面やバッテリーの交換は行っていません。設定とデータの移し替えはできます。",
  },
];

export default function BenriyaPage() {
  return (
    <div className="bn">
      {/* JSON の中の `<` は `<` に逃がす（Next.js の JSON-LD ガイドの指示） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, "<") }}
      />
      {/* ---------- ヒーロー ---------- */}
      <section id="top" className="bn-hero">
        <div className="bn-in bn-hero-in">
          <div className="bn-hero-t">
            <p className="bn-zen bn-hero-k">re&apos;vive 富山　暮らしのお手伝い</p>
            <h1 className="bn-zen bn-hero-h">
              <span>
                <span className="bn-q-open">「</span>ちょっと手伝って<span className="bn-q-close">」</span>が
              </span>
              <span>
                言える<span className="bn-q-close">、</span>
                <span className="bn-mark">富山の便利屋</span>。
              </span>
            </h1>
            <p className="bn-hero-lead">
              重い物の移動も、パソコンの設定も、売りたい物の買取も。
              <br />
              富山県内なら、re&apos;vive 富山が伺います。
            </p>
            <div className="bn-hero-act">
              <a href="#rei" className="bn-zen bn-btn bn-btn-lg">
                できることを見る
              </a>
              <div className="bn-hero-price">
                <span className="bn-hero-price-l">組み立て・片付けなど 1時間</span>
                <span className="bn-num bn-hero-price-n">{yen(HOURLY_FEE)}</span>
                <span className="bn-zen bn-hero-price-u">円〜</span>
              </div>
            </div>
          </div>
          <div className="bn-hero-ph">
            <Image
              src={images.benriyaHero.src}
              alt={images.benriyaHero.alt}
              width={images.benriyaHero.width}
              height={images.benriyaHero.height}
              sizes="(max-width: 1000px) 100vw, 560px"
              priority
            />
          </div>
        </div>
      </section>

      {/* ---------- 約束の帯 ---------- */}
      <div className="bn-band">
        <div className="bn-in bn-band-in">
          {PROMISES.map((p) => (
            <div key={p.title} className="bn-band-i">
              <span className="bn-band-ic">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B23F28"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {ICON[p.icon]}
                </svg>
              </span>
              <span className="bn-band-t">
                <span className="bn-zen">{p.title}</span>
                <span>{p.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- たとえば、こんなご相談も。 ---------- */}
      <section id="rei" className="bn-sec bn-white">
        <div className="bn-in">
          <h2 className="bn-zen bn-sec-h bn-h-36">たとえば、こんなご相談も。</h2>
          <p className="bn-sec-lead">富山の便利屋として、ここにないことも、お気軽にご相談ください。</p>
          <div className="bn-rei">
            {REI.map((r) => (
              <div key={r.title} className="bn-rei-c">
                <Image
                  src={r.image.src}
                  alt={r.image.alt}
                  width={r.image.width}
                  height={r.image.height}
                  sizes="(max-width: 760px) 100vw, 390px"
                />
                <div className="bn-rei-t">
                  <span className="bn-tag">{r.tag}</span>
                  <p className="bn-zen bn-rei-h">{r.title}</p>
                  <p className="bn-rei-b">{r.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bn-menu">
            <h3 className="bn-zen bn-menu-h">暮らしの困りごと、まずはご相談ください。</h3>
            <p className="bn-menu-lead">お受けしている内容と、料金の決まり方です。</p>

            {/* 1時間いくらでお受けする作業 */}
            <div id="ryokin" className="bn-hourly">
              <div className="bn-hourly-hd">
                <p className="bn-zen bn-box-h">1時間いくらでお受けする作業</p>
                <p className="bn-hourly-p">
                  <b className="bn-num">{yen(HOURLY_FEE)}</b>
                  <span className="bn-zen">円 / 1時間</span>　＋ 出張費
                </p>
              </div>
              <p className="bn-hourly-note">
                税込・作業員1名・最低1時間から。2名が必要な作業は事前にお見積りします。駐車場代がかかる場合は、実費のみいただいております。
                <br />
                作業の前に金額をお出しし、時間が延びそうなときは、その場でご確認いただいてから進めます。
              </p>
              <div className="bn-hourly-g">
                {HOURLY_WORK.map((g) => (
                  <div key={g.head}>
                    <p className="bn-zen bn-hourly-gh">{g.head}</p>
                    <ul>
                      {g.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="bn-fee">
                <p className="bn-zen bn-hourly-gh">時間制の作業の出張費</p>
                <div className="bn-fee-g">
                  {FEE_ROWS.map((r) => (
                    <div key={r.name} className="bn-fee-r">
                      <span>{r.name}</span>
                      <span className="bn-num">{yen(r.fee)}円</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bn-hourly-ft">
                <p>賃貸で壁に穴を開ける作業は、管理会社か大家さんの了承をいただいてから伺います。</p>
                <p>抜いた草はお持ち帰りできないため、ご自宅のごみとしてお出しください。</p>
              </div>
            </div>

            {/* 作業ごとの料金でお受けする作業 */}
            <div className="bn-perjob">
              <div className="bn-perjob-hd">
                <p className="bn-zen bn-box-h">作業ごとの料金でお受けする作業</p>
                <p>出張費も含めて、料金はそれぞれのページに載せています。</p>
              </div>
              <div className="bn-perjob-l">
                {PER_JOB.map((j) => (
                  <Link key={j.href} href={j.href} className="bn-prow">
                    <span className="bn-zen bn-prow-n">{j.name}</span>
                    <span className="bn-prow-d">{j.detail}</span>
                    <span className="bn-prow-p">{j.price}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 定期訪問 ---------- */}
      <section id="teiki" className="bn-sec bn-pale">
        <div className="bn-in bn-teiki">
          <div className="bn-teiki-t">
            <h2 className="bn-zen bn-sec-h bn-h-34">
              月に1回、困りごとを
              <br />
              まとめて片付けに伺います。
            </h2>
            <p className="bn-teiki-lead">
              ひとつひとつは小さくても、たまると暮らしにくくなること。そんな用事を、月に1回まとめて片付けます。離れて暮らすご家族からのお申し込みもできます。
            </p>
            <div className="bn-teiki-p">
              <span className="bn-num">{yen(MONTHLY_FEE)}</span>
              <span className="bn-zen">円 / 月</span>
            </div>
            <p className="bn-teiki-note">月1回・60分まで・税込（富山市内。市外は出張費が加わります）</p>
            <a href="#soudan" className="bn-zen bn-btn bn-btn-md">
              定期訪問を相談する
            </a>
          </div>
          <div className="bn-teiki-box">
            <p className="bn-zen bn-teiki-bh">たとえば、月1回の60分で</p>
            <div className="bn-teiki-g">
              {TEIKI_EXAMPLES.map((t) => (
                <div key={t}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 相談 ---------- */}
      <section id="soudan" className="bn-sec bn-white">
        <div className="bn-in bn-soudan">
          <div className="bn-soudan-t">
            <h2 className="bn-zen bn-sec-h bn-h-40">
              お困りごとを、
              <br />
              <span className="bn-dark">ひと言で。</span>
            </h2>
            <p className="bn-soudan-lead">
              どこに相談すればいいか分からないことでも大丈夫です。お受けできるかどうかと、だいたいの金額を、こちらからお返事します。
            </p>
            <div className="bn-me">
              <div className="bn-me-ph">
                <Image
                  src={images.daihyou.src}
                  alt={images.daihyou.alt}
                  width={images.daihyou.width}
                  height={images.daihyou.height}
                  sizes="84px"
                />
              </div>
              <div className="bn-me-t">
                <p className="bn-zen bn-me-h">伺うのは、私です。</p>
                <p className="bn-me-n">re&apos;vive 富山　代表　{COMPANY.representative}</p>
                <p className="bn-me-b">「こんなこと頼んでいいのかな」と迷う用事ほど、気軽に送ってください。</p>
                <Link href="/company" className="bn-me-a">
                  会社概要を見る →
                </Link>
              </div>
            </div>
            <div className="bn-voice">
              <p className="bn-voice-s" aria-label="星5つ">
                ★★★★★
              </p>
              <p className="bn-zen bn-voice-q">「明朗会計で良心的な業者さんだと思います。」</p>
              <p className="bn-voice-src">Googleのクチコミより</p>
            </div>
          </div>
          <BenriyaForm />
        </div>
      </section>

      {/* ---------- できないこと ---------- */}
      <section id="dekinai" className="bn-sec bn-sec-s bn-pale">
        <div className="bn-in">
          <h2 className="bn-zen bn-sec-h bn-h-32">できないことも、先にお伝えします。</h2>
          <p className="bn-sec-lead bn-sec-lead-s">お受けできない作業は、ご相談の段階でお伝えします。</p>
          <div className="bn-dekinai">
            {DEKINAI.map((d) => (
              <div key={d.title}>
                <p className="bn-zen">{d.title}</p>
                <p>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 最後の帯 ---------- */}
      <section className="bn-sec bn-sec-s bn-last">
        <div className="bn-last-in">
          <h2 className="bn-zen bn-sec-h bn-h-36">まずは、気軽にご相談ください。</h2>
          <p className="bn-last-sub">富山県全域の便利屋 re&apos;vive 富山</p>
          <div className="bn-last-btns">
            <a href="#soudan" className="bn-zen bn-btn-ink">
              お困りごとを書く
            </a>
            <a href={TEL_HREF} className="bn-zen bn-num bn-btn-tel">
              {TEL}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
