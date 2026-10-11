import type { Metadata } from "next";
import Link from "next/link";
import PriceHero from "../_components/PriceHero";
import LicenseStrip from "../_components/LicenseStrip";
import LastCta from "../_components/LastCta";
import UnpanChoices, { type Choice } from "./UnpanChoices";
import InBuildingEstimate from "./InBuildingEstimate";
import {
  INDOOR_FEE,
  INBUILDING_MOVE_FEE,
  INBUILDING_CREW2_FEE,
  INSTALL_FEE,
  INBUILDING_CAP,
  inBuildingTotal,
} from "../_fees";
import { CARGO_SIZE } from "../_cargo";
import { CAP, DEPART, DISASSEMBLE_FEE, STAIRS_FEE, TIER, fmt, plainTotal, yen } from "@/lib/pricing";

/**
 * 家具・家電の運搬。
 *
 * 【92_price_pages】トップ（90・91）と同じトーンに作り直した。
 * 見た目・動き・文言の正は参考モック（top_mock_20261008/Unpan.dc.html）。
 *
 * このページが言いたいのは1つだけ。
 * **「どこまで動かすか」で料金の決まり方が変わる。**
 * これが先に分かれば、8,000円と21,000円が同じページに並んでいても混乱しない。
 * なので、3枚のカードで先に選んでもらい、選んだものの説明だけを下に出す。
 *
 * 【どこまで動かすかで3つに分かれる】2026-09-24 改訂
 *   01 同じ部屋の中だけ        … INDOOR_FEE 8,000円（定額）
 *   02 建物の中（階・部屋をまたぐ・車は出さない）… inBuildingTotal()
 *   03 建物の外へ（車を出す）  … lib/pricing.ts の式
 *
 * 【階段の数え方は 02 と 03 で違う】2026-10-08 決定（cc_task/92 §1-1）
 *   03（車で運ぶ）… 2階までは込み。3階から1フロアにつき STAIRS_FEE（lib/pricing.ts の stairFloors）
 *   02（建物の中）… **変えていない。**階の移動そのものが作業なので、エレベーターなしは1フロアから STAIRS_FEE
 *
 * 【02 建物の中】2026-10-11 作り直し。見た目・文言・計算の正はモック（mock/unpan_bldg_mock.html）
 *   - 大型の家具・家電があると作業員2名で伺い、2人目の INBUILDING_CREW2_FEE が加わる
 *   - 階段は上限（INBUILDING_CAP）の外
 *   - 表の金額も、簡易見積り（InBuildingEstimate.tsx）の金額も inBuildingTotal() から出す
 *
 * 【料金の出どころ】
 *  - 03 の3行は **lib/pricing.ts** から算出している。手で書かない。
 *  - 計算式そのものは /moving に全部載っているので、ここでは繰り返さずリンクする。
 *  - 01 の 8,000円 と 02 の加算は式から出ない。理由は _fees.ts。
 *    **同じ数字をトップと /tokushoho も出すので、定義はこのファイルに戻さないこと。**
 *
 * 【ヒーローに画像を置かない】
 * **`/moving` の荷台の断面図をここに流用しないこと。**
 * 同じ図が2ページに出ると、図が「そのページの証拠」ではなく飾りになる。
 *
 * 【本文に数字を埋め込まないこと】
 * `{CAP}m³を…` と書くと React が text node の境目に `<!-- -->` を入れるので、
 * 文字列はテンプレートリテラルで1本にしてから出す。
 *
 * 「不用品回収」「不用品処分」「引き取り」「処分します」をサービスとして書かない。
 * 「格安」「業界最安」「絶対」「100%」「積み放題」、口コミ、他社比較も書かない。
 */

/* ============ lib/pricing.ts から引く数字 ============ */

/** 富山市内。/moving の検算表・トップと同じ 12km を代表値にしている */
const CITY_KM = 12;

/**
 * 03 建物の外へ（富山市内・平日・作業員2名・階段なし）。荷物の量だけが違う3行。
 * ⚠ 1行目は「大型1〜2点」。テレビ・机だけなら作業員1名で安くなるので、名前に入れない（cc_task/92 §1-3）。
 */
const CARRY_CASES: { name: string; tier: number }[] = [
  { name: "冷蔵庫・洗濯機など大型1〜2点", tier: 0 },
  { name: "ソファ・自転車1台", tier: 1 },
  { name: "軽バンいっぱい", tier: 2 },
];

const CARRY_ROWS = CARRY_CASES.map((c) => {
  const t = TIER[c.tier];
  return {
    name: c.name,
    desc: `${t.name}　〜${t.cap.toFixed(1)}m³`,
    amount: plainTotal({ tier: t, crew: 2, km: CITY_KM, coefKey: "heijitsu" }),
  };
});

/** 表のいちばん上の行。1点だけの運搬の下限。03 のカードと title / description で使う */
const CARRY_FROM = CARRY_ROWS[0].amount;

/* ============ _fees.ts から引く数字（02 建物の中） ============ */

/** 02 の表の列。エレベーターあり・加算なしで、点数だけが違う */
const INBUILDING_POINTS = [1, 2, 3];

/** 02 の表の行。作業員の人数だけが違う。金額は inBuildingTotal から出す */
const INBUILDING_KINDS: { name: string; badge?: string; things: string; crew: 1 | 2 }[] = [
  { name: "小型だけ", things: "棚・テレビ・段ボール・衣装ケースなど", crew: 1 },
  { name: "大型を含む", badge: "ご予約制", things: "冷蔵庫・洗濯機・ベッド・ソファ・タンスなど", crew: 2 },
];

const INBUILDING_TABLE = INBUILDING_KINDS.map((k) => ({
  name: k.name,
  badge: k.badge,
  desc: `作業員${k.crew}名。${k.things}`,
  amounts: INBUILDING_POINTS.map((items) =>
    inBuildingTotal({ items, crew: k.crew, floors: 0, disassembles: 0, installs: 0 }),
  ),
}));

/** 02 の下限（作業員1名・1点・加算なし）。カードに出す */
const INBUILDING_FROM = INBUILDING_TABLE[0].amounts[0];

/** 02 の札。必要なときだけ足すもの（上限の内側）と、エレベーターがないときの階段（上限の外） */
const INBUILDING_OPTIONS = [
  { name: "洗濯機の取り外し・取り付け", fee: INSTALL_FEE },
  { name: "ベッドなどの分解・組み立て（1点）", fee: DISASSEMBLE_FEE },
];
const INBUILDING_STAIRS = [{ name: "階段で運ぶ（1フロアにつき）", fee: STAIRS_FEE }];

/** お受けできないこと。⑤ と、02 の欄の最後の「運べない物」で同じ名前を出す */
const DENY_WASTE = { title: "廃棄物の運搬、処分場への持ち込み", reason: "廃棄物を運ぶ許可がないためです。" };
const DENY_HEAVY = {
  title: "ピアノ・金庫などの重量物",
  reason: "軽バンの道具と人数では、安全に運べないためです。",
};

/* ============ 3枚のカード ============ */

const CHOICES: Choice[] = [
  {
    id: "room",
    no: "01",
    name: "同じ部屋の中だけ",
    desc: "模様替え・組み立て・設置。運びません。",
    price: fmt(INDOOR_FEE),
    unit: "円",
  },
  {
    id: "bldg",
    no: "02",
    name: "建物の中",
    desc: "別の階や部屋へ。車は出しません。",
    price: fmt(INBUILDING_FROM),
    unit: "円〜",
  },
  {
    id: "out",
    no: "03",
    name: "建物の外へ",
    desc: "1点配送・自転車など。車で運びます。",
    price: fmt(CARRY_FROM),
    unit: "円〜",
  },
];

/* ============ 積める量 ============ */

/** 大きな数字で出す5つ。寸法と重さは _cargo.ts、積める量は CAP */
const CARGO_SPECS = [
  { label: "幅", value: String(CARGO_SIZE.w), unit: "cm" },
  { label: "高さ", value: String(CARGO_SIZE.h), unit: "cm" },
  { label: "奥行", value: String(CARGO_SIZE.d), unit: "cm" },
  { label: "積める量", value: CAP.toFixed(1), unit: "m³" },
  { label: "重さ", value: String(CARGO_SIZE.kg), unit: "kg" },
];

export const metadata: Metadata = {
  title: `富山の家具・家電の運搬｜1点から ${yen(CARRY_FROM)}・室内の移動 ${yen(INDOOR_FEE)} ｜ re'vive 富山`,
  description: `富山県全域。冷蔵庫1台でも、部屋の中で家具を動かすだけでも伺います。運ぶ場合は引越しと同じ計算式で富山市内・平日 ${yen(CARRY_FROM)}から、運ばない室内作業（家具移動・模様替え・組み立て・設置）は${yen(INDOOR_FEE)}、同じ建物の中での階移動は出動料＋1点${yen(INBUILDING_MOVE_FEE)}。金額は運ぶ前に確定します。貨物軽自動車運送事業 届出済。`,
  alternates: { canonical: "/unpan" },
  openGraph: {
    title: `富山の家具・家電の運搬｜1点から ${yen(CARRY_FROM)}・室内の移動 ${yen(INDOOR_FEE)} ｜ re'vive 富山`,
    description: `富山県全域。冷蔵庫1台でも、部屋の中で家具を動かすだけでも伺います。運ぶ場合は引越しと同じ計算式で富山市内・平日 ${yen(CARRY_FROM)}から、運ばない室内作業（家具移動・模様替え・組み立て・設置）は${yen(INDOOR_FEE)}、同じ建物の中での階移動は出動料＋1点${yen(INBUILDING_MOVE_FEE)}。金額は運ぶ前に確定します。貨物軽自動車運送事業 届出済。`,
    url: "https://revive-toyama.jp/unpan",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

/** 説明の箱の中の表。金額は数字だけ（単位は見出しと文で言っている） */
function Rows({ rows }: { rows: { name: string; desc: string; amount: number }[] }) {
  return (
    <table className="pp-tbl wide">
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <th scope="row">{r.name}</th>
            <td className="d">{r.desc}</td>
            <td className="p tp-num">{fmt(r.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 02 の札。名前と「＋金額」 */
function Pills({ items }: { items: { name: string; fee: number }[] }) {
  return (
    <ul className="pp-inc">
      {items.map((it) => (
        <li key={it.name}>
          {it.name}
          <b className="tp-num">{`＋${yen(it.fee)}`}</b>
        </li>
      ))}
    </ul>
  );
}

/** お受けできないこと。紺の箱に黄色の× */
function Deny({ title, reason }: { title: string; reason: string }) {
  return (
    <div className="pp-deny">
      <span className="x" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 5l12 12M17 5L5 17" />
        </svg>
      </span>
      <div>
        <b>{title}</b>
        <span>{reason}</span>
      </div>
    </div>
  );
}

export default function UnpanPage() {
  return (
    <div className="tp pp">
      {/* ① ヒーロー。紺の地。**画像を置かない。**
          見出しはお客さんの言葉。リードでこちらが答える、という組み立て */}
      <PriceHero
        kicker="家具・家電の運搬 ／ 富山県全域"
        title={["1点だけなんですけど、", "いいですか。"]}
        lead={["冷蔵庫1台でも、部屋の中で動かすだけでも伺います。", "金額は、運ぶ前に決まります。"]}
      />

      {/* ② 許認可の帯。91 のバッジ */}
      <LicenseStrip variant="badge" />

      {/* ③ 料金。3枚のカードで「どこまで動かすか」を選ぶと、下の説明が切り替わる。
          **3つの説明はどれも最初の HTML に入っている**（UnpanChoices が hidden で隠すだけ）。
          id="tatemononai"（トップの「車を使わない」の飛び先）は 01 の箱に付く */}
      <section className="pp-sec">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">PRICE</p>
            <h2 className="tp-h2">どこまで動かしますか？</h2>
            <p className="tp-sec-lead">動かす範囲で、料金の決まり方が3つに分かれます。</p>
          </div>

          <UnpanChoices
            choices={CHOICES}
            panels={{
              room: (
                <>
                  <h3>
                    同じ部屋の中だけ　<span className="tp-num n">{fmt(INDOOR_FEE)}</span>円
                  </h3>
                  <p className="tp-sec-lead">
                    模様替え、家具の位置替え、通販で届いた家具の組み立て。車も出さないので、いちばんお安くなります。
                  </p>
                </>
              ),
              bldg: (
                <>
                  <h3>
                    {"建物の中　出動料 "}
                    <span className="tp-num n">{fmt(DEPART)}</span>
                    {"円 ＋ 1点 "}
                    <span className="tp-num n">{fmt(INBUILDING_MOVE_FEE)}</span>円
                  </h3>
                  <p className="tp-sec-lead">
                    同じマンションの別の階や部屋へ。車を出さないので、距離の料金はかかりません。
                    <br />
                    {`大型の家具・家電があるときは、2人目の${yen(INBUILDING_CREW2_FEE)}が加わります。`}
                  </p>
                  <table className="pp-tbl pts">
                    <thead>
                      <tr>
                        <th scope="col">エレベーターありの場合</th>
                        {INBUILDING_POINTS.map((n) => (
                          <th scope="col" key={n}>{`${n}点`}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {INBUILDING_TABLE.map((r) => (
                        <tr key={r.name}>
                          <th scope="row">
                            {r.name}
                            {r.badge ? <span className="pp-badge">{r.badge}</span> : null}
                            <small>{r.desc}</small>
                          </th>
                          {r.amounts.map((a, i) => (
                            <td className="p tp-num" key={INBUILDING_POINTS[i]} data-l={`${INBUILDING_POINTS[i]}点`}>
                              {fmt(a)}
                              <small>円</small>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="pp-tbl-note">{`4点目からも1点 ${yen(INBUILDING_MOVE_FEE)}ずつ。下の「必要なときだけ」の作業を足しても、上限は ${yen(INBUILDING_CAP)} です（階段の料金は上限の外で、別にかかります）。`}</p>

                  <p className="pp-sub">必要なときだけ</p>
                  <Pills items={INBUILDING_OPTIONS} />

                  <p className="pp-sub">エレベーターがないとき</p>
                  <Pills items={INBUILDING_STAIRS} />

                  <InBuildingEstimate />

                  <Deny
                    title="運べない物"
                    reason={`${DENY_HEAVY.title}（安全に運べないため）／処分のための運び出し（廃棄物を運ぶ許可がないため）`}
                  />
                </>
              ),
              out: (
                <>
                  <h3>建物の外へ</h3>
                  <p className="tp-sec-lead">引越しと同じ計算です。富山市内・平日・作業員2名の場合。</p>
                  <Rows rows={CARRY_ROWS} />
                  <div className="pp-panel-acts">
                    <Link href="/simulator" className="tp-btn tp-btn-n">
                      自分の条件で計算する
                    </Link>
                    <Link href="/moving" className="tp-btn tp-btn-nw">
                      料金のしくみをみる
                    </Link>
                  </div>
                </>
              ),
            }}
          />
        </div>
      </section>

      {/* ④ 積める量。ベージュの地。**断面図は使わない**（/moving のものを流用しない） */}
      <section className="pp-sec beige">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">CARGO</p>
            <h2 className="tp-h2">軽バン1台ぶんまで</h2>
          </div>
          <dl className="pp-bigspec lg">
            {CARGO_SPECS.map((c) => (
              <div key={c.label}>
                <dt>{c.label}</dt>
                <dd className="tp-num">
                  {c.value}
                  <small>{c.unit}</small>
                </dd>
              </div>
            ))}
          </dl>
          <p className="tp-sec-lead pp-gap">{`冷蔵庫は高さ${CARGO_SIZE.h}cmまで。洗濯機は縦型もドラム式も積めます。`}</p>
        </div>
      </section>

      {/* ⑤ お受けできないこと。許可がないことを先に書く */}
      <section className="pp-sec">
        <div className="tw">
          <div className="tp-sec-hd">
            <p className="tp-eyebrow tp-num">NOTE</p>
            <h2 className="tp-h2">お受けできないこと</h2>
          </div>
          <Deny {...DENY_WASTE} />
          <Deny {...DENY_HEAVY} />
        </div>
      </section>

      {/* ⑥ 最後の案内。トップと同じ黄色の帯 */}
      <LastCta
        title="運ぶ物の写真を、1枚。"
        lead="運びたい物と行き先を教えてください。部屋の中で動かすだけでも構いません。"
      />
    </div>
  );
}
