"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown";
import LogoutButton from "./LogoutButton";
import DeployNotice from "./DeployNotice";
import { useHydrated } from "./useHydrated";
/* 記事本文のCSS。**プレビュー枠を本番と同じ `.rv .post` で描くために読む。**
   site.css は全体が `.rv` 配下にスコープしてあるので（先頭のコメント参照）、
   `.rv` を付けたプレビュー枠の中にしか当たらない。管理画面の Tailwind とは衝突しない。 */
import "../../(site)/site.css";

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
    <div className="min-h-screen bg-slate-50">

      {/* 管理ナビゲーション */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-350 mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2 mr-4 shrink-0">
            <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">A</span>
            </div>
            <span className="text-white font-black text-sm tracking-tight">AmNiss Admin</span>
          </div>
          <Link
            href="/admin/posts"
            className={
              isEdit
                ? "text-white text-xs font-black border-b-2 border-emerald-500 pb-0.5"
                : "text-slate-400 hover:text-white text-xs font-black transition-colors"
            }
          >
            記事一覧
          </Link>
          <Link
            href="/admin/posts/new"
            className={
              isEdit
                ? "text-slate-400 hover:text-white text-xs font-black transition-colors"
                : "text-white text-xs font-black border-b-2 border-emerald-500 pb-0.5"
            }
          >
            新規投稿
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="text-slate-400 hover:text-white text-xs font-bold transition-colors hidden sm:block"
            >
              {showPreview ? "▸ プレビューを隠す" : "▸ プレビューを表示"}
            </button>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* 成功画面 */}
      {status === "success" && (
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10">
            <div className="text-5xl mb-5">{isEdit ? "✅" : "🎉"}</div>
            <h2 className="text-xl font-black text-slate-900 mb-3">
              {isEdit ? "記事を保存しました！" : "記事を投稿しました！"}
            </h2>
            <p className="text-sm text-slate-500 font-medium mb-5">
              <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">/blog/{savedSlug}</code>{" "}
              {isEdit ? "を書き換えました" : "として公開されました"}
            </p>

            {/* ⚠ ここを消さないこと。出さないと「効いていない」と思ってもう一度押される */}
            <DeployNotice>
              {isEdit ? "保存しました。" : "投稿しました。"}
              <strong className="font-black">
                {isEdit ? "画面に反映されるまで2分ほどかかります。" : "画面に出るまで2分ほどかかります。"}
              </strong>
            </DeployNotice>

            {gitCommitted ? (
              <p className="text-xs text-emerald-600 font-bold mt-3">✅ Git コミット済み</p>
            ) : (
              <p className="text-xs text-amber-600 font-bold mt-3">⚠️ Git コミット未実施（手動でコミットしてください）</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
              <a
                href={`/blog/${savedSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-sm transition-all"
              >
                記事を確認する →
              </a>
              {isEdit ? (
                <Link
                  href="/admin/posts"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-black text-sm transition-all"
                >
                  記事一覧へ戻る
                </Link>
              ) : (
                <button
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-black text-sm transition-all"
                >
                  続けて投稿する
                </button>
              )}
            </div>
          </div>
        </main>
      )}

      {/* 投稿・編集フォーム */}
      {status !== "success" && (
        <main className="max-w-350 mx-auto px-4 sm:px-6 py-6">

          <div className="mb-6">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {isEdit ? "📝 記事を編集" : "✏️ 新規記事を作成"}
            </h1>
            {/* JS が追いつくまでは、入力欄を触れないようにしてある（下の disabled={!ready}）。
                触れてしまうと、ハイドレートの瞬間に打った内容が消える。47_admin で再現済み。
                **知らせる場所を増やさず、この1行を差し替えている。**帯を出し入れすると、
                入力できるようになった瞬間に下が全部ずれて、押す場所が動いてしまうため。 */}
            <p
              className={`text-xs font-medium mt-1 ${
                ready ? "text-slate-500" : "text-amber-600"
              }`}
            >
              {ready
                ? isEdit
                  ? "内容を直して「保存する」を押すと、記事ファイルが書き換わります。"
                  : "必須項目を入力して「投稿する」を押すと、自動的にファイルが生成されます。"
                : "読み込み中です。入力できるようになるまで、少しだけお待ちください。"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-2xl"}`}>

              {/* ─── フォーム列 ─── */}
              <div className="space-y-4">

                {/* タイトル */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    タイトル <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={!ready}
                    placeholder="記事のタイトルを入力してください"
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>

                {/* カテゴリー・日付・スラッグ (3カラム) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* カテゴリー */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      カテゴリ <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={categoryIdx}
                      onChange={(e) => setCategoryIdx(Number(e.target.value))}
                      disabled={!ready}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    >
                      {CATEGORY_OPTIONS.map((opt, i) => (
                        <option key={opt.category} value={i}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <span className={`${cat.accent} text-[10px] font-black px-2 py-0.5 rounded-full`}>
                        {cat.category}
                      </span>
                    </div>
                  </div>

                  {/* 日付 */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      日付 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDateEdited(e.target.value)}
                      required
                      disabled={!ready}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>

                  {/* スラッグ */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      Slug {!isEdit && <span className="text-red-400">*</span>}
                    </label>

                    {isEdit ? (
                      /* ⚠ 編集では slug を変えられない。入力欄ごと出さず、値だけを見せる。
                         **「なぜ変えられないか」を必ず1行出すこと。**
                         「変更できません」だけだと、何度も試すことになる。 */
                      <>
                        <p className="w-full bg-slate-100 border border-slate-200 p-3 rounded-xl text-xs text-slate-500 font-mono font-bold break-all">
                          {slug}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">URL: /blog/{slug}</p>
                        <p className="text-[10px] text-amber-700 font-bold mt-1.5 leading-relaxed">
                          slug は変更できません。変えると記事のURLが変わり、
                          <strong className="font-black">検索結果や、すでに送ったリンクから開けなくなります。</strong>
                          別のURLにしたいときは、新しく投稿してから、この記事を削除してください。
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlugEdited(e.target.value.toLowerCase())}
                            required
                            disabled={!ready}
                            pattern="[a-z0-9]+(-[a-z0-9]+)*"
                            placeholder="my-article-slug"
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={autoGenerateSlug}
                            disabled={!ready}
                            title="自動生成"
                            className="shrink-0 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-xl text-xs font-black text-slate-500 transition-all"
                          >
                            ↻
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">URL: /blog/{slug || "..."}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* 概要 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    概要（excerpt）<span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                    disabled={!ready}
                    placeholder="一覧・トップページのカードに表示される要約文（100〜200字程度）"
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none font-medium"
                  />
                </div>

                {/* 本文 (マークダウン) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    本文（Markdown）<span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    disabled={!ready}
                    placeholder={`## はじめに\n\nここに本文を書きます。**太字**、*斜体*、リスト、見出しなど、Markdown記法が使えます。\n\n## セクション2\n\n- 箇条書き1\n- 箇条書き2\n\n> 引用ブロックも使えます。`}
                    rows={22}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all resize-y font-mono leading-relaxed"
                  />

                  {/* ⚠ 本文が空のときは、押す前に理由を出す。空で保存すると記事が白紙になる */}
                  {ready && contentEmpty && (
                    <p className="text-[11px] text-red-600 font-black mt-2">
                      本文が空です。空のままでは保存できません。
                    </p>
                  )}

                  {/* 【A-3】ヒント文。**実態に合わせてある。**
                      右のプレビューは本番と同じ remark で描いているので、
                      **ここに「使えない」と書いたものは、プレビューでもそのまま出ません。**
                      使えないものを増やしたくなったら `remark-gfm` を入れる話になるが、
                      **CSS（`.rv .post` に表の指定は無い）とセットでないと入れないこと**（50で決定）。 */}
                  <div className="mt-2 space-y-1">
                    <p className="text-[10px] text-slate-400 font-medium">
                      Markdown記法が使えます：## 見出し、**太字**、*斜体*、- リスト、&gt; 引用、`コード`
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      段落を分けるときは<strong className="text-slate-500 font-black">空行を1つ</strong>入れてください。Enter 1回では改行されません。
                      表・取り消し線・チェックリスト・URLの自動リンクは使えません。
                    </p>
                    <p className="text-[10px] text-amber-600 font-bold">
                      ⚠ 太字を閉じる <code className="font-mono">**</code> の直前に「。」を置かないでください。
                      ✕ <code className="font-mono">**お答えします。**買取を</code> → ○ <code className="font-mono">**お答えします**。買取を</code>
                    </p>
                  </div>
                </div>

                {/* エラー表示 */}
                {status === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                {/* 送信ボタン */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {status === "loading"
                    ? isEdit
                      ? "保存中..."
                      : "投稿中..."
                    : isEdit
                      ? "💾 保存する"
                      : "🚀 投稿する"}
                </button>

                {isEdit && (
                  <Link
                    href="/admin/posts"
                    className="block text-center text-xs font-black text-slate-400 hover:text-slate-600 transition-colors py-2"
                  >
                    保存せずに一覧へ戻る
                  </Link>
                )}
              </div>

              {/* ─── プレビュー列 ─── */}
              {showPreview && (
                <div className="hidden lg:block">
                  <div className="sticky top-20">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      {/* プレビューヘッダー */}
                      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="ml-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Preview — /blog/{slug || "..."}
                        </span>
                      </div>

                      <div className="p-6 max-h-[calc(100vh-140px)] overflow-y-auto">
                        {/* タイトル・メタ情報プレビュー */}
                        {(title || excerpt) && (
                          <div className="mb-6 pb-6 border-b border-slate-100">
                            {cat && (
                              <span className={`${cat.accent} text-[10px] font-black px-2.5 py-1 rounded-full inline-block mb-3`}>
                                {cat.category}
                              </span>
                            )}
                            {title && (
                              <h1 className="text-xl font-black text-slate-900 leading-tight mb-3">
                                {title}
                              </h1>
                            )}
                            {excerpt && (
                              <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-4 border-emerald-500 pl-4 py-1 bg-emerald-50/50 rounded-r-xl pr-3">
                                {excerpt}
                              </p>
                            )}
                          </div>
                        )}

                        {/* マークダウン本文プレビュー。
                            **クラスは本番の記事ページ（`app/(site)/blog/[slug]/page.tsx:93`）と同じ
                            `.rv` ＋ `.post`。**Tailwind の `prose` は使わない。
                            `.rv` を付けているのは、`site.css` が全部 `.rv` 配下にスコープされていて、
                            付けないと1行も当たらないため（本番は <body> に付いている）。
                            `pv` は、<body> でないこの枠にも本文の土台（フォント・色・行間）を
                            当てるための目印（`site.css` の `body.rv, .rv.pv`）。 */}
                        {preview ? (
                          <div className="rv pv">
                            <div
                              className="post"
                              dangerouslySetInnerHTML={{ __html: preview }}
                            />
                          </div>
                        ) : (
                          <p className="text-slate-300 text-sm font-medium text-center py-10">
                            本文を入力するとプレビューが表示されます
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </main>
      )}
    </div>
  );
}
