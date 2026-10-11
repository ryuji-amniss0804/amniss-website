"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { INBUILDING_CAP, INBUILDING_MOVE_FEE, inBuildingParts, inBuildingTotal } from "../_fees";
import { LINE_URL } from "@/lib/site";
import { HANDOFF_KEY, type QuoteHandoff } from "@/lib/quote";
import { fmt, yen } from "@/lib/pricing";

/**
 * /unpan「建物の中」の簡易見積り。数を選ぶと、その場で金額が出る。
 *
 * 見た目・文言・計算の正はモック（mock/unpan_bldg_mock.html）。
 *
 * ★**ここに金額の数字も式も書かないこと。**合計は `inBuildingTotal()`、
 *   内訳は `inBuildingParts()`（どちらも _fees.ts）が返したものを並べるだけ。
 * ★**人数は選ばせない。**大型が1点でもあれば2名（引越しの crewFor と同じ考え方）。
 * ★日程は選ばせない。建物の中は日程係数を掛けない（_fees.ts）。
 *
 * 本文は {} を混ぜると text node が割れて <!-- --> が入るので、
 * 文字列はテンプレートリテラルで1本にしてから出す。
 */

type State = {
  /** 小型の数（1人で持てる物） */
  small: number;
  /** 大型の数（2人で運ぶ物） */
  large: number;
  /** うち、洗濯機の取り外し・取り付けの数。大型の数まで */
  wash: number;
  /** 分解・組み立ての数。合計点数まで */
  dis: number;
  /** エレベーターがないときの階段の階数。最小1 */
  floors: number;
  elevator: boolean;
  /** 金庫・ピアノがある */
  heavy: boolean;
};

/** 初期値。大型1・洗濯機の取り付け1・エレベーターあり */
const INITIAL: State = { small: 0, large: 1, wash: 1, dis: 0, floors: 1, elevator: true, heavy: false };

/** 1つの欄に入れられる数の上限（引き継ぎの検証 lib/quote.ts の上限と同じ） */
const MAX_COUNT = 99;

/** どれかを動かしたら、ほかの数を決まりの範囲に収め直す */
function clamp(s: State): State {
  const small = Math.max(0, Math.min(MAX_COUNT, s.small));
  const large = Math.max(0, Math.min(MAX_COUNT, s.large));
  return {
    ...s,
    small,
    large,
    wash: Math.max(0, Math.min(s.wash, large)),
    dis: Math.max(0, Math.min(s.dis, small + large)),
    floors: Math.max(1, Math.min(MAX_COUNT, s.floors)),
  };
}

type CountKey = "small" | "large" | "wash" | "dis" | "floors";

const HEAVY_DENY = "ピアノ・金庫などの重量物はお受けしていません。";

export default function InBuildingEstimate() {
  const router = useRouter();
  const [s, setS] = useState<State>(INITIAL);

  const bump = (k: CountKey, d: number) => setS((p) => clamp({ ...p, [k]: p[k] + d }));

  const items = s.small + s.large;
  const crew: 1 | 2 = s.large > 0 ? 2 : 1;
  const input = {
    items,
    crew,
    floors: s.elevator ? 0 : s.floors,
    disassembles: s.dis,
    installs: s.wash,
  };
  /** 金額を出せるか。金庫・ピアノがあるとき、何も選んでいないときは出さない */
  const ok = !s.heavy && items > 0;
  const total = ok ? inBuildingTotal(input) : null;

  /* ---- 内訳の1行。数字は inBuildingParts が返したものだけ ---- */
  let breakdown = "";
  if (ok) {
    const p = inBuildingParts(input);
    const parts: [string, number][] = [
      ["出動料", p.depart],
      [`${items}点 × ${fmt(INBUILDING_MOVE_FEE)}`, p.move],
    ];
    if (p.crew2) parts.push(["2人目", p.crew2]);
    if (p.install) parts.push([`洗濯機の取り外し・取り付け ×${s.wash}`, p.install]);
    if (p.disassemble) parts.push([`分解・組み立て ×${s.dis}`, p.disassemble]);
    breakdown = parts.map(([name, v]) => `${name}　${yen(v)}`).join("　＋　");
    if (p.capped) breakdown += `　→ 上限 ${yen(INBUILDING_CAP)}`;
    if (p.stairs) breakdown += `　＋　階段 ${input.floors}フロア　${yen(p.stairs)}`;
  } else if (!s.heavy) {
    breakdown = "動かす物の数を選んでください。";
  }

  const notice = s.heavy
    ? HEAVY_DENY
    : !ok
      ? ""
      : crew === 2
        ? `作業員${crew}名で伺います（${crew}名の作業はご予約制です。当日のご相談は電話かLINEで）。`
        : `作業員${crew}名で伺います。`;

  /* ---- /contact への引き継ぎ ----
     /simulator と同じ仕組み（lib/quote.ts・sessionStorage）に乗せる。
     **金額と内訳は、画面に出しているものと同じ変数から取る。**ここで計算し直さない。
     建物の中の作業なので、積載・距離・日程は運ばない（inBuilding が入っていると /contact とメールは別の行を出す） */
  function requestQuote() {
    if (total === null) return;
    const handoff: QuoteHandoff = {
      v: 1,
      at: new Date().toISOString(),
      items: [],
      m3: 0,
      pct: 0,
      tier: null,
      crew,
      km: 0,
      dist: null,
      floors: input.floors,
      slot: false,
      disassembles: [],
      coefLabel: "",
      coef: 0,
      amount: yen(total),
      roundtrip: false,
      inBuilding: { small: s.small, large: s.large, installs: s.wash, disassembles: s.dis, breakdown },
    };
    try {
      sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
    } catch {
      // 保存できない設定（プライベートモードなど）でも、フォームへは進める。
      // その場合フォームには引き継ぎのブロックが出ないだけ
    }
    router.push("/contact");
  }

  const counts: { k: CountKey; name: string; sub?: string }[] = [
    { k: "small", name: "小型の物", sub: "1人で持てる物（棚・テレビ・段ボールなど）" },
    { k: "large", name: "大型の物", sub: "2人で運ぶ物（冷蔵庫・洗濯機・ベッド・ソファなど）" },
    { k: "wash", name: "うち、洗濯機の取り外し・取り付け" },
    { k: "dis", name: "分解・組み立てが要る物", sub: "ベッドなど" },
  ];
  const floorsRow = { k: "floors" as const, name: "階段で上り下りする階数", sub: "2階→1階なら1フロア" };

  const stepper = (c: { k: CountKey; name: string; sub?: string }) => (
    <div className="pp-inb-q" key={c.k}>
      <div className="l">
        {c.name}
        {c.sub ? <small>{c.sub}</small> : null}
      </div>
      <div className="pp-stp">
        <button type="button" onClick={() => bump(c.k, -1)} aria-label={`${c.name} を1つ減らす`}>
          −
        </button>
        <span className="tp-num">{s[c.k]}</span>
        <button type="button" className="plus" onClick={() => bump(c.k, 1)} aria-label={`${c.name} を1つ増やす`}>
          ＋
        </button>
      </div>
    </div>
  );

  const seg = (name: string, opts: { t: string; on: boolean; pick: () => void }[]) => (
    <div className="pp-inb-q" role="group" aria-label={name}>
      <div className="l">{name}</div>
      <div className="pp-inb-seg">
        {opts.map((o) => (
          <button
            type="button"
            key={o.t}
            className={o.on ? "tp-chip on" : "tp-chip"}
            aria-pressed={o.on}
            onClick={o.pick}
          >
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pp-inb">
      <h4>自分の条件で計算する</h4>
      <p className="pp-inb-hint">同じ建物の中で動かす場合。数を選ぶと、その場で金額が出ます。</p>

      {counts.map(stepper)}
      {seg("エレベーター", [
        { t: "あり", on: s.elevator, pick: () => setS((p) => ({ ...p, elevator: true })) },
        { t: "なし", on: !s.elevator, pick: () => setS((p) => ({ ...p, elevator: false })) },
      ])}
      {s.elevator ? null : stepper(floorsRow)}
      {seg("金庫・ピアノがある", [
        { t: "ない", on: !s.heavy, pick: () => setS((p) => ({ ...p, heavy: false })) },
        { t: "ある", on: s.heavy, pick: () => setS((p) => ({ ...p, heavy: true })) },
      ])}

      <div className="pp-inb-out" aria-live="polite">
        <div className="pp-inb-total">
          <span className="k">概算（税込）</span>
          {s.heavy ? (
            <p className="tp-price">
              <span className="tp-num v">—</span>
            </p>
          ) : (
            <p className="tp-price">
              <span className="tp-num v">{fmt(total ?? 0)}</span>
              <span className="u">円</span>
            </p>
          )}
        </div>
        {breakdown ? <p className="tp-card-sum">{breakdown}</p> : null}
        {notice ? <p className="tp-card-warn">{notice}</p> : null}
      </div>

      <div className="pp-inb-acts">
        <a className="tp-btn tp-btn-y" href={LINE_URL} target="_blank" rel="noopener noreferrer">
          LINEで写真を送る
        </a>
        <button type="button" className="tp-btn tp-btn-o" onClick={requestQuote} disabled={total === null}>
          この内容で見積りフォームへ
        </button>
      </div>
    </div>
  );
}
