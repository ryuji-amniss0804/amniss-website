"use client";

import React, { useState } from "react"; // 💡 useEffect を削除
import Image from "next/image";
import Link from "next/link";

export default function CorporateHome() {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  // 💡 isMounted だけを残し、setIsMounted は削除（eslintの警告を回避）
  const [isMounted] = useState(true);

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
    <div className="bg-slate-50 text-slate-900 antialiased font-sans min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">
      

      {/* ─── ヒーローセクション（DX統合・背景画像版） ─── */}
<section
  id="hero" 
  className="relative w-full py-24 sm:py-32 bg-slate-900 border-b border-slate-700/60 overflow-hidden"
  style={{
    backgroundImage: 'url(/images/dx-hero-image.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* 暗いオーバーレイ */}
  <div className="absolute inset-0 bg-black/60 z-0"></div>

  {/* メインコンテンツ */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
    
    <div className="w-full max-w-3xl space-y-8">
      <span className="inline-block bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 text-[10px] font-black tracking-[0.3em] px-4 py-1.5 rounded-full uppercase select-none">
        IT × LOGISTICS × REUSE ONE-STOP
      </span>
      
      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.2] max-w-4xl mx-auto">
        富山からスマート物流と<br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-400 to-blue-400">
          価値あるリユース・DX
        </span>
        <br />
        をワンストップで。 
      </h1>

      <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-semibold">
        AmNiss & Co. Japan は、富山県を拠点に「軽バン単身引越し」「不用品回収・出張買取」、さらに「Python自動化やカスタムPC製造などのIT/DXソリューション」を融合させた、誠実でクリーンな総合次世代グループです。
      </p>

      {/* 信頼のバッジエリア */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 bg-white/5 border border-slate-700/60 px-3 py-1.5 rounded-lg shadow-sm">
          <span>✅</span> 富山県公安委員会許可
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 bg-white/5 border border-slate-700/60 px-3 py-1.5 rounded-lg shadow-sm">
          <span>🚚</span> 軽貨物運送登録済
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 bg-white/5 border border-slate-700/60 px-3 py-1.5 rounded-lg shadow-sm">
          <span>⚡</span> 迅速DX対応
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ─── 3. コア・サービスセクション（白ベース・プレミアムグリッド・見出し完全復活） ─── */}
      <section className="bg-slate-50 py-24 sm:py-36 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 💡 復活：お客様の目を最初に惹きつける重要な見出しエリア */}
          <div className="text-center mb-20">
            <span className="text-emerald-700 text-xs font-black uppercase tracking-[0.3em] bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
              Our Primary Divisions
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4">
              AmNissを支える3つの基幹事業
            </h2>
            <div className="w-12 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
          </div>

          {/* ─── 3つの基幹事業カードエリア（PNG画像・ホバー連動版） ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            
            {/* 事業1：A.P.C LOGISTICS（引越し・運送） */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 group shadow-xs relative overflow-hidden">
              <div>
                <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200/60 mb-6 group-hover:scale-[1.02] transition-transform duration-300">
                  <Image
                    src="/images/logistics-car.png"
                    alt="A.P.C LOGISTICS 軽バン運送"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">LOGISTICS</span>
                <h3 className="text-xl font-black text-slate-900 mt-3 mb-3 tracking-wide">単身引越し・緊急配送<br />【A.P.C LOGISTICS】</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  ハイルーフ仕様の軽バンを駆使した、ミニマルで無駄のない格安運送サービス。富山県内11,000円〜の明朗価格。不用品買取とセットでの劇的相殺割引や、新居でのWi-Fi設定代行が強みです。
                </p>
              </div>
              <Link 
  href="/transport" 
  className="w-full bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white py-4 rounded-xl font-black text-xs transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 mt-8 tracking-wider block text-center"
>
  引越し詳細・料金目安を見る
</Link>
            </div>

            {/* 事業2：re'vive（出張買取・不用品回収） */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 group shadow-xs relative overflow-hidden">
              <div>
                <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200/60 mb-6 group-hover:scale-[1.02] transition-transform duration-300">
                  <Image
                    src="/images/reuse-box.png"
                    alt="re'vive 出張買取・リユース"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200/50">REUSE</span>
                <h3 className="text-xl font-black text-slate-900 mt-3 mb-3 tracking-wide">不用品回収・出張買取<br />【re&apos;vive】</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  自作PC、古いパーツ、カメラ、ホビー品から家電、遺品整理まで幅広く対応。強固なEC・海外再販ルートを保有しているため、他店で断られた動作不良品やジャンク品にも確かな価値を見出して適正買取します。
                </p>
              </div>
              <Link 
  href="/shucho-kaitori" 
  className="w-full bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white py-4 rounded-xl font-black text-xs transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 mt-8 tracking-wider block text-center"
>
  出張買取・品目一覧を見る
</Link>
            </div>

            {/* 事業3：IT/DX SOLUTION（PC販売・DX・制作） */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 group shadow-xs relative overflow-hidden">
              <div>
                <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200/60 mb-6 group-hover:scale-[1.02] transition-transform duration-300">
                  <Image
                    src="/images/it-dx-solution.png"
                    alt="IT / DX SOLUTION カスタムPC・システム開発"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">DIGITAL</span>
                <h3 className="text-xl font-black text-slate-900 mt-3 mb-3 tracking-wide">カスタムPC ＆ DX制作<br />【IT / DX SOLUTION】</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  PythonによるExcel自動化プログラム、集客力を最大化するHP・Webシステム構築、用途別のオーダーメイドPC製造まで。現場の「手作業による無駄」を自社運用による知見をベースに最速で自動化変革します。
                </p>
              </div>
              <Link 
  href="/pc-sales" 
  className="w-full bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white py-4 rounded-xl font-black text-xs transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 mt-8 tracking-wider block text-center"
>
  DX自動化・PCビルドを見る
</Link>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 4. 強みセクション：WHY CHOSEN（縞々の効果を出すため bg-slate-50 を採用） ─── */}
<section className="bg-white py-24 sm:py-32 border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* 見出しエリア */}
    <div className="text-center mb-16">
      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
        AmNissが選ばれる3つの理由
      </h2>
      <p className="text-slate-500 font-bold mt-4 text-sm sm:text-base">
        物流・再販・IT。3つの専門性を掛け合わせることで、<br className="hidden sm:block" />
        他社には真似できない圧倒的な「利便性」と「コストパフォーマンス」を実現しています。
      </p>
    </div>

    {/* 強みカード：グリッドレイアウト */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* 理由1：シナジーによるコストカット */}
      <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl">💰</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-4">
          「買取 × 運送」の相殺割引
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
          引越しや運送の際に、不用品をその場で査定・買取。買取金額を運送費から差し引くことで、実質的なコストを劇的に抑えることが可能です。処分と移動を同時に完結させる、AmNiss最大の強みです。
        </p>
      </div>

      {/* 理由2：専門的な技術力 */}
      <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl">💻</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-4">
          ハード・ソフト両面の専門性
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
          単なる配送業者ではありません。PCの組立からPythonによる自動化、新居のインフラ構築まで対応可能。物理的な移動とデジタルの最適化を同時に行える「ITに強いパートナー」として選ばれています。
        </p>
      </div>

      {/* 理由3：地域密着のスピード対応 */}
      <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl">🤝</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-4">
          誠実な対面査定とサポート
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
          富山を拠点に、一つひとつの案件に代表自らが責任を持って対応します。不明瞭な追加料金は一切なし。古物商許可に基づいた誠実な査定と、アフターフォローまで徹底したサービス品質が信頼の証です。
        </p>
      </div>

    </div>

    {/* 会社概要への導線（しっかりとしたボタンスタイル） */}
<div className="mt-16 text-center">
  <Link 
  href="/company" 
  className="inline-flex items-center gap-3 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 group"
>
  <span>私たちの経営理念と代表挨拶を見る</span>
  <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-colors">
    ➔
  </span>
</Link>
</div>

  </div>
</section>

      {/* ─── 5. 最新ブログセクション（白ベース・導線最適化版） ─── */}
<section id="blog" className="w-full bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/50">
  <div className="max-w-5xl mx-auto">
    
    {/* 1. セクション見出し */}
    <div className="text-center mb-10">
      <span className="text-emerald-700 text-xs font-black uppercase tracking-[0.3em] bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
        Latest Insights
      </span>
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-4">
        公式ブログ・お役立ち豆知識
      </h2>
      <p className="text-xs text-slate-500 font-bold mt-2">
        富山のお客様の暮らしをスマートにする、プロ直伝のノウハウを発信中
      </p>
    </div>

    {/* 2. ブログ一覧へのリンク（見出し直後に配置） */}
    <div className="text-center mb-16">
      <Link 
  href="/blog" 
  className="inline-block bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-2xl font-black text-xs transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 tracking-wider"
>
  📚 ブログ記事一覧をすべて見る
</Link>
    </div>

    {/* 3. ブログ記事一覧エリア */}
    {React.useMemo(() => {
      const ALL_POSTS = [
        {
          slug: "jisaku-pc",
          title: "【プロ直伝】自作PC・高級ゲーミングPCを壊さずに引越しする方法！梱包手順と不用パーツ処分・新居のネットワーク設定まで完全解説",
          excerpt: "高性能グラボや水冷クーラー搭載のゲーミングPCを輸送振動から守る完璧な内部梱包5ステップ！自らPC事業を運用するからこそ分かる、余ったパーツの現金化相殺テクニックと新居での即日Wi-Fi無料開通まで徹底解説。",
          date: "2026.05.28",
          category: "ガジェット・引越しノウハウ",
          categoryBg: "bg-blue-50 text-blue-700 border border-blue-200/50",
        },
        {
          slug: "how-to-pack",
          title: "【プロが直伝】単身引越しを驚くほど格安＆スムーズに終わらせる荷造り・梱包の裏ワザ5選",
          excerpt: "一人暮らしや単身赴任の方必見！軽バン引越しを限界まで安く抑えるための事前準備と、ダンボールの詰め方のコツを物流のプロが解説。",
          date: "2026.05.28",
          category: "引越し豆知識",
          categoryBg: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
        },
        {
          slug: "toyama-fuyohin-tips",
          title: "【富山密着】不用品回収の費用を限界まで安く抑える5つのコツ！処分と買取を組み合わせる裏ワザとは？",
          excerpt: "富山県内で不用品回収やお片付けを安く抑える基本テクニックに加え、他社が処分とする『壊れたPC・古いカメラ・レトロゲーム』を独自の海外ルートで高価買取し、費用から直接相殺する裏ワザを公開！",
          date: "2026.05.28",
          category: "不用品回収・お片付け",
          categoryBg: "bg-amber-50 text-amber-800 border border-amber-200/50",
        },
      ];

      const sortedPosts = [...ALL_POSTS].sort((a, b) => b.date.localeCompare(a.date));
      const latestTwoPosts = sortedPosts.slice(0, 2);

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {latestTwoPosts.map((post) => (
            <article 
              key={post.slug} 
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`${post.categoryBg} text-[10px] font-black px-2.5 py-0.5 rounded border`}>
                    {post.category}
                  </span>
                  <time className="text-[11px] font-bold text-slate-400">{post.date}</time>
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug mb-3">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold mb-6">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Link href={`/blog/${post.slug}`} className="text-xs font-black text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-1">
                  この記事を読む ➔
                </Link>
              </div>
            </article>
          ))}
        </div>
      );
    }, [])}

    {/* 4. SNS連携＆最新活動エリア（LightWidget統合版） */}
<div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 text-center shadow-xs">
  <h3 className="text-xs font-black text-slate-900 mb-6 uppercase tracking-[0.2em]">
    Follow Our Daily Updates
  </h3>

<div className="mb-8 min-h-100">
  {isMounted && (
    <iframe 
      key="instagram-feed" // 💡 keyを追加することでReactの管理を強制的にリセットします
      src="//lightwidget.com/widgets/86950ed5222056f8872ed9851e9a87fb.html" 
      scrolling="no" 
      className="lightwidget-widget" 
      style={{ width: "100%", border: "none", overflow: "hidden" }} // borderを0ではなく"none"に明示
      title="Instagram Feed"
      suppressHydrationWarning={true} // 💡 これが最強の解決策です。ハイドレーションエラーを無視させます
    />
  )}
</div>

  <div className="flex justify-center gap-8 mb-6">
    <a href="https://x.com/amniss_reuse" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-600 transition-colors font-black text-lg">X (Twitter)</a>
    <a href="https://www.instagram.com/amniss_ryuji1724" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-600 transition-colors font-black text-lg">Instagram</a>
  </div>
  <p className="text-xs text-slate-500 font-bold">
    現場のリアルタイムや、制作風景、代表のプライベートも配信中！
  </p>
</div>

{/* 外部スクリプトの読み込み（コンポーネントの末尾またはuseEffectで実行） */}
<script src="https://cdn.lightwidget.com/widgets/lightwidget.js" async />
    
  </div>
</section>

{/* ─── 4. よくある質問 (FAQ) セクション ─── */}
<section className="py-24 bg-white border-y border-slate-100">
  <div className="max-w-3xl mx-auto px-4">
    <div className="text-center mb-16">
      <span className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.3em] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
        Q & A
      </span>
      <h2 className="text-3xl font-black mt-4">よくあるご質問</h2>
      <p className="text-xs text-slate-500 font-bold mt-2">ご依頼前の不安や疑問を解消します</p>
    </div>

    <div className="space-y-4">
      {[
        { q: "見積もり後の追加料金は発生しますか？", a: "原則、事前にお伝えした見積もり金額から変動することはありません。作業内容に変更が生じる場合は、必ず事前にご相談・確認をいたしますのでご安心ください。" },
        { q: "壊れたPCや古いパーツでも本当に買取対象ですか？", a: "はい、大歓迎です。壊れていても独自のパーツ再利用ルートやEC販路があるため、他店で断られたジャンク品でも価値を見出して適正に買取・相殺いたします。" },
        { q: "引越しと不用品処分を同時に頼めますか？", a: "可能です。むしろセットでのご依頼が最も効率的です。不用品の買取分を引越し費用から直接相殺（割引）させていただくため、実質負担を大幅に抑えることができます。" },
        { 
          q: "富山県外からの依頼も可能ですか？", 
          a: "富山県を中心に、石川・福井の北陸三県、および新潟・岐阜・長野の隣接県まで広く対応しております。遠方の場合、移動距離に応じて最低作業料金や交通費等の条件が適用される場合がございますが、お客様のご負担を抑える最も効率的なプランをご提案しますので、まずは一度、お荷物の量や内容をLINEにてご相談ください。" 
        },
        { q: "個人のPC設定やDX相談だけでも依頼できますか？", a: "喜んで承ります。Excelの自動化プログラム作成から、こだわりの自作PC制作まで、小規模なご相談こそ当社の得意分野です。LINEで気軽にご相談ください。" }
      ].map((item, idx) => (
        <details key={idx} className="group bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 transition-all">
          <summary className="font-black text-sm flex justify-between items-center cursor-pointer list-none">
            {item.q}
            <span className="text-emerald-600 transition-transform group-open:rotate-180">▼</span>
          </summary>
          <p className="text-xs text-slate-600 font-medium mt-4 leading-relaxed border-t border-slate-200 pt-4">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  </div>
</section>

      

      {/* ─── 6. 総合お問い合わせ＆信頼の証エリア ─── */}
<section id="contact" className="max-w-4xl mx-auto px-4 w-full py-24">
  
  {/* お問い合わせカード */}
  <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 relative overflow-hidden mb-8">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[20px_20px]"></div>
    
    <div className="relative z-10 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-emerald-700 font-black text-[10px] uppercase tracking-widest bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full inline-block mb-3">
          COMPANY CONTACT
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-wide">総合お問い合わせ窓口</h2>
        <p className="text-xs text-slate-500 mt-2 font-bold">引越し、片付け、買取、IT·DX開発のご相談など、お気軽にお寄せください。</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <a href="https://line.me/R/ti/p/@022lhymn" target="_blank" rel="noopener noreferrer" className="bg-[#06C755] p-4 rounded-xl flex items-center justify-center gap-4 hover:scale-[1.01] transition-transform shadow-md">
          <span className="text-2xl sm:text-3xl">💬</span>
          <div className="text-left">
            <div className="text-white text-[9px] font-black opacity-90 uppercase tracking-widest">24H LINE受付中</div>
            <div className="text-white text-base font-black tracking-wide">公式LINEから写真添付でかんたん無料相談</div>
          </div>
        </a>

        <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80">
          {formStatus === "success" ? (
            <div className="text-center py-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <h5 className="text-lg font-black text-emerald-600 mb-1">送信が完了しました！</h5>
              <p className="text-xs text-slate-500 font-medium">お問い合わせありがとうございます。内容を確認次第、折り返しご連絡いたします。</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
  <input type="hidden" name="access_key" value="5c6cab02-a690-430f-a08c-a8e48b97ad30" />
  
  {/* お名前フィールド */}
  <div>
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">お名前</label>
    <input 
      name="Name" 
      required 
      type="text" 
      placeholder="例：山田 太郎" 
      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
    />
  </div>

  {/* メールアドレスフィールド */}
  <div>
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">メールアドレス</label>
    <input 
      name="Email" 
      required 
      type="email" 
      placeholder="例：example@mail.com" 
      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
    />
  </div>

  {/* ご相談内容フィールド */}
  <div>
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">ご相談内容</label>
    <textarea 
      name="Message" 
      required 
      placeholder="例：引越しと不用品買取をセットで相談したい..." 
      rows={4} 
      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
    ></textarea>
  </div>

  {/* 送信ボタン */}
  <button 
  type="submit" 
  disabled={formStatus === "loading"}
  className="w-full bg-white border-2 border-slate-900 text-slate-900 font-black py-4 rounded-2xl transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
>
  {formStatus === "loading" ? "データ送信中..." : "上記の内容で送信する"}
</button>
</form>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Googleビジネスプロフィール誘導カード（お問い合わせと幅を統一） */}
  <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-lg text-center">
    <h4 className="text-sm font-black text-slate-900 mb-4 tracking-wider">
      ＼ 富山の皆様の信頼を大切にしています ／
    </h4>
    <p className="text-xs text-slate-600 font-bold mb-6">
      これまでの実績やお客様からの口コミは、Googleビジネスプロフィールにて公開中です。<br />
      ご依頼前の参考にぜひご覧ください。
    </p>
    <a 
      href="https://share.google/Lh1GlId3AZCH9D9NT" 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-slate-900 text-white font-black px-8 py-4 rounded-xl hover:bg-emerald-600 transition-all shadow-md"
    >
      <span>⭐</span> Googleの口コミ・実績を見る
    </a>
  </div>
</section>

      {/* 💡 ここに貼り付けます！ */}
      {/* 💡 LINEだと一目でわかるように修正！ */}
      <a 
        href="https://line.me/R/ti/p/@022lhymn" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#06C755] text-white px-5 py-3 rounded-full shadow-2xl md:hidden animate-bounce flex items-center gap-2 font-black text-sm"
      >
        <span>💬</span> LINEで相談
      </a>

    </div>
  );
}