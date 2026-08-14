"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown";
import AdminNav from "./AdminNav";
import DeployNotice from "./DeployNotice";
import { useHydrated } from "./useHydrated";

/**
 * 新規投稿と編集で共通のフォーム。【55／段階4】
 *
 * 以前は `app/admin/posts/new/page.tsx` に全部入っていた。編集画面を別に書くと
 * **A-4（JSが追いつく前に打ち込んだ内容が消える）の対策が片方にしか入らない。**
 * 対策も、プレビューの描き方も、ヒント文も、**1か所にしかない形にしてある。**
 *
 * 2つのモードの違いは3つだけ。
 * - `new`：日付と slug をブラウザ側で決める／POST /api/admin/posts
 * - `edit`：日付と slug は読み込んだ値／**slug は変えられない**／PUT /api/admin/posts/[slug]
 * - 成功画面の文言
 *
 * 【63／段階5】見た目を Tailwind から `.rv` のトークン（admin.css）へ移した。
 * **`site.css` の読み込みは `app/admin/layout.tsx` に移した。**
 * 以前はこのファイルが読んでいたが、管理画面ぜんぶが `.rv` に乗ったので要らない。
 */

export const CATEGORY_OPTIONS = [
  {
    label: "引越し豆知識",
    category: "引越し豆知識",
    categoryBg: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    label: "ガジェット・引越しノウハウ",
    category: "ガジェット・引越しノウハウ",
    categoryBg: "bg-blue-50 text-blue-700 border-blue-200/50",
    accent: "bg-violet-50 text-violet-600",
  },
  {
    label: "不用品の買取・お片付け",
    category: "不用品の買取・お片付け",
    categoryBg: "bg-amber-50 text-amber-800 border-amber-200/50",
    accent: "bg-amber-50 text-amber-700",
  },
  {
    label: "IT・DX・PC",
    category: "IT・DX・PC",
    categoryBg: "bg-indigo-50 text-indigo-700 border-indigo-200/50",
    accent: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "お知らせ",
    category: "お知らせ",
    categoryBg: "bg-teal-50 text-teal-700 border-teal-200/50",
    accent: "bg-teal-50 text-teal-700",
  },
];

/**
 * 日本時間（Asia/Tokyo）の「今日」を `YYYY-MM-DD` で返す。
 *
 * ⚠ **`toISOString()` を使わないこと。**あれは UTC なので日本より9時間前を返す。
 * 朝9時より前に投稿すると日付が前日になり、slug の頭（`YYYYMMDD`）まで1日ずれていた。
 * 見る人に見えるところなので、タイムゾーンを明示して組み立てる。
 *
 * **この関数はブラウザでしか呼ばない。**ビルド時に呼ぶと、その日の日付が
 * HTML に焼き付いてしまう（下の `getBoot` のコメントを参照）。
 */
function todayJST() {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function generateSlug(dateVal: string) {
  const d = dateVal.replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${d}-${suffix}`;
}

/** `<input type="date">` の `YYYY-MM-DD` → フロントマターの `YYYY.MM.DD` */
function dateToMeta(dateInput: string) {
  return dateInput.replace(/-/g, ".");
}

/** フロントマターの `YYYY.MM.DD` → `<input type="date">` の `YYYY-MM-DD` */
function metaToDate(metaDate: string) {
  return metaDate.replace(/\./g, "-");
}

/* ────────────────────────────────────────────────────────────────────────
   A-4 の対策は2段構え。仕掛け本体と経緯は `useHydrated.ts` にまとめてある。

   1. 日付と slug を **ブラウザ側でだけ**決める（下の `getBoot`）。
      以前は `useState(() => generateSlug(todayStr()))` と書いていたため、
      `Math.random()` と `new Date()` が **ビルド時に1回・ブラウザで1回、合計2回**走り、
      違う値になっていた。タイトルや本文は空になるので気づけるが、
      **slug だけはそれらしい値が入り直すので気づけない。**
   2. それでも打ち込めてしまう隙をなくすため、**動き出すまで入力欄を `disabled`**（`useHydrated`）

   ⚠ **編集でも 2 は要る。**編集は初期値をサーバーから受け取るので 1 の問題は起きないが、
   **ハイドレートの瞬間に「受け取った初期値」で上書きされる**ため、
   打ち込んだ内容が消えるのは同じ。だからこのファイルを新規・編集の両方で使っている。
   ──────────────────────────────────────────────────────────────────────── */

/**
 * 日付と slug は「ブラウザで1回だけ」決めて、以後は同じ値を返す。
 *
 * `useSyncExternalStore` の getSnapshot は**毎回同じものを返さないと
 * 描画が止まらなくなる**ので、`Math.random()` の結果はここでキャッシュする。
 */
let boot: { date: string; slug: string } | null = null;
function getBoot() {
  if (!boot) {
    const today = todayJST();
    boot = { date: today, slug: generateSlug(today) };
  }
  return boot;
}

type Status = "idle" | "loading" | "success" | "error";

export type PostFormInitial = {
  slug: string;
  title: string;
  excerpt: string;
  /** フロントマターの形（`YYYY.MM.DD`） */
  date: string;
  category: string;
  content: string;
  /** 読み込んだ時点の blob SHA。保存時にそのまま送り返す */
  sha: string;
};

type Props =
  | { mode: "new"; initial?: undefined }
  | { mode: "edit"; initial: PostFormInitial };

export default function PostForm(props: Props) {
  const isEdit = props.mode === "edit";
  const initial = props.initial;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [categoryIdx, setCategoryIdx] = useState(() => {
    if (!initial) return 0;
    const i = CATEGORY_OPTIONS.findIndex((o) => o.category === initial.category);
    return i >= 0 ? i : 0;
  });
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  /* **本番の記事ページとまったく同じ関数**（`lib/markdown.ts`）。
     以前は `marked`（`gfm: true, breaks: true`）で、本番の `remark` と
     6例中5例で出力が違っていた（47_admin §1-2）。 */
  const preview = renderMarkdown(content);
  const [showPreview, setShowPreview] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [savedSlug, setSavedSlug] = useState("");
  const [gitCommitted, setGitCommitted] = useState(false);

  /** JS が追いついて、入力を受け付けられる状態になったか（A-4 の対策） */
  const ready = useHydrated();

  /* 日付と slug は「初期値」と「人が直した値」の2段。
     新規は人が触るまで null で、そのあいだは getBoot()（ブラウザ側で決まる）を映す。
     編集は初期値がサーバーから来ているので、そのまま出せる。 */
  const [dateEdited, setDateEdited] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState<string | null>(null);
  const date = isEdit
    ? dateEdited ?? metaToDate(initial!.date)
    : dateEdited ?? (ready ? getBoot().date : "");
  // ⚠ 編集では slug を動かさない。変えると記事のURLが変わり、公開中のリンクが切れる。
  const slug = isEdit ? initial!.slug : slugEdited ?? (ready ? getBoot().slug : "");

  // slug を自動生成（新規のみ）
  const autoGenerateSlug = useCallback(() => {
    setSlugEdited(generateSlug(date));
  }, [date]);

  const cat = CATEGORY_OPTIONS[categoryIdx];

  /** 本文が空のままでは保存させない。空を通すと記事が白紙になる（守ってほしいこと 4） */
  const contentEmpty = content.trim() === "";
  const canSubmit = ready && status !== "loading" && !contentEmpty && title.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contentEmpty) {
      setErrorMsg("本文が空です。空のままでは保存できません");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(
        isEdit ? `/api/admin/posts/${encodeURIComponent(slug)}` : "/api/admin/posts",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug,
            category: cat.category,
            categoryBg: cat.categoryBg,
            accent: cat.accent,
            excerpt,
            content,
            date: dateToMeta(date),
            ...(isEdit ? { sha: initial!.sha } : {}),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSavedSlug(data.slug ?? slug);
        setGitCommitted(data.gitCommitted ?? false);
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? (isEdit ? "保存に失敗しました" : "投稿に失敗しました"));
        setStatus("error");
      }
    } catch {
      setErrorMsg("通信エラーが発生しました");
      setStatus("error");
    }
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    // 続けて投稿するときは、日付を引き直して slug も採り直す
    const today = todayJST();
    setDateEdited(today);
    setSlugEdited(generateSlug(today));
    setCategoryIdx(0);
    setStatus("idle");
    setErrorMsg("");
    setSavedSlug("");
  };

  return (
    <>
      <AdminNav
        current={isEdit ? "list" : "new"}
        right={
          status === "success" ? undefined : (
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="ad-hd-b ad-pv-t-b"
            >
              {showPreview ? "プレビューを隠す" : "プレビューを表示"}
            </button>
          )
        }
      />

      {/* 成功画面 */}
      {status === "success" && (
        <main className="ad-w ad-res">
          <div className="ad-res-in">
            <h2 className="ad-res-t">{isEdit ? "記事を保存しました" : "記事を投稿しました"}</h2>
            <p className="ad-res-s">
              <code>/blog/{savedSlug}</code>{" "}
              {isEdit ? "を書き換えました" : "として公開されました"}
            </p>

            {/* ⚠ ここを消さないこと。出さないと「効いていない」と思ってもう一度押される */}
            <DeployNotice>
              {isEdit ? "保存しました。" : "投稿しました。"}
              <strong>
                {isEdit ? "画面に反映されるまで2分ほどかかります。" : "画面に出るまで2分ほどかかります。"}
              </strong>
            </DeployNotice>

            {gitCommitted ? (
              <p className="ad-res-g">Git にコミットしました</p>
            ) : (
              <p className="ad-res-g ng">
                Git へのコミットができていません。手でコミットしてください
              </p>
            )}

            <div className="ad-res-acts">
              <a
                href={`/blog/${savedSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-fill"
              >
                記事を確認する
              </a>
              {isEdit ? (
                <Link href="/admin/posts" className="btn">
                  記事一覧へ戻る
                </Link>
              ) : (
                <button type="button" onClick={resetForm} className="btn">
                  続けて投稿する
                </button>
              )}
            </div>
          </div>
        </main>
      )}

      {/* 投稿・編集フォーム */}
      {status !== "success" && (
        <main className="ad-w-wide ad-main">
          <div className="ad-head">
            <div>
              <h1 className="ad-h1">{isEdit ? "記事を編集" : "新規記事を作成"}</h1>
              {/* JS が追いつくまでは、入力欄を触れないようにしてある（下の disabled={!ready}）。
                  触れてしまうと、ハイドレートの瞬間に打った内容が消える。47_admin で再現済み。
                  **知らせる場所を増やさず、この1行を差し替えている。**帯を出し入れすると、
                  入力できるようになった瞬間に下が全部ずれて、押す場所が動いてしまうため。 */}
              <p className={ready ? "ad-sub" : "ad-sub wait"}>
                {ready
                  ? isEdit
                    ? "内容を直して「保存する」を押すと、記事ファイルが書き換わります。"
                    : "必須項目を入力して「投稿する」を押すと、自動的にファイルが生成されます。"
                  : "読み込み中です。入力できるようになるまで、少しだけお待ちください。"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={showPreview ? "ad-cols" : "ad-cols one"}>

              {/* ─── フォーム列 ─── */}
              <div className="ad-f">

                {/* タイトル */}
                <div className="ad-panel ad-panel-p">
                  <label className="ad-lb" htmlFor="f-title">
                    タイトル <em>必須</em>
                  </label>
                  <input
                    id="f-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={!ready}
                    placeholder="記事のタイトルを入力してください"
                  />
                </div>

                {/* カテゴリ・日付・slug */}
                <div className="ad-panel ad-panel-p ad-row">

                  <div>
                    <label className="ad-lb" htmlFor="f-cat">
                      カテゴリ <em>必須</em>
                    </label>
                    <select
                      id="f-cat"
                      value={categoryIdx}
                      onChange={(e) => setCategoryIdx(Number(e.target.value))}
                      disabled={!ready}
                    >
                      {CATEGORY_OPTIONS.map((opt, i) => (
                        <option key={opt.category} value={i}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="ad-lb" htmlFor="f-date">
                      日付 <em>必須</em>
                    </label>
                    <input
                      id="f-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDateEdited(e.target.value)}
                      required
                      disabled={!ready}
                    />
                  </div>

                  <div className="wide">
                    {isEdit ? (
                      /* ⚠ 編集では slug を変えられない。入力欄ごと出さず、値だけを見せる。
                         **「なぜ変えられないか」を必ず1行出すこと。**
                         「変更できません」だけだと、何度も試すことになる。
                         入力欄が無いので、見出しも `<label>` ではなく `<p>` で出す。 */
                      <>
                        <p className="ad-lb">Slug</p>
                        <p className="ad-fix">{slug}</p>
                        <p className="ad-hint">URL: /blog/{slug}</p>
                        <p className="ad-hint warn">
                          slug は変更できません。変えると記事のURLが変わり、
                          <strong>検索結果や、すでに送ったリンクから開けなくなります。</strong>
                          別のURLにしたいときは、新しく投稿してから、この記事を削除してください。
                        </p>
                      </>
                    ) : (
                      <>
                        <label className="ad-lb" htmlFor="f-slug">
                          Slug <em>必須</em>
                        </label>
                        <div className="ad-slug">
                          <input
                            id="f-slug"
                            type="text"
                            className="mono"
                            value={slug}
                            onChange={(e) => setSlugEdited(e.target.value.toLowerCase())}
                            required
                            disabled={!ready}
                            pattern="[a-z0-9]+(-[a-z0-9]+)*"
                            placeholder="my-article-slug"
                          />
                          <button
                            type="button"
                            onClick={autoGenerateSlug}
                            disabled={!ready}
                            title="slug を採り直す"
                          >
                            採り直す
                          </button>
                        </div>
                        <p className="ad-hint">URL: /blog/{slug || "..."}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* 概要 */}
                <div className="ad-panel ad-panel-p">
                  <label className="ad-lb" htmlFor="f-excerpt">
                    概要（excerpt） <em>必須</em>
                  </label>
                  <textarea
                    id="f-excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                    disabled={!ready}
                    placeholder="一覧・トップページのカードに表示される要約文（100〜200字程度）"
                    rows={3}
                  />
                </div>

                {/* 本文 */}
                <div className="ad-panel ad-panel-p">
                  <label className="ad-lb" htmlFor="f-body">
                    本文（Markdown） <em>必須</em>
                  </label>
                  <textarea
                    id="f-body"
                    className="mono body"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    disabled={!ready}
                    placeholder={`## はじめに\n\nここに本文を書きます。**太字**、*斜体*、リスト、見出しなど、Markdown記法が使えます。\n\n## セクション2\n\n- 箇条書き1\n- 箇条書き2\n\n> 引用ブロックも使えます。`}
                  />

                  {/* ⚠ 本文が空のときは、押す前に理由を出す。空で保存すると記事が白紙になる */}
                  {ready && contentEmpty && (
                    <p className="ad-err">本文が空です。空のままでは保存できません。</p>
                  )}

                  {/* 【A-3】ヒント文。**実態に合わせてある。**
                      右のプレビューは本番と同じ remark で描いているので、
                      **ここに「使えない」と書いたものは、プレビューでもそのまま出ません。**
                      使えないものを増やしたくなったら `remark-gfm` を入れる話になるが、
                      **CSS（`.rv .post` に表の指定は無い）とセットでないと入れないこと**（50で決定）。 */}
                  <p className="ad-hint">
                    Markdown記法が使えます：## 見出し、**太字**、*斜体*、- リスト、&gt; 引用、`コード`
                  </p>
                  <p className="ad-hint">
                    段落を分けるときは<strong>空行を1つ</strong>入れてください。Enter 1回では改行されません。
                    表・取り消し線・チェックリスト・URLの自動リンクは使えません。
                  </p>
                  <p className="ad-hint warn">
                    太字を閉じる <code>**</code> の直前に「。」を置かないでください。
                    ✕ <code>**お答えします。**買取を</code> → ○ <code>**お答えします**。買取を</code>
                  </p>
                </div>

                {status === "error" && <p className="ad-err box">{errorMsg}</p>}

                <div className="ad-send">
                  <button type="submit" disabled={!canSubmit} className="btn btn-fill">
                    {status === "loading"
                      ? isEdit
                        ? "保存中..."
                        : "投稿中..."
                      : isEdit
                        ? "保存する"
                        : "投稿する"}
                  </button>

                  {isEdit && (
                    <Link href="/admin/posts" className="ad-back">
                      保存せずに一覧へ戻る
                    </Link>
                  )}
                </div>
              </div>

              {/* ─── プレビュー列 ─── */}
              {showPreview && (
                <div className="ad-pv-col">
                  <div className="ad-panel">
                    <p className="ad-pv-h">PREVIEW — /blog/{slug || "..."}</p>

                    <div className="ad-pv-b">
                      {(title || excerpt) && (
                        <div className="ad-pv-m">
                          <span className="ad-tag">{cat.category}</span>
                          {title && <h1 className="ad-pv-t">{title}</h1>}
                          {excerpt && <p className="ad-pv-x">{excerpt}</p>}
                        </div>
                      )}

                      {/* マークダウン本文プレビュー。
                          **クラスは本番の記事ページ（`app/(site)/blog/[slug]/page.tsx:93`）と同じ
                          `.rv` ＋ `.post`。**
                          `pv` は、<body> でないこの枠にも本文の土台（フォント・色・行間）を
                          当てるための目印（`site.css` の `body.rv, .rv.pv`）。
                          ⚠ **`.rv` は <body> にも付いているが、ここでも残すこと。**
                          `.rv.pv` の側が本文の font-size / line-height を持っているため。 */}
                      {preview ? (
                        <div className="rv pv">
                          <div className="post" dangerouslySetInnerHTML={{ __html: preview }} />
                        </div>
                      ) : (
                        <p className="ad-pv-e">本文を入力するとプレビューが表示されます</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </main>
      )}
    </>
  );
}
