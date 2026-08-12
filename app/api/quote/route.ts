import { NextResponse, type NextRequest } from "next/server";
import { MAX_PHOTOS, parseHandoff } from "@/lib/quote";
import { buildQuoteMail } from "@/lib/quote-mail";
import { verifyPass } from "@/lib/quote-server";

/**
 * お見積り依頼を、竜司さんのメールへ送る。
 *
 * **メールの送信が成功したことを確認してから 200 を返す。**
 * ここで先に 200 を返すと、画面には「お送りいただきました」が出て、
 * 竜司さんには何も届かない、という誰も気づかない失敗ができる（指示 25 §7①）。
 *
 * 写真はこの関数を通らない。ブラウザが Blob へ直接上げたあとのURLだけを受け取る。
 * そのURLは**お客様の手元を通ってくる**ので、保管先のドメインかどうかを検める。
 * メール本文の組み立ては lib/quote-mail.ts（副作用なし）。
 */

/** Resend の無料枠（ドメイン認証なし）で使える差出人 */
const DEFAULT_FROM = "onboarding@resend.dev";

/** 写真のURLとして受け付けるホスト */
const BLOB_HOST_SUFFIX = ".blob.vercel-storage.com";

const LIMIT = { name: 100, contact: 200, message: 5000 };

function isBlobUrl(u: string): boolean {
  try {
    const url = new URL(u);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "送信内容を読み取れませんでした" }, { status: 400 });
  }

  // ハニーポット。人には見えない欄が埋まっているのは自動送信なので、
  // 何も送らずに 200 を返す（相手に「弾かれた」と気づかせない）
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const guard = await verifyPass(typeof body.pass === "string" ? body.pass : null);
  if (!guard.ok) {
    // 画面には理由を出さない（指示 27 ①）ので、ここへ残す。
    // 401 はふつう「通行証が切れた」で、ブラウザは黙って取り直して送り直す
    console.error("[quote] 通行証を弾きました", guard.status, guard.message);
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, LIMIT.name) : "";
  const contact =
    typeof body.contact === "string" ? body.contact.trim().slice(0, LIMIT.contact) : "";
  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, LIMIT.message) : "";

  if (!name || !contact || !message) {
    return NextResponse.json({ error: "必須項目が入力されていません" }, { status: 400 });
  }

  const photos = (Array.isArray(body.photos) ? body.photos : [])
    .filter((p): p is string => typeof p === "string" && isBlobUrl(p))
    .slice(0, MAX_PHOTOS);

  const to = process.env.QUOTE_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) {
    console.error("[quote] RESEND_API_KEY / QUOTE_TO_EMAIL が設定されていません");
    return NextResponse.json({ error: "メールの設定が完了していません" }, { status: 500 });
  }

  const mail = buildQuoteMail({
    name,
    contact,
    message,
    photos,
    handoff: parseHandoff(body.handoff),
    now: new Date(),
  });

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || DEFAULT_FROM,
        to: [to],
        subject: mail.subject,
        // **text と html の両方を送る。**HTMLを出さないメールソフトでも
        // 同じ本文が読めるように（指示 34 §1）
        text: mail.text,
        html: mail.html,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
    });
  } catch (e) {
    console.error("[quote] Resend に接続できませんでした", e);
    return NextResponse.json({ error: "メールを送信できませんでした" }, { status: 502 });
  }

  if (!res.ok) {
    // 本文にお客様の入力が入るので、ログにはステータスと Resend の応答だけを残す
    console.error("[quote] Resend が失敗を返しました", res.status, await res.text());
    return NextResponse.json({ error: "メールを送信できませんでした" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
