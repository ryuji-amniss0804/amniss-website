"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  DIAGNOSIS_FEE,
  PC_LINE_URL,
  SYMPTOM_AGE,
  SYMPTOM_DATA,
  SYMPTOM_WHEN,
  SYMPTOMS,
  TRAVEL,
  priceOf,
  yen,
} from "@/lib/pc";

/**
 * /pc/symptom の道具の本体。
 * 手本：D:\revive_toyama_marketing\mockup_pc_doc_v4.html の「症状の目安（選択式）」
 *
 * ⚠ 金額の数字をこのファイルに書かないこと。`SYMPTOMS` が持つのはキー（"std" など）で、
 *   数字は `priceOf()` が `LABOR` / `MENU` から引く。料金を変えれば目安も一緒に直る。
 * ⚠ 市町村の一覧をここに書かないこと。`TRAVEL` を平らにして作る（下の `CITIES`）。
 *   同じ一覧が2か所にできると、出張費を変えたときに片方だけ古くなる。
 * ⚠ これは**判定ではなく目安**。「直る／直らない」と断定する文言を足さないこと。
 * ⚠ LINEのボタンは `PC_LINE_URL` が入るまで出ない。`lib/site.ts` の `LINE_URL`
 *   （引越し・買取用）で代用しないこと。
 *
 * ページの枠と metadata はサーバーコンポーネント（`page.tsx`）側にある。
 * ここだけをクライアントにしているのは、ページごと `"use client"` にすると
 * metadata を出せなくなるため。
 */

/** 出張費つきの市町村。**新しく一覧を書かず、`TRAVEL` から作る。** */
const CITIES = TRAVEL.flatMap((t) => t.cities.map((n) => ({ name: n, fee: t.fee })));

/** 金額の範囲。`hi === null` は上限を示さない、`hi === lo` は1つの数字 */
function range(lo: number, hi: number | null, add = 0): string {
  if (hi === null) return `${yen(lo + add)}円〜`;
  if (hi === lo) return `${yen(lo + add)}円`;
  return `${yen(lo + add)}〜${yen(hi + add)}円`;
}

type Result = {
  /** 何の金額なのかを示す小さいラベル */
  label: string;
  /** 大きく出す文字 */
  big: string;
  /** 金額ではなく「要見積り」を出しているか */
  estimate: boolean;
  /** 大きい文字の下の1行。内訳、または次にどうすればよいか */
  sub: string;
  notes: string[];
};

function buildResult(
  s: (typeof SYMPTOMS)[number],
  city: (typeof CITIES)[number] | null,
  ageOld: boolean,
  dataNeeded: boolean,
): Result {
  const notes = [
    `別に出張診断が${yen(DIAGNOSIS_FEE)}円かかりますが、作業をご依頼いただいた場合は上の工賃に充当するので、合計は変わりません。`,
    "上の金額は、これまでの作業からの目安です。確定するのは、伺って測ったあとです。",
  ];
  if (ageOld) {
    notes.push(
      "7年以上お使いとのことですので、直すより買い替えたほうが安く済む場合もあります。その判断も、診断のときに数値でお伝えします。",
    );
  }
  if (dataNeeded) {
    notes.push(
      "中のデータが必要とのことですので、作業の前にデータの取り出しやバックアップをご提案する場合があります。",
    );
  }

  const lo = s.lo === null ? null : priceOf(s.lo);
  const hi = s.hi === null ? null : priceOf(s.hi);

  // 下限が引けないものは金額を出さない。**推測で数字を作らないこと。**
  if (lo === null) {
    return {
      label: "費用の目安",
      big: "要見積り",
      estimate: true,
      sub: "伺って測ってからお伝えします。",
      notes,
    };
  }

  if (city) {
    return {
      label: "お支払いの合計（目安）",
      big: range(lo, hi, city.fee),
      estimate: false,
      sub: `作業工賃 ${range(lo, hi)}　＋　出張費 ${
        city.fee === 0 ? "無料" : `${yen(city.fee)}円`
      }（${city.name}）`,
      notes,
    };
  }

  return {
    label: "作業工賃の目安",
    big: range(lo, hi),
    estimate: false,
    sub: "お住まいを選ぶと、出張費を含めた合計が出ます。",
    notes,
  };
}

/** 選んだものを1本の文につなぐ。空文字（使用年数の「わからない」）は入れない */
function buildDraft(
  s: (typeof SYMPTOMS)[number],
  city: (typeof CITIES)[number] | null,
  when: string | null,
  age: string | null,
  data: string | null,
): string {
  return [s.t, city && `${city.name}です。`, when, age, data].filter(Boolean).join("");
}

/**
 * クリップボードへ。`navigator.clipboard` が無い／弾かれる環境
 * （古い端末、HTTPS でない環境）では `execCommand` に落ちる。
 */
function legacyCopy(ta: HTMLTextAreaElement): boolean {
  ta.readOnly = false;
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.readOnly = true;
  return ok;
}

/** 押して選ぶボタン。もう一度押すと解除する */
function Choice({
  label,
  pressed,
  onToggle,
}: {
  label: string;
  pressed: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onToggle}>
      {label}
    </button>
  );
}

function Question({
  no,
  id,
  label,
  wide,
  children,
}: {
  no: string;
  id: string;
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="tq">
      <span className="ql" id={id}>
        <em>{no}</em>
        {label}
      </span>
      <div className={wide ? "opts wide" : "opts"} role="group" aria-labelledby={id}>
        {children}
      </div>
    </div>
  );
}

/** 同じものをもう一度押したら解除（null に戻す） */
function toggle<T>(current: T | null, next: T): T | null {
  return current === next ? null : next;
}

export default function SymptomTool({ initialSymptom }: { initialSymptom: string | null }) {
  // 知らないキー（/pc/symptom?s=zzz）で来ても、何も選ばれていない状態にするだけ。エラーにしない。
  const [symptom, setSymptom] = useState<string | null>(() =>
    SYMPTOMS.some((s) => s.key === initialSymptom) ? initialSymptom : null,
  );
  const [city, setCity] = useState<number | null>(null);
  const [when, setWhen] = useState<number | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [data, setData] = useState<number | null>(null);

  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const picked = SYMPTOMS.find((s) => s.key === symptom) ?? null;
  const pickedCity = city === null ? null : CITIES[city];
  const pickedAge = age === null ? null : SYMPTOM_AGE[age];
  const pickedData = data === null ? null : SYMPTOM_DATA[data];

  const result = picked
    ? buildResult(
        picked,
        pickedCity,
        pickedAge !== null && "old" in pickedAge && pickedAge.old,
        pickedData !== null && "needed" in pickedData && pickedData.needed,
      )
    : null;

  const draft = picked
    ? buildDraft(
        picked,
        pickedCity,
        when === null ? null : SYMPTOM_WHEN[when],
        pickedAge === null || pickedAge.text === "" ? null : pickedAge.text,
        pickedData === null ? null : pickedData.text,
      )
    : "";

  function flash() {
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }

  function handleCopy() {
    const ta = taRef.current;
    if (!ta) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(draft).then(flash, () => {
        if (legacyCopy(ta)) flash();
      });
      return;
    }
    if (legacyCopy(ta)) flash();
  }

  return (
    <div className="triage">
      <Question no="01" id="q-symptom" label="どんな症状ですか" wide>
        {SYMPTOMS.map((s) => (
          <Choice
            key={s.key}
            label={s.card}
            pressed={symptom === s.key}
            onToggle={() => setSymptom((cur) => toggle(cur, s.key))}
          />
        ))}
      </Question>

      <Question no="02" id="q-city" label="お住まいの市町村（任意）">
        {CITIES.map((c, i) => (
          <Choice
            key={c.name}
            label={c.name}
            pressed={city === i}
            onToggle={() => setCity((cur) => toggle(cur, i))}
          />
        ))}
      </Question>

      <Question no="03" id="q-when" label="いつからですか（任意）" wide>
        {SYMPTOM_WHEN.map((w, i) => (
          <Choice
            key={w}
            label={w}
            pressed={when === i}
            onToggle={() => setWhen((cur) => toggle(cur, i))}
          />
        ))}
      </Question>

      <Question no="04" id="q-age" label="何年くらいお使いですか（任意）">
        {SYMPTOM_AGE.map((a, i) => (
          <Choice
            key={a.label}
            label={a.label}
            pressed={age === i}
            onToggle={() => setAge((cur) => toggle(cur, i))}
          />
        ))}
      </Question>

      <Question no="05" id="q-data" label="中のデータは必要ですか（任意）">
        {SYMPTOM_DATA.map((d, i) => (
          <Choice
            key={d.label}
            label={d.label}
            pressed={data === i}
            onToggle={() => setData((cur) => toggle(cur, i))}
          />
        ))}
      </Question>

      {/* 症状を選ぶまでは結果を出さない */}
      {picked && result && (
        <div className="tr">
          <span className="rl">{result.label}</span>
          <p className="pz">
            <span className={result.estimate ? "price est" : "price"}>{result.big}</span>
          </p>
          <p className="pn">{result.sub}</p>
          <p className="pn">{picked.n}</p>

          <div className="cols">
            <div>
              <h3>考えられる原因</h3>
              <p>{picked.c}</p>
            </div>
            <div>
              <h3>当日ここを測ります</h3>
              <p>{picked.k}</p>
            </div>
          </div>

          <ul className="tn">
            {result.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>

          <div className="draft">
            <p className="dl">
              そのまま送れる文
              <span>電話でもメールでも、これを読み上げる／貼り付けるだけで伝わります。</span>
            </p>
            <textarea
              ref={taRef}
              value={draft}
              readOnly
              rows={4}
              aria-label="そのまま送れる文"
            />
            <div className="dacts">
              <button type="button" className="btn s" onClick={handleCopy}>
                {copied ? "コピーしました" : "文をコピー"}
              </button>
              <Link className="btn p" href="/pc/contact">
                この内容で相談する
              </Link>
              {/* LINEは公式アカウントが開くまで出さない。URLが入ればここが自動で出る */}
              {PC_LINE_URL && (
                <a className="btn s" href={PC_LINE_URL} target="_blank" rel="noopener noreferrer">
                  LINEで相談する
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
