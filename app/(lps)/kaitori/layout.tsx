import type { Metadata } from "next";
import "../../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "富山の出張買取なら re'vive | ジャンク品・壊れていてもOK",
  description:
    "富山県全域対応の出張買取。カメラ・PC・家電・ジャンク品を出張査定。eBay4年の海外販路で他店断り品も高額査定。査定・出張費0円。古物商許可 富山県公安委員会 第501310007877号。",
  openGraph: {
    title: "富山の出張買取なら re'vive",
    description: "ジャンク・壊れていてもOK。海外販路で価値を引き出します。富山県全域対応。",
    url: "https://revive-lp-eight.vercel.app/kaitori",
    type: "website",
  },
};

export default function KaitoriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
