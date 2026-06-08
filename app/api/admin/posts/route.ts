import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();

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
  const { title, slug, category, categoryBg, accent, excerpt, content, date } = body as Record<string, string>;

  if (!title?.trim() || !slug?.trim() || !content?.trim() || !date) {
    return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json(
      { error: "slugは英小文字・数字・ハイフンのみ使用できます" },
      { status: 400 }
    );
  }

  const mdPath = path.join(ROOT, "content/blog", `${slug}.md`);
  if (fs.existsSync(mdPath)) {
    return NextResponse.json({ error: "このslugは既に使用されています" }, { status: 409 });
  }

  // 1. マークダウンファイルを作成
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, content.trim(), "utf-8");

  // 2. lib/posts-meta.ts に追記
  const metaPath = path.join(ROOT, "lib/posts-meta.ts");
  const metaContent = fs.readFileSync(metaPath, "utf-8");

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
    fs.unlinkSync(mdPath);
    return NextResponse.json(
      { error: "posts-meta.ts の更新に失敗しました" },
      { status: 500 }
    );
  }

  const insertAt = markerIdx + marker.length;
  const updatedMeta =
    metaContent.slice(0, insertAt) + newEntry + metaContent.slice(insertAt);
  fs.writeFileSync(metaPath, updatedMeta, "utf-8");

  // 3. Git コミット（失敗しても続行）
  let gitCommitted = false;
  try {
    execSync(`git add "${mdPath}" "${metaPath}"`, { cwd: ROOT, stdio: "pipe" });
    execSync(`git commit -m "blog: ${slug} を追加"`, { cwd: ROOT, stdio: "pipe" });
    gitCommitted = true;
  } catch (e) {
    console.warn("Git commit skipped:", e instanceof Error ? e.message : e);
  }

  return NextResponse.json({ ok: true, slug, gitCommitted });
}
