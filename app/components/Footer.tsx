import Link from "next/link";

const LINE_URL = "https://lin.ee/845Fdsy";

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
              re&apos;vive
            </span>
            <span className="block text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              by AmNiss&amp;Co.Japan
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
            { name: "引越し", href: "/moving" },
            { name: "買取", href: "/kaitori" },
            { name: "ブログ", href: "/blog" },
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

        {/* 問い合わせ */}
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
          <p className="text-[11px] leading-loose" style={{ color: "rgba(255,255,255,0.5)" }}>
            富山県SDGs宣言企業<br />
            古物商許可 富山県公安委員会<br />
            第501310007877号
          </p>
        </div>
      </div>

      <div
        className="border-t max-w-7xl mx-auto px-4 py-6 text-center"
        style={{ borderColor: "rgba(255,255,255,0.15)" }}
      >
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          &copy; 2025 AmNiss&amp;Co.Japan All rights reserved.
        </p>
      </div>
    </footer>
  );
}
