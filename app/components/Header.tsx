"use client";

import Link from "next/link";
import { useState } from "react";

const LINE_URL = "https://lin.ee/845Fdsy";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 w-full z-50 border-b transition-all duration-300"
      style={{
        backgroundColor: "rgba(255,255,255,0.95)",
        borderColor: "var(--color-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* ロゴ */}
        <Link href="/" className="flex flex-col select-none">
          <span
            className="text-xl sm:text-2xl font-black tracking-wide"
            style={{ fontFamily: "'Noto Serif JP', serif", color: "var(--color-primary-dark)" }}
          >
            re<span style={{ color: "var(--color-primary)" }}>&apos;</span>vive
          </span>
          <span
            className="text-[10px] tracking-wider font-bold uppercase mt-0.5"
            style={{ color: "var(--color-muted)" }}
          >
            by AmNiss&amp;Co.Japan
          </span>
        </Link>

        {/* PC ナビ */}
        <nav
          className="hidden lg:flex items-center gap-6 text-sm font-bold"
          style={{ color: "var(--color-text)" }}
        >
          <Link href="/#moving" className="hover:opacity-60 transition-opacity">
            引越し
          </Link>
          <Link href="/#kaitori" className="hover:opacity-60 transition-opacity">
            買取
          </Link>
          <Link href="/company" className="hover:opacity-60 transition-opacity">
            会社概要
          </Link>
        </nav>

        {/* CTA + ハンバーガー */}
        <div className="flex items-center gap-3">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            LINEで無料相談
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-xl px-2 font-black transition-opacity hover:opacity-60"
            style={{ color: "var(--color-text)" }}
            aria-label="メニューを開く"
          >
            {open ? "✕" : "≡"}
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <div
          className="lg:hidden border-t px-6 py-6 flex flex-col gap-4 text-sm font-bold"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <Link href="/#moving" onClick={() => setOpen(false)} className="py-2 hover:opacity-60 transition-opacity">
            引越し
          </Link>
          <Link href="/#kaitori" onClick={() => setOpen(false)} className="py-2 hover:opacity-60 transition-opacity">
            買取
          </Link>
          <Link href="/company" onClick={() => setOpen(false)} className="py-2 hover:opacity-60 transition-opacity">
            会社概要
          </Link>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 text-center text-white font-black py-3 rounded-lg transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            LINEで無料相談
          </a>
        </div>
      )}
    </header>
  );
}
