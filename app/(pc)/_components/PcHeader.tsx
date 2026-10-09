"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PC_NAV } from "@/lib/pc";

/**
 * /pc のヘッダー。紺の帯で sticky top:0（94 で本体と同じ紺にそろえた）。
 *
 * ⚠ `(site)/_components/Header.tsx` とは別物。あちらは引越し・買取の導線
 *   （`lib/site.ts` の NAV）で、`lib/site.ts` は変更しない。PCを混ぜない。
 *
 * ⚠ `PC_NAV` は `ready: false` のものを**描かない。**まだ無いページへのリンクを出さない。
 *   出し戻しは `lib/pc.ts` の1行だけ。フッターも同じ印を見ている。
 *
 * 860px 以下はハンバーガーで開閉する。`(site)` 側は「開閉する箱を増やさない」方針で
 * ハンバーガーを置いていないが、こちらはナビと相談ボタンが並び、下部の固定バーは
 * 電話と相談の2本しか受けられないので、メニューが要る。
 */
export default function PcHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="hd">
      <div className="w hd-in">
        <Link className="logo" href="/pc" onClick={() => setOpen(false)}>
          <b>
            re&apos;vive<em>_doc</em>
          </b>
          <span>パソコン修理・富山</span>
        </Link>

        <button
          className="burger"
          type="button"
          aria-label="メニュー"
          aria-expanded={open}
          aria-controls="pc-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
          </svg>
        </button>

        <nav id="pc-nav" className={open ? "nav open" : "nav"}>
          {PC_NAV.filter((item) => item.ready).map((item) => {
            const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={current ? "on" : undefined}
                aria-current={current ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link className="btn btn-g hd-cta" href="/pc/contact" onClick={() => setOpen(false)}>
            無料で相談
          </Link>
        </nav>
      </div>
    </header>
  );
}
