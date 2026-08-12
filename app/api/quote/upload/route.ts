import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { MAX_PHOTO_BYTES, PHOTO_PREFIX } from "@/lib/quote";
import { verifyPass } from "@/lib/quote-server";

/**
 * 写真のアップロード用トークンを発行する。
 *
 * **写真そのものはここを通らない。**ブラウザから Vercel Blob へ直接上がる
 * （指示 24「守ること」：写真が Vercel の関数を経由しないこと）。
 * この口が渡すのは、1ファイルぶんの短命なトークンだけ。
 *
 * 誰でも叩ける口にしないため、Turnstile を通した証（通行証）を見る。
 * `access: "public"` はブラウザ側で指定する。**public にしたうえで、
 * パス名の末尾にランダムな文字列を付ける**（addRandomSuffix）ので、
 * URLを知らないかぎり辿り着けない。そのうえで90日で消す（/api/cron/purge-photos）。
 */

/** 上げられる形式。HEIC はブラウザが縮小できないので原寸で上がってくることがある */
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
];

export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;

  // 通行証の検証。type を見ているのは、将来 onUploadCompleted を足したときに
  // Vercel からの折り返し（ヘッダーを付けられない）を巻き込まないため
  if (body.type === "blob.generate-client-token") {
    const guard = await verifyPass(req.headers.get("x-quote-pass"));
    if (!guard.ok) {
      // 画面には理由を出さない（指示 27 ①）ので、ここへ残す。
      // 401 はふつう「通行証が切れた」で、ブラウザは黙って取り直して上げ直す
      console.error("[quote/upload] 通行証を弾きました", guard.status, guard.message);
      return NextResponse.json({ error: guard.message }, { status: guard.status });
    }
  }

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // パス名はブラウザから来る。quote/ の外に書かせない
        if (!pathname.startsWith(PHOTO_PREFIX) || pathname.includes("..")) {
          throw new Error("パス名が不正です");
        }
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: MAX_PHOTO_BYTES,
          // 推測できないURLにする。公式の例と同じ32文字前後のランダム文字列が付く
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    console.error("[quote/upload] トークンを出せませんでした", (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
