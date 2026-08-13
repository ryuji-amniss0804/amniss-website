import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const GH = "https://api.github.com";

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

async function ghFetch(path: string, options?: RequestInit) {
  return fetch(`${GH}${path}`, { ...options, headers: ghHeaders() });
}

/**
 * フロントマターの値を YAML の二重引用符付き文字列にする。
 *
 * `JSON.stringify` の出す形（`"..."` と `\"` `\\` `\n` `\uXXXX` の逃がし方）は
 * YAML の二重引用符付き文字列と同じ規則なので、そのまま使える。
 *
 * ⚠ **引用符は必ず付けること。**とくに日付。`date: 2026.08.13` と裸で書くと
 * YAML が数値や日付として読み、表示と並び順が狂う（`lib/posts.ts` の
 * `toDateString` のコメントを参照）。タイトルや概要に `:` や `#` が入る場合も同じ。
 */
function yaml(value: string): string {
  return JSON.stringify(value);
}

async function verifyAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? "")
    );
    return true;
  } catch {
    return false;
  }
}

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

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json(
      { error: "slugは英小文字・数字・ハイフンのみ使用できます" },
      { status: 400 }
    );
  }

  const owner = process.env.GITHUB_OWNER ?? "";
  const repo = process.env.GITHUB_REPO ?? "";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  const base = `/repos/${owner}/${repo}`;

  // slug の重複チェック
  const checkRes = await ghFetch(
    `${base}/contents/content/blog/${slug}.md?ref=${branch}`
  );
  if (checkRes.ok) {
    return NextResponse.json({ error: "このslugは既に使用されています" }, { status: 409 });
  }

  // 【50】メタデータは記事ファイルの先頭（フロントマター）に書く。
  // 以前はここで `lib/posts-meta.ts` を取ってきて、配列の宣言行を目印に
  // 文字列で1件ぶん差し込んでいた。**コミットも2ファイルになっていた。**
  // 目印の行が動いただけで投稿が 500 になる作りだったので、丸ごとやめている。
  const frontMatter =
    `---\n` +
    `title: ${yaml(title.trim())}\n` +
    `excerpt: ${yaml((excerpt ?? "").trim())}\n` +
    `date: ${yaml(date)}\n` +
    `category: ${yaml(category ?? "ブログ")}\n` +
    `categoryBg: ${yaml(categoryBg ?? "bg-slate-50 text-slate-700 border-slate-200/50")}\n` +
    `accent: ${yaml(accent ?? "bg-emerald-50 text-emerald-700")}\n` +
    `---\n\n`;

  const fileBody = frontMatter + content.trim() + "\n";

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
      tree: [
        { path: `content/blog/${slug}.md`, mode: "100644", type: "blob", sha: mdBlob.sha },
      ],
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
