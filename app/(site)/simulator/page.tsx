import type { Metadata } from "next";
import Hero from "../_components/Hero";
import Split from "../_components/Split";
import Simulator from "./Simulator";

/**
 * お見積りシミュレーター。
 *
 * 中身は D:\re'vive_toyama_marketing\price_simulator.html の移植（Simulator.tsx）。
 * 料金は lib/pricing.ts が唯一の出どころで、/moving の表と同じものを見ている。
 *
 * **このページにフォームへのリンクを置かないこと。**入力はページ内で完結させる。
 * 送信は「この内容をコピー」＋ LINE ＋ 電話の3つだけ。
 */

export const metadata: Metadata = {
  title: "引越し料金シミュレーター｜富山の単身引越し ｜ re'vive 富山",
  description:
    "運ぶ物を選ぶだけで、軽バンに積めるかどうかと概算金額が出ます。出動料・荷物の量・距離・日程の内訳もそのまま表示します。富山県全域。",
  alternates: { canonical: "/simulator" },
  openGraph: {
    title: "引越し料金シミュレーター｜富山の単身引越し ｜ re'vive 富山",
    description:
      "運ぶ物を選ぶだけで、軽バンに積めるかどうかと概算金額が出ます。出動料・荷物の量・距離・日程の内訳もそのまま表示します。富山県全域。",
    url: "https://amniss-japan.jp/simulator",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

export default function SimulatorPage() {
  return (
    <>
      {/* 見出し・リードは price_simulator.html のヘッダーそのまま。
          写真もボタンも置かない。すぐ下が入力なので、間に何も挟まないほうがいい */}
      <Hero
        size="md"
        kicker="お 見 積 り シ ミ ュ レ ー タ ー"
        title="運ぶ物を選ぶだけで、その場で金額が出ます。"
        lead="お電話も入力フォームも要りません。当社は料金の計算式を全部公開しているので、ご依頼の前にご自身で確認できます。ここで出た金額が、当日お支払いいただく金額です。作業後に増えることはありません。軽バン1台に積み切れない量になった場合も、その場でお伝えします。"
      />

      <Split kicker="お 見 積 り" title="運ぶ物を選んでください" first>
        <Simulator />
      </Split>
    </>
  );
}
