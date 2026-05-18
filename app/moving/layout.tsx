import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "富山の格安・単身引っ越しなら A.P.C LOGISTICS",
  description: "富山県発着の単身引っ越し専門。軽バン（エブリイ）プラン12,100円〜。長距離引越しも大手より圧倒的に安い！不用品丸ごと査定で引っ越し代から割引＆新居でのWi-Fi・PC初期設定も完全無料！",
  keywords: ["富山 引っ越し", "単身引っ越し 富山", "格安引越し 富山", "軽バン 引っ越し 富山", "長距離引越し 富山", "エーピーシーロジスティクス"],
};

export default function MovingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}