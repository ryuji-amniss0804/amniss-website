"use client";

import { useState } from "react";
import Link from "next/link";
import { useCountUp } from "./useCountUp";
import { INBUILDING_MOVE_FEE, INDOOR_FEE, inBuildingParts, inBuildingTotal } from "../_fees";
import { LINE_URL } from "@/lib/site";
import { PLACES, kmBetween, type PlaceId } from "@/lib/regions";
import {
  COEF,
  DEPART,
  DIST,
  SAME_DAY_CREW2_NOTICE,
  TIER,
  crewFor,
  distOf,
  fmt,
  itemOf,
  load,
  needsReservation,
  plainTotal,
  tierOf,
  type CoefKey,
  type Counts,
  type Tier,
} from "@/lib/pricing";

/**
 * トップの「料金の目安」。3つ選ぶと、その場で目安が出る。
 *
 * 見た目・動き・文言の正は cc_task/90 の参考モック（top_mock_20261008/Main.dc.html）。
 *
 * ★**ここに金額の数字を書かないこと。**計算は lib/pricing.ts と _fees.ts の
 *   定数と関数だけで行う。合計は `plainTotal()` をそのまま呼んでいるので、
 *   /moving の検算表・/simulator と同じ式から出る。
 * ★**人数は選ばせない。**`crewFor()` で決める（2026-09-24 の決定）。
 * ★「車を使わない」で「同じ建物の別の階・部屋へ」を選んだときの金額は、/unpan の簡易見積り
 *   （InBuildingEstimate）と同じ `inBuildingTotal()` / `inBuildingParts()` から出す。
 *   大型が入っていれば2名（`crewFor()`）で、2人目の加算が入る。**同じ条件なら同じ金額になる。**
 *   ここで選べるのは点数と洗濯機の取り外し・取り付けだけ（エレベーターあり・分解なしの金額）。
 *   階段と分解・組み立ては /unpan で足してもらう。
 * ★/simulator の本体は埋めていない（トップが重くなる）。これは軽い別部品で、
 *   階段・分解・時刻指定・個数の増減は「詳しく見積もる」の先でやってもらう。
 *
 * 本文は {} を混ぜると text node が割れて <!-- --> が入るので、
 * 文字列はテンプレートリテラルで1本にしてから出す。
 */

type Mode = "full" | "pick" | "small" | "big" | "indoor";

/** 一式・小物だけで使う段。「まるごと」はいちばん上、「小物だけ」はいちばん下 */
const FULL_TIER = TIER[TIER.length - 1];
const SMALL_TIER = TIER[0];
/** 日帰りの上限。距離表のいちばん遠い行 */
const MAX_KM = DIST[DIST.length - 1].km;

/** 「段ボール15箱くらいまで」の15。小口の上限 ÷ 段ボール大。割り算の誤差が出ないよう100倍してから割る */
const SMALL_BOXES = (() => {
  const box = itemOf("box-l");
  if (!box) throw new Error("lib/pricing.ts に box-l がありません");
  return Math.floor(Math.round(SMALL_TIER.cap * 100) / Math.round(box.m3 * 100));
})();

const MODES: { k: Mode; t: string; s: string }[] = [
  { k: "full", t: "一人暮らしの部屋をまるごと", s: "ワンルーム〜1K。家具・家電・段ボール一式" },
  { k: "pick", t: "大きい物をいくつか", s: "冷蔵庫・洗濯機・ベッドなどを選ぶ" },
  { k: "small", t: "段ボールや小物だけ", s: `大きい家具・家電はない。段ボール${SMALL_BOXES}箱くらいまで` },
];

/** 「車を使わない」の中の2つ。部屋の中だけ（定額）か、建物の中で階・部屋をまたぐか */
type Scope = "room" | "bldg";
const SCOPES: { k: Scope; t: string }[] = [
  { k: "room", t: "同じ部屋の中だけ" },
  { k: "bldg", t: "同じ建物の別の階・部屋へ" },
];

const MODES2: { k: Mode; t: string }[] = [
  { k: "big", t: "1LDK以上・家族の引越し" },
  { k: "indoor", t: "車を使わない（同じ部屋・建物の中だけ）" },
];

/**
 * 「大きい物をいくつか」で出す品目。**id は lib/pricing.ts の CAT のもの。**
 * 体積と「大型かどうか」はあちらから引く。ここで持つのは短い表示名だけ。
 */
const PICK_ITEMS: { id: string; name: string }[] = [
  { id: "fridge", name: "冷蔵庫" },
  { id: "washer-top", name: "洗濯機" },
  { id: "washer-drum", name: "ドラム式洗濯機" },
  { id: "bedframe-s", name: "ベッド" },
  { id: "mattress-s", name: "マットレス" },
  { id: "sofa-2", name: "ソファ" },
  { id: "tansu", name: "タンス" },
  { id: "shokki", name: "食器棚" },
  { id: "hondana", name: "本棚" },
  { id: "desk", name: "机" },
  { id: "tv-42", name: "テレビ" },
  { id: "bike", name: "自転車" },
];
/** 「同じ建物の別の階・部屋へ」で出す品目。自転車は建物の中で運ぶ物ではないので外す */
const BLDG_ITEMS = PICK_ITEMS.filter((it) => it.id !== "bike");
/** 取り外し・取り付け（_fees.ts の INSTALL_FEE）がつく品目。洗濯機だけ */
const WASHER_IDS = ["washer-top", "washer-drum"];
// load() は知らない id を黙って飛ばす。id を打ち間違えると0m³のまま金額が出るので、ここで止める
for (const it of PICK_ITEMS) {
  if (!itemOf(it.id)) throw new Error(`lib/pricing.ts に品目 ${it.id} がありません`);
}

/** 日程。係数は COEF から出す。ここに数字を書かない */
const DAYS: { k: CoefKey; t: string; n: string }[] = [
  { k: "omakase", t: "決まっていない", n: "平日のうち、こちらで日を選びます" },
  { k: "heijitsu", t: "平日", n: "4日以上先の平日" },
  { k: "donichi", t: "土日祝", n: "土曜・日曜・祝日" },
  { k: "yoku", t: "翌日", n: "明日の作業" },
  { k: "touji", t: "当日", n: "今日の作業。空きを電話で確かめます" },
];

function coefText(k: CoefKey): string {
  return `×${COEF[k].coef.toFixed(2)}`;
}

export default function QuickEstimate() {
  const [mode, setMode] = useState<Mode>("full");
  const [picked, setPicked] = useState<Record<string, boolean>>({ fridge: true });
  const [from, setFrom] = useState<PlaceId>("toyama");
  const [to, setTo] = useState<PlaceId>("toyama");
  const [day, setDay] = useState<CoefKey>("heijitsu");
  const [scope, setScope] = useState<Scope>("room");
  /** 洗濯機の取り外し・取り付けもする（/unpan の簡易見積りの初期値と同じく、最初は「する」） */
  const [install, setInstall] = useState(true);

  /* ---- 手順1：段と人数 ---- */
  /** 車を使わない・建物の中で階や部屋をまたぐ。金額は _fees.ts の inBuildingTotal から出す */
  const inBldg = mode === "indoor" && scope === "bldg";
  // 「大きい物をいくつか」で自転車を選んだまま建物の中に切り替えても、見えていない自転車は数えない
  const pickItems = inBldg ? BLDG_ITEMS : PICK_ITEMS;
  const counts: Counts = {};
  for (const it of pickItems) if (picked[it.id]) counts[it.id] = 1;
  const l = load(counts);

  let tier: Tier | null = null;
  let crew: 1 | 2 = 1;
  /** 金額の代わりに出す文。[見出し, 説明] */
  let msg: [string, string] | null = null;

  if (mode === "full") {
    tier = FULL_TIER;
    crew = 2;
  } else if (mode === "small") {
    tier = SMALL_TIER;
    crew = 1;
  } else if (mode === "pick") {
    crew = crewFor(counts);
    if (l.items === 0) {
      msg = ["運ぶ物を選んでください", "上のボタンをタップすると、ここに金額が出ます。"];
    } else if (l.over) {
      msg = [
        "1台に積みきれない量です",
        "2往復にするか、量を減らすかでご相談ください。詳しいシミュレーターで往復の金額も出せます。",
      ];
    } else {
      tier = tierOf(l.m3);
    }
  } else if (inBldg) {
    crew = crewFor(counts);
    if (l.items === 0) {
      msg = ["動かす物を選んでください", "上のボタンをタップすると、ここに金額が出ます。"];
    }
  } else if (mode === "big") {
    msg = [
      "1LDK以上はご相談ください",
      "軽バン1台に積みきれない量です。LINEで部屋の写真を送ってもらえれば、2往復にするか、ほかの方法がいいかをお伝えします。",
    ];
  }

  /* ---- 手順2：距離 ---- */
  const indoor = mode === "indoor";
  const washers = WASHER_IDS.filter((id) => picked[id]).length;
  /** エレベーターあり・分解なしで見る（階段と分解・組み立ては /unpan で足す） */
  const bldgInput = { items: l.items, crew, floors: 0, disassembles: 0, installs: install ? washers : 0 };
  /** 手順2・3を使わない選び方（車を使わない／1LDK以上） */
  const noStep = indoor || mode === "big";
  const km = kmBetween(from, to);
  const dist = km === null ? null : distOf(km);
  if (!noStep && !msg && !dist) {
    msg = [
      "県外は詳しいシミュレーターで",
      `長野・新潟・名古屋などは、片道の距離を入れると金額が出ます。片道${MAX_KM}km（日帰り）までお受けします。`,
    ];
  }

  /* ---- 結果 ---- */
  const work = tier ? tier.work[crew === 1 ? 0 : 1] : 0;
  const total = inBldg
    ? l.items > 0
      ? inBuildingTotal(bldgInput)
      : null
    : indoor
      ? INDOOR_FEE
      : tier && km !== null && dist && !msg
      ? plainTotal({ tier, crew, km, coefKey: day })
      : null;
  const shown = useCountUp(total, plainTotal({ tier: FULL_TIER, crew: 2, km: 10, coefKey: "heijitsu" }));

  let rows: { name: string; v: string }[] = [];
  let summary = "";
  if (inBldg && total !== null) {
    const p = inBuildingParts(bldgInput);
    rows = [
      { name: "出動料", v: fmt(p.depart) },
      { name: `${l.items}点 × ${fmt(INBUILDING_MOVE_FEE)}`, v: fmt(p.move) },
    ];
    if (p.crew2) rows.push({ name: "2人目", v: fmt(p.crew2) });
    if (p.install) rows.push({ name: `洗濯機の取り外し・取り付け ×${bldgInput.installs}`, v: fmt(p.install) });
    if (p.capped) rows.push({ name: "上限", v: fmt(total) });
    summary = `作業員${crew}名で伺います${crew === 2 ? "（大型の荷物があるため）" : ""}`;
  } else if (indoor && !inBldg) {
    rows = [
      { name: "同じ部屋の中で動かす", v: fmt(INDOOR_FEE) },
      { name: "同じ建物で階・部屋をまたぐ", v: `出動料＋1点${fmt(INBUILDING_MOVE_FEE)}` },
    ];
    summary = "車を使わない作業は定額です";
  } else if (total !== null && tier && dist) {
    rows = [
      { name: "出動料", v: fmt(DEPART) },
      { name: `${tier.name}・作業員${crew}名`, v: fmt(work) },
      { name: `距離 片道${km}kmくらい`, v: fmt(dist.fee) },
      { name: `日程 ${DAYS.find((d) => d.k === day)?.t ?? ""}`, v: coefText(day) },
    ];
    summary = `作業員${crew}名で伺います${crew === 2 ? "（大型の荷物があるため）" : ""}`;
  }

  /* ---- /simulator へ引き継ぐ条件 ----
     「まるごと」「小物だけ」は品目を渡さない。シミュレーターには一式という選び方がなく、
     こちらで品目を決めて渡すと、選んでいない物が入った状態で開くことになるため。
     距離と日程だけを渡す。1LDK以上は、引き継ぐ条件がないのでそのまま開く。
     車を使わないときは、シミュレーターに該当する作業がないので /unpan の料金の節へ送る
     （飛び先の id は unpan/UnpanChoices.tsx が説明の箱に付けている）。
     「同じ建物の別の階・部屋へ」を選んでいるときは、02（建物の中）の欄を開く。 */
  const simParams: string[] = [];
  if (!noStep) {
    if (km !== null) simParams.push(`km=${km}`);
    simParams.push(`coef=${day}`);
    // 92_price_pages：シミュレーターにも地域のセレクトが付いたので、選んだ地域も渡す
    simParams.push(`from=${from}`, `to=${to}`);
    if (mode === "pick" && l.items > 0) {
      simParams.push(`items=${PICK_ITEMS.filter((it) => picked[it.id]).map((it) => it.id).join(",")}`);
    }
  }
  const simHref = simParams.length ? `/simulator?${simParams.join("&")}` : "/simulator";
  const detailHref = inBldg ? "/unpan#bldg" : indoor ? "/unpan#tatemononai" : simHref;

  const pct = Math.min(100, l.pct);
  const kmLabel =
    km !== null && dist
      ? `片道${km}kmくらい${dist.fee > 0 ? `（距離 ${fmt(dist.fee)}円）` : "（市内扱い・0円）"}`
      : "—";
  const dayNote = DAYS.find((d) => d.k === day);
  /** 2名の作業はご予約制。2名＋当日のときだけ一言を出す（車を使わない／1LDK以上は日程を使わないので出さない） */
  // 建物の中は日程を選ばせていないので、2名なら当日かどうかにかかわらず出す（/unpan の簡易見積りと同じ）
  const reserveNotice = inBldg
    ? total !== null && crew === 2
      ? SAME_DAY_CREW2_NOTICE
      : null
    : !noStep && needsReservation(crew, day)
      ? SAME_DAY_CREW2_NOTICE
      : null;

  return (
    <section className="tp tp-est" id="estimate">
      <div className="tw tp-sec-in">
        <div className="tp-sec-hd">
          <p className="tp-eyebrow tp-num">ESTIMATE</p>
          <h2 className="tp-h2">
            3つ選んで、<span className="tp-mark">目安をみる</span>
          </h2>
          <p className="tp-sec-lead">
            選ぶたびに金額が変わります。階段・分解・時刻の指定は、詳しいシミュレーターで足せます。
          </p>
        </div>

        <div className="tp-est-grid">
          <div className="tp-est-l">
            {/* 手順1 */}
            <fieldset className="tp-step">
              <legend>
                <span className="tp-leg">
                  <span className="tp-step-n tp-num">1</span>
                  <span className="tp-step-t">何を運びますか？</span>
                </span>
              </legend>
              <div className="tp-g3">
                {MODES.map((m) => (
                  <button
                    type="button"
                    key={m.k}
                    className={mode === m.k ? "tp-opt on" : "tp-opt"}
                    aria-pressed={mode === m.k}
                    onClick={() => setMode(m.k)}
                  >
                    <span className="t">{m.t}</span>
                    <span className="s">{m.s}</span>
                  </button>
                ))}
              </div>
              <div className="tp-chips">
                {MODES2.map((m) => (
                  <button
                    type="button"
                    key={m.k}
                    className={mode === m.k ? "tp-chip on" : "tp-chip"}
                    aria-pressed={mode === m.k}
                    onClick={() => setMode(m.k)}
                  >
                    <span className="dot" />
                    {m.t}
                  </button>
                ))}
              </div>

              {mode === "pick" ? (
                <div className="tp-pick">
                  <p className="tp-pick-t">
                    運ぶ物をタップ <small>（もう一度タップで外れます）</small>
                  </p>
                  <div className="tp-chips">
                    {PICK_ITEMS.map((it) => (
                      <button
                        type="button"
                        key={it.id}
                        className={picked[it.id] ? "tp-chip on" : "tp-chip"}
                        aria-pressed={!!picked[it.id]}
                        onClick={() => setPicked((p) => ({ ...p, [it.id]: !p[it.id] }))}
                      >
                        <span className="dot" />
                        {it.name}
                      </button>
                    ))}
                  </div>
                  <div className="tp-load">
                    <div className="tp-bar">
                      <i className={l.over ? "over" : undefined} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="tp-note">
                      {l.over
                        ? `軽バンの荷台 積みきれません（${l.m3.toFixed(2)}m³）`
                        : `軽バンの荷台 約${pct}%（${l.m3.toFixed(2)}m³）`}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* 車を使わない。部屋の中だけ（定額）か、建物の中か。建物の中は動かす物を選ぶと金額が出る */}
              {indoor ? (
                <div className="tp-pick">
                  <p className="tp-pick-t">どこまで動かしますか？</p>
                  <div className="tp-chips">
                    {SCOPES.map((sc) => (
                      <button
                        type="button"
                        key={sc.k}
                        className={scope === sc.k ? "tp-chip on" : "tp-chip"}
                        aria-pressed={scope === sc.k}
                        onClick={() => setScope(sc.k)}
                      >
                        <span className="dot" />
                        {sc.t}
                      </button>
                    ))}
                  </div>
                  {inBldg ? (
                    <>
                      <p className="tp-pick-t">
                        動かす物をタップ <small>（もう一度タップで外れます）</small>
                      </p>
                      <div className="tp-chips">
                        {BLDG_ITEMS.map((it) => (
                          <button
                            type="button"
                            key={it.id}
                            className={picked[it.id] ? "tp-chip on" : "tp-chip"}
                            aria-pressed={!!picked[it.id]}
                            onClick={() => setPicked((p) => ({ ...p, [it.id]: !p[it.id] }))}
                          >
                            <span className="dot" />
                            {it.name}
                          </button>
                        ))}
                      </div>
                      {washers > 0 ? (
                        <div className="tp-chips">
                          <button
                            type="button"
                            className={install ? "tp-chip on" : "tp-chip"}
                            aria-pressed={install}
                            onClick={() => setInstall((v) => !v)}
                          >
                            <span className="dot" />
                            洗濯機の取り外し・取り付けもする
                          </button>
                        </div>
                      ) : null}
                      <p className="tp-note">
                        エレベーターがある場合の金額です。階段と分解・組み立ては、建物の中の料金のページで足せます。
                      </p>
                    </>
                  ) : null}
                </div>
              ) : null}
            </fieldset>

            {/* 手順2。車を使わない／1LDK以上のときは薄くして押せなくする（disabled でキーボードからも外れる） */}
            <fieldset className={noStep ? "tp-step dis" : "tp-step"} disabled={noStep}>
              <legend>
                <span className="tp-leg">
                  <span className="tp-step-n tp-num">2</span>
                  <span className="tp-step-t">どこから、どこへ？</span>
                </span>
              </legend>
              <div className="tp-ft">
                <label>
                  <span>いまの住まい</span>
                  <select className="tp-sel" value={from} onChange={(e) => setFrom(e.target.value as PlaceId)}>
                    {PLACES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="tp-arw" aria-hidden="true">
                  <svg width="40" height="20" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M2 10h32M26 3l8 7-8 7" />
                  </svg>
                </div>
                <label>
                  <span>引越し先</span>
                  <select className="tp-sel" value={to} onChange={(e) => setTo(e.target.value as PlaceId)}>
                    {PLACES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="tp-note">{`距離の目安：${kmLabel}`}</p>
            </fieldset>

            {/* 手順3 */}
            <fieldset className={noStep ? "tp-step dis" : "tp-step"} disabled={noStep}>
              <legend>
                <span className="tp-leg">
                  <span className="tp-step-n tp-num">3</span>
                  <span className="tp-step-t">いつ運びますか？</span>
                </span>
              </legend>
              <div className="tp-chips">
                {DAYS.map((d) => (
                  <button
                    type="button"
                    key={d.k}
                    className={day === d.k ? "tp-chip on" : "tp-chip"}
                    aria-pressed={day === d.k}
                    onClick={() => setDay(d.k)}
                  >
                    <span className="dot" />
                    {d.t}
                  </button>
                ))}
              </div>
              <p className="tp-note">{dayNote ? `${dayNote.n}（${coefText(day)}）` : ""}</p>
            </fieldset>
          </div>

          {/* 結果。数え上げの途中の数字は読み上げさせない（aria-hidden）。
              読み上げるのは着地した金額のほう（.tp-vh）だけ */}
          <aside className="tp-est-r" aria-live="polite">
            <div className="tp-card">
              <p className="tp-card-k">あなたの条件の目安</p>
              {total !== null ? (
                <>
                  <div className="tp-card-top">
                    <p className="tp-price">
                      <span className="tp-num v" aria-hidden="true">
                        {fmt(shown)}
                      </span>
                      <span className="tp-vh">{fmt(total)}</span>
                      <span className="u">円〜</span>
                    </p>
                    <p className="tp-card-sum">{summary}</p>
                  </div>
                  <div className="tp-rows">
                    {rows.map((r) => (
                      <div key={r.name}>
                        <span>{r.name}</span>
                        <b className="tp-num">{r.v}</b>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="tp-card-top">
                  <p className="tp-msg-t">{msg ? msg[0] : ""}</p>
                  <p className="tp-msg-s">{msg ? msg[1] : ""}</p>
                </div>
              )}
              {reserveNotice ? <p className="tp-card-warn">{reserveNotice}</p> : null}
              <div className="tp-card-acts">
                <Link href={detailHref} className="tp-btn tp-btn-y">
                  {indoor ? "建物の中の作業の料金をみる" : "この条件で詳しく見積もる"}
                </Link>
                <a href={LINE_URL} className="tp-btn tp-btn-o" target="_blank" rel="noopener noreferrer">
                  LINEで写真を送って相談
                </a>
              </div>
              <p className="tp-card-note">
                目安は、階段・分解・時刻指定がない場合の金額です。距離は地域の中心どうしで見ています。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
