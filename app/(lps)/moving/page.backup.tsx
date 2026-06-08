"use client";

import React, { useState } from "react";
import Image from "next/image";

// 富山県内主要ルートの距離マスター
const ROUTE_DISTANCES = [
  { name: "選択してください", distance: 0 },
  { name: "富山市内 ⇔ 富山市内（10km以内）", distance: 10 },
  { name: "富山市 ⇔ 射水市（約15km）", distance: 15 },
  { name: "富山市 ⇔ 高岡市（約25km）", distance: 25 },
  { name: "富山市 ⇔ 砺波市（約35km）", distance: 35 },
  { name: "富山市 ⇔ 魚津市（約35km）", distance: 35 },
  { name: "富山市 ⇔ 氷見市（約45km）", distance: 45 },
  { name: "富山市 ⇔ 黒部市（約45km）", distance: 45 },
  { name: "【県外】富山 ⇔ 金沢（約65km）", distance: 65, isLongDist: true },
  { name: "【県外】富山 ⇔ 新潟（約160km）", distance: 160, isLongDist: true },
  { name: "【県外】富山 ⇔ 名古屋（約240km）", distance: 240, isLongDist: true },
  { name: "【県外】富山 ⇔ 東京（約370km）", distance: 370, isLongDist: true },
  { name: "その他（手動で距離を入力する）", distance: -1 },
];

export default function MovingLP() {
  // 💡 荷物量のカウント状態
  const [boxCount, setBoxCount] = useState<number>(5); // ダンボール箱数
  const [hasFridge, setHasFridge] = useState<boolean>(false); // 冷蔵庫
  const [hasWashing, setHasWashing] = useState<boolean>(false); // 洗濯機
  const [hasBed, setHasBed] = useState<boolean>(false); // ベッド・マットレス
  const [hasFuton, setHasFuton] = useState<boolean>(false); // 布団一式

  // シミュレーターのその他の状態
  const [routeIdx, setRouteIdx] = useState<number>(0); // ルート選択
  const [customDistance, setCustomDistance] = useState<number>(10); // 手動入力の距離
  const [stairs, setStairs] = useState<number>(0); // 階段オプション料金
  const [noVehicleAccess, setNoVehicleAccess] = useState<boolean>(false); // 車良進入不可
  const [addWorker, setAddWorker] = useState<boolean>(false); // 作業員追加
  const [pcSetup, setPcSetup] = useState<boolean>(false); // PC初期設定
  const [purchaseOption, setPurchaseOption] = useState<boolean>(false); // 不用品査定希望

  // 💡 予約番号システム用の状態
  const [isBooked, setIsBooked] = useState<boolean>(false); // 番号を発行したか
  const [bookingNumber, setBookingNumber] = useState<string>(""); // 発行された番号

  // 💡 最終お問い合わせメールフォームの状態管理
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // 💡 【積載量計算ロジック】荷物に応じてエブリイの許容量（MAX100）をどれくらい使うか計算
  let loadPoints = 0;
  loadPoints += boxCount * 3.5; // ダンボール1箱＝3.5pt
  if (hasFridge) loadPoints += 30; // 冷蔵庫＝30pt
  if (hasWashing) loadPoints += 25; // 洗濯機＝25pt
  if (hasBed) loadPoints += 35; // ベッド＝35pt
  if (hasFuton) loadPoints += 15; // 布団＝15pt

  // 選択ルートの情報を取得
  const selectedRoute = ROUTE_DISTANCES[routeIdx];
  const isCustomDistance = selectedRoute?.distance === -1;
  const currentDistance = isCustomDistance ? customDistance : (selectedRoute?.distance || 0);
  const isLongDistance = selectedRoute?.isLongDist || (isCustomDistance && currentDistance >= 100);

  // 料金のリアルタイム計算（軽バン一律ロジック）
  let basePrice = 0;
  let distPrice = 0;
  let realCost = 0;

  if (isLongDistance) {
    basePrice = 25000;
    if (currentDistance > 100) distPrice = (currentDistance - 100) * 165;
    realCost = (currentDistance * 2 * 15) + (currentDistance * 2 * 20); // 往復実費目安
  } else {
    basePrice = 12100;
    if (currentDistance > 10) distPrice = (currentDistance - 10) * 220;
  }

  const optionPrice = stairs + (noVehicleAccess ? 3300 : 0) + (addWorker ? 11000 : 0);
  const totalPrice = basePrice + distPrice + realCost + optionPrice;

  // 💡 ボタンを押した時に裏方APIへ非同期でシミュレーション内容を自動送信
  const handleBooking = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 予約番号（4桁のランダムな数字）を発行
    const randNum = Math.floor(1000 + Math.random() * 9000).toString();
    setBookingNumber(randNum);
    setIsBooked(true);

    try {
      // 💡 URLのドメイン部分を削って、スラッシュから始める
      await fetch("/api/send-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ...以下省略
        body: JSON.stringify({
          bookingNumber: randNum,
          totalPrice: totalPrice,
          autoPlan: "subaru", // 軽バンプラン固定
          boxCount: boxCount,
          hasFridge: hasFridge,
          hasWashing: hasWashing,
          hasBed: hasBed,
          hasFuton: hasFuton,
          selectedRoute: selectedRoute?.name,
          customDistance: isCustomDistance ? customDistance : null,
          stairs: Number(stairs),
          noVehicleAccess: noVehicleAccess,
          addWorker: addWorker,
          pcSetup: pcSetup,
          purchaseOption: purchaseOption
        }),
      });
    } catch (error) {
      console.error("見積もりメールの送信に失敗しました:", error);
    }
  };

  // メールフォーム送信ハンドラ
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased font-sans">
      {/* ─── ヘッダー ─── */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-blue-400">A.P.C LOGISTICS</span>
            <span className="text-xs text-slate-400">エー・ピー・シー ロジスティクス</span>
          </div>
          <a href="#simulator" className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-md transition-colors">
            スピード見積もり
          </a>
        </div>
      </header>

      {/* ─── ファーストビュー ─── */}
      <section className="bg-slate-900 text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-size-[16px_16px]"></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <span className="inline-block bg-blue-900/50 text-blue-400 border border-blue-700/50 text-xs sm:text-sm font-bold px-3 py-1 rounded-full mb-6 tracking-wide">
            富山県発着・軽バン単身引っ越し専門
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            富山の単身引っ越しを、<br />
            <span className="text-blue-400">どこよりも安く、スマートに。</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            軽バン（スズキ・エブリイ）に特化した圧倒的な格安プランから、県外への長距離運送まで完全対応。<br />
            あとからの不当な追加請求は一切ない【完全明朗会計】をお約束します。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {["完全明朗会計", "追加請求なし", "不用品買取で割引", "ネット初期設定￥0"].map((text, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg text-center">
                <span className="text-sm font-bold text-slate-200">✨ {text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 料金プランセクション ─── */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
            完全明朗会計の料金プラン
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            「基本運賃」＋「距離料金」＋「実費（長距離便のみ）」のクリアな軽バンプランです。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12利">
          {/* 1. 軽バン（エブリイ）プラン */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 sm:p-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">PLAN 01</span>
              <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">軽バン（エブリイ）近距離プラン</h3>
              <p className="text-sm text-slate-500 mb-6">富山県内のお引越しに！ワンルームの一人暮らし、荷物少なめの学生・単身赴任の方に最適です。</p>
              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <div className="text-xs text-slate-500">基本料金（最初の10kmまで込み）</div>
                <div className="text-2xl font-black text-slate-900 mt-1">12,100円<span className="text-sm font-normal text-slate-500">（税込）</span></div>
                <div className="text-xs text-slate-500 mt-3 border-t border-slate-200 pt-2">
                  10km以降の加算：<span className="font-bold text-slate-700">1kmにつき 220円（税込）</span>
                </div>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">富山県内コミコミ料金目安</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex justify-between border-b border-slate-100 pb-1"><span>富山市内 ⇔ 富山市内（10km内）</span><span className="font-bold text-slate-900">12,100円</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-1"><span>富山市 ⇔ 射水市（約15km）</span><span className="font-bold text-slate-900">13,200円</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-1"><span>富山市 ⇔ 高岡市（約25km）</span><span className="font-bold text-slate-900">15,400円</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-1"><span>富山市 ⇔ 砺波市・魚津市（約35km）</span><span className="font-bold text-slate-900">17,600円</span></li>
                <li className="flex justify-between pb-1"><span>富山市 ⇔ 氷見市・黒部市（約45km）</span><span className="font-bold text-slate-900">19,800円</span></li>
              </ul>
            </div>
          </div>

          {/* 2. 【県外対応】長距離引越しプラン */}
          <div className="bg-slate-950 text-white border border-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between relative p-6 sm:p-8">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl">県外対応</div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2.5 py-1 rounded">PLAN 02</span>
              <h3 className="text-xl font-bold mt-3 mb-2">軽バン長距離引越しプラン</h3>
              <p className="text-sm text-slate-400 mb-6">富山 ⇔ 県外の長距離移動専用。往復ガソリン代・高速代の実費精算で大手引越し会社より圧倒的な安さを実現！</p>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6">
                <div className="text-xs text-blue-400 font-bold">軽バン長距離運賃（片道100kmまで一律）</div>
                <div className="text-2xl font-black text-white mt-1">25,000円<span className="text-sm font-normal text-slate-400">（税込）〜</span></div>
                <div className="text-xs text-slate-400 mt-3 border-t border-slate-800 pt-2 font-medium">
                  100km以降の加算：<span className="text-slate-200 font-bold">1km毎 +165円（税込）</span><br />
                  ※別途、往復実費（ガソリン目安@15円＋軽自動車高速代）が加算されます。
                </div>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">県外コミコミ総額目安（運賃＋実費）</h4>
              <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3固定">
                <li className="flex justify-between border-b border-slate-900 pb-1"><span>富山 ⇔ 金沢（約65km）</span><span className="font-bold text-white">約31,000円</span></li>
                <li className="flex justify-between border-b border-slate-900 pb-1"><span>富山 ⇔ 新潟（約160km）</span><span className="font-bold text-white">約48,000円</span></li>
                <li className="flex justify-between border-b border-slate-900 pb-1"><span>富山 ⇔ 名古屋（約240km）</span><span className="font-bold text-white">約67,000円</span></li>
                <li className="flex justify-between pb-1"><span>富山 ⇔ 東京（約370km）</span><span className="font-bold text-white">約97,000円</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. 建物・環境オプション */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded mr-2">OPTION</span> 建物・環境オプション（階段割増など）
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>1階 ⇔ 1階（またはエレベーターあり）</span><span className="font-bold text-slate-900">＋0円</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>2階（階段のみ）</span><span className="font-bold text-blue-600">＋2,200円</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>3階（階段のみ）</span><span className="font-bold text-blue-600">＋4,400円</span></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>4階以上（階段のみ）</span><span className="font-bold text-blue-600">＋6,600円〜（要相談）</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>車両進入不可（お部屋まで距離あり）</span><span className="font-bold text-blue-600">＋3,300円</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>作業員1名追加（3時間まで）</span><span className="font-bold text-blue-600">＋11,000円</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. プレミアム特典 ─── */}
      <section className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-size-[24px_24px]"></div>
          <span className="inline-block bg-yellow-400 text-slate-950 text-xs font-black px-4 py-1 rounded-full mb-4 tracking-wider">
            A.P.C LOGISTICS 限定特典
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mb-4">他社には絶対に真似できない！2大プレミアム無料特典</h3>
          <p className="text-sm text-blue-100 max-w-xl mx-auto mb-8">
            パソコンショップの運営や買取ビジネスのノウハウを持つ当店だからこそできる、新生活応援のための特別無料サービスです。<br />
            <strong>※以下のシミュレーターで荷物と一緒に自由に選べます！</strong>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <div className="text-yellow-400 font-extrabold text-lg mb-2">🎁 特典①：Wi-Fi・PC初期設定（1台）</div>
              <div className="text-3xl font-black my-1 text-white">0円 <span className="text-xs font-normal text-blue-200">（完全無料）</span></div>
              <p className="text-xs text-blue-100 leading-relaxed mt-2 border-t border-white/10 pt-2">
                新居での面倒なインターネットのWi-Fi接続、パソコンの初期設定などを引越し当日に代行！すぐに快適にネットが使えます。
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <div className="text-yellow-400 font-extrabold text-lg mb-2">🎁 特典②：引越し時の不用品丸ごと査定</div>
              <div className="text-3xl font-black my-1 text-white">0円 <span className="text-xs font-normal text-blue-200">（完全無料）</span></div>
              <p className="text-xs text-blue-100 leading-relaxed mt-2 border-t border-white/10 pt-2">
                壊れたカメラや古いパソコン、ゲーム機、オーディオなど、引越しで出た不用品をその場で専門査定！買取金額を引っ越し総額から差し引くため、実質0円以下になることも！
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 見積もり＆積載シミュレーター ─── */}
      <section id="simulator" className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-blue-600 text-xs font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">LIVE SIMULATOR</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">荷物量＆料金 スピードシミュレーター</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">あなたの荷物量を選ぶだけで、軽バン1台に載るかどうかの積載率と概算料金を同時に弾き出します！</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* ステップ1：荷物の選択 */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">① あなたのお荷物を選択（軽バン1台に載るかジャッジします）</label>
                
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                  {/* ダンボール数 */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-sm font-bold text-slate-800">📦 ダンボール箱数 (Mサイズ目安)</span>
                      <p className="text-[10px] text-slate-500">洋服や小物を詰めた一般的な引越し箱</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button type="button" onClick={() => setBoxCount(Math.max(0, boxCount - 1))} className="w-8 h-8 bg-white border border-slate-300 rounded-lg text-lg font-bold flex items-center justify-center hover:bg-slate-100">-</button>
                      <span className="w-12 text-center font-black text-slate-900">{boxCount} 箱</span>
                      <button type="button" onClick={() => setBoxCount(Math.min(50, boxCount + 1))} className="w-8 h-8 bg-white border border-slate-300 rounded-lg text-lg font-bold flex items-center justify-center hover:bg-slate-100">+</button>
                    </div>
                  </div>

                  {/* 大型家電・家具チェックボックス */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-bold">
                    <label className={`flex items-center p-3 rounded-lg border cursor-pointer select-none ${hasFridge ? "border-blue-500 bg-blue-50/20" : "border-slate-200 bg-white"}`}>
                      <input type="checkbox" checked={hasFridge} onChange={(e) => setHasFridge(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded" />
                      <span className="ml-2 text-slate-800">❄️ 冷蔵庫(2ドア)</span>
                    </label>

                    <label className={`flex items-center p-3 rounded-lg border cursor-pointer select-none ${hasWashing ? "border-blue-500 bg-blue-50/20" : "border-slate-200 bg-white"}`}>
                      <input type="checkbox" checked={hasWashing} onChange={(e) => setHasWashing(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded" />
                      <span className="ml-2 text-slate-800">🌀 洗濯機</span>
                    </label>

                    <label className={`flex items-center p-3 rounded-lg border cursor-pointer select-none ${hasBed ? "border-blue-500 bg-blue-50/20" : "border-slate-200 bg-white"}`}>
                      <input type="checkbox" checked={hasBed} onChange={(e) => setHasBed(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded" />
                      <span className="ml-2 text-slate-800">🛏️ ベッド/マットレス</span>
                    </label>

                    <label className={`flex items-center p-3 rounded-lg border cursor-pointer select-none ${hasFuton ? "border-blue-500 bg-blue-50/20" : "border-slate-200 bg-white"}`}>
                      <input type="checkbox" checked={hasFuton} onChange={(e) => setHasFuton(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded" />
                      <span className="ml-2 text-slate-800">💤 布団一式</span>
                    </label>
                  </div>

                  {/* リアルタイム積載判定ゲージ */}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-600">🚚 軽バン（エブリイ）積載率シミュレート</span>
                      <span className={loadPoints > 95 ? "text-amber-600" : "text-blue-600"}>
                        {Math.min(100, Math.round(loadPoints))}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${loadPoints > 95 ? "bg-amber-500" : loadPoints > 75 ? "bg-yellow-500" : "bg-blue-500"}`}
                        style={{ width: `${Math.min(100, loadPoints)}%` }}
                      ></div>
                    </div>

                    {/* 判定メッセージ */}
                    <div className="mt-3 text-center">
                      {loadPoints <= 95 ? (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold p-2.5 rounded-lg">
                          🚙 <strong>軽バン（エブリイ）にスッポリ収まります！</strong> 格安プランでの引っ越しが可能です。
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold p-2.5 rounded-lg">
                          ⚠️ <strong>軽バンの積載目安（100%）に近づいています！</strong><br />
                          家具や小物のサイズによっては、1回で載りきらない可能性があります。2往復プランや荷物量の調整を、公式LINEからお気軽に店長までご相談ください！
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* ステップ2：移動ルートの選択 */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">② 移動ルート（距離）を選択</label>
                <select
                  value={routeIdx}
                  onChange={(e) => setRouteIdx(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {ROUTE_DISTANCES.map((route, idx) => (
                    <option key={idx} value={idx}>{route.name}</option>
                  ))}
                </select>

                {/* その他（手動入力） */}
                {isCustomDistance && (
                  <div className="mt-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <label className="block text-xs font-bold text-slate-700 mb-1">片道の移動距離（km）を入力してください</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={customDistance}
                        onChange={(e) => setCustomDistance(Math.max(1, Number(e.target.value)))}
                        className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg p-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-bold text-slate-600">km</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ステップ3：作業環境オプション */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">③ お部屋の階数・周辺環境（オプション）</label>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-xs sm:text-sm font-bold text-slate-700">お部屋の階数（階段の有無）</span>
                    <select
                      value={stairs}
                      onChange={(e) => setStairs(Number(e.target.value))}
                      className="bg-white border border-slate-300 text-slate-800 rounded-lg p-1.5 text-xs focus:outline-none font-medium mt-2 sm:mt-0"
                    >
                      <option value={0}>1階 ⇔ 1階（またはエレベーターあり） (+0円)</option>
                      <option value={2200}>2階（階段のみ） (+2,200円)</option>
                      <option value={4400}>3階（階段のみ） (+4,400円)</option>
                      <option value={6600}>4階以上（階段のみ） (+6,600円〜)</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-center p-3 rounded-xl border cursor-pointer select-none transition-all ${noVehicleAccess ? "border-blue-500 bg-blue-50/20" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                      <input type="checkbox" checked={noVehicleAccess} onChange={(e) => setNoVehicleAccess(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                      <div className="ml-3">
                        <div className="text-xs sm:text-sm font-bold text-slate-800">車両進入不可 (+3,300円)</div>
                        <p className="text-[10px] text-slate-500">軽バンが建物の前に横付けできない場合</p>
                      </div>
                    </label>

                    <label className={`flex items-center p-3 rounded-xl border cursor-pointer select-none transition-all ${addWorker ? "border-blue-500 bg-blue-50/20" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                      <input type="checkbox" checked={addWorker} onChange={(e) => setAddWorker(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                      <div className="ml-3">
                        <div className="text-xs sm:text-sm font-bold text-slate-800">作業員を1名追加 (+11,000円)</div>
                        <p className="text-[10px] text-slate-500">店長1人では持てない極端な大型家具がある場合</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* ステップ4：無料プレミアム特典の確認 */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl p-4 sm:p-5">
                <label className="block text-sm font-black text-blue-950 mb-3">✨ 無料プレミアム特典の追加（0円）</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start p-3 bg-white/80 rounded-lg border border-blue-100 cursor-pointer select-none">
                    <input type="checkbox" checked={pcSetup} onChange={(e) => setPcSetup(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded" />
                    <div className="ml-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">Wi-Fi・PC接続設定（0円）</span>
                      <span className="text-[10px] text-slate-500">上の「特典①」を希望する（当日無料）</span>
                    </div>
                  </label>
                  <label className="flex items-start p-3 bg-white/80 rounded-lg border border-blue-100 cursor-pointer select-none">
                    <input type="checkbox" checked={purchaseOption} onChange={(e) => setPurchaseOption(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded" />
                    <div className="ml-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">不用品丸ごと査定（0円）</span>
                      <span className="text-[10px] text-slate-500">上の「特典②」を希望する（当日無料）</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* 金額結果表示＆LINE連携エリア */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 border-t border-slate-800 text-center">
              {!isBooked ? (
                <>
                  <div className="text-xs sm:text-sm text-slate-400 font-bold tracking-wider">あなたのシミュレーション概算金額</div>
                  <div className="text-3xl sm:text-5xl font-black text-blue-400 mt-2 mb-2">
                    {totalPrice.toLocaleString()}<span className="text-base sm:text-xl text-white font-normal ml-1">円（税込）</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                    * 長距離便の概算金額には、往復のガソリン代・高速道路料金の目安が自動加算されています。
                  </p>
                  <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
                    * 上記は選んだ条件に基づく概算価格です。LINEでのヒアリング時に確定料金を提示し、以降の追加請求は一切行いません。
                  </p>
                  <div className="max-w-md mx-auto">
                    <button
                      onClick={handleBooking}
                      className="inline-flex items-center justify-center bg-green-600 hover:bg-green-500 text-white font-black text-sm sm:text-base py-4 px-6 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 w-full cursor-pointer"
                    >
                      💬 この概算内容で予約番号を発行する
                    </button>
                    <span className="text-[10px] text-slate-500 mt-2 block">ボタンを押すと、あなた専用 of 予約番号がその場でパッと発行されます。</span>
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <span className="bg-blue-900/50 text-blue-400 border border-blue-700/50 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                    見積もり予約番号の発行完了！
                  </span>
                  <div className="text-xs text-slate-400 font-bold">公式LINEで伝えるあなたの番号</div>
                  <div className="text-4xl sm:text-5xl font-black text-yellow-400 my-4 tracking-wider">
                    #{bookingNumber}
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl max-w-md mx-auto mb-6 text-xs text-left text-slate-300 space-y-1">
                    <p className="font-bold text-center text-white text-sm mb-1">💡 お申し込み手順 💡</p>
                    <p>1. 下の緑色のボタンを押して公式LINEを追加（トーク画面を開く）します。</p>
                    <p>2. メッセージ欄に、この番号 <span className="text-yellow-400 font-bold text-sm">{bookingNumber}</span> だけを入力して送信してください。</p>
                  </div>
                  <div className="max-w-md mx-auto">
                    <a
                      href={`https://line.me/R/ti/p/@022lhymn`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-green-600 hover:bg-green-500 text-white font-black text-sm sm:text-base py-4 px-6 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 w-full"
                    >
                      🟢 公式LINEを開いて番号を伝える
                    </a>
                    <button
                      onClick={() => setIsBooked(false)}
                      className="text-xs text-slate-500 underline mt-4 hover:text-slate-400 block mx-auto"
                    >
                      ← 条件を変えてもう一度計算する
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ─── 5. エブリイ積載目安セクション ─── */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-xs font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">CAPACITY</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-2 mb-4">
            想像以上の大容量！軽バン（エブリイ）の積載目安
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            「軽自動車のバンで本当に足りるの？」と思われがちですが、当店の相棒（スズキ・エブリイ）は荷室が広いハイルーフ仕様！積載のプロがパズルのように隙間なく100%空間を活かして積み込みます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-xs">
            <div className="text-2xl mb-3">📦</div>
            <h4 className="font-bold text-slate-900 text-lg mb-2">ダンボール中心の場合</h4>
            <div className="text-3xl font-black text-blue-600 mb-3">最大 約20〜30箱</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              衣装ケースや棚などの大きな家財がなく、引っ越し用ダンボール（Mサイズ等）がメインであれば、これだけの量を1回でまとめて運べます。衣類や本、ガジェット類が多い方に最適。
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-xs">
            <div className="text-2xl mb-3">🧺</div>
            <h4 className="font-bold text-slate-900 text-lg mb-2">単身家電＋ダンボールセット</h4>
            <ul className="text-sm font-bold space-y-1 mb-3 text-blue-600">
              <li>・小型冷蔵庫（2ドア）</li>
              <li>・洗濯機（単身サイズ）</li>
              <li>・電子レンジ / 炊飯器</li>
              <li>・布団一式 / カラーボックス</li>
              <li>・ダンボール 10箱前後</li>
            </ul>
            <p className="text-xs text-slate-500 leading-relaxed">
              一人暮らしの「基本家電セット」に加えてダンボール10箱前後が、エブリイ1台にすっぽりと綺麗に収まります。一般的な単身の荷物量ならこれでピッタリ1台分です！
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-xs">
            <div className="text-2xl mb-3">🛏️</div>
            <h4 className="font-bold text-slate-900 text-lg mb-2">大きめの家具がある場合</h4>
            <div className="text-sm font-bold mb-3 text-blue-600">
              折りたたみベッド や シングルマットレス、小型デスク等も積み込みOK！
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              長さのあるベッドマットなども、助手席側まで空間をフルにフラット化して工夫することで積載可能です（※その分、他の家電や箱数を調整してパズルを組みます）。
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-md">
          <div className="mb-4 sm:mb-0 max-w-xl text-center sm:text-left">
            <h4 className="font-black text-base sm:text-lg text-blue-400 mb-1">「これ、エブリイに入るかな？」と迷ったら</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ベッドのサイズや、自転車・突っ張り棚などが入るか不安な場合は、LINEで荷物の写真をパシャッと送っていただければ、その場ですぐに積めるかどうかプロの目で判断いたします！
            </p>
          </div>
          <a href="#simulator" className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors whitespace-nowrap shadow-sm">
            シミュレーターに戻る
          </a>
        </div>
      </section>

      {/* ─── 6. ❓ お悩み共感エリア ─── */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center mb-10">
            <span className="text-blue-600 text-xs font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">PROBLEMS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2">単身・一人暮らしの引っ越しで、こんなお悩みありませんか？</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 mb-6">
            {[
              "荷物が少ないのに、大手の引っ越し見積もりは高すぎる…",
              "基本料金は安かったのに、あとから色々なオプションを上乗せされそう…",
              "新居でのWi-Fi接続やパソコンの設定、自分でやるのが正直めんどくさい",
              "引っ越しで出る古いパソコンやカメラ、処分したいけど捨てるのも大変…",
            ].map((text, idx) => (
              <div key={idx} className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-red-500 font-bold text-lg mr-3 leading-none">✕</span>
                <p className="text-sm sm:text-base text-slate-700 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. WHY US なぜ選ばれるのか？（安さの秘密） ─── */}
      <section className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center mb-10">
            <span className="text-blue-600 text-xs font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">WHY US</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2">だから選ばれる！A.P.C LOGISTICSの安さの秘密</h2>
            <p className="text-sm text-slate-500 mt-2">大手のような「至れり尽くせり」をあえて省き、必要な部分だけをスマートに効率化しています。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                「事前梱包」をお客様にお願いしています
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                当日の搬出作業時間を極限まで短縮するため、小物のダンボール詰めはお客様ご自身にお願いしております。このご協力が、富山最安級の運賃を維持できる最大の理由です。
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                ダンボールは「使い回しの空き箱」でOK！
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                スーパーや薬局の空き箱、ネット通販の箱など、どんな箱でも大歓迎です！資材コストを一切料金に上乗せしていません。（※もちろん用意が難しい場合は実費手配も可能です）。
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center">
            <p className="text-sm sm:text-base font-bold text-blue-900">
              お客様に少しだけ「準備」をご協力いただくことで、<br className="hidden sm:block" />
              浮いたコストをすべて「圧倒的な低価格」と「豪華な無料特典」として100%還元しています！
            </p>
          </div>
        </div>
      </section>

      {/* ─── 8. 代表紹介（Profile）セクション ─── */}
<section id="profile" className="w-full bg-slate-100 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
  <div className="max-w-5xl mx-auto">
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-10 items-center">
      
      {/* 💡 横幅と縦幅を完全に固定してNext.jsのエラーを回避します */}
      <div className="w-60 h-80 bg-slate-100 rounded-2xl overflow-hidden shadow-inner shrink-0 relative">
        <Image
          src="/images/face (2).jpg"
          alt="代表：小川 竜司"
          width={240}
          height={320}
          className="w-full h-full object-cover"
          priority
          unoptimized
        />
      </div>
      
      {/* 💡 元の「md:w-2/3」にしっかりと戻しました */}
      <div className="w-full md:w-2/3 text-center md:text-left">
        <div className="mb-6">
          <h3 className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-2">
            Representative
          </h3>
          <div className="text-2xl md:text-3xl font-black text-slate-900">
            代表：小川 竜司 <span className="text-sm md:text-base font-bold text-slate-400 block md:inline-block md:ml-2">Ryuji Ogawa</span>
          </div>
        </div>
        <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed mb-6">
          富山県を拠点に、物販と物流の二軸で活動中。「誠実な対応」と「迅速なフットワーク」を信条に、地域の皆様のお手伝いを行っています。<br />
          趣味はカメラで家族を撮ること。二人のプリンセスと最愛の妻に支えられながら、引っ越し・PCサポート・不用品査定をすべてワンストップでお届けし、地域の皆様に愛されるサービスを目指しています。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Office Name</span>
            <span className="text-base font-black text-slate-800">AmNiss&Co.Japan</span>
          </div>
          <div className="flex flex-col gap-0.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Name</span>
            <span className="text-base font-black text-slate-800">A.P.C LOGISTICS / re&apos;vive</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* ─── 9. 最終お問い合わせフォーム ─── */}
      <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-size-[24px_24px]"></div>
          
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-center mb-10 md:mb-16">
              <h3 className="text-blue-400 font-black text-xs uppercase tracking-widest bg-blue-950/60 border border-blue-900/50 px-3 py-1 rounded-full inline-block mb-3">
                CONTACT
              </h3>
              <div className="text-2xl md:text-4xl font-black text-white">まずはお気軽にご相談を</div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8">
              {/* LINEボタン */}
              <a 
                href="https://line.me/R/ti/p/@022lhymn" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#06C755] p-5 sm:p-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.01] transition-transform shadow-md cursor-pointer"
              >
                <span className="text-2xl sm:text-4xl">💬</span>
                <div className="text-left">
                  <div className="text-white text-[10px] sm:text-xs font-bold opacity-80 uppercase tracking-wider">24H LINE受付中</div>
                  <div className="text-white text-lg sm:text-2xl font-black">公式LINEで無料相談・見積もり</div>
                </div>
              </a>

              {/* メールフォーム */}
              <div className="bg-slate-800/40 p-6 sm:p-10 rounded-3xl border border-slate-800">
                <h4 className="text-white text-base sm:text-lg font-bold mb-6 flex items-center gap-3">
                  <span className="text-xl">📧</span> メールフォームで問い合わせ
                </h4>

                {formStatus === "success" ? (
                  <div className="text-center py-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                    <span className="text-3xl mb-2 block">✨</span>
                    <h5 className="text-lg font-black text-emerald-400 mb-1">送信が完了しました！</h5>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                      お問い合わせありがとうございます。内容を確認しだい、入力いただいたメールアドレス宛にご連絡いたします。
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input type="hidden" name="access_key" value="5c6cab02-a690-430f-a08c-a8e48b97ad30" />
                    <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input name="Name" required type="text" placeholder="お名前" className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors w-full" />
                      <input name="Email" required type="email" placeholder="メールアドレス" className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors w-full" />
                    </div>
                    
                    <textarea name="Message" required placeholder="ご相談内容（例：5月下旬に富山市内での単身引っ越しの空き状況を知りたい、など）" rows={4} className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"></textarea>
                    
                    <button 
                      type="submit" 
                      disabled={formStatus === "loading"}
                      className="w-full bg-blue-600 text-white font-black py-4 rounded-xl text-base hover:bg-blue-500 transition-colors shadow-md disabled:bg-slate-700 disabled:text-slate-400 cursor-pointer"
                    >
                      {formStatus === "loading" ? "送信中..." : "メールを送信する"}
                    </button>
                    
                    {formStatus === "error" && (
                      <p className="text-red-400 font-bold text-xs text-center">送信に失敗しました。もう一度お試しいただくか、LINEよりご連絡ください。</p>
                    )}
                  </form>
                )}
              </div>
              
              {/* 電話番号エリア */}
              <div className="text-center text-slate-500 text-xs font-bold mt-4">
                お急ぎの方はお電話にて：<br className="sm:hidden" />
                <a href="tel:07084500897" className="text-slate-300 text-lg sm:text-xl sm:ml-2 font-black inline-block mt-1 hover:text-blue-400 transition-colors">
                  070-8450-0897
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── フッター ─── */}
      <footer className="bg-slate-900 text-white text-center py-12 border-t border-slate-800">
        <p className="text-xs text-slate-500 mb-2">&copy; 2026 A.P.C LOGISTICS. All rights reserved.</p>
      </footer>
    </div>
  );
}