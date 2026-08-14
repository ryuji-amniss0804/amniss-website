"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <button type="button" onClick={handleLogout} className="ad-hd-b">
      ログアウト
    </button>
  );
}
