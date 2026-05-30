import React from "react";
import Link from "next/link";

export const metadata = {
  title: "不用品回収・出張買取（re'vive） | AmNiss & Co. Japan",
  description: "富山県内全域対応の出張買取・不用品回収ならre'vive（リバイブ）にお任せください。パソコン、家電、ゲーミングPC、カメラなどを適正査定。引越し費用との相殺でさらにお得に！",
};

export default function ShuchoKaitoriPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16 md:pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ページヘッダー */}
        <div className="text-center mb-16">
          <span className="text-emerald-600 text-sm font-black tracking-widest uppercase block mb-2">
            REUSE & LOGISTICS SERVICE
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            不用品回収・出張買取事業
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-bold mt-2">
            【re&apos;vive】独自の販路で価値を再発見するスマートなリユースソリューション
          </p>
          <div className="w-12 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* ─── 強み：引越し×買取の相殺システム ─── */}
        <section className="bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-xl mb-12">
          <div className="max-w-3xl">
            <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full inline-block mb-4">
              AmNiss最大の強み
            </span>
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
              「処分費用を払う」から「その場で現金化」へ。<br />
              引越し費用とまとめて相殺できるスマートシステム
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
              一般的な引越しや不用品回収では、使わなくなった家具や家電を捨てるために「処分費用」を支払わなければなりません。私たちは、回収と同時に独自の国内外のルートを活用してその場で出張査定を実施。買取金額をそのまま引越し費用や作業料金から差し引く（相殺する）ため、驚きの低価格、場合によっては「実質0円以下」での新生活スタートも可能になります。
            </p>
          </div>
        </section>

        {/* ─── 買取対象品目（LP参考の3列グリッド） ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80 mb-12">
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block" />
              幅広い買取品目
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1">「これ売れる？」迷ったらまずはご相談ください</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-medium">
            
            {/* 1. パソコン・周辺機器 */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-3">💻</div>
                <h3 className="font-black text-slate-900 text-base mb-2 border-b border-slate-200 pb-2">
                  パソコン・周辺機器
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  デスクトップ、ノートPCはもちろん、パーツ単位や周辺機器まで。データの消去もお任せください。
                </p>
              </div>
              <ul className="space-y-1 text-slate-800 font-black text-xs pt-2 border-t border-slate-100">
                <li>✓ ゲーミングPC・自作PC</li>
                <li>✓ モニター・キーボード</li>
                <li className="text-emerald-600">★ 壊れたパーツ・基板もOK</li>
              </ul>
            </div>

            {/* 2. カメラ・撮影機材 */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-3">📸</div>
                <h3 className="font-black text-slate-900 text-base mb-2 border-b border-slate-200 pb-2">
                  カメラ・撮影機材
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  一眼レフからレトロなフィルムカメラまで。撮影ボックスを用いた高クオリティなEC販路があるからこそ高価買取が可能です。
                </p>
              </div>
              <ul className="space-y-1 text-slate-800 font-black text-xs pt-2 border-t border-slate-100">
                <li>✓ デジタル一眼・レンズ</li>
                <li>✓ フィルムカメラ・二眼レフ</li>
                <li className="text-emerald-600">★ レンズのカビ・動作不良OK</li>
              </ul>
            </div>

            {/* 3. ゲーム・ホビー */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-3">🎮</div>
                <h3 className="font-black text-slate-900 text-base mb-2 border-b border-slate-200 pb-2">
                  ゲーム・ホビー
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  最新機種から、押し入れに眠っていたレトロゲームまで。付属品がなくても大歓迎です。
                </p>
              </div>
              <ul className="space-y-1 text-slate-800 font-black text-xs pt-2 border-t border-slate-100">
                <li>✓ PS5・Switch・レトロ機</li>
                <li>✓ ソフト・周辺機器</li>
                <li className="text-emerald-600">★ 起動しないジャンク品もOK</li>
              </ul>
            </div>

            {/* 4. 小型家電・生活用品（下部にドカンと横長配置） */}
            <div className="md:col-span-3 border border-slate-100 bg-slate-50/50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔌</span>
                  <h3 className="font-black text-slate-900 text-base">小型家電・生活用品</h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  「これは無理かな？」と思うようなガジェットや楽器、調理家電までまとめて査定いたします！
                </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 md:border-l md:border-slate-200 md:pl-6">
                <div>・スマホ・タブレット</div>
                <div>・オーディオ・スピーカー</div>
                <div>・楽器・エフェクター</div>
                <div>・電動工具・DIY用品</div>
                <div>・調理家電・掃除機</div>
                <div className="text-slate-400">…など何でもご相談ください！</div>
              </div>
            </div>

          </div>

          {/* 注意事項 */}
          <div className="mt-8 text-center border-t border-slate-100 pt-4">
            <p className="text-slate-400 font-bold text-[11px] leading-relaxed">
              ※大型家具、冷蔵庫などの大型家電、宝石、ブランド品、衣類などは対象外となります。<br className="hidden md:block" />
              判断に迷う場合は、LINEでお写真を送っていただければすぐにお答えします！
            </p>
          </div>
        </section>

        {/* ─── 修正：お困りごと解決メニュー（遺品整理をベースとして追加！） ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80 mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block" />
            その他のお困りごと解決メニュー
          </h2>
          
          {/* 💡 md:grid-cols-3 から md:grid-cols-4 に拡張して、遺品整理を並列で追加しました！ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm font-medium">
            
            {/* A. 遺品整理・生前整理（★新規ベース追加！） */}
            <div className="bg-emerald-50/30 rounded-2xl p-5 border border-emerald-100/50 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-2 block">🏠</span>
                <h4 className="font-black text-slate-900 mb-1">遺品整理・生前整理</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  ご家族の大切な遺品を丁寧に整理・仕分けいたします。価値のあるガジェットや骨董・家電はリユース査定でしっかり買取相殺するため、高額になりがちな整理費用を賢く大幅に抑えられます。
                </p>
              </div>
              <span className="text-[10px] text-emerald-600 font-black mt-2 block">※詳細はお気軽にご相談ください</span>
            </div>

            {/* B. 思い出の救出 */}
            <div className="bg-emerald-50/30 rounded-2xl p-5 border border-emerald-100/50 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-2 block">💾</span>
                <h4 className="font-black text-slate-900 mb-1">思い出の救出</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  「電源が入らない古いPCから写真や大切なデータを取り出したい」そんな切実な願いにプロとしてお応えします。
                </p>
              </div>
            </div>

            {/* C. PC・ネット設定 */}
            <div className="bg-emerald-50/30 rounded-2xl p-5 border border-emerald-100/50 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-2 block">🔧</span>
                <h4 className="font-black text-slate-900 mb-1">PC・ネット設定</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  新居での初期設定やWi-Fiネットワークの構築、プリンター接続など。家中の「ITの困った」をその場で即解決します。
                </p>
              </div>
            </div>

            {/* D. お片付け・搬出作業 */}
            <div className="bg-emerald-50/30 rounded-2xl p-5 border border-emerald-100/50 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-2 block">🧹</span>
                <h4 className="font-black text-slate-900 mb-1">お片付け・搬出作業</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  「重くて自分では動かせない」「分別方法が全くわからない」というお悩みも、物流のプロの機動力で丁寧にサポートします。
                </p>
              </div>
            </div>

          </div>
          <p className="text-center text-xs font-black text-emerald-600 mt-5">
            ※作業内容により別途お見積り。買取や引越しとセットならさらにお得に相殺可能です！
          </p>
        </section>

        {/* ─── 出張買取の流れ ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80 mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block" />
            出張買取・回収の流れ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center text-sm font-bold">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">1</div>
              <div className="text-slate-900">かんたん受付</div>
              <p className="text-xs text-slate-500 font-medium">LINEまたはメールから、売りたい物や処分したい物の内容をお知らせください。</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">2</div>
              <div className="text-slate-900">写真で事前査定</div>
              <p className="text-xs text-slate-500 font-medium">LINEで商品の写真を送っていただければ、現地に伺う前におおよその査定額をお伝え可能です。</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">3</div>
              <div className="text-slate-900">現地で本査定・作業</div>
              <p className="text-xs text-slate-500 font-medium">ご予約日時に伺い、実際の状態を確認して最終査定。承諾いただければその場で迅速に搬出します。</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base font-black">4</div>
              <div className="text-slate-900">即時清算・相殺</div>
              <p className="text-xs text-slate-500 font-medium">その場で現金でお支払い、または引越し費用から差し引く形でスマートに清算完了です！</p>
            </div>
          </div>
        </section>

        {/* 買取CTAエリア（清潔感のあるスタイルに統一） */}
<div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 text-center text-slate-900 space-y-6">
  <h3 className="text-xl md:text-3xl font-black text-slate-900">
    不用品の処分に困ったら、捨てる前にまずは出張査定！
  </h3>
  <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl mx-auto">
    重くて運べない大型家電、価値があるか分からない大量のPCパーツなど、富山県内どこでも駆けつけます。LINEなら写真をポチッと送るだけでいつでも気軽に相談できます。
  </p>
  
  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
    {/* お見積もりボタン：影付き立体デザイン */}
    <a 
      href="/kaitori" 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-block bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 tracking-wider text-center"
    >
      💰 お見積もり・相談はこちら
    </a>
    
    {/* LINEボタン：こちらも影付き立体デザインに統一 */}
    <a 
      href="https://line.me/R/ti/p/@022lhymn" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="inline-block bg-[#06C755] border-2 border-[#05b34c] text-white hover:bg-[#05b34c] px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(4,136,58,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 tracking-wider text-center"
    >
      💬 LINEで写真を送って簡単査定
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