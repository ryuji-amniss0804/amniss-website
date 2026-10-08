import Image from "next/image";
import { images, SIZES_FULL } from "@/lib/images";

type Props = {
  /** 「ワンルーム一式・富山市内・平日」の金額（3桁区切り・円なし）。**page.tsx の MOVING_FROM から渡す。直書きしない** */
  from: string;
};

/**
 * トップだけのヒーロー。写真を全面に敷き、紺を重ねて、その上に文字を置く。
 *
 * 【90_top_renewal で作り直した】見た目・動き・文言の正は
 * cc_task/90 の参考モック（top_mock_20261008/Main.dc.html）。
 * 17_hero の「写真 → 濃紺パネル」は、写真が証拠（軽バンと立山連峰）だったときの組み方で、
 * 写真を差し替えたので役目が変わった（lib/images.ts の heroTop を参照）。
 *
 * ★「金額がわかる。」は**黄色の塗りを文字の高さいっぱいに敷き、その上に紺の文字**。
 *   下だけに線を引く形に戻さないこと。暗い写真の上で紺の文字が読めなくなる（本人の指摘）。
 *
 * ヘッダーはこの上に重なる（Header.tsx の on-top）。上の余白 150px はそのぶん。
 * 動きは site.css の tp-* キーフレーム。`prefers-reduced-motion: reduce` ですべて止まる。
 * 下層ページの Hero は「文字が先、写真が後」でこれとは別物なので、別部品のまま。
 */
export default function HeroTop({ from }: Props) {
  const img = images.heroTop;

  return (
    <section className="tp tp-hero" id="top">
      {/* priority は Next.js 16 で非推奨。同じ役目の preload を使う */}
      <div className="tp-hero-img">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          preload
          sizes={SIZES_FULL}
          style={{ objectFit: "cover", objectPosition: img.objectPosition }}
        />
      </div>
      <div className="tp-hero-shade" />

      <div className="tw tp-hero-in">
        <p className="tp-hero-k tp-a1">富山の単身引越し・家具1点の運搬</p>
        <h1 className="tp-hero-h tp-a2">
          運ぶ前に、
          <br />
          <span className="tp-mark">金額がわかる。</span>
        </h1>
        <p className="tp-hero-lead tp-a3">
          何を運ぶか、どこからどこへ、いつ。
          <br />
          3つ選ぶだけで、その場で目安が出ます。
        </p>
        <div className="tp-hero-acts tp-a4">
          <a href="#estimate" className="tp-btn tp-btn-y tp-btn-lg tp-pulse">
            金額をみる
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
              <path d="M4 7l5 5 5-5" />
            </svg>
          </a>
          <div className="tp-hero-from">
            <span>ワンルーム一式・富山市内・平日</span>
            <b className="tp-num">
              {from}
              <small>円〜</small>
            </b>
          </div>
        </div>

        {/* 軽バンが左から右へ走る。飾りなので読み上げない */}
        <div className="tp-road" aria-hidden="true">
          <div className="tp-van">
            <svg viewBox="0 0 72 34" width="72" height="34" fill="none">
              <path d="M3 8h38v18H3z" fill="#FFC21A" />
              <path d="M41 12h14l9 8v6H41z" fill="#FFC21A" />
              <path d="M45 14h8l6 6H45z" fill="#14202B" />
              <circle cx="15" cy="27" r="5" fill="#14202B" stroke="#FAF8F3" strokeWidth="2" />
              <circle cx="53" cy="27" r="5" fill="#14202B" stroke="#FAF8F3" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
