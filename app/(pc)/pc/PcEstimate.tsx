"use client";

import Link from "next/link";
import { useState } from "react";
import { useCountUp } from "@/app/(site)/_components/useCountUp";
import { SYMPTOMS, yen } from "@/lib/pc";
import PcIcon from "../_components/PcIcon";
import { AREAS, laborOf } from "../_lib/estimate";

/**
 * トップ（/pc）の「症状を押すと、費用の目安が出ます」。94 §4-2。
 * 見た目・動きの正は参考モック（top_mock_20261008/PcTop.dc.html）。
 *
 * 左：手順1 症状のカード10枚（押すと緑）／手順2 伺う地域のセレクト
 * 右：紺の面に、費用の目安・考えられる原因・当日測るところ（PC では sticky）
 *
 * ⚠ 金額の数字をこのファイルに書かないこと。症状は `lib/pc.ts` の `SYMPTOMS`、
 *   金額は `laborOf()`（＝`priceOf()`）、出張費は `AREAS`（＝`TRAVEL`）から出す。
 *   計算は /pc/symptom の道具と同じ関数（`app/(pc)/_lib/estimate.ts`）を通る。
 * ⚠ これは**判定ではなく目安**。「直る／直らない」と断定する文言を足さないこと。
 *
 * 【最初の HTML】サーバーが出すのは、最初の選択（下の INITIAL_*）の金額・原因・測るところ。
 * 残りの9症状のカードの文字（症状名と補足）も最初から HTML に入っている。
 *
 * 【読み上げ】`aria-live` は結果の面（右の aside）だけ。数え上げている途中の数字は
 * 読ませず（aria-hidden）、着地の金額だけを見えない文字で渡している（本体の CountUp と同じ）。
 * スマホの帯には `aria-live` を付けない（本体の 92c と同じ）。
 *
 * 【スマホ（860px以下）】症状のカードの下についてくる帯に目安を出す。押すと結果の面へ動く。
 */

/** 最初に選んである症状と地域（94 §4-2：「異音・熱くて落ちる」・富山市内） */
const INITIAL_SYMPTOM = "heat";
const INITIAL_AREA = 0;

/** 結果の面の id。スマホの帯の飛び先 */
const RESULT_ID = "est-result";

export default function PcEstimate() {
  const [key, setKey] = useState<string>(INITIAL_SYMPTOM);
  const [area, setArea] = useState<number>(INITIAL_AREA);

  const cur = SYMPTOMS.find((s) => s.key === key) ?? SYMPTOMS[0];
  const fee = AREAS[area].fee;
  const { lo, hi } = laborOf(cur);

  const loTotal = lo === null ? null : lo + fee;
  const hiTotal = lo === null || hi === null ? null : hi + fee;

  // 数え上げ。最初の値は着地の値（サーバーの HTML は最初から最終値）
  const init = laborOf(SYMPTOMS.find((s) => s.key === INITIAL_SYMPTOM) ?? SYMPTOMS[0]);
  const initFee = AREAS[INITIAL_AREA].fee;
  const shownLo = useCountUp(loTotal, (init.lo ?? 0) + initFee);
  const shownHi = useCountUp(hiTotal, (init.hi ?? init.lo ?? 0) + initFee);

  /** 大きく出す文字。`moving` は数え上げている途中の数字で組む */
  const big = (a: number, b: number): { num: string; unit: string } => {
    if (loTotal === null) return { num: "要見積り", unit: "" };
    if (hiTotal === null) return { num: yen(a), unit: "円〜" };
    if (hiTotal === loTotal) return { num: yen(a), unit: "円" };
    return { num: `${yen(a)}〜${yen(b)}`, unit: "円" };
  };
  const live = big(shownLo, shownHi);
  const final = big(loTotal ?? 0, hiTotal ?? 0);

  const sub =
    loTotal === null
      ? "伺って測ってから、金額をお伝えします。"
      : `作業工賃＋出張費${yen(fee)}円`;

  // 押した症状を /pc/symptom へ引き継ぐ（78a からの形）。地域は「段」で渡す
  const href = `/pc/symptom?s=${cur.key}&a=${area}`;

  return (
    <div className="est">
      <div className="est-l">
        <div className="step-h" id="est-q1">
          <span className="step-n">1</span>どんな症状ですか？
        </div>
        <div className="syms" role="group" aria-labelledby="est-q1">
          {SYMPTOMS.map((s) => {
            const on = s.key === cur.key;
            return (
              <button
                key={s.key}
                type="button"
                className={on ? "sym on" : "sym"}
                aria-pressed={on}
                onClick={() => setKey(s.key)}
              >
                <span className="sym-i" aria-hidden="true">
                  <PcIcon name={s.icon} />
                </span>
                <b>{s.card}</b>
                <span>{s.cardNote}</span>
              </button>
            );
          })}
        </div>

        <div className="step-h">
          <span className="step-n">2</span>
          <label htmlFor="est-area">どちらに伺いますか？</label>
        </div>
        <select
          id="est-area"
          className="sel"
          value={area}
          onChange={(e) => setArea(Number(e.target.value) || 0)}
        >
          {AREAS.map((a) => (
            <option key={a.index} value={a.index}>
              {`${a.name}（出張費 ${yen(a.fee)}円）`}
            </option>
          ))}
        </select>

        {/* スマホの帯（860px以下だけ）。症状を選んでいる間、画面の下についてくる。
            ★aria-live は付けない。読み上げるのは右の結果の面だけ */}
        <a className="est-m" href={`#${RESULT_ID}`}>
          <span className="est-m-n">{cur.card}</span>
          <span className="est-m-p">
            {loTotal === null ? (
              <b className="msg">{live.num}</b>
            ) : (
              <>
                目安 <b className="num">{live.num}</b>
                {live.unit}
              </>
            )}
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <path d="M2 5l5 5 5-5" />
          </svg>
          <span className="vh">結果へ</span>
        </a>
      </div>

      <aside className="est-r" id={RESULT_ID} aria-live="polite">
        <div className="res">
          <p className="res-k">{`費用の目安（${cur.card}）`}</p>
          <p className={loTotal === null ? "res-v msg" : "res-v"}>
            <span className="vh">{`${final.num}${final.unit}`}</span>
            <span aria-hidden="true">
              {live.num}
              {live.unit ? <small>{live.unit}</small> : null}
            </span>
          </p>
          <p className="res-s">{sub}</p>
          <dl>
            <div>
              <dt>考えられる原因</dt>
              <dd>{cur.c}</dd>
            </div>
            <div>
              <dt>当日、測るところ</dt>
              <dd>{cur.k}</dd>
            </div>
          </dl>
          <Link className="btn btn-g" href={href}>
            この内容で相談する
          </Link>
          <p className="res-n">
            作業工賃＋出張費の目安です。部品が要る場合は別にお伝えします。直せなかったときは、診断料と出張費だけです。
          </p>
        </div>
      </aside>
    </div>
  );
}
