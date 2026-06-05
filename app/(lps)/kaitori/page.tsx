"use client";

import React, { useState } from "react";
import Image from "next/image"; // 元々あるImageのインポート

export default function Home() {
  // ─── 【ここから追記】送信状態を管理するプログラム ───
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };


  return (
    <main className="flex min-h-screen font-sans bg-white flex-col md:flex-row">
      {/* 1. レスポンシブ・サイドバー / ヘッダー */}
      {/* スマホ(デフォルト)は横長、PC(md:)で縦長サイドバーに切り替え */}
      <nav className="fixed top-0 left-0 w-full h-20 md:h-screen md:w-64 bg-white border-b md:border-r border-gray-100 flex md:flex-col justify-between items-center md:items-stretch p-4 md:p-10 z-50">
        <div className="flex md:flex-col items-center md:items-start w-full">
          {/* --- ロゴエリア --- */}
          <div className="flex flex-col">
            <div className="relative h-10 w-32 md:h-16 md:w-full">
              <Image
                src="/images/logo-horizontal.png"
                alt="re'vive logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            {/* キャッチコピーはPCのみ表示 */}
            <p className="hidden md:block text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold pl-4 mt-2">
              Reuse & Logistics
            </p>
          </div>
          
          {/* ナビゲーションメニュー */}
          <ul className="hidden md:block mt-12 space-y-7 text-sm font-semibold text-gray-500 pl-1">
            <li><a href="#problems" className="hover:text-black transition-colors">こんなお悩みありませんか？</a></li>
            <li><a href="#why" className="hover:text-black transition-colors">選ばれる3つの理由</a></li>
            <li><a href="#products" className="hover:text-black transition-colors">買取品目</a></li>
            <li><a href="#vision" className="hover:text-black transition-colors">世界へ繋ぐリユース</a></li>
            <li><a href="#profile" className="hover:text-black transition-colors">代表紹介</a></li>
            
            {/* ↓ お問い合わせメニューを追加（少しだけ文字色を強調して目立たせるのもアリです） */}
            <li>
              <a href="#contact" className="text-gray-700 hover:text-yellow-500 transition-colors flex items-center gap-1.5">
                <span>✉</span> お問い合わせ
              </a>
            </li>
          </ul>
        </div>

        {/* 右側（スマホ）/ 下部（PC）：LINEボタン */}
        <div className="flex items-center md:flex-col gap-4">
          <a 
            href="https://line.me/R/ti/p/@022lhymn" // ← ここに実際のLINE公式アカウントのURLを入れる
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#06C755] hover:bg-[#05b34c] text-white py-2 px-4 md:py-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all shadow-lg shadow-green-100 active:scale-95 whitespace-nowrap inline-block text-center"
          >
            LINE無料査定
          </a>
  
          {/* PC時のみ表示される許可証番号 */}
          <p className="hidden md:block text-[10px] text-center text-gray-400 mt-6 leading-relaxed">
            古物商許可<br />
            [富山県公安委員会<br />第501310007877号]
          </p>
        </div>
      </nav>

      {/* 2. メインコンテンツエリア */}
      {/* スマホは上に余白(mt-20)、PCは左に余白(md:ml-64) */}
      <div className="mt-20 md:mt-0 md:ml-64 w-full md:w-[calc(100%-256px)] min-h-screen flex flex-col overflow-x-hidden">
        
        {/* --- ファーストビュー（ヒーローエリア） --- */}
        <section className="relative w-full h-[85vh] md:h-screen overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <Image 
              src="/images/IMG_1438.JPG" 
              alt="富山の風景とエブリイ"
              fill
              className="object-cover scale-105"
              priority
            />
          </div>

          <div className="relative z-20 h-full flex flex-col justify-center px-5 md:px-16">
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-start gap-4 md:gap-12">
              
              {/* 左側：メインコピー */}
              <div className="text-left shrink-0 w-full md:w-auto">
                <h2 className="font-[1000] text-white leading-[1.2] tracking-tighter">
                  <span className="text-[26px] xs:text-3xl md:text-7xl block drop-shadow-lg">
                    「えっ、これも売れるの？」
                  </span>
                  <span className="text-[42px] xs:text-5xl md:text-8xl block mt-1 md:mt-4 text-yellow-400 italic drop-shadow-2xl leading-[1.1]">
                    {/* inline-block で単語の塊を守る */}
                    <span className="inline-block">押し入れの</span>
                    <span className="inline-block">ガラクタ、</span>
                    <br />
                    実はお宝かも？！
                  </span>
                </h2>
              </div>

              {/* 右側：強みバッジ（狭い画面では横に並べ、入りきらない分は自動で下へ） */}
              <div className="flex flex-row md:flex-col flex-wrap gap-2 md:gap-4 mt-2 md:mt-10">
                <div className="bg-linear-to-r from-yellow-400 to-yellow-500 px-3 py-1.5 md:px-8 md:py-4 rounded-full text-black font-[1000] text-[11px] xs:text-sm md:text-2xl shadow-lg transform md:rotate-2 whitespace-nowrap">
                  出張・査定 0円
                </div>
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 md:px-8 md:py-4 rounded-full text-white font-black text-[11px] xs:text-sm md:text-xl shadow-lg transform md:-rotate-2 whitespace-nowrap">
                  壊れていてもOK
                </div>
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 md:px-8 md:py-4 rounded-full text-white font-black text-[11px] xs:text-sm md:text-xl shadow-lg transform md:rotate-1 whitespace-nowrap">
                  即日現金対応
                </div>
              </div>
            </div>

            {/* リード文：SEでも読みやすいサイズに */}
            <div className="w-full max-w-7xl mx-auto mt-6 md:mt-10">
              <p className="text-sm xs:text-base md:text-2xl text-gray-100 font-bold leading-relaxed drop-shadow-lg max-w-3xl">
                古いカメラやPC、壊れたゲーム機まで。<br className="hidden md:block" />
                あなたが「ゴミ」だと思っているモノ、見せてください！<br />
                富山から世界へ。re&apos;viveが価値を見つけ出します。
              </p>
            </div>
          </div>
        </section>

        {/* --- お悩み（問題提起）セクション --- */}
        {/* px-6 md:px-24 でスマホ時の余白を確保 */}
        <section id="problems" className="w-full bg-gray-50 py-16 md:py-32 px-6 md:px-24 border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-left mb-12 md:mb-20 border-l-8 border-yellow-400 pl-6 md:pl-8">
              <h3 className="text-2xl md:text-5xl font-[1000] text-gray-900 tracking-tight mb-4 leading-tight">
                {/* 塊ごとに inline-block で囲み、スマホでの強制改行(<br>)は削除します */}
                <span className="inline-block">「もったいない」を、</span>
                <span className="inline-block">プロの技術で</span>
                <span className="inline-block">「価値」に変える。</span>
              </h3>
              <p className="text-lg md:text-2xl text-gray-500 font-bold">
                こんなお悩み、re&apos;viveが解決します。
              </p>
            </div>

            {/* grid-cols-1 でスマホは1列、lg:で4列に切り替え */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* カード1 */}
              <div className="flex flex-col items-center text-center bg-white p-8 md:p-10 rounded-[40px] md:rounded-[50px] border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                <span className="text-orange-500 font-black text-sm md:text-base mb-4 block whitespace-nowrap">「これ、売れるのかな…？」</span>
                <h4 className="text-xl md:text-[26px] font-[1000] text-gray-900 mb-6 md:mb-8 leading-tight">不用品・片付け</h4>
                <div className="mb-6 md:mb-8 text-5xl md:text-7xl bg-orange-50 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center rounded-full shadow-inner group-hover:scale-110 transition-transform">📦</div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed font-bold mb-8 flex-1">
                  楽器やオーディオ、小型家電まで。価値がわからない不用品もプロの目でしっかり査定します。
                </p>
                <div className="w-full pt-6 border-t border-gray-100 text-orange-600 font-black text-xs md:text-sm uppercase tracking-widest">幅広い品目に対応</div>
              </div>

              {/* カード2 */}
              <div className="flex flex-col items-center text-center bg-white p-8 md:p-10 rounded-[40px] md:rounded-[50px] border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                <span className="text-blue-600 font-black text-sm md:text-base mb-4 block whitespace-nowrap">「古くて壊れてるけど…」</span>
                <h4 className="text-xl md:text-[26px] font-[1000] text-gray-900 mb-6 md:mb-8 leading-tight">古い・壊れた品</h4>
                <div className="mb-6 md:mb-8 text-5xl md:text-7xl bg-blue-50 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center rounded-full shadow-inner group-hover:scale-110 transition-transform">🛠️</div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed font-bold mb-8 flex-1">
                  動かない精密機器や10年以上前の家電。私たちなら再利用の道を見つけ出し価値に変えられます。
                </p>
                <div className="w-full pt-6 border-t border-gray-100 text-blue-600 font-black text-xs md:text-sm uppercase tracking-widest">ジャンク品も大歓迎</div>
              </div>

              {/* カード3 */}
              <div className="flex flex-col items-center text-center bg-white p-8 md:p-10 rounded-[40px] md:rounded-[50px] border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                <span className="text-green-600 font-black text-sm md:text-base mb-4 block whitespace-nowrap">「一気に片付けたい！」</span>
                <h4 className="text-xl md:text-[26px] font-[1000] text-gray-900 mb-6 md:mb-8 leading-tight">大量・重いもの</h4>
                <div className="mb-6 md:mb-8 text-5xl md:text-7xl bg-green-50 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center rounded-full shadow-inner group-hover:scale-110 transition-transform">🚚</div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed font-bold mb-8 flex-1">
                  引っ越し前の整理や、自分では運べない大量の家電。搬出まですべてお任せ下さい。
                </p>
                <div className="w-full pt-6 border-t border-gray-100 text-green-600 font-black text-xs md:text-sm uppercase tracking-widest">まとめて一括査定</div>
              </div>

              {/* カード4 */}
              <div className="flex flex-col items-center text-center bg-white p-8 md:p-10 rounded-[40px] md:rounded-[50px] border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                <span className="text-red-600 font-black text-sm md:text-base mb-4 block whitespace-nowrap">「適当に扱われない？」</span>
                <h4 className="text-xl md:text-[26px] font-[1000] text-gray-900 mb-6 md:mb-8 leading-tight">安心の買取</h4>
                <div className="mb-6 md:mb-8 text-5xl md:text-7xl bg-red-50 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center rounded-full shadow-inner group-hover:scale-110 transition-transform">🤝</div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed font-bold mb-8 flex-1">
                  不透明な査定はいたしません。富山密着の信頼を大切に、一点一点誠実に査定いたします。
                </p>
                <div className="w-full pt-6 border-t border-gray-100 text-red-600 font-black text-xs md:text-sm uppercase tracking-widest">地域密着・誠実査定</div>
              </div>

            </div>
          </div>
        </section>

      {/* --- 選ばれる3つの理由セクション --- */}
        <section id="why" className="w-full bg-white py-20 md:py-32 px-6 md:px-24">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-left mb-16 md:mb-24 border-l-8 border-yellow-400 pl-6 md:pl-8">
              <h3 className="text-xs md:text-sm font-black text-yellow-500 uppercase tracking-[0.3em] mb-2 md:mb-4">Why Choose Us</h3>
              <div className="text-3xl md:text-5xl font-[1000] text-gray-900 tracking-tight">
                re&apos;viveが選ばれる<span className="text-yellow-500">3つの理由</span>
              </div>
            </div>

            <div className="flex flex-col gap-24 md:gap-40">
              
              {/* 理由 01：北陸・近隣5県への広域対応 */}
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20 group">
                <div className="flex-1 order-2 md:order-1">
                  <div className="text-6xl md:text-8xl font-black text-gray-100 mb-4 md:mb-6 group-hover:text-yellow-100 transition-colors duration-500 italic">01</div>
                  <h4 className="text-2xl md:text-4xl font-[1000] text-gray-900 mb-6 md:mb-8 leading-tight">
                    北陸・近隣5県を網羅！<br />
                    圧倒的なフットワークで即対応
                  </h4>
                  <p className="text-base md:text-xl text-gray-600 font-bold leading-relaxed">
                    富山県内はもちろん、石川・福井・新潟・岐阜まで。私たちは地域に根ざした迅速なフットワークを大切にしています。「遠方だから…」「量が多いから…」と諦める前にご相談ください。広域エリアをカバーする独自ルートで、あなたのお困りごとに最短距離で駆けつけます。
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="bg-gray-100 px-4 py-2 rounded-full text-xs md:text-sm font-black text-gray-700">北陸・近隣5県対応</span>
                    <span className="bg-gray-100 px-4 py-2 rounded-full text-xs md:text-sm font-black text-gray-700">最短即日お伺い</span>
                  </div>
                </div>
                <div className="w-full flex-1 order-1 md:order-2 relative aspect-video rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl border border-gray-100 bg-gray-100 group">
                  <Image 
                    src="/images/IMG_1404_001.JPG" 
                    alt="出張買取用車両 エブリイ" 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>

              {/* 理由 02：独自のグローバル販路 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-20 group">
                
                {/* 文字側：スマホでは2番目(order-2)、PCではデフォルト(md:order-none) */}
                <div className="flex-1 order-2 md:order-0">
                  <div className="text-6xl md:text-8xl font-black text-gray-100 mb-4 md:mb-6 group-hover:text-yellow-100 transition-colors duration-500 italic">02</div>
                  <h4 className="text-2xl md:text-4xl font-[1000] text-gray-900 mb-6 md:mb-8 leading-tight">
                    壊れていても価値を逃さない！<br />
                    世界中に広がる独自の販売ルート
                  </h4>
                  <p className="text-base md:text-xl text-gray-600 font-bold leading-relaxed">
                    私たちはただの不用品回収業者ではありません。カメラやPCの専門知識を持ち、国内では「価値なし」とされた故障品も、世界中のコレクターや必要としている人々へ届けます。他店で断られた品に、再び「お宝」としての光を当てます。
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="bg-gray-100 px-4 py-2 rounded-full text-xs md:text-sm font-black text-gray-700">世界市場へ再販</span>
                    <span className="bg-gray-100 px-4 py-2 rounded-full text-xs md:text-sm font-black text-gray-700">ジャンク品歓迎</span>
                  </div>
                </div>

                {/* 画像側：スマホでは1番目(order-1)、PCではデフォルト(md:order-none) */}
                <div className="w-full flex-1 order-1 md:order-0 relative aspect-video rounded-[30px] md:rounded-[50px] overflow-hidden shadow-xl border border-gray-100 bg-gray-100 group">
                  <Image 
                    src="/images/hand.png" 
                    alt="カメラの精密メンテナンス風景" 
                    fill
                    className="object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>

              {/* 理由 03：データの徹底消去 */}
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20 group">
                <div className="flex-1 order-2 md:order-1">
                  <div className="text-6xl md:text-8xl font-black text-gray-100 mb-4 md:mb-6 group-hover:text-yellow-100 transition-colors duration-500 italic">03</div>
                  <h4 className="text-2xl md:text-4xl font-[1000] text-gray-900 mb-6 md:mb-8 leading-tight">
                    「消したはず」を「絶対」に。<br />
                    データの痕跡すら残さない徹底消去
                  </h4>
                  <p className="text-base md:text-xl text-gray-600 font-bold leading-relaxed">
                    スマホやPCを手放すとき、一番の不安は情報の流出。私たちは単なる初期化ではなく、プロの技術で見えない痕跡まで完全に「上書き」し、復元不可能な状態を実現します。「自分で消すのは不安」という方こそ、安心の完全リセットをお約束します。
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="bg-gray-100 px-4 py-2 rounded-full text-xs md:text-sm font-black text-gray-700">復元不可能レベルまで消去</span>
                    <span className="bg-gray-100 px-4 py-2 rounded-full text-xs md:text-sm font-black text-gray-700">安心の対面受付</span>
                  </div>
                </div>
                <div className="w-full flex-1 order-1 md:order-2 relative aspect-video rounded-[30px] md:rounded-[50px] overflow-hidden shadow-xl border border-gray-100 bg-gray-100 group">
                  <Image 
                    src="/images/data.png" 
                    alt="データの完全消去イメージ" 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>

            </div>
          </div>
        </section>
      
      {/* --- 買取品目セクション --- */}
        <section id="products" className="w-full bg-gray-50 py-16 md:py-32 px-6 md:px-24 border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-left mb-12 md:mb-20 border-l-8 border-yellow-400 pl-6 md:pl-8">
              <h3 className="text-xs md:text-sm font-black text-yellow-500 uppercase tracking-[0.3em] mb-2 md:mb-4">Product Category</h3>
              <div className="text-3xl md:text-5xl font-[1000] text-gray-900 tracking-tight">
                幅広い<span className="text-yellow-500">買取品目</span>
              </div>
              <p className="mt-4 text-lg md:text-xl text-gray-500 font-bold">「これ売れる？」迷ったらまずはご相談ください</p>
            </div>

            {/* 買取品目グリッド：スマホ1列 / PC3列 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              
              {/* 1. パソコン（特化） */}
              <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">💻</div>
                <h4 className="text-xl md:text-2xl font-[1000] text-gray-900 mb-4">パソコン・周辺機器</h4>
                <p className="text-gray-500 text-sm font-bold leading-relaxed mb-6">デスクトップ、ノートPCはもちろん、パーツ単位や周辺機器まで。データの消去もお任せください。</p>
                <ul className="space-y-2 text-gray-800 font-black text-sm md:text-base">
                  <li className="flex items-center gap-2">✓ ゲーミングPC・自作PC</li>
                  <li className="flex items-center gap-2">✓ モニター・キーボード</li>
                  <li className="flex items-center gap-2 text-blue-600">★ 壊れたパーツ・基板もOK</li>
                </ul>
              </div>

              {/* 2. カメラ（特化） */}
              <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">📷</div>
                <h4 className="text-xl md:text-2xl font-[1000] text-gray-900 mb-4">カメラ・撮影機材</h4>
                <p className="text-gray-500 text-sm font-bold leading-relaxed mb-6">一眼レフからレトロなフィルムカメラまで。販路があるから、どんなに古くても価値を見出せます。</p>
                <ul className="space-y-2 text-gray-800 font-black text-sm md:text-base">
                  <li className="flex items-center gap-2">✓ デジタル一眼・レンズ</li>
                  <li className="flex items-center gap-2">✓ フィルムカメラ・二眼レフ</li>
                  <li className="flex items-center gap-2 text-blue-600">★ レンズのカビ・動作不良OK</li>
                </ul>
              </div>

              {/* 3. ゲーム（特化） */}
              <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">🎮</div>
                <h4 className="text-xl md:text-2xl font-[1000] text-gray-900 mb-4">ゲーム・ホビー</h4>
                <p className="text-gray-500 text-sm font-bold leading-relaxed mb-6">最新機種から、押し入れに眠っていたレトロゲームまで。付属品がなくても大歓迎です。</p>
                <ul className="space-y-2 text-gray-800 font-black text-sm md:text-base">
                  <li className="flex items-center gap-2">✓ PS5・Switch・レトロ機</li>
                  <li className="flex items-center gap-2">✓ ソフト・周辺機器</li>
                  <li className="flex items-center gap-2 text-blue-600">★ 起動しないジャンク品もOK</li>
                </ul>
              </div>

              {/* 4. 小型家電：スマホでは他と同じサイズ、PCでは横長(col-span-3) */}
              <div className="md:col-span-3 bg-white p-8 md:p-12 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl">🔌</span>
                    <h4 className="text-2xl md:text-3xl font-[1000] text-gray-900">小型家電・生活用品</h4>
                  </div>
                  <p className="text-base md:text-lg text-gray-600 font-bold leading-relaxed mb-6 md:mb-8">
                    「これは無理かな？」と思うような家電や楽器、調理家電まで。まとめて査定いたします！
                  </p>
                  <div className="inline-block bg-yellow-400 px-6 py-2 rounded-full text-xs md:text-sm font-black text-black">
                    まとめてお片付けがお得です
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 md:gap-y-4 text-base md:text-lg font-black text-gray-800 md:border-l md:border-gray-100 md:pl-10">
                  <div className="flex items-center gap-2 italic text-sm md:text-lg">・スマホ・タブレット</div>
                  <div className="flex items-center gap-2 italic text-sm md:text-lg">・オーディオ・スピーカー</div>
                  <div className="flex items-center gap-2 italic text-sm md:text-lg">・楽器・エフェクター</div>
                  <div className="flex items-center gap-2 italic text-sm md:text-lg">・電動工具・DIY用品</div>
                  <div className="flex items-center gap-2 italic text-sm md:text-lg">・調理家電・掃除機</div>
                  <div className="flex items-center gap-2 italic text-sm md:text-lg text-gray-400">…などなど何でも！</div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center px-4">
              <p className="text-gray-400 font-bold text-xs md:text-sm leading-relaxed">
                ※大型家具、冷蔵庫などの大型家電、宝石、ブランド品、衣類などは対象外となります。<br className="hidden md:block" />
                判断に迷う場合は、LINEでお写真を送っていただければすぐにお答えします！
              </p>
            </div>
          </div>
        </section>
      
        {/* --- お困りごと解決 セクション --- */}
        <section className="w-full bg-white py-16 md:py-24 px-6 md:px-24">
          <div className="max-w-6xl mx-auto">
            
            <div className="flex items-center gap-4 md:gap-6 mb-12">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h3 className="text-lg md:text-2xl font-[1000] text-gray-400 text-center">
                その他の <span className="text-blue-600">お困りごと解決メニュー</span>
              </h3>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { emoji: "💾", title: "思い出の救出", desc: "「電源が入らないPCから写真を取り出したい」そんな切実な願いにお応えします。" },
                { emoji: "🔧", title: "PC・ネット設定", desc: "初期設定やWi-Fi構築、プリンター接続など。家中の「困った」を即解決します。" },
                { emoji: "🧹", title: "お片付け・搬出", desc: "「重くて動かせない」「分別がわからない」お悩みも。物流のプロが運び出しを助けます。" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start bg-blue-50/50 p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-blue-100 group hover:bg-blue-50 transition-colors">
                  <div className="text-4xl">{item.emoji}</div>
                  <div>
                    <h4 className="text-lg md:text-xl font-black text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-xs md:text-sm text-gray-600 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-blue-600 font-black text-sm md:text-lg px-4">
                ※作業内容により別途お見積り。買取とセットならさらにお得！
              </p>
            </div>
          </div>
        </section>

      {/* --- 中押し：お問い合わせ誘導 (CTA) --- */}
        <section className="w-full bg-yellow-400 py-16 md:py-20 px-6 md:px-24">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-[1000] text-gray-900 mb-6">
              ＼ まずは査定額をチェック！ ／
            </h3>
            <p className="text-base md:text-xl font-bold text-gray-900 mb-10 leading-relaxed">
              LINEなら自動受付で24時間いつでも対応！<br className="hidden md:block" />
              写真送信後は、内容を確認しだい速やかに概算をお伝えします。
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
              {/* LINEボタン：aタグに変更 */}
              <a 
                href="https://line.me/R/ti/p/@022lhymn"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#06C755] text-white px-8 md:px-12 py-5 md:py-6 rounded-full text-xl md:text-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-4 text-center"
              >
                <span>LINEで無料査定</span>
              </a>

              {/* 電話番号ボタン：aタグに変更 ＆ telリンク反映 */}
              <a 
                href="tel:07084500897"
                className="bg-white text-gray-900 px-8 md:px-12 py-5 md:py-6 rounded-full text-xl md:text-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-4 border-2 border-gray-900 text-center"
              >
                <span>お電話はこちら</span>
              </a>
            </div>
          </div>
        </section>

        {/* --- Our Vision セクション --- */}
        <section id="vision" className="w-full bg-gray-50 pt-20 md:pt-32 px-6 md:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
              <div className="flex-1 order-2 md:order-1">
                <div className="text-left mb-8 md:mb-12 border-l-8 border-yellow-400 pl-6 md:pl-8">
                  <h3 className="text-xs md:text-sm font-black text-yellow-500 uppercase tracking-[0.3em] mb-2 md:mb-4">Our Vision</h3>
                  <div className="text-3xl md:text-5xl font-[1000] text-gray-900 tracking-tight leading-tight">
                    あなたの不用品を<br /><span className="text-yellow-500">世界の誰かの宝物へ</span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-gray-600 font-bold leading-relaxed">
                  日本で「動かない」「古い」と捨てられてしまう物も、世界にはそれを必要としている人々がいます。私たちは、お客様から集めた思い出の品々を独自のルートで世界中へ届け、次のステージへ繋いでいます。ゴミを減らし、価値を循環させる。それがre&apos;viveの使命です。
                </p>
              </div>
              
              <div className="w-full md:flex-1 order-1 md:order-2 relative aspect-square rounded-[30px] md:rounded-[50px] overflow-hidden md:rotate-3 shadow-2xl group bg-white">
                <Image 
                  src="/images/world.png" 
                  alt="世界へ繋がるリユースネットワーク" 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-yellow-400/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 代表紹介（Profile）セクション --- */}
        {/* 前のセクションから連続性を持たせるため、上部のパディングを調整(pbは32で確保) */}
        <section id="profile" className="w-full bg-gray-50 py-20 md:py-32 px-6 md:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-10 md:gap-16 items-center">
              <div className="w-full md:w-1/3 aspect-3/4 bg-gray-100 rounded-[30px] md:rounded-[40px] overflow-hidden relative shadow-inner">
                <Image
                  src="/images/face (2).jpg"
                  alt="代表：小川 竜司"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="w-full md:w-2/3 text-center md:text-left">
                <div className="mb-6 md:mb-8">
                  <h3 className="text-xs md:text-sm font-black text-yellow-500 uppercase tracking-[0.3em] mb-2">Representative</h3>
                  <div className="text-3xl md:text-4xl font-[1000] text-gray-900">
                    代表：小川 竜司 <span className="text-lg md:text-xl font-bold text-gray-400 block md:inline-block md:ml-4">Ryuji Ogawa</span>
                  </div>
                </div>
                <p className="text-base md:text-lg text-gray-600 font-bold leading-relaxed mb-8">
                  富山県を拠点に、物販と物流の二軸で活動中。「誠実な査定」と「迅速なフットワーク」を信条に、年間数百件以上の査定を行っています。
                  趣味はカメラで家族を撮ること。二人のプリンセスと最愛の妻に支えられながら、地域の皆様に愛されるサービスを目指しています。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 text-left">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Office Name</span>
                    <span className="text-lg md:text-xl font-black text-gray-800">AmNiss&Co.Japan</span>
                  </div>
                  <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                    <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Service Name</span>
                    <span className="text-lg md:text-xl font-black text-gray-800 tracking-tighter">re&apos;vive / A.P.C LOGISTICS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 最終お問い合わせフォーム --- */}
        <section id="contact" className="w-full bg-gray-900 py-20 md:py-32 px-6 md:px-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h3 className="text-yellow-400 font-black text-xl md:text-2xl mb-4 tracking-widest">CONTACT</h3>
              <div className="text-3xl md:text-5xl font-[1000] text-white">まずはお気軽にご相談を</div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:gap-12">
              {/* LINEボタン：URL反映済み */}
              <a 
                href="https://line.me/R/ti/p/@022lhymn" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#06C755] p-6 md:p-8 rounded-[30px] md:rounded-[40px] flex items-center justify-center gap-4 md:gap-6 hover:scale-[1.02] transition-transform shadow-2xl"
              >
                <span className="text-3xl md:text-5xl">💬</span>
                <div className="text-left">
                  <div className="text-white text-[10px] md:text-sm font-bold opacity-80 uppercase tracking-widest">24H LINE受付中</div>
                  <div className="text-white text-xl md:text-3xl font-[1000]">公式LINEで無料査定</div>
                </div>
              </a>

              {/* メールフォーム（その場で完了メッセージ版） */}
              <div className="bg-white/5 p-8 md:p-12 rounded-[40px] md:rounded-[50px] border border-white/10">
                <h4 className="text-white text-xl md:text-2xl font-black mb-8 flex items-center gap-4">
                  <span className="text-2xl md:text-3xl">📧</span> メールフォームで問い合わせ
                </h4>

                {/* 送信状態を管理する仕組み（State）の準備 */}
                {/* フォームが送信完了(success)なら、サンクスメッセージを表示 */}
                {formStatus === "success" ? (
                  <div className="text-center py-12 bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                    <span className="text-4xl mb-4 block">✨</span>
                    <h5 className="text-xl md:text-2xl font-black text-green-400 mb-2">送信が完了しました！</h5>
                    <p className="text-sm md:text-base text-gray-300 font-bold leading-relaxed">
                      お問い合わせありがとうございます。<br />
                      内容を確認しだい、入力いただいたメールアドレス宛にご連絡いたします。
                    </p>
                  </div>
                ) : (
                  /* 送信前、または送信中なら通常のフォームを表示 */
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <input type="hidden" name="access_key" value="5c6cab02-a690-430f-a08c-a8e48b97ad30" />
                    <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* name属性を「お名前」から「Name」に変更 */}
                      <input name="Name" required type="text" placeholder="お名前" className="bg-white/10 border border-white/20 rounded-2xl p-5 text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 transition-colors w-full" />
                      
                      {/* name属性を「返信用メールアドレス」から「Email」に変更 */}
                      <input name="Email" required type="email" placeholder="メールアドレス" className="bg-white/10 border border-white/20 rounded-2xl p-5 text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 transition-colors w-full" />
                    </div>
                    
                    {/* name属性を「ご相談内容」から「Message」に変更 */}
                    <textarea name="Message" required placeholder="ご相談内容（例：壊れたノートPCを3台見てほしい、など）" rows={4} className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"></textarea>
                    
                    <button 
                      type="submit" 
                      disabled={formStatus === "loading"}
                      className="w-full bg-yellow-400 text-gray-900 font-[1000] py-5 md:py-6 rounded-2xl text-xl md:text-2xl hover:bg-yellow-300 transition-colors shadow-xl disabled:bg-gray-600 disabled:text-gray-400"
                    >
                      {formStatus === "loading" ? "送信中..." : "メールを送信する"}
                    </button>
                    
                    {formStatus === "error" && (
                      <p className="text-red-400 font-bold text-sm text-center">送信に失敗しました。もう一度お試しいただくか、LINEよりご連絡ください。</p>
                    )}
                  </form>
                )}
              </div>
              
              {/* 電話番号エリア */}
              <div className="text-center text-white/50 font-bold">
                お急ぎの方はお電話にて：<br className="md:hidden" />
                <a 
                  href="tel:07084500897" 
                  className="text-white text-xl md:text-2xl md:ml-2 font-black inline-block mt-2 hover:text-yellow-400 transition-colors"
                >
                  070-8450-0897
                </a>
              </div>
            </div>
          </div>
        </section>

      </div> {/* ← サイドバーとメインコンテンツを分けている親要素の閉じタグ */}
    </main>
  );
}