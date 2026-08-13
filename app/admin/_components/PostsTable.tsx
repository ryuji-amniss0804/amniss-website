"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/posts-meta";
import DeployNotice from "./DeployNotice";
import { useHydrated } from "./useHydrated";

/**
 * 記事一覧の表と、削除の確認。【55／段階4】
 *
 * ⚠ **`alert` / `confirm` などブラウザのダイアログは1つも使わない。**（47の指示）
 * 「削除」を押すと、**その行だけが確認の行に変わる。**
 *
 * ⚠ **「削除する」は、slug を打ち込んで一致するまで押せない。**
 * 打つのが面倒なのは、そのままにしてある。**削除は取り返しがつかないので、
 * 面倒であることが守りになっている。**押し間違いでは通らない。
 *
 * ⚠ **確認の行にはタイトルだけでなく URL も出す。**
 * `20260813-gwu2` のような slug は、タイトルだけでは取り違える。
 *
 * ⚠ **消したあとに「2分ほどかかります」を必ず出す。**
 * 出さないと「消えていない」と思って、もう一度押すことになる。
 */

const SITE_URL = "https://amniss-japan.jp";

type RowState =
  | { kind: "idle" }
  | { kind: "confirming"; typed: string; busy: boolean; error: string }
  | { kind: "deleted" };

export default function PostsTable({ posts }: { posts: BlogPostMeta[] }) {
  /** JS が追いつくまで「削除」を押せないようにする（A-4 の対策） */
  const ready = useHydrated();
  const [rows, setRows] = useState<Record<string, RowState>>({});

  const stateOf = (slug: string): RowState => rows[slug] ?? { kind: "idle" };
  const setRow = (slug: string, state: RowState) =>
    setRows((prev) => ({ ...prev, [slug]: state }));

  const handleDelete = async (post: BlogPostMeta, typed: string) => {
    setRow(post.slug, { kind: "confirming", typed, busy: true, error: "" });
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(post.slug)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        // ⚠ 画面の作りだけを守りにしない。APIも同じ slug が入っていないと動かない
        body: JSON.stringify({ confirmSlug: post.slug }),
      });
      const data = await res.json().catch(() => ({}));

      // 「既に消えている」は失敗として出さない。押した人から見れば、結果は同じ
      if (res.ok || data.alreadyDeleted) {
        setRow(post.slug, { kind: "deleted" });
        return;
      }
      setRow(post.slug, {
        kind: "confirming",
        typed,
        busy: false,
        error: data.error ?? "削除に失敗しました",
      });
    } catch {
      setRow(post.slug, {
        kind: "confirming",
        typed,
        busy: false,
        error: "通信エラーが発生しました",
      });
    }
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="py-16 text-center text-slate-400 font-medium text-sm">
          まだ記事がありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        {/* ⚠ 360px で列を潰さないために、狭い画面では「カテゴリ」「種別」を畳む。
            畳まないと、47 の案C と同じで**1文字ずつ縦に折れて読めなくなる**（実測済み）。
            横スクロールにしなかったのは、**確認の行まで横に流れて
            「削除する」ボタンが画面の外へ出てしまう**ため。

            ⚠ `table-fixed` は使わないこと。**確認の行（`colSpan={5}`）が出た瞬間に
            列幅の配分が変わり、タイトル列が 143px → 48px に潰れる**（360px で実測）。
            幅の指定は下の `w-*` を「目安」として渡すだけにして、配分はブラウザに任せる。 */}
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="w-21 sm:w-28 text-left px-3 sm:px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">日付</th>
            <th className="hidden md:table-cell md:w-52 text-left px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">カテゴリ</th>
            <th className="text-left px-3 sm:px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">タイトル</th>
            <th className="hidden lg:table-cell lg:w-32 text-left px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">種別</th>
            <th className="w-24 sm:w-40 text-right px-3 sm:px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, i) => {
            const state = stateOf(post.slug);
            const zebra = i % 2 === 0 ? "" : "bg-slate-50/30";

            if (state.kind === "deleted") {
              return (
                <tr key={post.slug} className="border-b border-slate-100 last:border-0">
                  <td colSpan={5} className="px-3 sm:px-5 py-4">
                    <DeployNotice>
                      「{post.title}」を削除しました。
                      <strong className="font-black">画面から消えるまで2分ほどかかります。</strong>
                    </DeployNotice>
                  </td>
                </tr>
              );
            }

            if (state.kind === "confirming") {
              const matches = state.typed === post.slug;
              return (
                <tr key={post.slug} className="border-b border-red-200 last:border-0 bg-red-50/50">
                  <td colSpan={5} className="px-3 sm:px-5 py-5">
                    <div className="max-w-2xl space-y-2">
                      <p className="text-sm font-black text-red-800 leading-relaxed">
                        ⚠ 「{post.title}」を削除します。
                      </p>
                      {/* ⚠ タイトルだけでは取り違えるので、URL も必ず出す */}
                      <p className="text-xs text-red-700 font-medium leading-relaxed break-all">
                        公開中のページ{" "}
                        <code className="font-mono font-bold bg-white border border-red-200 rounded px-1.5 py-0.5">
                          {SITE_URL}/blog/{post.slug}
                        </code>{" "}
                        が見られなくなります。
                      </p>
                      <p className="text-xs font-black text-red-800">取り消せません。</p>

                      <div className="pt-2">
                        <label
                          htmlFor={`confirm-${post.slug}`}
                          className="block text-[11px] font-black text-slate-600 mb-1.5"
                        >
                          確認のため、下の slug をそのまま入力してください：{" "}
                          <code className="font-mono bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-900">
                            {post.slug}
                          </code>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                          <input
                            id={`confirm-${post.slug}`}
                            type="text"
                            value={state.typed}
                            onChange={(e) =>
                              setRow(post.slug, {
                                kind: "confirming",
                                typed: e.target.value,
                                busy: false,
                                error: "",
                              })
                            }
                            disabled={state.busy}
                            autoComplete="off"
                            placeholder="slug を入力"
                            className="w-full sm:w-64 bg-white border border-slate-300 px-3 py-2 rounded-lg text-xs text-slate-900 font-mono font-bold focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleDelete(post, state.typed)}
                              disabled={!matches || state.busy}
                              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-black text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {state.busy ? "削除中..." : "削除する"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setRow(post.slug, { kind: "idle" })}
                              disabled={state.busy}
                              className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-4 py-2 rounded-lg font-black text-xs transition-all"
                            >
                              やめる
                            </button>
                          </div>
                        </div>
                        {!matches && (
                          <p className="text-[11px] text-slate-500 font-medium mt-1.5">
                            slug が一致するまで「削除する」は押せません。
                          </p>
                        )}
                      </div>

                      {state.error && (
                        <p className="text-xs font-black text-red-700 bg-white border border-red-200 rounded-lg px-3 py-2">
                          {state.error}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={post.slug}
                className={`border-b border-slate-100 last:border-0 ${zebra} hover:bg-emerald-50/30 transition-colors`}
              >
                <td className="px-3 sm:px-5 py-4 text-slate-500 font-bold text-xs whitespace-nowrap align-top">
                  {post.date}
                </td>
                <td className="hidden md:table-cell px-5 py-4 align-top">
                  <span className={`${post.accent} text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap`}>
                    {post.category}
                  </span>
                </td>
                <td className="px-3 sm:px-5 py-4 font-bold text-slate-900 text-xs align-top">
                  <span className="line-clamp-2">{post.title}</span>
                  {/* 狭い画面ではカテゴリ列を畳むので、ここに小さく出す */}
                  <span
                    className={`${post.accent} md:hidden inline-block mt-1.5 text-[10px] font-black px-2 py-0.5 rounded-full`}
                  >
                    {post.category}
                  </span>
                </td>
                <td className="hidden lg:table-cell px-5 py-4 align-top">
                  {post.isStaticPage ? (
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">静的ページ</span>
                  ) : (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">マークダウン</span>
                  )}
                </td>
                <td className="px-3 sm:px-5 py-4 align-top">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 justify-end">
                    {post.isStaticPage ? (
                      /* 手書きの静的ページには `.md` が無いので、編集も削除もできない */
                      <span className="text-[10px] font-bold text-slate-300">編集不可</span>
                    ) : (
                      <>
                        <Link
                          href={`/admin/posts/${post.slug}/edit`}
                          className="text-[11px] font-black text-emerald-700 hover:text-emerald-500 transition-colors"
                        >
                          編集
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setRow(post.slug, {
                              kind: "confirming",
                              typed: "",
                              busy: false,
                              error: "",
                            })
                          }
                          disabled={!ready}
                          className="text-[11px] font-black text-red-600 hover:text-red-500 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed"
                        >
                          削除
                        </button>
                      </>
                    )}
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-black text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      表示 →
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
