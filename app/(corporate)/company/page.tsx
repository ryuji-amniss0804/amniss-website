import Image from "next/image";

export const metadata = {
  title: "会社概要 | re'vive 富山",
  description:
    "re'vive 富山（運営：AmNiss&Co. Japan）の会社概要。代表・小川竜司が直接対応。富山県富山市を拠点に県内全域の単身引越し・出張買取・軽貨物運送。古物商許可、貨物軽自動車運送事業届出済、富山県SDGs宣言企業。",
  alternates: { canonical: "/company" },
};

const LINE_URL = "https://lin.ee/845Fdsy";
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
        単身引越し・軽貨物運送・出張買取・不用品の買取・遺品整理（仕分け／買取／形見分けの配送）
        <span className="block text-xs mt-1" style={{ color: "var(--color-muted)" }}>
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
    <div
      className="min-h-screen pt-28 pb-20"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ページタイトル */}
        <div className="amn-animate mb-16" style={{ animationDelay: "0s" }}>
          <span
            className="text-xs font-black tracking-widest uppercase block mb-3"
            style={{ color: "var(--color-primary-light)" }}
          >
            Company Profile
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            会社概要
          </h1>
          <div
            className="w-10 h-0.5 mt-5"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
        </div>

        {/* 代表紹介 */}
        <section
          className="amn-animate mb-16 pb-16"
          style={{ animationDelay: "0.1s", borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-10">
            <div className="shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden relative">
                <Image
                  src="/images/face (2).jpg"
                  alt="代表 小川竜司"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 144px, 176px"
                  priority
                />
              </div>
            </div>
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest block mb-2"
                style={{ color: "var(--color-primary-light)" }}
              >
                Representative
              </span>
              <h2
                className="text-xl sm:text-2xl font-black mb-1"
                style={{ fontFamily: "'Noto Serif JP', serif" }}
              >
                小川 竜司
              </h2>
              <p className="text-xs mb-5" style={{ color: "var(--color-muted)" }}>
                Ryuji Ogawa
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-muted)" }}
              >
                軽貨物運送・せどり4年・eBay輸出の経験から、<br />
                他店で断られたジャンク品・古い精密機器でも<br />
                価値を見出して高く買い取ります。<br />
                引越しから買取まで、すべて一人で責任を持って対応します。
              </p>
            </div>
          </div>
        </section>

        {/* 会社概要テーブル */}
        <section
          className="amn-animate mb-16"
          style={{ animationDelay: "0.2s" }}
        >
          <h2
            className="text-lg sm:text-xl font-black mb-8"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            事業概要
          </h2>

          <div style={{ borderTop: "1px solid var(--color-border)" }}>
            {TABLE_ROWS.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 py-5 text-sm"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <div
                  className="font-black sm:col-span-1 text-xs uppercase tracking-wide"
                  style={{ color: "var(--color-muted)" }}
                >
                  {row.label}
                </div>
                <div className="sm:col-span-3 font-medium" style={{ color: "var(--color-text)" }}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="amn-animate text-center" style={{ animationDelay: "0.3s" }}>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white font-black text-sm px-8 py-4 rounded-lg transition-opacity hover:opacity-80 mb-8"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            LINEで無料相談・お問い合わせ
          </a>
        </section>

      </div>
    </div>
  );
}
