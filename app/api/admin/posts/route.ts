import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/admin-auth";
import {
  SLUG_PATTERN,
  buildPostFile,
  ghFetch,
  postPath,
  repoInfo,
} from "@/lib/admin-github";

/**
 * 記事の新規投稿。
 *
 * 【55／段階4】フロントマターの組み立て・GitHub の叩き方・認証は
 * `lib/admin-github.ts` と `lib/admin-auth.ts` へ移した。**編集APIと同じ関数を使う。**
 * 別々に持つと、いつか形が食い違い「1文字も変えずに保存したのに記事が変わる」が起きる。
 * **コミットの作り方（Git Data API で1コミット）はここだけ変えていない。**
 */

export async function POST(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, category, categoryBg, accent, excerpt, content, date } =
    body as Record<string, string>;

  if (!title?.trim() || !slug?.trim() || !content?.trim() || !date) {
    return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
  }

  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json(
      { error: "slugは英小文字・数字・ハイフンのみ使用できます" },
      { status: 400 }
    );
  }

  const { base, branch } = repoInfo();

  // slug の重複チェック
  const checkRes = await ghFetch(`${base}/contents/${postPath(slug)}?ref=${branch}`);
  if (checkRes.ok) {
    return NextResponse.json({ error: "このslugは既に使用されています" }, { status: 409 });
  }

  // 【50】メタデータは記事ファイルの先頭（フロントマター）に書く。
  // 以前はここで `lib/posts-meta.ts` を取ってきて、配列の宣言行を目印に
  // 文字列で1件ぶん差し込んでいた。**コミットも2ファイルになっていた。**
  // 目印の行が動いただけで投稿が 500 になる作りだったので、丸ごとやめている。
  const fileBody = buildPostFile(
    { title, excerpt, date, category, categoryBg, accent },
    content
  );

  // ── Git Data API で1コミットにまとめる ──────────────────────

  // 現在のブランチの最新コミット SHA
  const refRes = await ghFetch(`${base}/git/refs/heads/${branch}`);
  if (!refRes.ok) {
    return NextResponse.json({ error: "ブランチ情報の取得に失敗しました" }, { status: 500 });
  }
  const refJson = await refRes.json();
  const latestSha: string = refJson.object.sha;

  // 最新コミットのツリー SHA
  const commitRes = await ghFetch(`${base}/git/commits/${latestSha}`);
  const commitJson = await commitRes.json();
  const baseTree: string = commitJson.tree.sha;

  // ブロブを作成（【50】記事ファイル1つだけ）
  const mdBlob = await ghFetch(`${base}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({
      content: Buffer.from(fileBody).toString("base64"),
      encoding: "base64",
    }),
  }).then((r) => r.json());

  // 新しいツリーを作成
  const treeRes = await ghFetch(`${base}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseTree,
      tree: [{ path: postPath(slug), mode: "100644", type: "blob", sha: mdBlob.sha }],
    }),
  });
  const treeJson = await treeRes.json();

  // コミットを作成
  const newCommitRes = await ghFetch(`${base}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: `blog: ${slug} を追加`,
      tree: treeJson.sha,
      parents: [latestSha],
    }),
  });
  const newCommitJson = await newCommitRes.json();

  // ブランチを更新
  const updateRes = await ghFetch(`${base}/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommitJson.sha, force: false }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    console.error("GitHub ref update failed:", err);
    return NextResponse.json({ error: "GitHubへのコミットに失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug, gitCommitted: true });
}
