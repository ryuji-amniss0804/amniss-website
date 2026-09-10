"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PC_NAV } from "@/lib/pc";

/**
 * /pc のヘッダー。sticky top:0。
 *
 * ⚠ `(site)/_components/Header.tsx` とは別物。あちらは引越し・買取の導線
 *   （`lib/site.ts` の NAV）で、`lib/site.ts` は変更しない。PCを混ぜない。
 *
 * ⚠ `PC_NAV` は `ready: false` のものを**描かない。**まだ無いページへのリンクを出さない。
 *   出し戻しは `lib/pc.ts` の1行だけ。フッターも同じ印を見ている。
 *
 * 640px 以下はハンバーガーで開閉する。`(site)` 側は「開閉する箱を増やさない」方針で
 * ハンバーガーを置いていないが、こちらはナビと相談ボタンが並び、下部の固定バーは
 * 電話と相談の2本しか受けられないので、メニューが要る。
 */
export default function PcHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="hd">
      <div className="w">
        <Link className="brand" href="/pc" onClick={() => setOpen(false)}>
          re&apos;vive<em>_doc</em>
          <span>PC REPAIR / TOYAMA</span>
        </Link>

        <button
          className="burger"
          type="button"
          aria-label="メニュー"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <nav className={open ? "nav open" : "nav"}>
          {PC_NAV.filter((item) => item.ready).map((item) => {
            const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={current ? "on" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link className="cta" href="/pc/contact" onClick={() => setOpen(false)}>
            ご相談はこちら
          </Link>
        </nav>
      </div>
    </header>
  );
}
