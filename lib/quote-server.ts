import { SignJWT, jwtVerify } from "jose";
import { PASS_TTL_SEC } from "@/lib/quote";

/**
 * お見積り依頼フォームのサーバー側の共通処理。
 * **このファイルはブラウザから読まないこと**（鍵を触る）。
 *
 * 【なぜ「通行証」を挟むのか】
 * Turnstile のトークンは**1回検証すると使えなくなる**（Cloudflare 側で消費される）。
 * ところがフォームの送信は
 *   ① 写真をブラウザから Blob へ直接上げる（アップロード用トークンをこちらが発行する）
 *   ② 本文と写真のURLを送る
 * の2回サーバーを叩く。**1つのトークンで2回検証できない。**
 * そこで Turnstile を1回だけ検証し、その結果を短命の署名つき通行証にして、
 * ①と②はその通行証を見る形にしてある。
 * これがないと①のアップロード口が誰でも叩ける（保管先が荒らされる）。
 *
 * 署名鍵は TURNSTILE_SECRET_KEY から**派生**させている。
 * 竜司さんに新しい環境変数をもう1つ作ってもらわずに済ませるため。
 * そのまま鍵に使わずハッシュを通すのは、用途の違う2つに同じ値を使わないため。
 */

/**
 * 通行証の有効期間は lib/quote.ts の PASS_TTL_SEC。
 * **ブラウザ側も同じ数字を見て、切れる前に黙って取り直す。**
 * 数字と、その長さの理由は lib/quote.ts に書いてある。
 */

/** 本番かどうか。鍵が無いときに黙って素通しするかどうかの分かれ目 */
export function isProd(): boolean {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

async function passKey(secret: string): Promise<Uint8Array> {
  const raw = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`revive-quote-pass:${secret}`),
  );
  return new Uint8Array(raw);
}

export type Guard =
  | { ok: true }
  /** 設定が足りない。本番では素通しせず、ここで止める */
  | { ok: false; status: number; message: string };

/**
 * Turnstile の検証。
 * 鍵が無いとき、本番は**落とす**（スパム対策が外れたまま動くほうが危ない）。
 * ローカルは素通しする（鍵は竜司さんが入れるもので、CC は値を持たない）。
 */
export async function verifyTurnstile(token: string, ip: string | null): Promise<Guard> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (isProd()) {
      return { ok: false, status: 500, message: "TURNSTILE_SECRET_KEY が設定されていません" };
    }
    console.warn("[quote] TURNSTILE_SECRET_KEY が無いので、Turnstile の検証を飛ばしました");
    return { ok: true };
  }
  if (!token) return { ok: false, status: 400, message: "認証を完了してください" };

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const json = (await res.json()) as { success?: boolean };
    if (!json.success) return { ok: false, status: 400, message: "認証を完了してください" };
    return { ok: true };
  } catch {
    return { ok: false, status: 502, message: "認証サーバーに接続できませんでした" };
  }
}

/** 通行証を作る。中身は空でよく、「Turnstile を通った」ことだけを署名で示す */
export async function issuePass(): Promise<string> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return "dev";
  return new SignJWT({ p: "quote" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${PASS_TTL_SEC}s`)
    .sign(await passKey(secret));
}

/** 通行証を検める。切れていたら 401（ブラウザ側はもう一度 Turnstile を通す） */
export async function verifyPass(pass: string | null): Promise<Guard> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (isProd()) {
      return { ok: false, status: 500, message: "TURNSTILE_SECRET_KEY が設定されていません" };
    }
    return { ok: true };
  }
  if (!pass) return { ok: false, status: 401, message: "認証をやり直してください" };
  try {
    await jwtVerify(pass, await passKey(secret));
    return { ok: true };
  } catch {
    return { ok: false, status: 401, message: "認証をやり直してください" };
  }
}
