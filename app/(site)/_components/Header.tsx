"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPANY, HOURS, NAV, TEL } from "@/lib/site";

/**
 * ヘッダー。紺の帯で sticky top:0。
 * **トップ（/）だけ、ヒーローの写真の上に重ねる**（透明・白文字・position:absolute）。
 * 見た目の切り替えは site.css の `header.site.on-top`。
 * 960px 以下ではナビと電話番号を隠す（下部の MobileBar が受ける）。
 * ハンバーガーメニューは置かない。開閉する箱を増やさない方針。
 */

/** ロゴは「re'vive」（Barlow Condensed）と「富山」に分けて組む。文字は COMPANY.brand から取る */
const [BRAND_LATIN, BRAND_PLACE] = (() => {
  const v: string = COMPANY.brand;
  const i = v.indexOf(" ");
  if (i < 0) throw new Error(`COMPANY.brand に半角スペースがありません: ${v}`);
  return [v.slice(0, i), v.slice(i + 1)];
})();

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={pathname === "/" ? "site on-top" : "site"}>
      <div className="w hd-in">
        <div className="logo">
          <Link href="/">
            <b>{BRAND_LATIN}</b>
            <span>{BRAND_PLACE}</span>
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
