"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { marked } from "marked";
import LogoutButton from "../../_components/LogoutButton";

marked.use({ gfm: true, breaks: true });

const CATEGORY_OPTIONS = [
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
    label: "不用品回収・お片付け",
    category: "不用品回収・お片付け",
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

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function generateSlug(dateVal: string) {
  const d = dateVal.replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${d}-${suffix}`;
}

function dateToMeta(dateInput: string) {
  return dateInput.replace(/-/g, ".");
}

type Status = "idle" | "loading" | "success" | "error";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [date, setDate] = useState(todayStr());
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [createdSlug, setCreatedSlug] = useState("");
  const [gitCommitted, setGitCommitted] = useState(false);

  // マークダウンプレビューを更新
  useEffect(() => {
    const html = marked.parse(content) as string;
    setPreview(html);
  }, [content]);

  // slug を自動生成
  const autoGenerateSlug = useCallback(() => {
    setSlug(generateSlug(date));
  }, [date]);

  // 初期 slug 生成
  useEffect(() => {
    if (!slug) autoGenerateSlug();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cat = CATEGORY_OPTIONS[categoryIdx];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
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
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCreatedSlug(data.slug);
        setGitCommitted(data.gitCommitted ?? false);
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "投稿に失敗しました");
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
    setDate(todayStr());
    setSlug(generateSlug(todayStr()));
    setCategoryIdx(0);
    setStatus("idle");
    setErrorMsg("");
    setCreatedSlug("");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* 管理ナビゲーション */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2 mr-4 shrink-0">
            <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">A</span>
            </div>
            <span className="text-white font-black text-sm tracking-tight">AmNiss Admin</span>
          </div>
          <Link href="/admin/posts" className="text-slate-400 hover:text-white text-xs font-black transition-colors">
            記事一覧
          </Link>
          <Link href="/admin/posts/new" className="text-white text-xs font-black border-b-2 border-emerald-500 pb-0.5">
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
            <div className="text-5xl mb-5">🎉</div>
            <h2 className="text-xl font-black text-slate-900 mb-3">記事を投稿しました！</h2>
            <p className="text-sm text-slate-500 font-medium mb-1">
              <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">/blog/{createdSlug}</code> として公開されました
            </p>
            {gitCommitted ? (
              <p className="text-xs text-emerald-600 font-bold mt-2">✅ Git コミット済み</p>
            ) : (
              <p className="text-xs text-amber-600 font-bold mt-2">⚠️ Git コミット未実施（手動でコミットしてください）</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
              <a
                href={`/blog/${createdSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-sm transition-all"
              >
                記事を確認する →
              </a>
              <button
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-black text-sm transition-all"
              >
                続けて投稿する
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 投稿フォーム */}
      {status !== "success" && (
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">

          <div className="mb-6">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">✏️ 新規記事を作成</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              必須項目を入力して「投稿する」を押すと、自動的にファイルが生成されます。
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
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>

                  {/* スラッグ */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      Slug <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase())}
                        required
                        pattern="[a-z0-9]+(-[a-z0-9]+)*"
                        placeholder="my-article-slug"
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={autoGenerateSlug}
                        title="自動生成"
                        className="shrink-0 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-xl text-xs font-black text-slate-500 transition-all"
                      >
                        ↻
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">URL: /blog/{slug || "..."}</p>
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
                    placeholder={`## はじめに\n\nここに本文を書きます。**太字**、*斜体*、リスト、見出しなど、Markdown記法が使えます。\n\n## セクション2\n\n- 箇条書き1\n- 箇条書き2\n\n> 引用ブロックも使えます。`}
                    rows={22}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all resize-y font-mono leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    Markdown記法が使えます：## 見出し、**太字**、*斜体*、- リスト、&gt; 引用、`コード`
                  </p>
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
                  disabled={status === "loading"}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {status === "loading" ? "投稿中..." : "🚀 投稿する"}
                </button>
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

                        {/* マークダウン本文プレビュー */}
                        {preview ? (
                          <div
                            className={[
                              "prose prose-slate max-w-none text-sm",
                              "prose-headings:font-black prose-headings:tracking-tight",
                              "prose-a:text-emerald-600 prose-a:font-bold prose-a:no-underline",
                              "prose-strong:font-black prose-strong:text-slate-900",
                              "prose-blockquote:border-emerald-500",
                              "prose-code:before:content-none prose-code:after:content-none",
                              "prose-code:bg-slate-100 prose-code:text-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal",
                            ].join(" ")}
                            dangerouslySetInnerHTML={{ __html: preview }}
                          />
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
