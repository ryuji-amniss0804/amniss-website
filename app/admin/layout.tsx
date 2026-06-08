import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "AmNiss Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
