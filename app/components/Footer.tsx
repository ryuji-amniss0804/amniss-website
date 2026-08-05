import Link from "next/link";

const LINE_URL = "https://lin.ee/845Fdsy";
const TEL = "070-8450-0897";

export default function Footer() {
  return (
    <footer
      id="footer-menu"
      className="mt-auto"
      style={{ backgroundColor: "var(--color-primary-dark)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* ブランド */}
        <div className="flex flex-col gap-5">
          <div>
            <span
              className="text-xl font-black tracking-wide"
              style={{ fontFamily: "'Noto Serif JP', serif", color: "#ffffff" }}
            >
              re&apos;vive 富山
            </span>
            <span className="block text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              運営：AmNiss&amp;Co. Japan
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            富山県全域の単身引越し・出張買取サービス。<br />
            モノと暮らしに新しい命を。
          </p>
          <div className="flex flex-col gap-2 text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            <Link href="/company" className="hover:opacity-80 transition-opacity underline underline-offset-2">
              会社概要
            </Link>
            <Link href="/tokushoho" className="hover:opacity-80 transition-opacity underline underline-offset-2">
              特定商取引法に基づく表記
            </Link>
            <Link href="/privacy" className="hover:opacity-80 transition-opacity underline underline-offset-2">
              プライバシーポリシー
            </Link>
          </div>
        </div>

        {/* ナビ */}
        <div className="flex flex-col gap-3">
          <span
            className="text-[10px] font-black tracking-widest uppercase mb-2"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Navigation
          </span>
          {[
            { name: "単身引越し", href: "/#moving" },
            { name: "出張買取", href: "/#kaitori" },
            { name: "会社概要", href: "/company" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-bold hover:opacity-80 transition-opacity flex items-center gap-2"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              <span style={{ color: "rgba(255,255,255,0.35)" }}>/</span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* 事業者情報・問い合わせ */}
        <div className="flex flex-col gap-4">
          <span
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Contact
          </span>

          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-black text-sm py-3 px-6 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#ffffff", color: "var(--color-primary-dark)" }}
          >
            LINEで無料相談
          </a>

          {/* NAP（名称・住所・電話）— 表記ゆれを作らないこと */}
          <address className="not-italic text-[11px] leading-loose" style={{ color: "rgba(255,255,255,0.6)" }}>
            <span className="block font-bold" style={{ color: "rgba(255,255,255,0.8)" }}>
              re&apos;vive 富山
            </span>
            富山県富山市<br />
            TEL{" "}
            <a href={`tel:${TEL.replace(/-/g, "")}`} className="underline underline-offset-2 hover:opacity-80">
              {TEL}
            </a>
            <br />
            営業時間 9:00〜21:00（年中無休）<br />
            対応エリア 富山県全域
          </address>

          <p className="text-[11px] leading-loose" style={{ color: "rgba(255,255,255,0.5)" }}>
            古物商許可 富山県公安委員会<br />
            第501310007877号<br />
            貨物軽自動車運送事業 届出済<br />
            富山県SDGs宣言企業
          </p>

          {/* 一般廃棄物収集運搬業の許可がないことの明示。文言は変更しないこと */}
          <p className="text-[10px] leading-loose" style={{ color: "rgba(255,255,255,0.45)" }}>
            当社は一般廃棄物収集運搬業の許可を受けていないため、廃棄物の有料回収は行っておりません。
          </p>
        </div>
      </div>

      <div
        className="border-t max-w-7xl mx-auto px-4 py-6 text-center"
        style={{ borderColor: "rgba(255,255,255,0.15)" }}
      >
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          &copy; {new Date().getFullYear()} AmNiss&amp;Co. Japan All rights reserved.
        </p>
      </div>
    </footer>
  );
}
