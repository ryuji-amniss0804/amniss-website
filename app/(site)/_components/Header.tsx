"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPANY, HOURS, NAV, TEL } from "@/lib/site";

/**
 * ヘッダー。sticky top:0。
 * 960px 以下ではナビと電話番号を隠す（下部の MobileBar が受ける）。
 * ハンバーガーメニューは置かない。開閉する箱を増やさない方針。
 */
export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site">
      <div className="w hd-in">
        <div className="logo">
          <Link href="/">
            {COMPANY.brand}
            <span>{COMPANY.latin}</span>
          </Link>
        </div>

        <nav className="main">
          {NAV.map((item) => {
            // アンカー付きのリンク（/#faq など）は現在地の判定から外す
            const href: string = item.href;
            const current =
              !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));
            return (
              <Link key={item.href} href={item.href} className={current ? "cur" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hd-r">
          <div className="hd-tel">
            <b>{TEL}</b>
            <span>{HOURS}</span>
          </div>
          {/* 寸法は site.css の .hd-cta。インラインで持つと 360px 以下の
              メディアクエリが効かない（インラインのほうが必ず勝つ）ため */}
          <Link className="btn btn-fill hd-cta" href="/#cta">
            見積りを依頼
          </Link>
        </div>
      </div>
    </header>
  );
}
