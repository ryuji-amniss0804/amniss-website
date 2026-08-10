import { del, list } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import { PHOTO_PREFIX, PHOTO_RETENTION_DAYS } from "@/lib/quote";
import { isProd } from "@/lib/quote-server";

/**
 * お見積り依頼で受け取った写真を、90日で消す。
 *
 * Vercel Blob には R2 のような「◯日で消す」設定が無いので、
 * Vercel Cron（vercel.json）から1日1回ここを叩く。
 *
 * **日数は lib/quote.ts の PHOTO_RETENTION_DAYS 1つだけを見ている。**
 * メール本文の削除予定日・/privacy の条文・この削除が、同じ数字から出るようにするため。
 * 実際に消えるのは、その日を過ぎてから最初に Cron が走ったとき（最大24時間の遅れ）。
 *
 * 消すのは quote/ の下だけ。ほかの用途で Blob を使い始めても巻き込まない。
 * 削除の操作は課金対象外。
 */

/** list の1回ぶん。取りこぼさないよう、消す前に全ページを集める */
const PAGE = 1000;
/** del にまとめて渡す数 */
const CHUNK = 100;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    if (req.headers.get("authorization") !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (isProd()) {
    // 本番で鍵が無いなら、誰でも叩ける削除口になる。動かさない
    console.error("[purge] CRON_SECRET が設定されていません");
    return NextResponse.json({ error: "CRON_SECRET が設定されていません" }, { status: 500 });
  }

  const cutoff = Date.now() - PHOTO_RETENTION_DAYS * 24 * 60 * 60 * 1000;

  const stale: string[] = [];
  let checked = 0;
  let cursor: string | undefined;

  try {
    do {
      const page = await list({ prefix: PHOTO_PREFIX, cursor, limit: PAGE });
      checked += page.blobs.length;
      for (const b of page.blobs) {
        if (b.uploadedAt.getTime() < cutoff) stale.push(b.url);
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    for (let i = 0; i < stale.length; i += CHUNK) {
      await del(stale.slice(i, i + CHUNK));
    }
  } catch (e) {
    console.error("[purge] 削除に失敗しました", e);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }

  console.log(`[purge] ${checked}件を確認、${stale.length}件を削除（${PHOTO_RETENTION_DAYS}日）`);
  return NextResponse.json({ checked, deleted: stale.length, days: PHOTO_RETENTION_DAYS });
}
