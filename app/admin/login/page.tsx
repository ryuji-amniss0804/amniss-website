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
    <div className="ad-login">
      <div className="ad-login-in">

        <div className="ad-login-h">
          <span className="ad-brand">
            <i>A</i>
            <b>AmNiss Admin</b>
          </span>
          <p>ブログ管理システム</p>
        </div>

        <div className="ad-login-c">
          <h1>管理者ログイン</h1>

          {error && <p className="ad-err box">{error}</p>}

          <form onSubmit={handleSubmit} className="ad-f">
            <div>
              <label className="ad-lb" htmlFor="l-id">管理者ID</label>
              <input
                id="l-id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                autoComplete="username"
                placeholder="admin ID"
              />
            </div>

            <div>
              <label className="ad-lb" htmlFor="l-pw">パスワード</label>
              <input
                id="l-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <div className="ad-send">
              <button type="submit" disabled={loading} className="btn btn-fill">
                {loading ? "ログイン中..." : "ログイン"}
              </button>
            </div>
          </form>
        </div>

        <p className="ad-login-n">このページは管理者専用です</p>
      </div>
    </div>
  );
}
