import { NextResponse, type NextRequest } from "next/server";
import { TRAVEL } from "@/lib/pc";
import { MACHINES, buildPcInquiryMail } from "@/lib/pc-inquiry";
import { MAX_PHOTOS } from "@/lib/quote";
import { verifyPass } from "@/lib/quote-server";

/**
 * パソコン修理のご相談（/pc/contact）を、竜司さんのメールへ送る。
 *
 * 手本は `app/api/quote/route.ts`（引越しの見積り依頼の受け口）。守ることは同じ。
 *
 * ⚠ **`app/api/quote/route.ts` に項目を足して共用しないこと。**
 *   あちらは**いま動いている引越しの問い合わせの受け口**で、竜司さんの集客の中心。
 *   パソコン用の項目を足すために共有部分を触るのは割に合わない。
 *   通行証（`/api/quote/pass`）・写真の口（`/api/quote/upload`）・写真の自動削除
 *   （`/api/cron/purge-photos`）は**そのまま借りる**ので、新しい環境変数は1つも要らない。
 *
 * **メールの送信が成功したことを確認してから 200 を返す。**
 * ここで先に 200 を返すと、画面には「お送りいただきました」が出て、
 * 竜司さんには何も届かない、という誰も気づかない失敗ができる。
 *
 * 写真はこの関数を通らない。ブラウザが Blob へ直接上げたあとのURLだけを受け取る。
 * そのURLは**お客様の手元を通ってくる**ので、保管先のドメインかどうかを検める。
 * メール本文の組み立ては `lib/pc-inquiry.ts`（副作用なし）。
 */

/** Resend の無料枠（ドメイン認証なし）で使える差出人 */
const DEFAULT_FROM = "onboarding@resend.dev";

/** 写真のURLとして受け付けるホスト */
const BLOB_HOST_SUFFIX = ".blob.vercel-storage.com";

/** 文字数の上限。引越しの受け口（app/api/quote/route.ts）に合わせてある */
const LIMIT = { name: 100, tel: 200, email: 200, symptom: 5000, preferred: 200 };

/** 市町村は `lib/pc.ts` の `TRAVEL` から作る。**一覧をここに書かないこと** */
const CITIES: readonly string[] = TRAVEL.flatMap((t) => t.cities as readonly string[]);

function isBlobUrl(u: string): boolean {
  try {
    const url = new URL(u);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** 選択式の項目。一覧にある値だけを通す（無ければ空） */
function pick(v: unknown, allowed: readonly string[]): string {
  const s = typeof v === "string" ? v.trim() : "";
  return allowed.includes(s) ? s : "";
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
    // 画面には理由を出さないので、ここへ残す。
    // 401 はふつう「通行証が切れた」で、ブラウザは黙って取り直して送り直す
    console.error("[pc/inquiry] 通行証を弾きました", guard.status, guard.message);
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const name = text(body.name, LIMIT.name);
  const tel = text(body.tel, LIMIT.tel);
  const email = text(body.email, LIMIT.email);
  const city = pick(body.city, CITIES);
  const machine = pick(body.machine, MACHINES);
  const symptom = text(body.symptom, LIMIT.symptom);
  const preferred = text(body.preferred, LIMIT.preferred);

  if (!name || !tel || !city || !symptom) {
    return NextResponse.json({ error: "必須項目が入力されていません" }, { status: 400 });
  }

  const photos = (Array.isArray(body.photos) ? body.photos : [])
    .filter((p): p is string => typeof p === "string" && isBlobUrl(p))
    .slice(0, MAX_PHOTOS);

  /**
   * 宛先。**いまは引越しと同じ受信箱に届く。**
   * パソコン用のメールアドレスを分けたくなったら、Vercel に `PC_INQUIRY_TO_EMAIL` を
   * 足すだけで切り替わる。**新しい環境変数を作らなくても動くこと。**
   * 見分けは件名の `【PC修理】`（lib/pc-inquiry.ts）が持つ。
   */
  const to = process.env.PC_INQUIRY_TO_EMAIL || process.env.QUOTE_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) {
    console.error("[pc/inquiry] RESEND_API_KEY / QUOTE_TO_EMAIL が設定されていません");
    return NextResponse.json({ error: "メールの設定が完了していません" }, { status: 500 });
  }

  const mail = buildPcInquiryMail({
    name,
    tel,
    email,
    city,
    machine,
    symptom,
    preferred,
    photos,
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
        // **text と html の両方を送る。**HTMLを出さないメールソフトでも同じ本文が読めるように
        text: mail.text,
        html: mail.html,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
    });
  } catch (e) {
    console.error("[pc/inquiry] Resend に接続できませんでした", e);
    return NextResponse.json({ error: "メールを送信できませんでした" }, { status: 502 });
  }

  if (!res.ok) {
    // 本文にお客様の入力が入るので、ログにはステータスと Resend の応答だけを残す
    console.error("[pc/inquiry] Resend が失敗を返しました", res.status, await res.text());
    return NextResponse.json({ error: "メールを送信できませんでした" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
