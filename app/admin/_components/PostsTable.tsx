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
 *
 * 【63／段階5】見た目を Tailwind から `.rv` のトークン（admin.css）へ移した。
 * **列の畳み方と `table-layout` の扱いは、55で実測して決めたまま変えていない。**
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
      <div className="ad-panel">
        <p className="ad-empty">まだ記事がありません</p>
      </div>
    );
  }

  return (
    <div className="ad-panel">
      <table className="ad-tbl">
        {/* ⚠ 360px で列を潰さないために、狭い画面では「カテゴリ」「種別」を畳む。
            畳まないと、47 の案C と同じで**1文字ずつ縦に折れて読めなくなる**（実測済み）。
            横スクロールにしなかったのは、**確認の行まで横に流れて
            「削除する」ボタンが画面の外へ出てしまう**ため。

            ⚠ `table-layout: fixed` は使わないこと。**確認の行（`colSpan={5}`）が出た瞬間に
            列幅の配分が変わり、タイトル列が 143px → 48px に潰れる**（360px で実測）。
            幅の指定は admin.css の `width` を「目安」として渡すだけにして、
            配分はブラウザに任せる。 */}
        <thead>
          <tr>
            <th className="c-date">日付</th>
            <th className="c-cat">カテゴリ</th>
            <th className="c-ttl">タイトル</th>
            <th className="c-kind">種別</th>
            <th className="c-act">操作</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const state = stateOf(post.slug);

            if (state.kind === "deleted") {
              return (
                <tr key={post.slug}>
                  <td colSpan={5}>
                    <DeployNotice>
                      「{post.title}」を削除しました。
                      <strong>画面から消えるまで2分ほどかかります。</strong>
                    </DeployNotice>
                  </td>
                </tr>
              );
            }

            if (state.kind === "confirming") {
              const matches = state.typed === post.slug;
              return (
                <tr key={post.slug} className="ad-rm">
                  <td colSpan={5}>
                    <div className="ad-rm-in">
                      <p className="ad-rm-t">「{post.title}」を削除します。</p>
                      {/* ⚠ タイトルだけでは取り違えるので、URL も必ず出す */}
                      <p className="ad-rm-u">
                        公開中のページ{" "}
                        <code>
                          {SITE_URL}/blog/{post.slug}
                        </code>{" "}
                        が見られなくなります。
                      </p>
                      <p className="ad-rm-w">取り消せません。</p>

                      <div>
                        <label htmlFor={`confirm-${post.slug}`} className="ad-rm-l">
                          確認のため、下の slug をそのまま入力してください：{" "}
                          <code>{post.slug}</code>
                        </label>
                        <div className="ad-rm-row">
                          <input
                            id={`confirm-${post.slug}`}
                            type="text"
                            className="mono"
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
                          />
                          <div className="ad-rm-b">
                            <button
                              type="button"
                              onClick={() => handleDelete(post, state.typed)}
                              disabled={!matches || state.busy}
                              className="btn btn-s btn-rm"
                            >
                              {state.busy ? "削除中..." : "削除する"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setRow(post.slug, { kind: "idle" })}
                              disabled={state.busy}
                              className="btn btn-s"
                            >
                              やめる
                            </button>
                          </div>
                        </div>
                        {!matches && (
                          <p className="ad-rm-n">
                            slug が一致するまで「削除する」は押せません。
                          </p>
                        )}
                      </div>

                      {state.error && <p className="ad-err">{state.error}</p>}
                    </div>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={post.slug}>
                <td className="c-date">{post.date}</td>
                <td className="c-cat">
                  <span className="ad-tag">{post.category}</span>
                </td>
                <td className="c-ttl">
                  <span className="ad-ttl">{post.title}</span>
                  {/* 狭い画面ではカテゴリ列を畳むので、ここに小さく出す */}
                  <span className="ad-tag ad-tag-in">{post.category}</span>
                </td>
                <td className="c-kind">
                  <span className={post.isStaticPage ? "ad-tag q" : "ad-tag"}>
                    {post.isStaticPage ? "静的ページ" : "マークダウン"}
                  </span>
                </td>
                <td className="c-act">
                  <div className="ad-acts">
                    {post.isStaticPage ? (
                      /* 手書きの静的ページには `.md` が無いので、編集も削除もできない */
                      <span className="no">編集不可</span>
                    ) : (
                      <>
                        <Link href={`/admin/posts/${post.slug}/edit`}>編集</Link>
                        <button
                          type="button"
                          className="rm"
                          onClick={() =>
                            setRow(post.slug, {
                              kind: "confirming",
                              typed: "",
                              busy: false,
                              error: "",
                            })
                          }
                          disabled={!ready}
                        >
                          削除
                        </button>
                      </>
                    )}
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                      表示
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
