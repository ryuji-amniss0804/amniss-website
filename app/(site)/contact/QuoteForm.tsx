"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import {
  HANDOFF_KEY,
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  PASS_RENEW_MARGIN_SEC,
  PASS_TTL_SEC,
  PHOTO_PREFIX,
  SHRINK_LONG_EDGE,
  handoffCalcAt,
  handoffLines,
  parseHandoff,
  type QuoteHandoff,
} from "@/lib/quote";
import { LINE_URL, TEL, TEL_HREF } from "@/lib/site";

/**
 * お見積り依頼フォーム。
 *
 * 【項目は4つだけ】お名前・ご連絡先・ご依頼の内容・写真（任意）。
 * 金額は /simulator で出せるので、ここの仕事は「写真を送って相談を始めること」だけ。
 *
 * 【写真はこのサイトの関数を通らない】
 * ブラウザ → Vercel Blob へ直接上げる（@vercel/blob/client の upload）。
 * 関数を通すと実行時間とリクエストサイズの制限に当たる。
 *
 * 【縮小は best-effort】
 * 送る前に長辺2,000px・JPEG に縮小する。**失敗したら原寸で上げる。**
 * ここを必須にすると、HEIC など読めない形式のときに写真が送れないお客様が出る。
 *
 * 【失敗を成功に見せない】
 * メールの送信が成功したことを確認してから「お送りいただきました」を出す。
 * 写真だけ失敗したときは本文だけ送り、そのことを画面に出す。
 * どちらの失敗でも**入力した内容は消さない。**
 *
 * 【画面には失敗の理由を出さない】（指示 27 ①）
 * 「メールの設定が完了していません」のような理由は**こちらの内部事情**で、
 * 読んだお客様にできることは何もない。画面は「送信できませんでした」と
 * 電話・LINEへの導線だけにして、理由はサーバーのログに残す。
 * **必須項目が空のときの案内はこれに含まない**（お客様が直せることなので出す）。
 *
 * 【通行証は、切れてもお客様に見せない】（指示 27 ②）
 * 通行証には期限がある（lib/quote.ts の PASS_TTL_SEC）。
 * 切れかけていたら送信を始める前に、切れていたら 401 を受けた時点で、
 * **Turnstile を裏で解き直して、そのまま送信を続ける。**
 * 写真は上げ終わったURLを覚えていて、やり直しでも上げ直さない。
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
    /** GA4（app/components/Ga4.tsx）。タグが読めていないときは undefined */
    gtag?: (...args: unknown[]) => void;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onRvTurnstileLoad";

/**
 * Turnstile の解き直しを待つ上限。
 * 実測では解き直しに 2.3〜3.3 秒かかる。届かなければ待つのをやめて失敗にする
 * （待たせ続けるより、電話とLINEをお見せするほうがよい）。
 */
const TOKEN_WAIT_MS = 20000;

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
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)}MB` : `${Math.max(1, Math.round(n / 1024))}KB`;
}

function extOf(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  if (type === "image/heic") return "heic";
  if (type === "image/heif") return "heif";
  return "jpg";
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

/** 変更を購読しない。/simulator から移ってきた時点の1回だけ読めばよい */
const noSubscribe = () => () => {};

function readHandoffRaw(): string | null {
  try {
    return sessionStorage.getItem(HANDOFF_KEY);
  } catch {
    // sessionStorage が使えない設定。引き継ぎなしとして扱う
    return null;
  }
}

export default function QuoteForm() {
  /**
   * /simulator からの引き継ぎ。**直接 /contact を開いた人には何も出ない。**
   * useEffect + setState ではなく useSyncExternalStore で読んでいるのは、
   * sessionStorage がサーバーに無いため。素の初期値として読むと
   * サーバーの HTML（引き継ぎなし）とクライアントの1回目（引き継ぎあり）が
   * 食い違ってハイドレーションが壊れる。
   * getSnapshot は**文字列を返す**こと。ここで parse すると毎回別のオブジェクトになり、
   * React が「変わり続けている」と見て再描画が止まらない。
   */
  const raw = useSyncExternalStore(noSubscribe, readHandoffRaw, () => null);
  const handoff = useMemo<QuoteHandoff | null>(() => {
    if (!raw) return null;
    try {
      return parseHandoff(JSON.parse(raw));
    } catch {
      return null;
    }
  }, [raw]);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // ハニーポット。人には見えない

  const [photos, setPhotos] = useState<Picked[]>([]);
  const [picking, setPicking] = useState(false);
  const [photoNote, setPhotoNote] = useState("");

  const [errors, setErrors] = useState<{ name?: string; contact?: string; message?: string }>({});
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
   * 失敗を画面に出す。**理由は画面に出さない**（指示 27 ①）。
   * 理由はサーバーのログに残っている。ここはブラウザだけで起きたこと
   * （回線が切れた等）も追えるように、コンソールにだけ書いておく。
   */
  function fail(reason: string) {
    console.error("[quote]", reason);
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
        notes.push(`${file.name} は1枚の上限（10MB）を超えているため外しました。`);
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
    if (status === "sending" || picking) return;

    const next: typeof errors = {};
    if (!name.trim()) next.name = "お名前を入力してください。";
    if (!contact.trim()) next.contact = "お電話番号またはメールアドレスを入力してください。";
    if (!message.trim()) next.message = "ご依頼の内容を入力してください。";
    setErrors(next);
    if (Object.keys(next).length) {
      // **必須項目の案内は項目ごとに出す**（お客様が直せることなので）。
      // 「送信できませんでした」の箱は引っ込める
      setStatus("idle");
      return;
    }

    setStatus("sending");
    setPhotoFailed(false);

    // ① 通行証。Turnstile のトークンは1回しか検証できないので、ここで1度だけ通す。
    // 前の送信から時間が空いていたら、ここで黙って取り直す
    if (!(await ensurePass())) return;

    // ② 写真。**失敗しても本文は送る**（写真は任意項目なので）
    const urls: string[] = [];
    let failed = false;
    const stamp = new Date();
    const day = `${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, "0")}${String(
      stamp.getDate(),
    ).padStart(2, "0")}`;

    const put = async (p: Picked, i: number) => {
      const res = await upload(`${PHOTO_PREFIX}${day}/photo-${i + 1}.${extOf(p.body.type)}`, p.body, {
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

      // 5枚×10MB は細い回線だと20分を超える。上げている最中に通行証が
      // 切れないよう、1枚ごとに残りを見て、必要なら裏で取り直す
      if (!(await ensurePass())) return;

      try {
        await put(p, i);
      } catch (e) {
        console.error("[quote] 写真を上げられませんでした", (e as Error).message);
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
          console.error("[quote] 写真を上げ直しても駄目でした", (e2 as Error).message);
          failed = true;
        }
      }
    }

    // ③ 本文。**ここが成功して初めて「お送りいただきました」を出す**
    const sendBody = () =>
      fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          message,
          company,
          photos: urls,
          handoff,
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

    // GA4 に1件だけ数える。**ここは本文の送信が成功したことを確認した後**なので、
    // 「押した数」ではなく「本当に届いた数」になる。失敗して return した経路は通らない。
    // 写真だけ失敗していても本文は届いているので、そのときも数える。
    // タグが読めていない（広告ブロック等）ときは何もしない。数え損なうだけで、送信は妨げない。
    window.gtag?.("event", "generate_lead");

    setPhotoFailed(failed);
    setStatus("done");
  }

  /* ---- 送信後 ---- */
  if (status === "done") {
    return (
      <div className="qf">
        <div className="qf-done" role="status">
          <p className="qf-done-t">お送りいただきました。</p>
          <p>
            9:00〜21:00の間に、いただいたご連絡先へお返事します。
            <br />
            お急ぎの場合は、お電話かLINEをお使いください。
          </p>
          {photoFailed ? (
            <p className="qf-done-ng">
              ただし、<b>写真は送れませんでした。</b>
              ご依頼の内容は届いています。写真は
              <a className="tl" href={LINE_URL} target="_blank" rel="noopener noreferrer">
                公式LINE
              </a>
              からお送りいただけると助かります。
            </p>
          ) : null}
          <div className="qf-done-acts">
            <a className="btn" href={TEL_HREF}>
              {TEL}
            </a>
            <a className="btn" href={LINE_URL} target="_blank" rel="noopener noreferrer">
              LINEで相談する
            </a>
          </div>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="qf" onSubmit={submit} noValidate>
      {/* ---- /simulator からの引き継ぎ。読み取り専用 ---- */}
      {handoff ? (
        <div className="qf-sum">
          <div className="qf-sum-h">
            お見積りの内容
            {handoffCalcAt(handoff) ? <span>（{handoffCalcAt(handoff)}）</span> : null}
          </div>
          <dl className="qf-sum-l">
            {handoffLines(handoff).map((l) => (
              <div key={l.label}>
                <dt>{l.label}</dt>
                <dd>{l.value}</dd>
              </div>
            ))}
          </dl>
          {handoff.roundtrip ? (
            <p className="qf-sum-n">
              軽バン1台に積み切れないため、同じ日に2回に分けて運ぶ往復プランの金額です。
            </p>
          ) : null}
          <p className="qf-sum-n">
            この内容で合っていない場合は、下の「ご依頼の内容」に書いてください。
          </p>
        </div>
      ) : null}

      {/* ---- お名前 ---- */}
      <div className="qf-f">
        <label htmlFor="qf-name">
          お名前<em>必須</em>
        </label>
        <input
          id="qf-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "qf-name-e" : undefined}
        />
        {errors.name ? (
          <p className="qf-e" id="qf-name-e">
            {errors.name}
          </p>
        ) : null}
      </div>

      {/* ---- ご連絡先 ---- */}
      <div className="qf-f">
        <label htmlFor="qf-contact">
          ご連絡先<em>必須</em>
        </label>
        <input
          id="qf-contact"
          name="contact"
          type="text"
          inputMode="text"
          autoComplete="tel"
          placeholder="例）090-1234-5678　または　name@example.com"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          aria-invalid={errors.contact ? true : undefined}
          aria-describedby={errors.contact ? "qf-contact-e" : "qf-contact-h"}
        />
        <p className="qf-h" id="qf-contact-h">
          お電話番号またはメールアドレスのどちらかで結構です。
        </p>
        {errors.contact ? (
          <p className="qf-e" id="qf-contact-e">
            {errors.contact}
          </p>
        ) : null}
      </div>

      {/* ---- ご依頼の内容 ---- */}
      <div className="qf-f">
        <label htmlFor="qf-message">
          ご依頼の内容<em>必須</em>
        </label>
        <textarea
          id="qf-message"
          name="message"
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            "例）富山市内で1Kから1Kへの引越しです。冷蔵庫・洗濯機・ベッド・段ボール10箱ほど。\n　　9月の平日、日程はおまかせでも大丈夫です。2階でエレベーターはありません。"
          }
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "qf-message-e" : undefined}
        />
        {errors.message ? (
          <p className="qf-e" id="qf-message-e">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* ---- 写真 ---- */}
      <div className="qf-f">
        <label htmlFor="qf-photos">
          お荷物の写真<em>任意・{MAX_PHOTOS}枚まで</em>
        </label>

        {/* **ブラウザ標準の「ファイル選択／選択されていません」は出さない**（指示 28 ①）。
            「選択されていません」はシステムの言葉で、お客様には何かが足りない表示に読める。
            input は DOM に残したまま <label> で包み、見た目だけこのサイトの枠線ボタン（.btn）にする。
            **display:none にしない。**キーボードと読み上げから触れなくなる。
            opacity:0 のままボタンいっぱいに広げてあるので、
            ・タブキーで input に止まり、Enter / Space でファイル選択が開く
            ・ボタンのどこを押しても、押しているのは input 本体
            の両方が、JavaScript を1行も足さずに成り立つ */}
        <div className="qf-file">
          <label className="btn qf-file-b">
            <input
              ref={fileRef}
              id="qf-photos"
              name="photos"
              type="file"
              accept="image/*"
              multiple
              className="qf-file-i"
              onChange={(e) => pick(e.target.files)}
              disabled={photos.length >= MAX_PHOTOS || picking || sending}
            />
            写真を選ぶ
          </label>
          {/* 枚数はお客様の言葉で出す。0枚のときは何も書かない（:empty で消える） */}
          <span className="qf-file-n" aria-live="polite">
            {photos.length ? `${photos.length}枚選びました` : ""}
          </span>
        </div>

        <p className="qf-h">
          お部屋全体が写っている写真が1枚あると、いちばん正確に出せます。
          <br />
          大きな家具は個別に撮っていただけると助かります。
        </p>
        {picking ? <p className="qf-h">写真を読み込んでいます…</p> : null}
        {photoNote ? <p className="qf-e">{photoNote}</p> : null}

        {photos.length ? (
          <ul className="qf-thumbs">
            {photos.map((p, i) => (
              <li key={`${p.original}-${i}`}>
                {/* next/image は blob: を扱わない。プレビューは素の img */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt={`選んだ写真 ${i + 1}`} />
                <div className="qf-thumb-m">
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

      {/* ハニーポット。人には見えない。自動送信だけがここを埋める。
          name と id は、Chrome の自動入力が意味を割り当てられない綴りにしてある（指示 40）。
          `company` だと Chrome が「会社名」と解釈し、保存済み住所を選んだ本物のお客様の
          送信をここで黙って捨ててしまう。サーバーへ送る JSON の鍵は `company` のまま。
          ラベルも同じ理由で「会社名」を外してある（指示 41）。Chrome は name/id だけでなく
          ラベルの文字も手がかりにするため。この欄は画面にも読み上げにも出ないので、
          会社名の欄のふりをする必要がない */}
      <div className="qf-hp" aria-hidden="true">
        <label htmlFor="qf-7x">この欄は入力しないでください</label>
        <input
          id="qf-7x"
          name="qf7x"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {/* Turnstile。サイトキーが入っていないときは何も出さない */}
      <div className="qf-cf" ref={boxRef} />

      {/* **理由は書かない。**読んだお客様にできることは何もなく、
          うちの仕組みが壊れていることだけが伝わる（指示 27 ①）。
          理由はサーバーのログに残してある */}
      {status === "error" ? (
        <div className="qf-ng" role="alert">
          <p className="qf-ng-t">送信できませんでした。</p>
          <p>
            お手数ですが、お電話（
            <a className="tl" href={TEL_HREF}>
              {TEL}
            </a>
            ）か
            <a className="tl" href={LINE_URL} target="_blank" rel="noopener noreferrer">
              公式LINE
            </a>
            でご連絡ください。
            <br />
            9:00〜21:00 の間、年中無休で受け付けています。
          </p>
          <p className="qf-ng-k">入力していただいた内容はそのまま残してあります。</p>
        </div>
      ) : null}

      <div className="qf-send">
        <button type="submit" className="btn btn-fill" disabled={sending || picking}>
          {sending ? "送信しています…" : "写真を送って見積りを依頼"}
        </button>
      </div>

      <p className="qf-pp">
        送信をもって、
        <Link className="tl" href="/privacy">
          プライバシーポリシー
        </Link>
        にご同意いただいたものとして取り扱います。
      </p>
    </form>
  );
}
