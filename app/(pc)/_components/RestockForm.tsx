"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RESTOCK_EMAIL, RESTOCK_KINDS } from "@/lib/pc-restock";
import { HOURS_RANGE, TEL, TEL_HREF } from "@/lib/site";

/**
 * 中古パソコンの入荷通知の受付（/pc の「診断書付きの中古パソコン」の箱の中）。94 §4-5・§5。
 *
 * 預かるのはメールアドレスと、欲しい種類（任意）だけ。送り先は `/api/pc/restock`。
 * 送った後は別ページに飛ばさず、同じ箱の中に「受け付けました」を出す。
 *
 * 【しくみは /pc/contact のフォームから借りる】
 * 通行証（`/api/quote/pass`。Turnstile を1回通した証）をそのまま叩く。**新しい環境変数は要らない。**
 * `PcContactForm.tsx` と違うのは、Turnstile を**欄に触れたときに初めて読み込む**こと。
 * この箱はトップページの下のほうにあり、ほとんどの人は触れずに通り過ぎる。
 * 全員に Cloudflare のスクリプトを読ませない。
 *
 * 【失敗を成功に見せない】受信箱へのメールが届いたことを確認してから「受け付けました」を出す。
 * 失敗の理由は画面に出さない（読んだ人にできることが無い）。入力したアドレスは消さない。
 *
 * ⚠ 種類の一覧をここに書かないこと。`lib/pc-restock.ts` の `RESTOCK_KINDS` を受け口と共有している。
 * ⚠ GA4 は `pc_restock`。`pc_inquiry`（相談フォーム）と混ぜない。混ぜると相談の件数が水増しされる。
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onRvTurnstileLoad&render=explicit";

/** Turnstile を待つ上限。届かなければ失敗にして、お電話をお見せする */
const TOKEN_WAIT_MS = 20000;

type Status = "idle" | "sending" | "done" | "error";

export default function RestockForm() {
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState("");
  const [company, setCompany] = useState(""); // ハニーポット。人には見えない
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const boxRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const tokenRef = useRef("");
  const tokenWaiters = useRef<((t: string) => void)[]>([]);
  const passRef = useRef("");
  const armed = useRef(false);
  const doneRef = useRef<HTMLDivElement>(null);

  // 送った後、読み上げとキーボードの位置を「受け付けました」へ移す
  useEffect(() => {
    if (status === "done") doneRef.current?.focus();
  }, [status]);

  /** Turnstile を読み込んで枠に描く。**欄に触れたとき／送信のときに1度だけ** */
  function arm() {
    if (armed.current || !SITE_KEY) return;
    armed.current = true;

    const render = () => {
      if (!window.turnstile || !boxRef.current || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(boxRef.current, {
        sitekey: SITE_KEY,
        language: "ja",
        callback: (t) => {
          tokenRef.current = t;
          const waiting = tokenWaiters.current;
          tokenWaiters.current = [];
          for (const w of waiting) w(t);
        },
        "expired-callback": () => {
          tokenRef.current = "";
        },
        "error-callback": () => {
          tokenRef.current = "";
        },
      });
    };

    if (window.turnstile) {
      render();
      return;
    }
    window.onRvTurnstileLoad = render;
    if (!document.querySelector(`script[src="${TURNSTILE_SRC}"]`)) {
      const s = document.createElement("script");
      s.src = TURNSTILE_SRC;
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
  }

  /** Turnstile のトークンを待つ。鍵が無い環境（手元）では空のまま返す */
  function waitForToken(): Promise<string> {
    if (tokenRef.current) return Promise.resolve(tokenRef.current);
    if (!SITE_KEY) return Promise.resolve("");
    return new Promise((resolve) => {
      const hit = (t: string) => {
        clearTimeout(timer);
        resolve(t);
      };
      const timer = setTimeout(() => {
        tokenWaiters.current = tokenWaiters.current.filter((w) => w !== hit);
        resolve("");
      }, TOKEN_WAIT_MS);
      tokenWaiters.current.push(hit);
    });
  }

  function fail(reason: string) {
    console.error("[pc/restock]", reason);
    setStatus("error");
  }

  /** 通行証を取る。Turnstile のトークンは1回検証すると使えなくなるので、使ったら捨てる */
  async function getPass(): Promise<boolean> {
    arm();
    if (!tokenRef.current && window.turnstile && widgetId.current !== null) {
      window.turnstile.reset(widgetId.current);
    }
    const token = await waitForToken();

    let res: Response;
    try {
      res = await fetch("/api/quote/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    } catch {
      fail("通行証の要求で通信できませんでした");
      return false;
    }
    const json = (await res.json().catch(() => ({}))) as { pass?: string; error?: string };
    tokenRef.current = "";
    if (!res.ok || !json.pass) {
      fail(`通行証を取れませんでした ${res.status} ${json.error ?? ""}`);
      return false;
    }
    passRef.current = json.pass;
    return true;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    const value = email.trim();
    if (!value) {
      setEmailError("メールアドレスを入力してください。");
      setStatus("idle");
      return;
    }
    if (!RESTOCK_EMAIL.test(value)) {
      setEmailError("メールアドレスの形をお確かめください。");
      setStatus("idle");
      return;
    }
    setEmailError("");
    setStatus("sending");

    if (!passRef.current && !(await getPass())) return;

    const post = () =>
      fetch("/api/pc/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, kind, company, pass: passRef.current }),
      });

    try {
      let res = await post();
      if (res.status === 401) {
        // 通行証が切れていた。見せずに取り直して、もう一度だけ送る
        if (!(await getPass())) return;
        res = await post();
      }
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        fail(`送れませんでした ${res.status} ${json.error ?? ""}`);
        return;
      }
    } catch {
      fail("送信で通信できませんでした");
      return;
    }

    // 届いたことを確認した後に1件だけ数える。`pc_inquiry` とは別のイベント
    window.gtag?.("event", "pc_restock");
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="rs">
        <div className="rs-done" role="status" tabIndex={-1} ref={doneRef}>
          <p>受け付けました。入荷したら、このアドレスにお知らせします。</p>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="rs" onSubmit={submit} noValidate>
      <div className="rs-f">
        <label htmlFor="rs-email">メールアドレス</label>
        <input
          id="rs-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={arm}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "rs-email-e" : undefined}
        />
        {emailError ? (
          <p className="rs-err" id="rs-email-e" role="alert">
            {emailError}
          </p>
        ) : null}
      </div>

      {/* 欲しい種類（任意）。ラジオなので、矢印キーで動かせる。選ばなくても送れる */}
      <fieldset className="rs-f">
        <legend>
          欲しい種類<em>任意</em>
        </legend>
        <div className="rs-kinds">
          {RESTOCK_KINDS.map((k) => (
            <label key={k} className="rs-kind">
              <input
                type="radio"
                name="kind"
                value={k}
                checked={kind === k}
                onChange={() => setKind(k)}
              />
              <span>{k}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* ハニーポット。人には見えない。自動送信だけがここを埋める。
          name と id は Chrome の自動入力が意味を割り当てられない綴り（/pc/contact と同じ理由）。
          サーバーへ送る JSON の鍵は `company`。 */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="rs-7x">この欄は入力しないでください</label>
        <input
          id="rs-7x"
          name="rs7x"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {/* Turnstile。欄に触れるまで中身は空 */}
      <div className="rs-cf" ref={boxRef} />

      {status === "error" ? (
        <div className="rs-ng" role="alert">
          <p>
            <b>送信できませんでした。</b>お手数ですが、お電話（
            <a href={TEL_HREF}>{TEL}</a>
            ・{HOURS_RANGE}）でお知らせください。
          </p>
        </div>
      ) : null}

      <button type="submit" className="btn btn-g rs-send" disabled={sending}>
        {sending ? "送信しています…" : "入荷したら知らせてほしい"}
      </button>

      <p className="rs-note">
        お知らせ以外には使いません。停止はメールの返信でいつでも承ります。
        <Link href="/privacy">プライバシーポリシー</Link>
      </p>
    </form>
  );
}
