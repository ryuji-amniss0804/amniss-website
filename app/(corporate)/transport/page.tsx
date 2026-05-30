import React from "react";
import Link from "next/link";

export const metadata = {
  title: "単身引越し・緊急配送（A.P.C LOGISTICS） | AmNiss & Co. Japan",
  description: "富山発着の単身引越し、格安運送、緊急のスポット配送ならA.P.C LOGISTICSにお任せください。軽貨物の機動力を活かし、どこよりも安くスマートにお運びします。",
};

export default function TransportPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16 md:pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ページヘッダー */}
        <div className="text-center mb-16">
          <span className="text-emerald-600 text-sm font-black tracking-widest uppercase block mb-2">
            REUSE & LOGISTICS SERVICE
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            単身引越し・緊急運送事業
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-bold mt-2">
            【A.P.C LOGISTICS】軽貨物の機動力を活かしたスマートな物流ソリューション
          </p>
          <div className="w-12 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* ─── 特徴・強み ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80 mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block" />
            A.P.C LOGISTICS が選ばれる理由
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <span className="text-2xl mb-2 block">🎒</span>
              <h3 className="font-black text-slate-900 mb-2">単身・一人暮らしに最適化</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                大きな引越しトラックを頼むほどではない、一人暮らしや単身赴任、学生さんの引越しに特化。無駄なコストを徹底的にカットした格安プランをご提案します。
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <span className="text-2xl mb-2 block">⚡</span>
              <h3 className="font-black text-slate-900 mb-2">24時間いつでも緊急配送</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                「今すぐ届けたい荷物がある」「急な配送トラブルで代車が必要」など、深夜・早朝を問わず富山県内から全国へスポット配送・チャーター便を走らせます。
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <span className="text-2xl mb-2 block">🤝</span>
              <h3 className="font-black text-slate-900 mb-2">不用品買取との神相殺</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                引越し作業と同時に、不要になった家電やパソコン、ゲームなどをその場で出張査定・買取可能。買取金額を引越し費用から直接引くため、限界突破の安さを実現します。
              </p>
            </div>
          </div>
        </section>

        {/* ─── 料金表 ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80 mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block" />
            料金目安（プラン一覧）
          </h2>
          <p className="text-xs text-slate-400 font-bold mb-6">
            ※料金は移動距離、お荷物の量、作業環境（エレベーターの有無など）によって変動します。詳しくはお気軽に見積もりをご依頼ください。
          </p>

          <div className="border-t border-slate-200 divide-y divide-slate-100 text-sm md:text-base">
            
            {/* プラン1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 py-6 gap-2 md:gap-4">
              <div className="font-black text-slate-900 md:col-span-1">
                <span className="block text-xs text-emerald-600 font-bold">富山市内・近郊</span>
                ミニミニ引越しプラン
              </div>
              <div className="md:col-span-3 space-y-2">
                <div className="text-xl font-black text-slate-900">
                  <span className="text-xs font-bold text-slate-400">目安：</span>11,000円〜 <span className="text-xs text-slate-400 font-normal">（税込）</span>
                </div>
                <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed">
                  ダンボール数箱と衣装ケース、小型家電程度など、「自家用車には載らないけれど、業者を頼むほどでもない」という超ミニマルな引越しに最適です。
                </p>
              </div>
            </div>

            {/* プラン2 */}
            <div className="grid grid-cols-1 md:grid-cols-4 py-6 gap-2 md:gap-4">
              <div className="font-black text-slate-900 md:col-span-1">
                <span className="block text-xs text-emerald-600 font-bold">一番人気</span>
                軽バン単身引越しパック
              </div>
              <div className="md:col-span-3 space-y-2">
                <div className="text-xl font-black text-slate-900">
                  <span className="text-xs font-bold text-slate-400">目安：</span>16,500円〜 <span className="text-xs text-slate-400 font-normal">（税込）</span>
                </div>
                <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed">
                  一人暮らしの標準的な家具・家電（冷蔵庫、洗濯機、電子レンジ、テレビ、布団、ダンボール10箱程度）をしっかり積載。積載効率を極限まで高めたプロの技で運びます。
                </p>
              </div>
            </div>

            {/* プラン3 */}
            <div className="grid grid-cols-1 md:grid-cols-4 py-6 gap-2 md:gap-4">
              <div className="font-black text-slate-900 md:col-span-1">
                <span className="block text-xs text-emerald-600 font-bold">緊急・長距離</span>
                スポットチャーター便
              </div>
              <div className="md:col-span-3 space-y-2">
                <div className="text-xl font-black text-slate-900">
                  <span className="text-xs font-bold text-slate-400">料金：</span>要お見積もり <span className="text-xs text-slate-400 font-normal">（距離制運賃）</span>
                </div>
                <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed">
                  富山県内から県外（北陸エリア、関東、関西、中京圏など）への長距離運送、または法人様の緊急配送に対応。混載便ではない「貸切直行便」のため、最速かつ破損リスクゼロで届けます。
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ─── ご利用の流れ ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80 mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block" />
            引越し・運送の流れ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center text-sm font-bold">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">1</div>
              <div className="text-slate-900">お見積もり依頼</div>
              <p className="text-xs text-slate-500 font-medium">LINEまたはメールから、お荷物の量と移動先をお知らせください。</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">2</div>
              <div className="text-slate-900">料金・プランのご提示</div>
              <p className="text-xs text-slate-500 font-medium">即座に明確なコミコミ料金を提示します。不用品買取の相談もここで可能！</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">3</div>
              <div className="text-slate-900">荷造り・当日作業</div>
              <p className="text-xs text-slate-500 font-medium">ご予約日時に軽バンで伺い、迅速かつ丁寧に養生・搬出・積込みを行います。</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">4</div>
              <div className="text-slate-900">搬入・新居での確認</div>
              <p className="text-xs text-slate-500 font-medium">新居への搬入後、配置を確認して完了。ご希望ならWi-FiやPC設定もその場で行います！</p>
            </div>
          </div>
        </section>

        {/* CTAエリア */}
<div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 text-center text-slate-900 space-y-6">
  <h3 className="text-xl md:text-3xl font-black text-slate-900">
    富山発着の単身引越し、まずはお気軽に見積もり相談！
  </h3>
  <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl mx-auto">
    他社で「3万円〜」と言われた荷物でも、不用品買取やスマートな積載により大幅に安く抑えられる可能性があります。LINEならお荷物の写真を送るだけで爆速査定できます。
  </p>
  
  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
    {/* お見積もりボタン：影付き立体デザインに統一 */}
    <a 
      href="/moving" 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-block bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 tracking-wider text-center"
    >
      🚚 お見積もり・相談はこちら
    </a>
    
    {/* LINEボタン：こちらも影付きスタイルで統一してさらに押しやすく */}
    <a 
      href="https://line.me/R/ti/p/@022lhymn" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="inline-block bg-[#06C755] border-2 border-[#05b34c] text-white hover:bg-[#05b34c] px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(4,136,58,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 tracking-wider text-center"
    >
      💬 LINEで簡単見積もり
    </a>
  </div>
</div>

        {/* リンク */}
        <div className="text-center mt-12">
          <Link href="/" className="text-sm font-black text-slate-500 hover:text-emerald-600 transition-colors">
            ➔ トップページへ戻る
          </Link>
        </div>

      </div>
    </div>
  );
}