import matter from "gray-matter";
import { toDateString } from "./posts";

/**
 * 管理画面から GitHub の `main` を書き換えるための共通部品。
 *
 * 【なぜ分けたか —— 55／段階4】
 * 投稿（`app/api/admin/posts/route.ts`）と、編集・削除（`.../[slug]/route.ts`）が
 * **別々にフロントマターを組み立てると、いつか形が食い違う。**
 * 食い違った瞬間に「1文字も変えずに保存したのに記事が変わる」が起きる。
 * **記事ファイルの形を決める場所は、この1か所だけにしてある。**
 *
 * ⚠ `buildPostFile()` の出力は**投稿APIが書いていた形と1バイトも同じ**にしてあること。
 *   既存記事を読み直して書き戻したときに差分が出たら、それはこの関数のバグ。
 *   （55の検証2で、既存2記事について差分0バイトを実測している）
 */

const GH = "https://api.github.com";

/** 記事1本のメタデータ（`slug` と本文を除いたフロントマターの中身） */
export type PostFields = {
  title: string;
  excerpt: string;
  /** フロントマターに書く形。**点区切り**（例 `2026.08.13`） */
  date: string;
  category: string;
  categoryBg: string;
  accent: string;
};

export type RepoPost = PostFields & {
  slug: string;
  /** フロントマターを除いた本文（Markdown） */
  content: string;
  /** GitHub 上の blob SHA。**編集・削除のときに、読んだ時点から変わっていないかの確認に使う** */
  sha: string;
};

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const DEFAULT_CATEGORY = "ブログ";
const DEFAULT_CATEGORY_BG = "bg-slate-50 text-slate-700 border-slate-200/50";
const DEFAULT_ACCENT = "bg-emerald-50 text-emerald-700";

export function repoInfo() {
  const owner = process.env.GITHUB_OWNER ?? "";
  const repo = process.env.GITHUB_REPO ?? "";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  return { owner, repo, branch, base: `/repos/${owner}/${repo}` };
}

export function postPath(slug: string) {
  return `content/blog/${slug}.md`;
}

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

/**
 * GitHub API を叩く。
 *
 * ⚠ `cache: "no-store"` を必ず付けること。編集画面は**サーバー側でこの関数を呼んで
 * 記事の中身を読む**ので、キャッシュが効くと**古い本文を編集させてしまう。**
 */
export async function ghFetch(path: string, options?: RequestInit) {
  return fetch(`${GH}${path}`, { ...options, headers: ghHeaders(), cache: "no-store" });
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
export function yaml(value: string): string {
  return JSON.stringify(value);
}

/** 記事ファイルの中身を組み立てる。**投稿・編集の両方がここを通る。** */
export function buildPostFile(fields: Partial<PostFields>, content: string): string {
  const frontMatter =
    `---\n` +
    `title: ${yaml((fields.title ?? "").trim())}\n` +
    `excerpt: ${yaml((fields.excerpt ?? "").trim())}\n` +
    `date: ${yaml(fields.date ?? "")}\n` +
    `category: ${yaml(fields.category ?? DEFAULT_CATEGORY)}\n` +
    `categoryBg: ${yaml(fields.categoryBg ?? DEFAULT_CATEGORY_BG)}\n` +
    `accent: ${yaml(fields.accent ?? DEFAULT_ACCENT)}\n` +
    `---\n\n`;

  return frontMatter + content.trim() + "\n";
}

export type ReadResult =
  | { ok: true; post: RepoPost }
  | { ok: false; status: number; error: string };

/**
 * GitHub 上の記事ファイルを読む。
 *
 * ⚠ **ビルド時のファイル（`content/blog/`）ではなく GitHub を読む。**
 * Vercel に配られているファイルはビルドした瞬間のもので、投稿直後の約2分間は古い。
 * その古い本文を編集画面に出すと、**保存した瞬間に直前の投稿が巻き戻る。**
 */
export async function readPostFromRepo(slug: string): Promise<ReadResult> {
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, status: 400, error: "slugの形式が正しくありません" };
  }
  const { base, branch } = repoInfo();
  const res = await ghFetch(`${base}/contents/${postPath(slug)}?ref=${branch}`);

  if (res.status === 404) {
    return { ok: false, status: 404, error: "この記事は見つかりませんでした" };
  }
  if (!res.ok) {
    return { ok: false, status: 502, error: "GitHubから記事を取得できませんでした" };
  }

  const json = (await res.json()) as { content?: string; encoding?: string; sha?: string };
  if (json.encoding !== "base64" || typeof json.content !== "string" || !json.sha) {
    return { ok: false, status: 502, error: "記事ファイルを読み取れませんでした" };
  }

  const raw = Buffer.from(json.content, "base64").toString("utf-8");
  const { data, content } = matter(raw);

  return {
    ok: true,
    post: {
      slug,
      title: String(data.title ?? ""),
      excerpt: String(data.excerpt ?? ""),
      date: toDateString(data.date),
      category: String(data.category ?? DEFAULT_CATEGORY),
      categoryBg: String(data.categoryBg ?? DEFAULT_CATEGORY_BG),
      accent: String(data.accent ?? DEFAULT_ACCENT),
      content: content.trim(),
      sha: json.sha,
    },
  };
}

/** 記事ファイルを書き換える（1コミット）。`sha` は読んだときの blob SHA。 */
export async function writePostToRepo(
  slug: string,
  fileBody: string,
  sha: string,
  message: string
) {
  const { base, branch } = repoInfo();
  return ghFetch(`${base}/contents/${postPath(slug)}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(fileBody).toString("base64"),
      sha,
      branch,
    }),
  });
}

/** 記事ファイルを消す（1コミット）。`sha` は読んだときの blob SHA。 */
export async function deletePostFromRepo(slug: string, sha: string, message: string) {
  const { base, branch } = repoInfo();
  return ghFetch(`${base}/contents/${postPath(slug)}`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch }),
  });
}
