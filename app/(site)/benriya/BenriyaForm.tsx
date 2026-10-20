"use client";

import { useState } from "react";
import Link from "next/link";
import { HOURS_RANGE, LINE_ID, ONLINE_HOURS, TEL } from "@/lib/site";
import { yen } from "@/lib/pc";
import { CITIES, HOURLY_FEE } from "./_benriya";

/**
 * 便利屋の相談フォーム（/benriya の #soudan）。
 *
 * どこにも送信しない。入力した文を載せて LINE のトークを開くか、/contact へ渡すだけ。
 * ⚠ モックアップにあった「写真（あれば）」のファイル選択は置かない。
 *   選んでも送り先が無いため。写真は LINE で送ったあとトークに送ってもらう。
 * ⚠ /contact はクエリを受け取らないので、ただのリンク。
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** 文面を入れた状態でトークを開く URL。アカウントは lib/site.ts の LINE_ID */
function lineUrl(text: string, area: string): string {
  const msg = `【便利屋のご相談】\nお困りごと：${text}\n市町村：${area}\n（写真があれば、このあと送ってください）`;
  return `https://line.me/R/oaMessage/${encodeURIComponent(LINE_ID)}/?${encodeURIComponent(msg)}`;
}

export default function BenriyaForm() {
  const [text, setText] = useState("");
  const [area, setArea] = useState("");

  const city = CITIES.find((c) => c.name === area);
  const fee = city ? `${city.name}の出張費 ${yen(city.fee)}円` : "市町村を選ぶと出張費が出ます";

  return (
    <div className="bn-form">
      <label htmlFor="komari" className="bn-zen bn-form-q">
        お困りごとは何ですか？
      </label>
      <p className="bn-form-sub">短くても大丈夫です。</p>
      <textarea
        id="komari"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="例）冷蔵庫を2階に上げたい／プリンターが急に動かなくなった"
      />
      <div className="bn-form-row">
        <div>
          <label htmlFor="area" className="bn-form-lb">
            お住まいの市町村
          </label>
          <select id="area" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">選んでください</option>
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <p className="bn-form-photo">写真があると話が早いです。LINEで送ったあと、そのままトークに写真を送れます。</p>
      </div>
      <div className="bn-form-fee">
        <span>
          時間制の作業 <b className="bn-num">{yen(HOURLY_FEE)}</b>円 / 1時間 ＋ 出張費
        </span>
        <span className="bn-form-fee-v" aria-live="polite">
          {fee}
        </span>
      </div>
      <div className="bn-form-btns">
        <a
          href={lineUrl(text, area)}
          className="bn-zen bn-btn-line"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => window.gtag?.("event", "benriya_line")}
        >
          LINEで送る
        </a>
        <Link href="/contact" className="bn-zen bn-btn" onClick={() => window.gtag?.("event", "benriya_form")}>
          フォームで送る
        </Link>
      </div>
      {/* 友だち追加がまだの人は、追加の画面を挟むと oaMessage の文面が消える（実機で確認済み） */}
      <p className="bn-form-note">初めての方は、友だち追加のあとにこのページへ戻り、もう一度『LINEで送る』を押してください。</p>
      <p className="bn-form-note">{`LINE・フォームは${ONLINE_HOURS}受付。電話は ${HOURS_RANGE}（${TEL}）`}</p>
    </div>
  );
}
