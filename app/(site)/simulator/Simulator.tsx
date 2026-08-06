"use client";

import { Fragment, useState } from "react";
import ReasonList, { type Reason } from "../_components/ReasonList";
import { LINE_URL, TEL, TEL_HREF } from "@/lib/site";
import {
  CAP,
  CAT,
  COEF,
  COEF_OPTIONS,
  DISASSEMBLE_FEE,
  DIST,
  LONG_HAUL,
  ROUNDTRIP_MAX_KM,
  TIER,
  buildQuote,
  buyable,
  distOf,
  fmt,
  itemOf,
  itemWarnings,
  load,
  pickedItems,
  roundtripExtra,
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
 * D:\re'vive_toyama_marketing\price_simulator.html の移植。
 * **計算・分岐・文言は本人の承認済み。作り直していない。**
 * 数字は lib/pricing.ts が唯一の出どころで、/moving の表と同じものを見ている。
 *
 * 元の CSS は持ち込まず、(site) のデザインに載せ替えてある。
 * `--accent` を使うのは積載バーの超過表示だけ（このページで1箇所）。
 */

/** 距離表の最後の区分。これを超えると日帰りができない */
const MAX_KM = DIST[DIST.length - 1].km;
/** 「あと段ボール（大）約◯箱」の1箱ぶん */
const BOX_L_M3 = itemOf("box-l")?.m3 ?? 0.06;
/** 積み切れないときに基準にする区分（軽バン満載） */
const FULL_TIER = TIER[TIER.length - 1];

function toInt(v: string): number {
  return Math.max(0, parseInt(v || "0", 10) || 0);
}

export default function Simulator() {
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
  const [crew, setCrew] = useState<1 | 2>(1);
  const [kmInput, setKmInput] = useState("10");
  const [floorInput, setFloorInput] = useState("0");
  const [slot, setSlot] = useState(false);
  const [coefKey, setCoefKey] = useState<CoefKey>("heijitsu");
  const [copied, setCopied] = useState<"" | "ok" | "ng">("");

  const km = toInt(kmInput);
  const floors = toInt(floorInput);
  const l = load(counts);
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

  /** 明細を1本組み立てる。往復プランのときだけ extra が付く */
  function quote(t: Tier, extraAmount?: number): Quote | null {
    if (!dist) return null;
    return buildQuote({
      tier: t,
      m3: l.m3,
      crew,
      km,
      dist,
      floors,
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

  /* ---- 結果の見出しと金額 ---- */
  let cardLabel = "お 支 払 い 額";
  let cardValue = "—";
  let cardUnit = false;
  let cardNote = "税込・作業後のお支払い";

  if (l.items === 0) {
    // 初期表示のまま
  } else if (!dist) {
    cardLabel = "個 別 お 見 積 り";
    cardValue = "1泊2日";
    cardNote = "";
  } else if (normal) {
    cardValue = fmt(normal.total);
    cardUnit = true;
  } else {
    cardLabel = "積 み 切 れ ま せ ん";
    cardValue = "2つの方法";
    cardNote = "下のどちらかでご提案します";
  }

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
    const building: string[] = [];
    if (floors > 0) building.push(`階段 ${floors}フロア`);
    if (slot) building.push("時刻指定");
    if (building.length) lines.push(`・建物：${building.join(" / ")}`);
    const dnames = picked.filter((p) => dis[p.item.id]).map((p) => p.item.short ?? p.item.name);
    if (dnames.length) lines.push(`・分解・組み立て：${dnames.join(" / ")}`);
    lines.push(`・概算：${estimateText()}`);
    return lines.join("\n");
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

  /* ---- 積み切れないときの2案 ---- */
  const plans: Reason[] = [];

  if (l.items > 0 && !dist) {
    plans.push({
      n: "",
      title: `片道${MAX_KM}kmを超えるため、日帰りができません`,
      body: `国が定めるトラック運転者の1日の拘束時間は原則13時間です。積込・搬入・法定の休憩を引くと、運転に使えるのは片道4時間強、距離にして約${MAX_KM}kmが上限になります。${LONG_HAUL.map(
        (h) => `${h.place}で${yen(h.from)}〜`,
      ).join(
        "、",
      )}が目安です。帰り便に空きがある日と重なれば、3万円前後お安くできることがあります。`,
    });
  } else if (l.items > 0 && !normal) {
    if (roundtrip) {
      plans.push({
        n: "方法1",
        title: "往復プラン",
        body: `同じ日に2回に分けて運びます。片道${km}kmなら現実的な範囲です。出動料は1回分のままで、2回目の積み下ろしと走行のぶんだけ加算します。`,
        evidence: `${yen(roundtrip.total)}　この条件での往復`,
      });
    } else {
      plans.push({
        n: "方法1",
        title: "荷物を減らす",
        body: `片道${km}kmでは、同じ日に2往復するのは現実的ではありません。運ぶ物を${(
          l.m3 - CAP
        ).toFixed(2)}m³ぶん減らしていただくか、下の買取をご検討ください。`,
      });
    }

    if (pick.buy.length) {
      plans.push({
        n: "方法2",
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
        n: "",
        title: "買い取れない物があります",
        body: (
          <>
            <b>{pick.no.join("、")}</b>{" "}
            は買い取れません。中古の需要がないこと、寝具は衛生面でお預かりできないことが理由です。当社は一般廃棄物収集運搬業の許可がないため、有料でお引き取りすることもできません。処分される場合は、お住まいの市町村の大型ごみになります。
            <b>富山市であれば、戸別収集の予約は 076-428-4040 です。</b>
            出し方や、当日までに何を減らせばいいかのご相談には乗ります。
          </>
        ),
      });
    }
  }

  return (
    <div className="sim">
      {/* ---- 運ぶ物 ---- */}
      <fieldset className="sim-fs">
        <legend className="sim-leg">運 ぶ 物</legend>

        {CAT.map((g) => (
          <div className="sim-grp" key={g.id}>
            <div className="sim-gh">{g.name}</div>
            {g.items.map((it) => {
              const n = counts[it.id] ?? 0;
              return (
                <Fragment key={it.id}>
                  <div className={n > 0 ? "sim-row on" : "sim-row"}>
                    <div className="sim-nm">
                      {it.name}
                      <small>{it.size}</small>
                    </div>
                    <div className="sim-v">{it.m3.toFixed(2)}m³</div>
                    <div className="sim-st">
                      <button type="button" onClick={() => bump(it.id, -1)} aria-label={`${it.name} を1つ減らす`}>
                        −
                      </button>
                      <span className="sim-n">{n}</span>
                      <button type="button" onClick={() => bump(it.id, 1)} aria-label={`${it.name} を1つ増やす`}>
                        ＋
                      </button>
                    </div>
                  </div>

                  {/* 分解チェックは、その品目の数が1以上のときだけ出す */}
                  {it.disassemble && n > 0 ? (
                    <label className="sim-dis">
                      <input
                        type="checkbox"
                        checked={dis[it.id] ?? false}
                        onChange={(e) => toggleDis(it.id, e.target.checked)}
                      />
                      <span>
                        分解・組み立ても依頼する<em>1点につき {yen(DISASSEMBLE_FEE)}</em>
                      </span>
                    </label>
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        ))}

        <p className="sim-hint">
          よく運ぶ物だけを並べています。ここに無い物は、LINEで写真を送っていただければお答えします。
          <br />
          <b>容積は、それぞれの標準的な寸法（幅×奥行×高さ）から計算しています。</b>
          品目名の下に元の寸法を書いてあるので、お手持ちの物と比べて確認できます。段ボールは大手引越し業者が配っているサイズに合わせています（大＝3辺合計120cm、小＝100cm）。これより大きい箱をお使いの場合は、多めに数えてください。実際に伺って増減があった場合も、作業前に金額を確定してから始めます。
        </p>
      </fieldset>

      {/* ---- 積載バー。罫線1本と塗りだけ。--accent を使うのはここだけ ---- */}
      <div className={l.over ? "sim-load over" : "sim-load"} aria-live="polite">
        <div className="sim-lt">
          <span>積 載 率</span>
          <b>{l.pct}%</b>
        </div>
        <div className={l.over ? "sim-bar over" : "sim-bar"}>
          <i style={{ width: `${Math.min(100, l.pct)}%` }} />
        </div>
        <div className="sim-ls">
          {l.items === 0 ? (
            "運ぶ物を選んでください。"
          ) : l.over ? (
            <>
              <b>軽バン1台には積み切れません。</b>
              {`${l.m3.toFixed(2)}m³ ／ 積める目安 ${CAP.toFixed(1)}m³（${(l.m3 - CAP).toFixed(
                2,
              )}m³ 超過）`}
            </>
          ) : (
            `${l.m3.toFixed(2)}m³ ／ 積める目安 ${CAP.toFixed(1)}m³　あと段ボール（大）約${Math.floor(
              (CAP - l.m3) / BOX_L_M3,
            )}箱ぶん積めます。`
          )}
        </div>
        {warnings.map((w) => (
          <p className="sim-warn" key={w}>
            {w}
          </p>
        ))}
      </div>

      {/* ---- 作業人数 ---- */}
      <fieldset className="sim-fs">
        <legend className="sim-leg">作 業 人 数</legend>
        <div className="sim-opts">
          {([1, 2] as const).map((c) => (
            <label key={c}>
              <input
                type="radio"
                name="crew"
                checked={crew === c}
                onChange={() => {
                  setCrew(c);
                  setCopied("");
                }}
              />
              <span>
                {c}名<small>{c === 1 ? "通常はこちら" : "大型家具・3階以上・搬出入が同時"}</small>
              </span>
            </label>
          ))}
        </div>
        <p className="sim-hint">
          2名が必要かどうかは、こちらで判断してお伝えします。お客様に積み下ろしをお手伝いいただくことはありません。
          <br />
          人数を増やしても積める量は変わりません。作業が速く、安全になります。
        </p>
      </fieldset>

      {/* ---- 移動距離 ---- */}
      <fieldset className="sim-fs">
        <legend className="sim-leg">移 動 距 離（片 道）</legend>
        <div className="sim-num">
          <input
            id="sim-km"
            type="number"
            inputMode="numeric"
            value={kmInput}
            min={0}
            max={500}
            step={5}
            onChange={(e) => {
              setKmInput(e.target.value);
              setCopied("");
            }}
          />
          <label htmlFor="sim-km">km</label>
        </div>
        <p className="sim-hint">
          {dist
            ? `〜${dist.km}km の区分です。高速代・燃料はこの中に含みます。`
            : `片道${MAX_KM}kmを超えています。1泊2日での個別お見積りになります。`}
        </p>
      </fieldset>

      {/* ---- 建物の条件 ---- */}
      <fieldset className="sim-fs">
        <legend className="sim-leg">建 物 の 条 件</legend>
        <div className="sim-num">
          <label htmlFor="sim-floors">階段で上り下りするフロア数</label>
          <input
            id="sim-floors"
            type="number"
            inputMode="numeric"
            value={floorInput}
            min={0}
            max={6}
            step={1}
            onChange={(e) => {
              setFloorInput(e.target.value);
              setCopied("");
            }}
          />
          <span>フロア</span>
        </div>
        <div className="sim-chk">
          <label>
            <input
              type="checkbox"
              checked={slot}
              onChange={(e) => {
                setSlot(e.target.checked);
                setCopied("");
              }}
            />
            <span>
              時刻を指定する<em>◯時ちょうどに伺う</em>
            </span>
          </label>
        </div>
        <p className="sim-hint">
          エレベーターがある場合、1階どうしの場合は0フロアです。2階までの階段作業は出動料に含まれています。
          <br />
          家具の分解・組み立ては、上の品目リストで1点ずつお選びいただけます。
        </p>
      </fieldset>

      {/* ---- 日程 ---- */}
      <fieldset className="sim-fs">
        <legend className="sim-leg">ご 希 望 の 日 程</legend>
        <div className="sim-opts">
          {COEF_OPTIONS.map((o) => (
            <label key={o.key}>
              <input
                type="radio"
                name="coef"
                checked={coefKey === o.key}
                onChange={() => {
                  setCoefKey(o.key);
                  setCopied("");
                }}
              />
              <span>
                {o.label}
                <small>{o.note ?? "\u00a0"}</small>
              </span>
            </label>
          ))}
        </div>
        <p className="sim-hint">
          複数に当てはまる場合（土日かつ翌日など）は、<b>高いほうだけ</b>
          を適用します。重ねがけはしません。
        </p>
      </fieldset>

      {/* ---- 明細と合計。Spec と同じ枠 ---- */}
      <div className="spec sim-result" aria-live="polite">
        <div className="k">{cardLabel}</div>
        <div className="v mincho sim-total">
          {cardValue}
          {cardUnit ? <small>円</small> : null}
        </div>
        {cardNote ? <div className="sim-taxnote">{cardNote}</div> : null}

        {normal ? (
          <table className="sim-bd">
            <tbody>
              {normal.rows.map((r, i) => (
                <tr key={`${r.name}-${i}`}>
                  <td>
                    {r.name}
                    {r.note ? <small>{r.note}</small> : null}
                  </td>
                  <td>{yen(r.amount)}</td>
                </tr>
              ))}
              <tr className="sub">
                <td>基本料金</td>
                <td>{yen(normal.base)}</td>
              </tr>
              <tr>
                <td>
                  {normal.coefLabel}
                  <small>日程による係数</small>
                </td>
                <td>×{normal.coef.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </div>

      {/* ---- 積み切れないとき／300km超のご提案。箱で囲まない ---- */}
      {plans.length ? (
        <div className="sim-plans">
          <ReasonList items={plans} />
        </div>
      ) : null}

      {/* ---- 送信。フォームへのリンクはこのページには置かない ---- */}
      <div className="sim-send">
        <button type="button" className="btn btn-fill" onClick={copy} disabled={l.items === 0}>
          {copied === "ok"
            ? "コピーしました"
            : copied === "ng"
              ? "コピーできませんでした"
              : "この内容をコピー"}
        </button>
        <a className="btn" href={LINE_URL} target="_blank" rel="noopener noreferrer">
          LINEで送る
        </a>
        <a className="btn" href={TEL_HREF}>
          {TEL}
        </a>
      </div>

      <p className="sim-note">
        この画面の金額は目安です。正式なお見積りは、現地または写真を拝見してから確定します。確定したあとに金額が増えることはありません。
      </p>

      {/* price_simulator.html のフッターにあった但し書き。
          廃棄物の1行はサイト全体のフッターに入っているので、ここでは重ねない */}
      <p className="sim-note sub">
        有料駐車場しかない場合のパーキング代のみ、実費をご負担いただいています。それ以外に、当日お支払いいただく費用はありません。
        <br />
        買取のご依頼を同時にいただいた場合、買取金額をこのお支払い額から差し引きます。
      </p>
    </div>
  );
}
