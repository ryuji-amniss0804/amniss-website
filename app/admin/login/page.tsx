"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      if (res.ok) {
        router.push("/admin/posts/new");
      } else {
        const data = await res.json();
        setError(data.error ?? "ログインに失敗しました");
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* ロゴ */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">AmNiss Admin</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">ブログ管理システム</p>
        </div>

        {/* ログインカード */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
          <h1 className="text-lg font-black text-slate-900 mb-6 tracking-tight">
            管理者ログイン
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                管理者ID
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                autoComplete="username"
                placeholder="admin ID"
                className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs font-medium mt-6">
          このページは管理者専用です
        </p>
      </div>
    </div>
  );
}
