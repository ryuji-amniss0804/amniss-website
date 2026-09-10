"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { TRAVEL, yen } from "@/lib/pc";
import { MACHINES } from "@/lib/pc-inquiry";
import {
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  PASS_RENEW_MARGIN_SEC,
  PASS_TTL_SEC,
  PHOTO_PREFIX,
  SHRINK_LONG_EDGE,
} from "@/lib/quote";
import { TEL, TEL_HREF } from "@/lib/site";

/**
 * パソコン修理のご相談フォーム（/pc/contact の本体）。
 *
 * 【仕組みは引越しの見積りフォームから借りる。引越しのコードは触らない】
 * 通行証（`/api/quote/pass`）・写真の口（`/api/quote/upload`）・写真の自動削除
 * （`/api/cron/purge-photos`）は**そのまま叩く。**写真も同じ `PHOTO_PREFIX` に置くので、
 * 何もしなくても同じ日数で消える。**新しい環境変数は1つも要らない。**
 * 送信先だけが別（`/api/pc/inquiry`）で、そこが件名に `【PC修理】` を付ける。
 *
 * ⚠ `app/(site)/contact/QuoteForm.tsx` を書き換えて共用しないこと。
 *   あちらは**いま動いている引越しの受け口**。項目が違うだけのために触ると実害が出る。
 *
 * 【写真はこのサイトの関数を通らない】
 * ブラウザ → Vercel Blob へ直接上げる（`@vercel/blob/client` の upload）。
 * 関数を通すと実行時間とリクエストサイズの制限に当たる。
 *
 * 【縮小は best-effort】
 * 送る前に長辺 SHRINK_LONG_EDGE px・JPEG に縮小する。**失敗したら原寸で上げる。**
 * ここを必須にすると、HEIC など読めない形式のときに写真が送れないお客様が出る。
 *
 * 【失敗を成功に見せない】
 * メールの送信が成功したことを確認してから「お送りいただきました」を出す。
 * 写真だけ失敗したときは本文だけ送り、そのことを画面に出す。
 * どちらの失敗でも**入力した内容は消さない。**書き直させるのがいちばん悪い。
 *
 * 【画面には失敗の理由を出さない】
 * 「メールの設定が完了していません」のような理由は**こちらの内部事情**で、
 * 読んだお客様にできることは何もない。画面は「送信できませんでした」と
 * お電話への導線だけにして、理由はログに残す。
 * **必須項目が空のときの案内はこれに含まない**（お客様が直せることなので出す）。
 *
 * 【通行証は、切れてもお客様に見せない】
 * 通行証には期限がある（`lib/quote.ts` の PASS_TTL_SEC）。切れかけていたら送信を始める前に、
 * 切れていたら 401 を受けた時点で、**Turnstile を裏で解き直して、そのまま送信を続ける。**
 * 写真は上げ終わったURLを覚えていて、やり直しでも上げ直さない。
 *
 * ⚠ 市町村の一覧・出張費・写真の上限を、このファイルに書かないこと。
 *   すべて `lib/pc.ts` の `TRAVEL` と `lib/quote.ts` の定数から出す。
 * ⚠ LINEのボタンは出さない（`PC_LINE_URL` が null）。右側のカードも同じ扱い。
 */

/** Turnstile が window に生やす API のうち、使うものだけ */
type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      language?: string;
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  reset: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onRvTurnstileLoad?: () => void;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onRvTurnstileLoad&render=explicit";

/**
 * Turnstile の解き直しを待つ上限。
 * 届かなければ待つのをやめて失敗にする（待たせ続けるより、お電話をお見せするほうがよい）。
 */
const TOKEN_WAIT_MS = 20000;

/** 出張費つきの市町村。**新しく一覧を書かず、`TRAVEL` から作る**（/pc/symptom と同じ） */
const CITIES = TRAVEL.flatMap((t) => t.cities.map((n) => ({ name: n, fee: t.fee })));

/** 写真1枚の上限。数字を書かず `MAX_PHOTO_BYTES` から出す */
const MAX_MB = Math.round(MAX_PHOTO_BYTES / 1024 / 1024);

type Picked = {
  /** 実際に上げるもの。縮小できたら縮小後、だめなら原寸 */
  body: Blob;
  /** 上げるときのファイル名 */
  name: string;
  /** 画面に出す元のファイル名 */
  original: string;
  size: number;
  shrunk: boolean;
  preview: string;
};

type Status = "idle" | "sending" | "done" | "error";

function kb(n: number): string {
  return n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1)}MB`
    : `${Math.max(1, Math.round(n / 1024))}KB`;
}

function extOf(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  if (type === "image/heic") return "heic";
  if (type === "image/heif") return "heif";
  return "jpg";
}

/** 出張費の言い方。**0円は「0円」と書かず「無料」と出す**（メールの本文と同じ） */
function feeText(fee: number): string {
  return fee === 0 ? "出張費 無料" : `出張費 ${yen(fee)}円`;
}

/**
 * 長辺 SHRINK_LONG_EDGE px の JPEG にする。
 * **できなければ原寸をそのまま返す。**ブラウザが読めない形式（HEIC など）、
 * canvas が使えない環境、縮小したのに元より大きくなった場合が該当する。
 */
async function shrink(file: File): Promise<{ body: Blob; name: string; shrunk: boolean }> {
  const asis = { body: file as Blob, name: file.name, shrunk: false };
  if (!file.type.startsWith("image/")) return asis;

  try {
    // imageOrientation: EXIF の向きを反映させる。付けないと横倒しの写真ができる
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const long = Math.max(bmp.width, bmp.height);
    if (long <= SHRINK_LONG_EDGE && file.size <= MAX_PHOTO_BYTES) {
      bmp.close();
      return asis;
    }

    const scale = Math.min(1, SHRINK_LONG_EDGE / long);
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bmp.close();
      return asis;
    }
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();

    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return asis;

    return { body: blob, name: file.name.replace(/\.[^.]+$/, "") + ".jpg", shrunk: true };
  } catch {
    return asis;
  }
}

export default function PcContactForm() {
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [machine, setMachine] = useState("");
  const [symptom, setSymptom] = useState("");
  const [preferred, setPreferred] = useState("");
  const [company, setCompany] = useState(""); // ハニーポット。人には見えない

  const [photos, setPhotos] = useState<Picked[]>([]);
  const [picking, setPicking] = useState(false);
  const [photoNote, setPhotoNote] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    tel?: string;
    city?: string;
    symptom?: string;
  }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [photoFailed, setPhotoFailed] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const tokenRef = useRef("");
  /** Turnstile の解き直しを待っている人。callback が来たら全員に配る */
  const tokenWaiters = useRef<((t: string) => void)[]>([]);
  /** Turnstile を通した証。送信をやり直すときに使い回す */
  const passRef = useRef("");
  /** 通行証を受け取った時刻。切れる前に取り直すため */
  const passAtRef = useRef(0);
  /**
   * 上げ終わった写真のURL。**送信をやり直しても上げ直さない。**
   * スマホから5枚上げ直すのは回線の負担が大きく、保管先にも同じ写真が二重に残る。
   */
  const uploadedRef = useRef(new Map<Picked, string>());

  /* ---- Turnstile ---- */
  useEffect(() => {
    if (!SITE_KEY) return;

    const render = () => {
      if (!window.turnstile || !boxRef.current || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(boxRef.current, {
        sitekey: SITE_KEY,
        language: "ja",
        callback: (t) => {
          tokenRef.current = t;
          // 解き直しを待っている送信処理に渡す。**待たせたままにしない**
          const waiting = tokenWaiters.current;
          tokenWaiters.current = [];
          for (const w of waiting) w(t);
        },
        // 期限切れ（既定で5分）。refresh-expired は既定の auto なので、
        // Turnstile が裏で解き直して上の callback をもう一度呼ぶ
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
  }, []);

  /* ---- プレビュー用の URL を持ちっぱなしにしない ----
     photos を deps に入れると、写真を1枚足すたびに古い URL を破棄してしまい、
     残っているプレビューまで消える。**最新の一覧を ref で持って、
     アンマウントのときだけまとめて破棄する。**個別の破棄は remove() でやっている */
  const photosRef = useRef<Picked[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => {
    return () => {
      for (const p of photosRef.current) URL.revokeObjectURL(p.preview);
    };
  }, []);

  function resetTurnstile() {
    tokenRef.current = "";
    if (window.turnstile && widgetId.current !== null) {
      window.turnstile.reset(widgetId.current);
    }
  }

  /**
   * 失敗を画面に出す。**理由は画面に出さない。**
   * サーバー側の理由はサーバーのログに残っている。ここはブラウザだけで起きたこと
   * （回線が切れた等）も追えるように、コンソールにだけ書いておく。
   */
  function fail(reason: string) {
    console.error("[pc/contact]", reason);
    setStatus("error");
  }

  /** いま持っている通行証が、これから始める送信のあいだ持つか */
  function passIsFresh(): boolean {
    if (!passRef.current) return false;
    const usableMs = (PASS_TTL_SEC - PASS_RENEW_MARGIN_SEC) * 1000;
    return Date.now() - passAtRef.current < usableMs;
  }

  /** Turnstile の新しいトークンを待つ。鍵が無い環境（手元）では空のまま返す */
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

  /**
   * 通行証を用意する。**お客様には何も見せない。**
   * 切れかけている（または force）なら Turnstile を裏で解き直して取り直す。
   * Turnstile のトークンは1回検証すると使えなくなるので、使ったら捨てる。
   */
  async function ensurePass(force = false): Promise<boolean> {
    if (!force && passIsFresh()) return true;

    // 手元に使えるトークンが無いときだけ解き直す。
    // 初回の送信では読み込み時に解けたトークンがあるので、ここは通らない
    if (force || !tokenRef.current) resetTurnstile();
    const token = await waitForToken();

    let res: Response;
    try {
      // **引越しの口をそのまま叩く。**通行証の発行は共通で、変更しない
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
    // このトークンは検証に回した。成功しても失敗しても、もう使えない
    tokenRef.current = "";
    if (!res.ok || !json.pass) {
      resetTurnstile();
      fail(`通行証を取れませんでした ${res.status} ${json.error ?? ""}`);
      return false;
    }

    passRef.current = json.pass;
    passAtRef.current = Date.now();
    return true;
  }

  /* ---- 写真を選ぶ ---- */
  async function pick(list: FileList | null) {
    if (!list || list.length === 0) return;
    setPicking(true);
    setPhotoNote("");

    const room = MAX_PHOTOS - photos.length;
    const chosen = Array.from(list).slice(0, Math.max(0, room));
    const notes: string[] = [];
    if (list.length > room) notes.push(`写真は${MAX_PHOTOS}枚までです。`);

    const added: Picked[] = [];
    for (const file of chosen) {
      const r = await shrink(file);
      if (r.body.size > MAX_PHOTO_BYTES) {
        notes.push(`${file.name} は1枚の上限（${MAX_MB}MB）を超えているため外しました。`);
        continue;
      }
      added.push({
        body: r.body,
        name: r.name,
        original: file.name,
        size: r.body.size,
        shrunk: r.shrunk,
        preview: URL.createObjectURL(r.body),
      });
    }

    setPhotos((prev) => [...prev, ...added]);
    setPhotoNote(notes.join(" "));
    setPicking(false);
    // 同じファイルをもう一度選べるようにする
    if (fileRef.current) fileRef.current.value = "";
  }

  function remove(i: number) {
    setPhotos((prev) => {
      const target = prev[i];
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((_, n) => n !== i);
    });
    setPhotoNote("");
  }

  /* ---- 送信 ---- */
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // 二重送信を防ぐ。ボタンは disabled にしてあるが、Enter でも入ってこられる
    if (status === "sending" || picking) return;

    const next: typeof errors = {};
    if (!name.trim()) next.name = "お名前を入力してください。";
    if (!tel.trim()) next.tel = "お電話番号を入力してください。";
    if (!city) next.city = "お住まいの市町村を選んでください。";
    if (!symptom.trim()) next.symptom = "症状を入力してください。";
    setErrors(next);
    if (Object.keys(next).length) {
      // **必須項目の案内は項目ごとに出す**（お客様が直せることなので）。
      // 「送信できませんでした」の箱は引っ込める
      setStatus("idle");
      return;
    }

    setStatus("sending");
    setPhotoFailed(false);

    // ① 通行証。Turnstile のトークンは1回しか検証できないので、ここで1度だけ通す
    if (!(await ensurePass())) return;

    // ② 写真。**失敗しても本文は送る**（写真は任意項目なので）
    const urls: string[] = [];
    let failed = false;
    const stamp = new Date();
    const day = `${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, "0")}${String(
      stamp.getDate(),
    ).padStart(2, "0")}`;

    const put = async (p: Picked, i: number) => {
      // パス名は **PHOTO_PREFIX（quote/）で始める。**
      // Cron の自動削除がこの prefix だけを見ているので、外に置くと消えなくなる
      const res = await upload(`${PHOTO_PREFIX}${day}/pc-photo-${i + 1}.${extOf(p.body.type)}`, p.body, {
        access: "public",
        handleUploadUrl: "/api/quote/upload",
        headers: { "x-quote-pass": passRef.current },
        contentType: p.body.type || "image/jpeg",
      });
      uploadedRef.current.set(p, res.url);
      urls.push(res.url);
    };

    /** この送信で通行証を取り直したか。1枚失敗するたびに取り直さないための印 */
    let renewed = false;

    for (let i = 0; i < photos.length; i++) {
      const p = photos[i];

      // 前の送信で上げ終わっている写真は、そのURLを使い回す
      const already = uploadedRef.current.get(p);
      if (already) {
        urls.push(already);
        continue;
      }

      // 5枚×上限は細い回線だと20分を超える。上げている最中に通行証が
      // 切れないよう、1枚ごとに残りを見て、必要なら裏で取り直す
      if (!(await ensurePass())) return;

      try {
        await put(p, i);
      } catch (e) {
        console.error("[pc/contact] 写真を上げられませんでした", (e as Error).message);
        // **@vercel/blob は応答のステータスを握りつぶす**ので、401（通行証切れ）か
        // ほかの失敗かがここでは分からない。まだ取り直していなければ1度だけ取り直して、
        // この1枚をやり直す。取り直しても駄目なら、その1枚だけをあきらめる
        if (renewed) {
          failed = true;
          continue;
        }
        renewed = true;
        if (!(await ensurePass(true))) return;
        try {
          await put(p, i);
        } catch (e2) {
          console.error("[pc/contact] 写真を上げ直しても駄目でした", (e2 as Error).message);
          failed = true;
        }
      }
    }

    // ③ 本文。**ここが成功して初めて「お送りいただきました」を出す**
    const sendBody = () =>
      fetch("/api/pc/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tel,
          email,
          city,
          machine,
          symptom,
          preferred,
          company,
          photos: urls,
          pass: passRef.current,
        }),
      });

    try {
      let res = await sendBody();
      if (res.status === 401) {
        // 通行証が切れていた。**お客様には見せず**、Turnstile を裏で取り直して送り直す。
        // 写真は上げ終わっているので、選び直していただく必要はない
        if (!(await ensurePass(true))) return;
        res = await sendBody();
      }
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!res.ok || !json.ok) {
        fail(`本文を送れませんでした ${res.status} ${json.error ?? ""}`);
        return;
      }
    } catch {
      fail("本文の送信で通信できませんでした");
      return;
    }

    setPhotoFailed(failed);
    setStatus("done");
  }

  /* ---- 送信後。**別ページに飛ばさず、同じ画面で結果を出す** ---- */
  if (status === "done") {
    return (
      <div className="cf">
        <div className="cf-done" role="status">
          <p className="cf-done-t">お送りいただきました。</p>
          <p>
            9:00〜21:00に受け付けています。作業中は折り返しになりますが、その日のうちにご連絡します。
          </p>
          {photoFailed ? (
            <p className="cf-done-ng">
              ただし、<b>写真は送れませんでした。</b>
              ご相談の内容は届いています。写真はお電話でご相談いただくか、伺ったときに拝見します。
            </p>
          ) : null}
          <div className="cf-done-acts">
            <a className="btn p" href={TEL_HREF}>
              {TEL}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const sending = status === "sending";
  const picked = CITIES.find((c) => c.name === city) ?? null;

  return (
    <form className="cf" onSubmit={submit} noValidate>
      {/* ---- お名前 ---- */}
      <div className="f">
        <label htmlFor="cf-name">
          お名前<em>必須</em>
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="富山 太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "cf-name-e" : undefined}
        />
        {errors.name ? (
          <p className="err" id="cf-name-e">
            {errors.name}
          </p>
        ) : null}
      </div>

      {/* ---- お電話番号 ---- */}
      <div className="f">
        <label htmlFor="cf-tel">
          お電話番号<em>必須</em>
        </label>
        <input
          id="cf-tel"
          name="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="090-0000-0000"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          aria-invalid={errors.tel ? true : undefined}
          aria-describedby={errors.tel ? "cf-tel-e" : undefined}
        />
        {errors.tel ? (
          <p className="err" id="cf-tel-e">
            {errors.tel}
          </p>
        ) : null}
      </div>

      {/* ---- メールアドレス（任意） ---- */}
      <div className="f">
        <label htmlFor="cf-email">メールアドレス</label>
        <input
          id="cf-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="cf-email-h"
        />
        <p className="hint" id="cf-email-h">
          お電話がつながらないときのご連絡先です。
        </p>
      </div>

      {/* ---- お住まいの市町村 ----
          一覧も金額も `lib/pc.ts` の `TRAVEL` から出している。**書き写さないこと。**
          選ぶと出張費が横に出る（0円は「無料」）。 */}
      <div className="f">
        <label htmlFor="cf-city">
          お住まいの市町村<em>必須</em>
        </label>
        <div className="cf-row">
          <select
            id="cf-city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-invalid={errors.city ? true : undefined}
            aria-describedby={errors.city ? "cf-city-e" : undefined}
          >
            <option value="">選択してください</option>
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {/* 選ぶまでは何も出さない。**空の枠を置かない** */}
          <span className="cf-fee" aria-live="polite">
            {picked ? feeText(picked.fee) : ""}
          </span>
        </div>
        {errors.city ? (
          <p className="err" id="cf-city-e">
            {errors.city}
          </p>
        ) : null}
      </div>

      {/* ---- 機種のタイプ（任意） ---- */}
      <div className="f">
        <label htmlFor="cf-machine">機種のタイプ</label>
        <select
          id="cf-machine"
          name="machine"
          value={machine}
          onChange={(e) => setMachine(e.target.value)}
        >
          <option value="">選択してください</option>
          {MACHINES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* ---- 症状 ---- */}
      <div className="f">
        <label htmlFor="cf-symptom">
          症状<em>必須</em>
        </label>
        <textarea
          id="cf-symptom"
          name="symptom"
          rows={6}
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          placeholder="いつから、どんなときに、どうなるか。わかる範囲で構いません。"
          aria-invalid={errors.symptom ? true : undefined}
          aria-describedby={errors.symptom ? "cf-symptom-e" : undefined}
        />
        {errors.symptom ? (
          <p className="err" id="cf-symptom-e">
            {errors.symptom}
          </p>
        ) : null}
      </div>

      {/* ---- 写真（任意） ----
          **ブラウザ標準の「ファイル選択／選択されていません」は出さない。**
          「選択されていません」はシステムの言葉で、お客様には何かが足りない表示に読める。
          input は DOM に残したまま <label> で包み、見た目だけこのサイトの枠線ボタン（.btn）にする。
          **display:none にしない。**キーボードと読み上げから触れなくなる。 */}
      <div className="f">
        <label htmlFor="cf-photos">
          写真<em>任意・{MAX_PHOTOS}枚まで</em>
        </label>

        <div className="cf-file">
          <label className="btn s cf-file-b">
            <input
              ref={fileRef}
              id="cf-photos"
              name="photos"
              type="file"
              accept="image/*"
              multiple
              className="cf-file-i"
              onChange={(e) => pick(e.target.files)}
              disabled={photos.length >= MAX_PHOTOS || picking || sending}
            />
            写真を選ぶ
          </label>
          {/* 枚数はお客様の言葉で出す。0枚のときは何も書かない */}
          <span className="cf-file-n" aria-live="polite">
            {photos.length ? `${photos.length}枚選びました` : ""}
          </span>
        </div>

        <p className="hint">
          画面の様子や、機体の型番が写っている写真があると助かります。
          <br />※ 送信いただいた写真は一定期間後に自動で削除されます
        </p>
        {picking ? <p className="hint">写真を読み込んでいます…</p> : null}
        {photoNote ? <p className="err">{photoNote}</p> : null}

        {photos.length ? (
          <ul className="cf-thumbs">
            {photos.map((p, i) => (
              <li key={`${p.original}-${i}`}>
                {/* next/image は blob: を扱わない。プレビューは素の img */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt={`選んだ写真 ${i + 1}`} />
                <div className="cf-thumb-m">
                  <span>{p.original}</span>
                  <small>
                    {kb(p.size)}
                    {p.shrunk ? "（縮小しました）" : ""}
                  </small>
                </div>
                <button type="button" onClick={() => remove(i)} disabled={sending}>
                  外す
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* ---- ご希望の日時（任意） ---- */}
      <div className="f">
        <label htmlFor="cf-preferred">ご希望の日時</label>
        <input
          id="cf-preferred"
          name="preferred"
          type="text"
          placeholder="例）今週の土日の午前中"
          value={preferred}
          onChange={(e) => setPreferred(e.target.value)}
        />
      </div>

      {/* ハニーポット。人には見えない。自動送信だけがここを埋める。
          name と id は、Chrome の自動入力が意味を割り当てられない綴りにしてある。
          `company` だと Chrome が「会社名」と解釈し、保存済み住所を選んだ本物のお客様の
          送信をここで黙って捨ててしまう。サーバーへ送る JSON の鍵は `company` のまま。 */}
      <div className="cf-hp" aria-hidden="true">
        <label htmlFor="cf-7x">この欄は入力しないでください</label>
        <input
          id="cf-7x"
          name="cf7x"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {/* Turnstile。サイトキーが入っていないときは何も出さない */}
      <div className="cf-cf" ref={boxRef} />

      {/* **理由は書かない。**読んだお客様にできることは何もなく、
          うちの仕組みが壊れていることだけが伝わる。理由はログに残してある */}
      {status === "error" ? (
        <div className="cf-ng" role="alert">
          <p className="cf-ng-t">送信できませんでした。</p>
          <p>
            お手数ですが、お電話（
            <a href={TEL_HREF}>{TEL}</a>
            ）でご連絡ください。
            <br />
            9:00〜21:00 の間、年中無休で受け付けています。
          </p>
          <p className="cf-ng-k">入力していただいた内容はそのまま残してあります。</p>
        </div>
      ) : null}

      <div className="cf-send">
        <button type="submit" className="btn p" disabled={sending || picking}>
          {sending ? "送信しています…" : "この内容で送信する"}
        </button>
        <p className="hint">送信いただいても、費用は発生しません。</p>
      </div>

      <p className="hint cf-pp">
        送信をもって、
        <Link href="/privacy">プライバシーポリシー</Link>
        にご同意いただいたものとして取り扱います。
      </p>
    </form>
  );
}
