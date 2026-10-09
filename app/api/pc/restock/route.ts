import { NextResponse, type NextRequest } from "next/server";
import { RESTOCK_EMAIL, RESTOCK_KINDS, buildRestockMails } from "@/lib/pc-restock";
import { verifyPass } from "@/lib/quote-server";

/**
 * 中古パソコンの入荷通知の受付（/pc の「入荷したら知らせてほしい」）。
 *
 * 作りは `app/api/pc/inquiry/route.ts` と同じ。守ることも同じ。
 * - 人には見えない欄（ハニーポット）が埋まっていたら、何も送らずに 200 を返す
 * - 通行証（`/api/quote/pass`。Turnstile を1回通した証）が無ければ受け付けない。
 *   **送信回数を絞っているのはこれ。** `/api/pc/inquiry` と同じしくみで、新しい環境変数は要らない
 * - 送信元は `RESEND_FROM`、宛先は `/api/pc/inquiry` と同じ受信箱
 *
 * 送るのは2通（中身は `lib/pc-restock.ts`。副作用なし）。
 *   1. 受信箱へ：誰が・何を・いつ希望したか
 *   2. 登録した人へ：受け付けたことを知らせる自動返信（1通だけ）
 *
 * **1通目が届いたことを確認してから 200 を返す。**先に 200 を返すと、画面には
 * 「受け付けました」が出て、受信箱には何も届かない、という誰も気づかない失敗ができる。
 * 2通目（自動返信）が送れなかったときは、ログに残して 200 を返す。受付そのものは
 * 受信箱に届いていて、入荷のお知らせは送れるため。
 *
 * ⚠ 登録者を保存しない（DBを作らない）。一斉配信もしない。94 §5。
 */

/** Resend の無料枠（ドメイン認証なし）で使える差出人。/api/pc/inquiry と同じ */
const DEFAULT_FROM = "onboarding@resend.dev";

/** 文字数の上限。/api/pc/inquiry の email と同じ */
const EMAIL_MAX = 200;

type Mail = { to: string; subject: string; text: string; replyTo?: string };

async function send(apiKey: string, from: string, m: Mail): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [m.to],
        subject: m.subject,
        text: m.text,
        ...(m.replyTo ? { reply_to: m.replyTo } : {}),
      }),
    });
    if (res.ok) return { ok: true, detail: "" };
    return { ok: false, detail: `${res.status} ${await res.text()}` };
  } catch (e) {
    return { ok: false, detail: `接続できませんでした ${(e as Error).message}` };
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
    console.error("[pc/restock] 通行証を弾きました", guard.status, guard.message);
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || email.length > EMAIL_MAX || !RESTOCK_EMAIL.test(email)) {
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
  }

  // 選択式の項目。一覧にある値だけを通す（無ければ空）
  const kindRaw = typeof body.kind === "string" ? body.kind.trim() : "";
  const kind = (RESTOCK_KINDS as readonly string[]).includes(kindRaw) ? kindRaw : "";

  // 宛先は /api/pc/inquiry と同じ受信箱。見分けは件名の【re'vive_doc】が持つ
  const to = process.env.PC_INQUIRY_TO_EMAIL || process.env.QUOTE_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) {
    console.error("[pc/restock] RESEND_API_KEY / QUOTE_TO_EMAIL が設定されていません");
    return NextResponse.json({ error: "メールの設定が完了していません" }, { status: 500 });
  }
  const from = process.env.RESEND_FROM || DEFAULT_FROM;

  const mails = buildRestockMails({ email, kind, now: new Date() });

  // ① 受信箱へ。**ここが届いて初めて「受け付けました」を出す**
  const owner = await send(apiKey, from, { to, ...mails.owner });
  if (!owner.ok) {
    console.error("[pc/restock] 受信箱へのメールを送れませんでした", owner.detail);
    return NextResponse.json({ error: "メールを送信できませんでした" }, { status: 502 });
  }

  // ② 登録した人へ（自動返信1通だけ）。送れなくても受付は済んでいるので、ログに残して進む
  const reply = await send(apiKey, from, mails.reply);
  if (!reply.ok) {
    console.error("[pc/restock] 自動返信を送れませんでした", reply.detail);
  }

  return NextResponse.json({ ok: true });
}
