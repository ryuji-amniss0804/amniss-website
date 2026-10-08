import type { Metadata } from "next";
import PriceHero from "../_components/PriceHero";
import Simulator from "./Simulator";

/**
 * お見積りシミュレーター。
 *
 * 【92_price_pages】トップ（90・91）と同じトーンに作り直した。
 * 見た目・文言の正は参考モック（top_mock_20261008/Simulator.dc.html）。
 * 料金は lib/pricing.ts が唯一の出どころで、/moving の表と同じものを見ている。
 *
 * 計算そのものはページ内で完結させる。フォームへ移るのは、
 * **結果が出たあとに、その条件と金額を持っていくときだけ**（24_form §2）。
 * 「この内容で見積りフォームへ」で sessionStorage に置き、/contact が読む。
 * 途中で /contact へ逃がすリンクは置かないこと。
 */

export const metadata: Metadata = {
  title: "引越し料金シミュレーター｜富山の見積りをその場で計算 ｜ re'vive 富山",
  description:
    "運ぶ物を選ぶだけで、軽バンに積めるかどうかと概算金額が出ます。出動料・荷物の量・距離・日程の内訳もそのまま表示します。富山県全域。",
  alternates: { canonical: "/simulator" },
  openGraph: {
    title: "引越し料金シミュレーター｜富山の見積りをその場で計算 ｜ re'vive 富山",
    description:
      "運ぶ物を選ぶだけで、軽バンに積めるかどうかと概算金額が出ます。出動料・荷物の量・距離・日程の内訳もそのまま表示します。富山県全域。",
    url: "https://revive-toyama.jp/simulator",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

export default function SimulatorPage() {
  return (
    <div className="tp pp">
      {/* ヒーロー。紺の地。写真もボタンも置かない。すぐ下が入力なので、間に何も挟まない */}
      <PriceHero
        small
        kicker="お見積りシミュレーター"
        title={["運ぶ物を選ぶだけで、", "金額が出ます。"]}
        lead={["ここで出た金額が、当日のお支払いです。作業のあとに増えることはありません。"]}
      />

      <div className="tw">
        <Simulator />
      </div>
    </div>
  );
}
