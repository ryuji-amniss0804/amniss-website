import React from "react";
import Link from "next/link";

export const metadata = {
  title: "ゲーミングPC受注販売・IT/DXソリューション | AmNiss & Co. Japan",
  description: "富山の中小企業向けDX・業務自動化（PythonによるExcel効率化）、Webアプリ・HP制作から、オーダーメイドゲーミングPC製造まで、元リユース事業主の技術力でスマートに解決します。",
};

export default function PcSalesPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16 md:pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ページヘッダー */}
        <div className="text-center mb-16">
          <span className="text-emerald-600 text-sm font-black tracking-widest uppercase block mb-2">
            IT & DX SOLUTION
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            PC販売 ＆ IT・DXソリューション
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-bold mt-2">
            泥臭い手作業を、プログラムとシステムで一変させる。現場主義のデジタル変革。
          </p>
          <div className="w-12 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* ─── 特徴：現場主義のIT×物流の強み ─── */}
        <section className="bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-xl mb-12">
          <div className="max-w-3xl">
            <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full inline-block mb-4">
              現場密着型のデジタル化
            </span>
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
              「教科書通りのDX」はいらない。<br />
              明日からの業務がリアルに軽くなる仕組みを。
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
              高額なシステムを導入したのに現場が使いこなせない……そんな悲劇を私たちは無くします。私自身、自ら物流・EC物販事業を回す中で、「どうすれば毎日のルーティンを自動化し、ミスを減らせるか」をプログラムを駆使して徹底的に実践してきました。Excelのコピペ作業をPythonで1秒で終わらせる自動化から、集客に直結するHP・Webアプリ制作まで、現場の痛みがわかるパートナーとして、等身大かつ最高効率の解決策をご提案します。
            </p>
          </div>
        </section>

        {/* ─── サービスメニュー（3列構成へ拡張） ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80 mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block" />
            提供ソリューション
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-medium">
            
            {/* ⭐️ 1. 【新設】業務自動化・DXコンサル */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-3 block">🐍</span>
                <h3 className="font-black text-slate-900 text-base mb-2 border-b border-slate-200 pb-2">
                  業務効率化・Python自動化
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  毎日・毎週発生する「決まりきった事務作業」をプログラムで自動化。人間の手作業による打ち間違いや時間の浪費をゼロにします。
                </p>
              </div>
              <ul className="space-y-1 text-emerald-600 font-bold text-xs pt-2 border-t border-slate-100/60">
                <li>• Excel・CSVデータの自動統合・集計</li>
                <li>• ネット上の情報収集（スクレイピング）</li>
                <li>• 請求書自動生成・メール自動送信</li>
              </ul>
            </div>

            {/* ⭐️ 2. 【新設】HP・Webアプリ制作 */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-3 block">🌐</span>
                <h3 className="font-black text-slate-900 text-base mb-2 border-b border-slate-200 pb-2">
                  HP制作 ＆ Webアプリ開発
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  名刺代わりのホームページ制作から、店舗や業務で実際にガシガシ使える独自のオーダーメイドWebシステム・アプリまで柔軟に開発します。
                </p>
              </div>
              <ul className="space-y-1 text-emerald-600 font-bold text-xs pt-2 border-t border-slate-100/60">
                <li>• 高速でスマホ対応の集客型HP・LP</li>
                <li>• 社内や店舗向けの簡易管理システム</li>
                <li>• 顧客管理・予約連携アプリの構築</li>
              </ul>
            </div>

            {/* 3. ゲーミング・カスタムPC受注販売 */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-3 block">🖥️</span>
                <h3 className="font-black text-slate-900 text-base mb-2 border-b border-slate-200 pb-2">
                  カスタムPC受注製造・販売
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  「このゲームを快適に動かしたい」「動画編集やAIタスクを爆速にしたい」など、目的に合わせてパーツ単位で最適化した1台を組み上げます。
                </p>
              </div>
              <ul className="space-y-1 text-emerald-600 font-bold text-xs pt-2 border-t border-slate-100/60">
                <li>• 予算と性能を両立したパーツ選定</li>
                <li>• 24時間の徹底した連続負荷・動作テスト</li>
                <li>• 初期設定・最新OSアップデート済納品</li>
              </ul>
            </div>

            {/* 4. 暮らしのITサポート（下部にワイド配置） */}
            <div className="md:col-span-3 border border-slate-100 bg-emerald-50/30 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📶</span>
                  <h3 className="font-black text-slate-900 text-base">IT・インフラサポート</h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  PCのアップグレード（SSD換装による爆速化）や、トラブル対応、オフィス・新居での快適なネットワーク（メッシュWi-Fi等）環境構築もお任せください。
                </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 md:border-l md:border-slate-200 md:pl-6">
                <div>・パソコン初期設定・データ移行</div>
                <div>・本格内部クリーニング・グリス塗り直し</div>
                <div>・SSD換装による古いPCの超高速化</div>
                <div>・宅内・店舗Wi-Fi環境の電波改善</div>
                <div className="text-emerald-600 col-span-2">★ 電源が入らない端末からの「思い出のデータ救出」も対応！</div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── 相談・開発の流れ ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80 mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block" />
            ご相談から導入までの流れ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center text-sm font-bold">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">1</div>
              <div className="text-slate-900">現状のヒアリング</div>
              <p className="text-xs text-slate-500 font-medium">「このExcel作業が面倒」「こんなサイトを作りたい」など、普段の困りごとや理想をそのままお聞かせください。</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">2</div>
              <div className="text-slate-900">スマートな解決策提案</div>
              <p className="text-xs text-slate-500 font-medium">過剰で高額なシステムではなく、最小コストで最大の費用対効果を生む設計・構成案を提示します。</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">3</div>
              <div className="text-slate-900">開発・丁寧なビルド</div>
              <p className="text-xs text-slate-500 font-medium">プログラムの組み立てやWeb制作、自作PCのビルドを、検証を重ねながら迅速に進めます。</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">4</div>
              <div className="text-slate-900">導入・安心運用サポート</div>
              <p className="text-xs text-slate-500 font-medium">実際の設置や操作方法のレクチャー、納品後の調整まで、同じ富山のパートナーとして伴走します！</p>
            </div>
          </div>
        </section>

        {/* IT/DX事業 CTAエリア（統一デザイン・メール見積もり対応） */}
<div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 text-center text-slate-900 space-y-6">
  <h3 className="text-xl md:text-3xl font-black text-slate-900">
    パソコン、業務の自動化、Webサイトのお悩みはありませんか？
  </h3>
  <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl mx-auto">
    「こんな些細な自動化でも頼めるのかな？」「予算内でホームページを作りたい」など、どんなことでも大歓迎です。同じ目線でお手伝いいたします。
  </p>
  
  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
    {/* 指定されたメール見積もりリンクを立体ボタン化 */}
    <Link 
      href="/#contact" 
      className="inline-block bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 tracking-wider text-center"
    >
      ✉️ メール見積もり
    </Link>
    
    {/* LINEボタン：他のCTAとデザインを統一 */}
    <a 
      href="https://line.me/R/ti/p/@022lhymn" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="inline-block bg-[#06C755] border-2 border-[#05b34c] text-white hover:bg-[#05b34c] px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(4,136,58,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 tracking-wider text-center"
    >
      💬 LINEでIT・DXの相談をする
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