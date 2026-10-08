"use client";

import { Fragment, Suspense, useEffect, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCountUp } from "../_components/useCountUp";
import { HANDOFF_KEY, type QuoteHandoff } from "@/lib/quote";
import { LINE_URL, TEL_HREF } from "@/lib/site";
import { PLACES, kmBetween, type PlaceId } from "@/lib/regions";
import {
  CAP,
  CAT,
  COEF,
  COEF_OPTIONS,
  DISASSEMBLE_FEE,
  DIST,
  LONG_HAUL,
  ROUNDTRIP_MAX_KM,
  SLOT_FEE,
  STAIRS_FEE,
  STAIRS_FREE_UPTO,
  STAIRS_MAX_FLOOR,
  TIER,
  buildQuote,
  buyable,
  crewFor,
  distOf,
  fmt,
  itemOf,
  itemWarnings,
  load,
  pickedItems,
  roundtripExtra,
  stairFloors,
  tierOf,
  yen,
  type CoefKey,
  type Counts,
  type Disassembles,
  type Quote,
  type Tier,
} from "@/lib/pricing";

/**
 * お見積りシミュレーター。
 *
 * 【92_price_pages】見た目をトップ（90・91）のトーンに作り直した。
 * 見た目・動き・文言の正は参考モック（top_mock_20261008/Simulator.dc.html）。
 * 左に5つの手順、右に結果（PCは貼り付く。860px以下は下）。
 *
 * ★**計算は変えていない。**変えたのは階段の数え方だけ（cc_task/92 §1-1）。
 *   「上り下りするフロア数」を入れてもらう形をやめ、運び出す階・運び込む階を選んでもらう。
 *   数え方は lib/pricing.ts の stairFloors() ひとつ。**ここに数字を書かないこと。**
 * ★数字は lib/pricing.ts が唯一の出どころで、/moving の表と同じものを見ている。
 * ★人数は選ばせない。荷物から決まる（crewFor）。
 * ★積みきれない・300km超・何も選んでいないときの分岐と、往復プランの提案は前のまま。
 *
 * 元は D:\re'vive_toyama_marketing\price_simulator.html の移植。
 */

/** 距離表の最後の区分。これを超えると日帰りができない */
const MAX_KM = DIST[DIST.length - 1].km;
/** 「あと段ボール大 約◯箱」の1箱ぶん */
const BOX_L_M3 = itemOf("box-l")?.m3 ?? 0.06;
/** 結果の欄の id。スマホの帯（pp-load-m）の飛び先 */
const RESULT_ID = "sim-result";
/** 積み切れないときに基準にする区分（軽バン満載） */
const FULL_TIER = TIER[TIER.length - 1];

/** 階のセレクト。0 は「エレベーターあり」（階段の料金がかからない） */
const FLOOR_OPTIONS: { v: number; t: string }[] = [
  { v: 0, t: "エレベーターあり" },
  ...Array.from({ length: STAIRS_MAX_FLOOR }, (_, i) => ({ v: i + 1, t: `${i + 1}階` })),
];

/** LINE に送る文章での階の書き方 */
function floorText(v: number): string {
  return v > 0 ? `${v}階（エレベーターなし）` : "エレベーターあり";
}

function toInt(v: string): number {
  return Math.max(0, parseInt(v || "0", 10) || 0);
}

function isPlace(v: string | null): v is PlaceId {
  return v !== null && PLACES.some((p) => p.id === v);
}

/** トップの「料金の目安」から引き継ぐ初期値。無いもの・不正なものは undefined（＝今の既定値のまま） */
type UrlInit = { km?: string; coefKey?: CoefKey; counts?: Counts; from?: PlaceId; to?: PlaceId };

/** 距離の入力欄の上限（下の <input max> と同じ） */
const KM_INPUT_MAX = 500;

/**
 * `/simulator?km=25&coef=donichi&items=fridge,washer-top&from=takaoka&to=toyama` を読む（90_top_renewal §4-4）。
 * **足したのは初期値の入口だけ。計算・表示は変えていない。**
 * from・to は 92 で足した（地域のセレクトをこちらにも置いたため）。無くても動く。
 *
 * useSearchParams を使う部品は、静的に書き出すページでは Suspense で包む必要があり、
 * 包んだ範囲はサーバーで描かれなくなる（node_modules/next/dist/docs/…/use-search-params.md）。
 * **シミュレーター本体を包むと、書き出される HTML から中身が消える。**
 * なので、URL を読むだけの何も描かない部品に分けて、それだけを包んでいる。
 */
function InitFromUrl({ apply }: { apply: (init: UrlInit) => void }) {
  const sp = useSearchParams();

  useEffect(() => {
    const init: UrlInit = {};

    const km = sp.get("km");
    if (km !== null && /^\d{1,3}$/.test(km) && Number(km) <= KM_INPUT_MAX) init.km = String(Number(km));

    const coef = sp.get("coef");
    if (coef !== null && Object.hasOwn(COEF, coef)) init.coefKey = coef as CoefKey;

    const items = sp.get("items");
    if (items) {
      const counts: Counts = {};
      for (const id of items.split(",")) if (itemOf(id)) counts[id] = 1;
      if (Object.keys(counts).length) init.counts = counts;
    }

    const from = sp.get("from");
    if (isPlace(from)) init.from = from;
    const to = sp.get("to");
    if (isPlace(to)) init.to = to;

    if (Object.keys(init).length) apply(init);
    // 開いたときに1回だけ読む。そのあとの入力を URL で上書きしない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

/** 積みきれないとき／300km超のご提案 */
type Plan = { tag?: string; title?: string; body: ReactNode; evidence?: string };

export default function Simulator() {
  const router = useRouter();
  /**
   * 個数と「分解を頼むか」は1つの state にまとめてある。
   * 別々にすると、数を0に戻したときのチェック外しを更新関数の中で書けず、
   * 素早く2回押したときに1回ぶんしか入らない（前回の値を読み損ねる）。
   */
  const [picked, setPicked] = useState<{ counts: Counts; dis: Disassembles }>({
    counts: {},
    dis: {},
  });
  const counts = picked.counts;
  const dis = picked.dis;
  const [from, setFrom] = useState<PlaceId>("toyama");
  const [to, setTo] = useState<PlaceId>("toyama");
  const [kmInput, setKmInput] = useState("10");
  /** 運び出す階・運び込む階。0 はエレベーターあり */
  const [floorOut, setFloorOut] = useState(0);
  const [floorIn, setFloorIn] = useState(0);
  const [slot, setSlot] = useState(false);
  const [coefKey, setCoefKey] = useState<CoefKey>("heijitsu");
  const [copied, setCopied] = useState<"" | "ok" | "ng">("");

  function applyUrlInit(init: UrlInit) {
    if (init.km !== undefined) setKmInput(init.km);
    if (init.coefKey !== undefined) setCoefKey(init.coefKey);
    if (init.counts !== undefined) setPicked({ counts: init.counts, dis: {} });
    if (init.from !== undefined) setFrom(init.from);
    if (init.to !== undefined) setTo(init.to);
  }

  const km = toInt(kmInput);
  const floors = stairFloors(floorOut, floorIn);
  const l = load(counts);
  /** 人数は選ばせない。荷物から決まる（lib/pricing.ts の crewFor） */
  const crew = crewFor(counts);
  const dist = distOf(km);
  const tier = tierOf(l.m3);
  const warnings = itemWarnings(counts);

  function bump(id: string, d: number) {
    setPicked((p) => {
      const next = Math.max(0, Math.min(99, (p.counts[id] ?? 0) + d));
      return {
        counts: { ...p.counts, [id]: next },
        // 0 に戻したら、分解のチェックも外す（元の実装と同じ）
        dis: next === 0 && p.dis[id] ? { ...p.dis, [id]: false } : p.dis,
      };
    });
    setCopied("");
  }

  function toggleDis(id: string, on: boolean) {
    setPicked((p) => ({ ...p, dis: { ...p.dis, [id]: on } }));
    setCopied("");
  }

  /** 地域を選ぶと km の欄に入る。県外（表にない行き先）のときは km をそのままにして、直接入れてもらう */
  function pickPlace(which: "from" | "to", v: PlaceId) {
    const a = which === "from" ? v : from;
    const b = which === "to" ? v : to;
    if (which === "from") setFrom(v);
    else setTo(v);
    const k = kmBetween(a, b);
    if (k !== null) setKmInput(String(k));
    setCopied("");
  }

  /** 明細を1本組み立てる。往復プランのときだけ extra が付く */
  function quote(t: Tier, extraAmount?: number): Quote | null {
    if (!dist) return null;
    return buildQuote({
      tier: t,
      m3: l.m3,
      crew,
      km,
      dist,
      floorOut,
      floorIn,
      slot,
      counts,
      disassembles: dis,
      coefKey,
      extra:
        extraAmount === undefined
          ? undefined
          : [
              {
                name: "往復（2回に分けて運びます）",
                note: "2回目の積み下ろしと走行ぶん",
                amount: extraAmount,
              },
            ],
    });
  }

  const normal = l.items > 0 && dist && tier ? quote(tier) : null;
  const roundtrip =
    l.items > 0 && dist && !tier && km <= ROUNDTRIP_MAX_KM
      ? quote(FULL_TIER, roundtripExtra(crew, dist))
      : null;
  const pick = buyable(counts);

  /* ---- 結果。金額が出ないときは、代わりの見出しと説明 ---- */
  let msg: [string, string] | null = null;
  if (l.items === 0) {
    msg = ["運ぶ物を選んでください", "＋を押すと、ここに金額が出ます。"];
  } else if (!dist) {
    msg = [`片道${MAX_KM}kmを超えています`, "1泊2日での個別のお見積りになります。"];
  } else if (!normal) {
    msg = [
      "1台に積みきれない量です",
      roundtrip
        ? `片道${ROUNDTRIP_MAX_KM}kmまでなら、同じ日に2往復で運べます。この条件での往復は${yen(roundtrip.total)}です。`
        : "荷物を減らすか、売れる物を買取に回すご相談になります。",
    ];
  }
  const total = normal ? normal.total : null;
  const shown = useCountUp(total, 0);
  /** スマホの帯で、金額の代わりに出す短い一言（分岐は上の msg と同じ順） */
  const barMsg = l.items === 0 ? "品目を選んでください" : !dist ? "個別にお見積り" : "積みきれません";

  /* ---- LINE に貼るテキスト ---- */
  function estimateText(): string {
    if (!dist) return "個別お見積り（1泊2日）";
    if (normal) return yen(normal.total);
    if (roundtrip) return `往復プラン ${yen(roundtrip.total)}`;
    return "軽バン1台に積み切れません（荷物を減らすか、買取のご相談）";
  }

  function conditionText(): string {
    const picked = pickedItems(counts);
    const lines = [
      "【お見積りの条件】",
      `・運ぶ物：${picked.map((p) => `${p.item.short ?? p.item.name} ${p.n}`).join(" / ")}`,
      `・積載：${l.m3.toFixed(2)}m³（${tier ? tier.name : "軽バン1台に積み切れません"}）`,
      `・作業員：${crew}名`,
      `・距離：片道 ${km}km`,
      `・日程：${COEF[coefKey].label}`,
    ];
    // 階は、料金がかからないときも書く（何階かが分かれば、当日の段取りが決まる）
    const building = [`運び出す ${floorText(floorOut)}`, `運び込む ${floorText(floorIn)}`];
    if (floors > 0) building.push(`階段 ${floors}フロア`);
    if (slot) building.push("時刻指定");
    lines.push(`・建物：${building.join(" / ")}`);
    const dnames = picked.filter((p) => dis[p.item.id]).map((p) => p.item.short ?? p.item.name);
    if (dnames.length) lines.push(`・分解・組み立て：${dnames.join(" / ")}`);
    lines.push(`・概算：${estimateText()}`);
    return lines.join("\n");
  }

  /* ---- /contact への引き継ぎ ----
     **金額は画面に出しているものと同じ変数から取る。**
     ここで計算し直すと、お客様が見た数字と竜司さんが見る数字がずれる余地ができる。
     URLには乗せない（長くなるうえ、そのURLを共有すると条件がついて回る）。
     sessionStorage なので、タブを閉じれば消える。 */
  function handoffAmount(): string {
    if (!dist) return "個別お見積り（1泊2日）";
    if (normal) return yen(normal.total);
    if (roundtrip) return yen(roundtrip.total);
    return "軽バン1台に積み切れません（荷物を減らすか、買取のご相談）";
  }

  function buildHandoff(): QuoteHandoff {
    const items = pickedItems(counts);
    return {
      v: 1,
      at: new Date().toISOString(),
      items: items.map((p) => ({ name: p.item.short ?? p.item.name, n: p.n })),
      m3: l.m3,
      pct: l.pct,
      tier: tier ? tier.name : null,
      crew,
      km,
      dist: dist ? { km: dist.km, area: dist.area } : null,
      // 料金がかかるフロア数（stairFloors）。明細の「階段 ◯フロア」と同じ数
      floors,
      slot,
      disassembles: items.filter((p) => dis[p.item.id]).map((p) => p.item.short ?? p.item.name),
      coefLabel: COEF[coefKey].label,
      coef: COEF[coefKey].coef,
      amount: handoffAmount(),
      roundtrip: !normal && roundtrip !== null,
    };
  }

  function requestQuote() {
    try {
      sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(buildHandoff()));
    } catch {
      // 保存できない設定（プライベートモードなど）でも、フォームへは進める。
      // その場合フォームには引き継ぎのブロックが出ないだけ
    }
    router.push("/contact");
  }

  async function copy() {
    const text = conditionText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied("ok");
      return;
    } catch {
      // クリップボードAPIが使えない環境（古い端末・http）の逃げ道
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(ok ? "ok" : "ng");
    } catch {
      setCopied("ng");
    }
  }

  /* ---- 積み切れないときの2案／300km超 ---- */
  const plans: Plan[] = [];

  if (l.items > 0 && !dist) {
    plans.push({
      // 92b：見出しは外した。上の紺の面が「片道300kmを超えています」と言っているので、同じことを2回言わない
      // 92a：拘束時間（13時間）の説明は外した。/moving の「日帰りは、片道300kmまで」と同じ言い方にそろえる
      body: `日帰りは片道${MAX_KM}kmまで。${LONG_HAUL.map((h) => h.name.replace("方面", "")).join("・")}方面は1泊2日で、個別にお見積りします。`,
    });
  } else if (l.items > 0 && !normal) {
    if (roundtrip) {
      plans.push({
        tag: "方法1",
        title: "往復プラン",
        body: `同じ日に2回に分けて運びます。片道${km}kmなら現実的な範囲です。出動料は1回分のままで、2回目の積み下ろしと走行のぶんだけ加算します。`,
        evidence: `${yen(roundtrip.total)}　この条件での往復`,
      });
    } else {
      plans.push({
        tag: "方法1",
        title: "荷物を減らす",
        body: `片道${km}kmでは、同じ日に2往復するのは現実的ではありません。運ぶ物を${(
          l.m3 - CAP
        ).toFixed(2)}m³ぶん減らしていただくか、下の買取をご検討ください。`,
      });
    }

    if (pick.buy.length) {
      plans.push({
        tag: "方法2",
        title: "値のつく物を、その場で買い取る",
        body: (
          <>
            選ばれた中では <b>{pick.buy.join("、")}</b>{" "}
            が査定の対象です。古物商許可を持っているので、出発前にその場で査定して、買取金額をお引越し代金から差し引けます。
            <b>運ぶ量が減れば、お引越し自体の料金も下がります。</b>
            家電は製造5年以内が目安です。査定だけで終わっても費用はいただきません。
          </>
        ),
        evidence: "査定無料　その場で現金",
      });
    }

    if (pick.no.length) {
      plans.push({
        title: "買い取れない物があります",
        body: (
          <>
            <b>{pick.no.join("、")}</b>{" "}
            は買い取れません。中古の需要がないこと、寝具は衛生面でお預かりできないことが理由です。廃棄物を回収する許可がないため、有料でお引き取りすることもできません。処分される場合は、お住まいの市町村の大型ごみになります。
            <b>富山市であれば、戸別収集の予約は 076-428-4040 です。</b>
            出し方や、当日までに何を減らせばいいかのご相談には乗ります。
          </>
        ),
      });
    }
  }

  const stairsHint = `${STAIRS_FREE_UPTO}階までは料金に込み。${STAIRS_FREE_UPTO + 1}階から1フロアにつき${yen(STAIRS_FEE)}です。`;
  const dayNote = COEF_OPTIONS.find((o) => o.key === coefKey)?.note;

  return (
    <div className="pp-est">
      <Suspense fallback={null}>
        <InitFromUrl apply={applyUrlInit} />
      </Suspense>

      <div className="pp-est-l">
        {/* ---- 1 運ぶ物 ---- */}
        <fieldset className="tp-step">
          <legend>
            <span className="tp-leg">
              <span className="tp-step-n tp-num">1</span>
              <span className="tp-step-t">運ぶ物</span>
            </span>
          </legend>

          {CAT.map((g) => (
            <div className="pp-grp" key={g.id}>
              {/* 品目の見出しは字間を空けた形（「大 型 家 具」）で定義してある。ここでは詰めて出す */}
              <div className="pp-grp-h">{g.name.replace(/ /g, "")}</div>
              {g.items.map((it) => {
                const n = counts[it.id] ?? 0;
                return (
                  <Fragment key={it.id}>
                    <div className={n > 0 ? "pp-row on" : "pp-row"}>
                      <div className="pp-row-n">
                        {it.name}
                        <small>{it.size}</small>
                      </div>
                      <span className="pp-row-v tp-num">{`${it.m3.toFixed(2)}m³`}</span>
                      <div className="pp-stp">
                        <button type="button" onClick={() => bump(it.id, -1)} aria-label={`${it.name} を1つ減らす`}>
                          −
                        </button>
                        <span className="tp-num">{n}</span>
                        <button
                          type="button"
                          className="plus"
                          onClick={() => bump(it.id, 1)}
                          aria-label={`${it.name} を1つ増やす`}
                        >
                          ＋
                        </button>
                      </div>
                    </div>

                    {/* 分解チェックは、その品目の数が1以上のときだけ出す */}
                    {it.disassemble && n > 0 ? (
                      <label className="pp-dis">
                        <input
                          type="checkbox"
                          checked={dis[it.id] ?? false}
                          onChange={(e) => toggleDis(it.id, e.target.checked)}
                        />
                        <span>
                          分解・組み立ても依頼する<em>{`1点につき ${yen(DISASSEMBLE_FEE)}`}</em>
                        </span>
                      </label>
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
          ))}

          {/* 荷台のバー。品目リストの下に貼り付いてくる。CAP を超えたら赤。
              ★aria-live は付けない。読み上げるのは下の結果の欄（#sim-result）だけ。
                ここにも付けると、＋を押すたびに同じ金額を2回読む */}
          <div className="pp-load">
            {/* PC（861px以上）の見出し。スマホでは下の pp-load-m に替わる */}
            <div className="pp-load-t">
              <span>軽バンの荷台</span>
              <span className="tp-num">{l.over ? `積みきれません ${l.pct}%` : `${l.pct}%`}</span>
            </div>
            {/* スマホ（860px以下）だけ。結果の欄が品目リストのずっと下にあるので、選びながら金額が見えるようにする。
                金額は結果の欄と同じ変数（normal.total・shown）。押すと結果の欄へ動く */}
            <a className="pp-load-m" href={`#${RESULT_ID}`}>
              <span className="a">
                {"荷台 "}
                <b className="tp-num">{`${l.pct}%`}</b>
              </span>
              <span className="sep" aria-hidden="true">
                ｜
              </span>
              {normal ? (
                <span className="b">
                  {"目安 "}
                  <b className="tp-num" aria-hidden="true">
                    {fmt(shown)}
                  </b>
                  <span className="tp-vh">{fmt(normal.total)}</span>円
                </span>
              ) : (
                <span className="b msg">{barMsg}</span>
              )}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="M2 5l5 5 5-5" />
              </svg>
              <span className="tp-vh">結果へ</span>
            </a>
            <div className="tp-bar">
              <i className={l.over ? "over" : undefined} style={{ width: `${Math.min(100, l.pct)}%` }} />
            </div>
            <p className="tp-note">
              {l.items === 0
                ? "＋を押して、運ぶ物を選んでください。"
                : l.over
                  ? `${l.m3.toFixed(2)}m³ ／ 積める目安 ${CAP.toFixed(1)}m³（${(l.m3 - CAP).toFixed(2)}m³ 超過）`
                  : `${l.m3.toFixed(2)}m³ ／ 積める目安 ${CAP.toFixed(1)}m³　あと段ボール大 約${Math.floor(
                      (CAP - l.m3) / BOX_L_M3,
                    )}箱`}
            </p>
          </div>

          {warnings.map((w) => (
            <p className="pp-warn" key={w}>
              {w}
            </p>
          ))}
        </fieldset>

        {/* ---- 2 作業員（選べない。荷物から決まる） ---- */}
        <fieldset className="tp-step">
          <legend>
            <span className="tp-leg">
              <span className="tp-step-n tp-num">2</span>
              <span className="tp-step-t">作業員</span>
            </span>
          </legend>
          <div className="pp-crew" aria-live="polite">
            <b className="tp-num">{`${crew}名`}</b>
            <span>
              {crew === 2
                ? "大型の家具・家電があるので、2名で伺います。"
                : "大型の家具・家電がないので、1名で伺います。"}
            </span>
          </div>
          <p className="tp-note">人数は荷物で決まります。選ぶ必要はありません。</p>
        </fieldset>

        {/* ---- 3 どこから、どこへ？ ---- */}
        <fieldset className="tp-step">
          <legend>
            <span className="tp-leg">
              <span className="tp-step-n tp-num">3</span>
              <span className="tp-step-t">どこから、どこへ？</span>
            </span>
          </legend>
          <div className="tp-ft">
            <label>
              <span>いまの住まい</span>
              <select className="tp-sel" value={from} onChange={(e) => pickPlace("from", e.target.value as PlaceId)}>
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
              <select className="tp-sel" value={to} onChange={(e) => pickPlace("to", e.target.value as PlaceId)}>
                {PLACES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="pp-km">
            <label htmlFor="sim-km">片道</label>
            <input
              id="sim-km"
              className="tp-num"
              type="number"
              inputMode="numeric"
              value={kmInput}
              min={0}
              max={KM_INPUT_MAX}
              step={5}
              onChange={(e) => {
                setKmInput(e.target.value);
                setCopied("");
              }}
            />
            <span>km</span>
            <span className="tp-note">
              {dist
                ? dist.fee > 0
                  ? `距離 ${yen(dist.fee)}`
                  : `市内扱い・${yen(dist.fee)}`
                : `片道${MAX_KM}kmを超えています`}
            </span>
          </div>
          <p className="tp-note">県外は、片道の距離を入れてください。</p>
        </fieldset>

        {/* ---- 4 建物 ---- */}
        <fieldset className="tp-step">
          <legend>
            <span className="tp-leg">
              <span className="tp-step-n tp-num">4</span>
              <span className="tp-step-t">建物（エレベーターなしの場合）</span>
            </span>
          </legend>
          <div className="tp-ft pp-f2">
            <label>
              <span>運び出す階</span>
              <select
                className="tp-sel"
                value={floorOut}
                onChange={(e) => {
                  setFloorOut(toInt(e.target.value));
                  setCopied("");
                }}
              >
                {FLOOR_OPTIONS.map((f) => (
                  <option key={f.v} value={f.v}>
                    {f.t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>運び込む階</span>
              <select
                className="tp-sel"
                value={floorIn}
                onChange={(e) => {
                  setFloorIn(toInt(e.target.value));
                  setCopied("");
                }}
              >
                {FLOOR_OPTIONS.map((f) => (
                  <option key={f.v} value={f.v}>
                    {f.t}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="tp-note">{stairsHint}</p>
          <div className="tp-chips">
            <button
              type="button"
              className={slot ? "tp-chip on" : "tp-chip"}
              aria-pressed={slot}
              onClick={() => {
                setSlot((v) => !v);
                setCopied("");
              }}
            >
              時刻を指定する
              <small>{`＋${yen(SLOT_FEE)}`}</small>
            </button>
          </div>
        </fieldset>

        {/* ---- 5 日程 ---- */}
        <fieldset className="tp-step">
          <legend>
            <span className="tp-leg">
              <span className="tp-step-n tp-num">5</span>
              <span className="tp-step-t">日程</span>
            </span>
          </legend>
          <div className="tp-chips">
            {COEF_OPTIONS.map((o) => (
              <button
                type="button"
                key={o.key}
                className={coefKey === o.key ? "tp-chip on" : "tp-chip"}
                aria-pressed={coefKey === o.key}
                onClick={() => {
                  setCoefKey(o.key);
                  setCopied("");
                }}
              >
                {o.label}
                <small>{`×${COEF[o.key].coef.toFixed(2)}`}</small>
              </button>
            ))}
          </div>
          <p className="tp-note">{dayNote ?? "いくつか当てはまるときは、高いほうだけ。重ねがけはしません。"}</p>
        </fieldset>

        {/* ---- 但し書き。モックには無いが、金額にかかわる決まりなので小さく残してある ---- */}
        <div className="pp-sim-notes">
          <p className="pp-fine">
            この画面の金額は目安です。正式なお見積りは、現地または写真を拝見してから確定します。確定したあとに金額が増えることはありません。
          </p>
          <p className="pp-fine">
            高速道路を使う場合は、その分を事前のお見積りでお伝えします。有料駐車場しかない場合のパーキング代のみ、実費をご負担いただいています。それ以外に、当日お支払いいただく費用はありません。買取のご依頼を同時にいただいた場合、買取金額をこのお支払い額から差し引きます。
          </p>
          <details className="pp-more">
            <summary>容積の数え方</summary>
            <p className="pp-fine">
              よく運ぶ物だけを並べています。ここに無い物は、LINEで写真を送っていただければお答えします。容積は、それぞれの標準的な寸法（幅×奥行×高さ）から計算しています。品目名の下に元の寸法を書いてあるので、お手持ちの物と比べて確認できます。段ボールは大手引越し業者が配っているサイズに合わせています（大＝3辺合計120cm、小＝100cm）。これより大きい箱をお使いの場合は、多めに数えてください。実際に伺って増減があった場合も、作業前に金額を確定してから始めます。
            </p>
          </details>
        </div>
      </div>

      {/* ---- 結果。数え上げの途中の数字は読み上げさせない（aria-hidden）。
          読み上げるのは着地した金額のほう（.tp-vh）だけ。
          ご提案（plans）が出ているときは貼り付けない（結果が画面より長くなり、下が読めなくなる） ---- */}
      <aside className={plans.length ? "pp-est-r free" : "pp-est-r"} id={RESULT_ID} aria-live="polite">
        <div className="tp-card">
          <p className="tp-card-k">お見積り</p>
          {normal ? (
            <>
              <div className="tp-card-top">
                <p className="tp-price">
                  <span className="tp-num v" aria-hidden="true">
                    {fmt(shown)}
                  </span>
                  <span className="tp-vh">{fmt(normal.total)}</span>
                  <span className="u">円</span>
                </p>
                <p className="tp-card-sum">税込・作業のあとにお支払い</p>
              </div>
              <div className="tp-rows">
                {normal.rows.map((r, i) => (
                  <div key={`${r.name}-${i}`}>
                    <span>{r.name}</span>
                    <b className="tp-num">{fmt(r.amount)}</b>
                  </div>
                ))}
                <div>
                  <span>{`日程 ${normal.coefLabel}`}</span>
                  <b className="tp-num">{`×${normal.coef.toFixed(2)}`}</b>
                </div>
              </div>
            </>
          ) : (
            <div className="tp-card-top">
              <p className="tp-msg-t">{msg ? msg[0] : ""}</p>
              <p className="tp-msg-s">{msg ? msg[1] : ""}</p>
            </div>
          )}

          {/* 送る。LINE のボタンは、条件を写してから LINE を開く（前は「コピー」と「LINEで送る」の2つだった）。
              リンクなので、JS がなくても LINE は開く。運ぶ物を選ぶ前は写さない */}
          <div className="tp-card-acts">
            <a
              className="tp-btn tp-btn-y"
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (l.items > 0) void copy();
              }}
            >
              この内容をLINEで送る
            </a>
            <a className="tp-btn tp-btn-o" href={TEL_HREF}>
              電話で相談する
            </a>
            <p className="tp-card-note" role="status">
              {copied === "ok"
                ? "内容をコピーしました。LINEのトークに貼り付けて送ってください。"
                : copied === "ng"
                  ? "コピーできませんでした。LINEのトークで条件をお知らせください。"
                  : "押すと、この内容をコピーしてLINEを開きます。トークに貼り付けて送ってください。"}
            </p>
            {/* 24_form §2 の引き継ぎ。入力した条件と金額をそのまま /contact へ持っていく */}
            <button type="button" className="pp-to-form" onClick={requestQuote} disabled={l.items === 0}>
              この内容で見積りフォームへ
            </button>
          </div>
        </div>

        {/* ---- 積み切れないとき／300km超のご提案 ---- */}
        {plans.length ? (
          <div className="pp-plans">
            {plans.map((p) => (
              <div className="pp-plan" key={p.title ?? "note"}>
                {p.tag ? <span className="tag">{p.tag}</span> : null}
                {p.title ? <h3>{p.title}</h3> : null}
                <p>{p.body}</p>
                {p.evidence ? <span className="tp-rs-e">{p.evidence}</span> : null}
              </div>
            ))}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
