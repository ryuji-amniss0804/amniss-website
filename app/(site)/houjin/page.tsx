import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PriceHero from "../_components/PriceHero";
import LicenseStrip from "../_components/LicenseStrip";
import LastCta from "../_components/LastCta";
import { SPOT_EXTEND_FEE, SPOT_EXTEND_MIN, SPOT_FEE, spotTotal } from "../_fees";
import { LICENSES, TEL, TEL_HREF } from "@/lib/site";
import { DIST, fmt, yen } from "@/lib/pricing";

/**
 * 法人のお客様。
 *
 * 【93_other_pages】トップ（90・91）・料金の3ページ（92）と同じトーンに作り直した。
 * 見た目・文言の正は参考モック（top_mock_20261008/Houjin.dc.html）。
 *
 * **価格では勝負しない。「1時間から受ける」で勝負する。**
 * 軽貨物のスポット便は2時間・4時間単位が普通で、1時間から受けると
 * 公表している事業者が見当たらない。そこが空いているので、そこを言う。
 *
 * **他社名は一切出さない。**「2時間・4時間の縛りなし」までは書いてよいが、
 * 「他社は2時間から」のような比較は書かない（比較は裏が取れないうえ、
 * 根拠のない数字を出さないというこのサイトの主張と噛み合わない）。
 *
 * 【料金の出どころ】
 *  - 距離料は **lib/pricing.ts の DIST**（個人と同じ距離表）。ここに書かない。
 *  - スポット便の 8,000円 と延長の 1,500円（30分ごと）は式から出ない。理由は _fees.ts。
 *    **同じ数字をトップの「メニュー」も出すので、定義はこのファイルに戻さないこと。**
 *  - 例の金額は **_fees.ts の spotTotal()** を通す。画面に数字を書かない。
 *  - **日程係数（COEF）を法人の計算に通さないこと。**個人向けの土日1.20・当日1.50は
 *    法人には適用しない。そのため lib/pricing.ts から COEF / applyCoef を import しない。
 *  - ★スポット便は**作業員1名だけ。**2人がかりの重い物はお受けしない
 *    （2026-10-09 決定。下の「お受けできないこと」に書いてある）。
 *
 * 【ヒーローに画像を置かない】
 * image_decision.md の枠C（雰囲気）は画像を使わない。
 * /moving の荷室断面図をここに流用しないこと。
 *
 * 【本文に数字を埋め込まないこと】
 * `{x}分ごと` と書くと React が text node の境目に `<!-- -->` を入れるので、
 * 文字列はテンプレートリテラルで1本にしてから出す（数字と単位を別の要素にする所は別）。
 *
 * 「不用品回収」「不用品処分」「引き取り」「処分します」をサービスとして書かない。
 * 「格安」「業界最安」「絶対」「100%」「積み放題」、口コミ、他社比較も書かない。
 */

/** 許認可は lib/site.ts の LICENSES から引く。番号をこのファイルに書き写さない */
function license(label: string) {
  const l = LICENSES.find((x) => x.label === label);
  if (!l) throw new Error(`許認可 "${label}" が lib/site.ts の LICENSES にありません`);
  return l;
}

const KOBUTSU = license("古物商許可");
const UNSOU = license("貨物軽自動車運送事業");
const SDGS = license("富山県SDGs宣言企業");

/**
 * 「富山県公安委員会 第501310007877号」を、発行者と番号に割る。
 * 番号だけ `.nw`（折り返し禁止）で束ねないと、幅しだいで
 * **「…公安委員会第 ／ 501310007877号」と、第と数字が別の行に割れる。**
 * word-break: auto-phrase は「第」と数字を別の文節と見るので、これでは直らない。
 * トップ（/）でも同じことをしている。
 */
const [KOBUTSU_ISSUER, KOBUTSU_NO] = (() => {
  const v: string = KOBUTSU.value;
  const i = v.indexOf(" ");
  if (i < 0) throw new Error(`古物商許可の value に半角スペースがありません: ${v}`);
  return [v.slice(0, i), v.slice(i + 1)];
})();

const TITLE = `富山の法人向け軽貨物｜スポット便 1時間 ${yen(SPOT_FEE)}〜 ｜ re'vive 富山`;
const DESCRIPTION = `富山県全域。軽貨物のスポット便を1時間からお受けします。2時間・4時間単位の縛りはありません。当日でも土日祝でも割増なし、富山市内・1時間まで${yen(SPOT_FEE)}、延長は${SPOT_EXTEND_MIN}分ごとに${yen(SPOT_EXTEND_FEE)}。事務所移転、什器・備品の移動、複数箇所の配送・集荷。請求書払い（月締め）可。貨物軽自動車運送事業 届出済。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/houjin" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://revive-toyama.jp/houjin",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

/** 富山市内。/moving・/unpan・トップと同じ 12km を代表値にしている */
const CITY_KM = 12;
/** 高岡まで。距離表（lib/pricing.ts の DIST）の「射水・滑川・高岡」の段に入る */
const TAKAOKA_KM = 25;

/** 富山市内（距離料なし）と、市外の最初の段（射水・滑川・高岡）。「市外 ＋3,000円〜」の出どころ */
const CITY = DIST[0];
const DIST_FIRST = DIST[1];

/** ① 3つの箱。数字はすべて _fees.ts と距離表から */
const BIG3: { k: string; v: string; unit: string; d: string; hot?: boolean }[] = [
  { k: "最初の1時間", v: fmt(SPOT_FEE), unit: "円", d: CITY.area },
  { k: "延長", v: fmt(SPOT_EXTEND_FEE), unit: "円", d: `${SPOT_EXTEND_MIN}分ごと`, hot: true },
  { k: "市外", v: `＋${fmt(DIST_FIRST.fee)}`, unit: "円〜", d: "距離料" },
];

/** ② 札 */
const PILLS = ["当日・土日祝の割増なし", "2時間・4時間の縛りなし", "請求書払い・月締め"];

/** ③ 例。**金額は spotTotal() から。**割増（日程の係数）は掛けない */
const CASES = [
  { place: CITY.area, hours: 1, km: CITY_KM },
  { place: CITY.area, hours: 2, km: CITY_KM },
  { place: CITY.area, hours: 4, km: CITY_KM },
  { place: "高岡まで", hours: 2, km: TAKAOKA_KM },
].map((c) => ({
  name: `${c.place}・${c.hours}時間`,
  price: fmt(spotTotal({ minutes: c.hours * 60, km: c.km })),
}));

/**
 * ④ 表。スポット便・延長・距離料（代表の3段）・個別のお見積り・実費 を1つにまとめた。
 * 距離料は**個人と同じ lib/pricing.ts の距離表**。出すのは代表値だけ（射水・滑川・高岡／氷見・黒部・南砺／金沢）。
 * 金額は数字だけ（単位は見出しの下の一言と、上の3つの箱で言っている）。
 */
const TABLE_ROWS: { name: string; desc: string; price: string }[] = [
  { name: "スポット便", desc: `${CITY.area}・1時間まで`, price: fmt(SPOT_FEE) },
  { name: "延長", desc: `${SPOT_EXTEND_MIN}分ごと`, price: fmt(SPOT_EXTEND_FEE) },
  ...DIST.slice(1, 4).map((d, i) => ({
    name: i === 0 ? "距離料" : "",
    desc: d.area,
    price: `＋${fmt(d.fee)}`,
  })),
  { name: "事務所移転・什器の搬出入", desc: "荷物の量で計算", price: "お見積り" },
  { name: "半日・1日の貸切", desc: "", price: "お見積り" },
  { name: "有料駐車場", desc: "コインパーキングしかない場合", price: "実費" },
  { name: "高速道路", desc: "使う場合は事前のお見積りに入れます", price: "お見積り" },
];

/** ⑤ お受けしている内容 */
const CAN_DO: { name: string; note?: string }[] = [
  { name: "軽バンに積める荷物全般" },
  { name: "当日・翌日の急ぎ" },
  { name: "複数箇所の配送・集荷" },
  { name: "事務所移転、什器・備品の移動" },
  { name: "不要になった機材・什器の買取", note: `${KOBUTSU.label}あり` },
];

/** 富山県SDGs宣言の時期。LICENSES には入っていない（/company の表は「2026年5月宣言」） */
const SDGS_SINCE = "2026年5月";

/** ⑥ お取引の前に。許認可は LICENSES から組む。番号を書き写さない */
const KITAI: { name: string; note: ReactNode }[] = [
  { name: "請求書払い", note: "月締めに対応" },
  {
    name: KOBUTSU.label,
    note: (
      <>
        {`${KOBUTSU_ISSUER} `}
        <span className="nw">{KOBUTSU_NO}</span>
      </>
    ),
  },
  { name: UNSOU.label, note: UNSOU.value },
  { name: SDGS.label, note: SDGS_SINCE },
];

/** ⑦ お受けできないこと。3つ目は 2026-10-09 に足した（スポット便は作業員1名だけ） */
const CANNOT: { name: string; note?: string }[] = [
  { name: "廃棄物の運搬、処分場への持ち込み", note: "廃棄物を運ぶ許可がないためです" },
  { name: "危険物、液体類" },
  { name: "2人がかりで運ぶ重い物", note: "スポット便は作業員1名での対応です" },
];

export default function HoujinPage() {
  return (
    <div className="tp pp op">
      {/* ① ヒーロー。紺の地。**画像を置かない。**
          見出しはお客さんの言葉。リードでこちらが答える */}
      <PriceHero
        kicker="法人のお客様 ／ 富山県全域"
        title={["1時間だけ、", "お願いできますか。"]}
        lead={["軽貨物のスポット便を、1時間から。", "当日も土日祝も、同じ料金です。"]}
        actions={
          <>
            <a className="tp-btn tp-btn-y" href={TEL_HREF}>
              <span className="tp-num op-btn-tel">{TEL}</span>
            </a>
            <Link className="tp-btn tp-btn-o op-btn-o" href="/contact">
              見積りフォーム
            </Link>
          </>
        }
      />

      {/* ② 許認可の帯。91 のバッジ */}
      <LicenseStrip variant="badge" />

      {/* ③ 料金。**日程係数は掛けない。**土日・当日を指定しても金額は動かない */}
      <section className="pp-sec">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">PRICE</p>
            <h2 className="tp-h2">
              1時間から、<span className="tp-mark pp-fill">{`${SPOT_EXTEND_MIN}分きざみ`}</span>
            </h2>
            <p className="tp-sec-lead">税込・作業員1名。お伝えした金額のままです。</p>
          </div>

          <div className="op-big3">
            {BIG3.map((b) => (
              <div className={b.hot ? "op-bx y tp-rise" : "op-bx tp-rise"} key={b.k}>
                <span className="k">{b.k}</span>
                <span className="v tp-num">
                  {b.v}
                  <small>{b.unit}</small>
                </span>
                <span className="d">{b.d}</span>
              </div>
            ))}
          </div>

          <ul className="pp-inc">
            {PILLS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <div className="pp-cases op-gap-lg">
            {CASES.map((c) => (
              <div className="pp-case tp-rise" key={c.name}>
                <span className="t">{c.name}</span>
                <span className="p tp-num">
                  {c.price}
                  <small>円</small>
                </span>
              </div>
            ))}
          </div>

          <table className="pp-tbl box op-tbl3 op-gap-lg">
            <tbody>
              {TABLE_ROWS.map((r) => (
                <tr key={`${r.name}-${r.desc}`}>
                  {/* 距離料の2・3行目は見出しを繰り返さない（空のセル） */}
                  {r.name ? <th scope="row">{r.name}</th> : <td />}
                  <td className="d">{r.desc}</td>
                  <td className="p tp-num">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="pp-tbl-note">
            これより遠い行き先の距離料は、
            <Link href="/moving">単身引越し</Link>
            の距離表と同じです。
          </p>
        </div>
      </section>

      {/* ④ お受けしている内容。ベージュの地に丸い札 */}
      <section className="pp-sec beige">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">SERVICE</p>
            <h2 className="tp-h2">お受けしている内容</h2>
          </div>
          <ul className="op-chips">
            {CAN_DO.map((c) => (
              <li key={c.name}>
                <i aria-hidden="true" />
                <span>{c.name}</span>
                {c.note ? <small>{c.note}</small> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ⑤ お取引の前に（紺のカード4枚）と、お受けできないこと。許可がないことを先に書く */}
      <section className="pp-sec">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">TRUST</p>
            <h2 className="tp-h2">お取引の前に</h2>
          </div>
          <ul className="op-trust">
            {KITAI.map((k) => (
              <li className="tp-rise" key={k.name}>
                <b>{k.name}</b>
                <span>{k.note}</span>
              </li>
            ))}
          </ul>

          <h2 className="tp-h2 op-h2-sm">お受けできないこと</h2>
          <ul className="op-deny">
            {CANNOT.map((c) => (
              <li key={c.name}>
                <span className="x" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 5l12 12M17 5L5 17" />
                  </svg>
                </span>
                <div>
                  <b>{c.name}</b>
                  {c.note ? <span>{c.note}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ⑥ 最後の案内。黄色の帯。法人は電話が主 */}
      <LastCta
        variant="tel"
        title="まずは、お電話ください。"
        lead="運ぶ物・行き先・時間を伺えば、その場で金額をお伝えします。"
      />
    </div>
  );
}
