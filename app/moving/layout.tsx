import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "富山の格安・単身引っ越しなら A.P.C LOGISTICS",
  description: "富山県発着の単身引っ越し専門。軽バン（エブリイ）プラン12,100円〜。長距離引越しも大手より圧倒的に安い！不用品丸ごと査定で引っ越し代から割引＆新居でのWi-Fi・PC初期設定も完全無料！",
  keywords: ["富山 引っ越し", "単身引っ越し 富山", "格安引越し 富山", "軽バン 引っ越し 富山", "長距離引越し 富山", "エーピーシーロジスティクス"],
  
  // 💡 ここを追加！LINEやSNSに「これが引越しページの専用プレビュー情報だよ！」と強制的に教え込みます
  openGraph: {
    title: "富山の格安・単身引っ越しなら A.P.C LOGISTICS",
    description: "富山県発着の単身引っ越し専門。軽バン（エブリイ）プラン12,100円〜。不用品丸ごと査定＆新居でのWi-Fi・PC初期設定も完全無料！",
    url: "https://revive-lp-eight.vercel.app/moving",
    type: "website",
    // 💡 もし引っ越し専用の画像（OGP画像）がすでにある場合は、ここにそのパス（例: '/moving-ogp.png' など）を指定するとその画像がLINEにドカンと出ます！
  },
};

export default function MovingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}