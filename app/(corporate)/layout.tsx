import type { Metadata } from "next";
import "../globals.css";
// 相対パス（../）を使用して、appの外側のcomponentsフォルダを指定します
import Header from "../components/Header"; 
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "AmNiss&Co.Japan | 富山の物流・総合リユースグループ",
  description: "富山県を拠点に、単身引越し、不用品回収・買取、DXソリューションをワンストップで提供。",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        {/* すべてのページで共通のヘッダー */}
        <Header /> 
        
        {/* 各ページの内容：tailwindcssの警告に従い grow を使用 */}
        <main className="grow">
          {children}
        </main>
        
        {/* すべてのページで共通のフッター */}
        <Footer /> 
      </body>
    </html>
  );
}