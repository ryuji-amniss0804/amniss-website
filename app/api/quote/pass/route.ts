import { NextResponse, type NextRequest } from "next/server";
import { issuePass, verifyTurnstile } from "@/lib/quote-server";

/**
 * Turnstile を1回だけ検証して、短命の通行証を返す。
 *
 * **Turnstile のトークンは1回しか検証できない**（消費される）のに対し、
 * フォームの送信はアップロードと本文送信の2回サーバーを叩く。
 * 理由は lib/quote-server.ts の冒頭に書いてある。
 */
export async function POST(req: NextRequest) {
  let token = "";
  try {
    const body = (await req.json()) as { token?: unknown };
    if (typeof body.token === "string") token = body.token;
  } catch {
    // 本文が JSON でないときは token 空として扱う（下で弾かれる）
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const guard = await verifyTurnstile(token, ip);
  if (!guard.ok) {
    // **画面には理由を出さない**（指示 27 ①）ので、追えるようにここへ残す。
    // お客様の入力は1文字も通っていない口なので、ログに出して困る中身はない
    console.error("[quote/pass] 通行証を出せませんでした", guard.status, guard.message);
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  return NextResponse.json({ pass: await issuePass() });
}
