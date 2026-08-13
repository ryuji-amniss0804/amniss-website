import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/admin-auth";
import {
  SLUG_PATTERN,
  buildPostFile,
  deletePostFromRepo,
  readPostFromRepo,
  writePostToRepo,
} from "@/lib/admin-github";

/**
 * 記事1本の 取得 / 上書き / 削除。【55／段階4】
 *
 * 投稿（`../route.ts`）と違い、**ここは取り返しがつかない操作を含む。**
 * 守っていることを先に書いておく。
 *
 * 1. `slug` は URL からしか取らない。**本文の中の値では動かさない**（別の記事を消させないため）
 * 2. 上書きは、**編集画面が読んだときの blob SHA** を添えて出す。
 *    その間に誰かが（＝別のタブ・別の端末が）書き換えていたら GitHub が 409 で弾く。
 *    **「開きっぱなしのタブが、後から古い本文で上書きする」を防ぐのはここだけ。**
 * 3. 削除は、**本文に `confirmSlug` が入っていて、URL の slug と一致しないと動かない。**
 *    画面側でも slug を打たせているが、**画面の作りだけを守りにしない。**
 * 4. 本文が空の保存は 400 で断る。空を通すと記事が白紙になる（A-4 でこの画面は
 *    「空になる」壊れ方をすることが分かっている）
 */

function badSlug(slug: string) {
  return !slug || !SLUG_PATTERN.test(slug);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  if (badSlug(slug)) {
    return NextResponse.json({ error: "slugの形式が正しくありません" }, { status: 400 });
  }

  const result = await readPostFromRepo(slug);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ ok: true, post: result.post });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  if (badSlug(slug)) {
    return NextResponse.json({ error: "slugの形式が正しくありません" }, { status: 400 });
  }

  const body = (await req.json()) as Record<string, string>;
  const { title, category, categoryBg, accent, excerpt, content, date, sha } = body;

  // ⚠ 本文が空のままの保存は通さない。ここを緩めると記事が白紙になる。
  if (!content?.trim()) {
    return NextResponse.json(
      { error: "本文が空です。空のままでは保存できません" },
      { status: 400 }
    );
  }
  if (!title?.trim() || !date) {
    return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
  }
  if (!sha) {
    return NextResponse.json(
      { error: "編集画面を開き直してから、もう一度保存してください" },
      { status: 400 }
    );
  }

  const fileBody = buildPostFile(
    { title, excerpt, date, category, categoryBg, accent },
    content
  );

  const res = await writePostToRepo(slug, fileBody, sha, `blog: ${slug} を更新`);

  if (res.status === 409) {
    return NextResponse.json(
      {
        error:
          "この記事は、別の場所で更新されています。ページを開き直してから、もう一度保存してください",
      },
      { status: 409 }
    );
  }
  if (res.status === 404) {
    return NextResponse.json(
      { error: "この記事は見つかりませんでした（削除された可能性があります）" },
      { status: 404 }
    );
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("GitHub update failed:", err);
    return NextResponse.json({ error: "GitHubへの保存に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug, gitCommitted: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  if (badSlug(slug)) {
    return NextResponse.json({ error: "slugの形式が正しくありません" }, { status: 400 });
  }

  // 画面の作りだけを守りにしない。**本文にも同じ slug が入っていないと動かない。**
  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  if (body.confirmSlug !== slug) {
    return NextResponse.json(
      { error: "確認のため、削除する記事の slug を入力してください" },
      { status: 400 }
    );
  }

  // 消すときの SHA は、**いま GitHub にあるもの**を取り直して使う。
  // 一覧はビルド時のファイルから作られていて、最大2分ぶん古いことがあるため。
  const current = await readPostFromRepo(slug);
  if (!current.ok) {
    if (current.status === 404) {
      return NextResponse.json(
        { alreadyDeleted: true, error: "この記事は既に削除されています" },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: current.error }, { status: current.status });
  }

  const res = await deletePostFromRepo(slug, current.post.sha, `blog: ${slug} を削除`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("GitHub delete failed:", err);
    return NextResponse.json({ error: "GitHubからの削除に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug, gitCommitted: true });
}
