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

  // posts-meta.ts の現在の内容と SHA を取得
  const metaRes = await ghFetch(`${base}/contents/lib/posts-meta.ts?ref=${branch}`);
  if (!metaRes.ok) {
    return NextResponse.json({ error: "posts-meta.ts の取得に失敗しました" }, { status: 500 });
  }
  const metaJson = await metaRes.json();
  const metaContent = Buffer.from(metaJson.content.replace(/\n/g, ""), "base64").toString("utf-8");

  // 新しいエントリを先頭に挿入
  const newEntry =
    `  {\n` +
    `    slug: "${slug}",\n` +
    `    title: ${JSON.stringify(title.trim())},\n` +
    `    excerpt: ${JSON.stringify((excerpt ?? "").trim())},\n` +
    `    date: "${date}",\n` +
    `    category: ${JSON.stringify(category ?? "ブログ")},\n` +
    `    categoryBg: "${categoryBg ?? "bg-slate-50 text-slate-700 border-slate-200/50"}",\n` +
    `    accent: "${accent ?? "bg-emerald-50 text-emerald-700"}",\n` +
    `  },\n`;

  const marker = "export const BLOG_POSTS_META: BlogPostMeta[] = [\n";
  const markerIdx = metaContent.indexOf(marker);
  if (markerIdx === -1) {
    return NextResponse.json({ error: "posts-meta.ts の更新に失敗しました" }, { status: 500 });
  }
  const insertAt = markerIdx + marker.length;
  const updatedMeta =
    metaContent.slice(0, insertAt) + newEntry + metaContent.slice(insertAt);

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

  // 2つのブロブを作成
  const [mdBlob, metaBlob] = await Promise.all([
    ghFetch(`${base}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({
        content: Buffer.from(content.trim()).toString("base64"),
        encoding: "base64",
      }),
    }).then((r) => r.json()),
    ghFetch(`${base}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({
        content: Buffer.from(updatedMeta).toString("base64"),
        encoding: "base64",
      }),
    }).then((r) => r.json()),
  ]);

  // 新しいツリーを作成
  const treeRes = await ghFetch(`${base}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseTree,
      tree: [
        { path: `content/blog/${slug}.md`, mode: "100644", type: "blob", sha: mdBlob.sha },
        { path: "lib/posts-meta.ts", mode: "100644", type: "blob", sha: metaBlob.sha },
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
