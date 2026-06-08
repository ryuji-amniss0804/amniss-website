"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS_META } from "@/lib/posts-meta";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as const;
}


const SERVICES = [
  {
    href: "/transport",
    image: "/images/logistics-car.png",
    alt: "A.P.C LOGISTICS 軽バン運送",
    tag: "LOGISTICS",
    tagCls: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
    accentGrad: "from-emerald-500 to-teal-400",
    title: "単身引越し・緊急配送",
    sub: "A.P.C LOGISTICS",
    desc: "ハイルーフ仕様の軽バンを駆使した、ミニマルで無駄のない格安運送サービス。富山県内11,000円〜の明朗価格。不用品買取とセットでの劇的相殺割引や、新居でのWi-Fi設定代行が強みです。",
    cta: "引越し詳細・料金目安を見る",
    ctaHover: "hover:bg-emerald-600 hover:border-emerald-600",
  },
  {
    href: "/shucho-kaitori",
    image: "/images/reuse-box.png",
    alt: "re'vive 出張買取・リユース",
    tag: "REUSE",
    tagCls: "text-cyan-700 bg-cyan-50 border-cyan-200/60",
    accentGrad: "from-cyan-500 to-blue-400",
    title: "不用品回収・出張買取",
    sub: "re'vive",
    desc: "自作PC、古いパーツ、カメラ、ホビー品から家電、遺品整理まで幅広く対応。強固なEC・海外再販ルートを保有しているため、他店で断られたジャンク品でも価値を見出して適正買取します。",
    cta: "出張買取・品目一覧を見る",
    ctaHover: "hover:bg-cyan-600 hover:border-cyan-600",
  },
  {
    href: "/pc-sales",
    image: "/images/it-dx-solution.png",
    alt: "IT / DX SOLUTION カスタムPC・システム開発",
    tag: "DIGITAL",
    tagCls: "text-blue-700 bg-blue-50 border-blue-200/60",
    accentGrad: "from-blue-500 to-violet-400",
    title: "カスタムPC ＆ DX制作",
    sub: "IT / DX SOLUTION",
    desc: "PythonによるExcel自動化プログラム、集客力を最大化するHP・Webシステム構築、用途別のオーダーメイドPC製造まで。現場の手作業による無駄を自社知見をベースに最速で自動化変革します。",
    cta: "DX自動化・PCビルドを見る",
    ctaHover: "hover:bg-blue-600 hover:border-blue-600",
  },
];

const STRENGTHS = [
  {
    icon: "💰",
    lightBg: "bg-emerald-50",
    num: "01",
    title: "「買取 × 運送」の相殺割引",
    desc: "引越しや運送の際に、不用品をその場で査定・買取。買取金額を運送費から差し引くことで、実質的なコストを劇的に抑えることが可能です。処分と移動を同時に完結させる、AmNiss最大の強みです。",
  },
  {
    icon: "💻",
    lightBg: "bg-blue-50",
    num: "02",
    title: "ハード・ソフト両面の専門性",
    desc: "単なる配送業者ではありません。PCの組立からPythonによる自動化、新居のインフラ構築まで対応可能。物理的な移動とデジタルの最適化を同時に行える「ITに強いパートナー」として選ばれています。",
  },
  {
    icon: "🤝",
    lightBg: "bg-amber-50",
    num: "03",
    title: "誠実な対面査定とサポート",
    desc: "富山を拠点に、一つひとつの案件に代表自らが責任を持って対応します。不明瞭な追加料金は一切なし。古物商許可に基づいた誠実な査定と、アフターフォローまで徹底したサービス品質が信頼の証です。",
  },
];

const FAQS = [
  { q: "見積もり後の追加料金は発生しますか？", a: "原則、事前にお伝えした見積もり金額から変動することはありません。作業内容に変更が生じる場合は、必ず事前にご相談・確認をいたしますのでご安心ください。" },
  { q: "壊れたPCや古いパーツでも本当に買取対象ですか？", a: "はい、大歓迎です。壊れていても独自のパーツ再利用ルートやEC販路があるため、他店で断られたジャンク品でも価値を見出して適正に買取・相殺いたします。" },
  { q: "引越しと不用品処分を同時に頼めますか？", a: "可能です。むしろセットでのご依頼が最も効率的です。不用品の買取分を引越し費用から直接相殺（割引）させていただくため、実質負担を大幅に抑えることができます。" },
  { q: "富山県外からの依頼も可能ですか？", a: "富山県を中心に、石川・福井の北陸三県、および新潟・岐阜・長野の隣接県まで広く対応しております。遠方の場合、移動距離に応じた最低作業料金等の条件が適用される場合がございますが、お客様のご負担を最大限抑えるプランをご提案いたします。" },
  { q: "個人のPC設定やDX相談だけでも依頼できますか？", a: "喜んで承ります。Excelの自動化プログラム作成から、こだわりの自作PC制作まで、小規模なご相談こそ当社の得意分野です。LINEで気軽にご相談ください。" },
];

function anim(inView: boolean, delay = 0) {
  return {
    style: {
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
    },
  };
}

export default function CorporateHome() {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [heroReady, setHeroReady] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const [servicesRef, servicesInView] = useInView();
  const [whyRef, whyInView] = useInView();
  const [blogRef, blogInView] = useInView();
  const [faqRef, faqInView] = useInView();
  const [contactRef, contactInView] = useInView();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setFormStatus(data.success ? "success" : "error");
    } catch {
      setFormStatus("error");
    }
  };

  const latestPosts = [...BLOG_POSTS_META].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <div className="bg-slate-50 text-slate-900 antialiased font-sans min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">

      {/* ─── ヒーローセクション ─── */}
      <section
        id="hero"
        className="relative w-full min-h-[88vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: "url(/images/dx-hero-image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 多層グラデーションオーバーレイ */}
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, rgba(2,6,23,0.88) 0%, rgba(2,44,34,0.72) 50%, rgba(2,6,23,0.82) 100%)" }} />

        {/* アクセントグロー（エメラルド） */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full pointer-events-none z-0 animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 65%)" }}
        />

        {/* グリッドテクスチャ */}
        <div
          className="absolute inset-0 z-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 sm:py-40 flex flex-col items-center text-center">

          {/* バッジ */}
          <div
            style={{
              transition: "opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(14px)",
            }}
          >
            <span className="inline-flex items-center gap-2.5 bg-white/5 text-emerald-300 border border-emerald-500/30 text-[10px] font-black tracking-[0.35em] px-5 py-2.5 rounded-full uppercase backdrop-blur-sm mb-8 select-none">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              IT × LOGISTICS × REUSE ONE-STOP
            </span>
          </div>

          {/* メイン見出し */}
          <div
            style={{
              transition: "opacity 0.75s ease 0.18s, transform 0.75s ease 0.18s",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] max-w-5xl mx-auto mb-8">
              富山からスマート物流と
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #34d399 0%, #22d3ee 50%, #818cf8 100%)" }}
              >
                価値あるリユース・DX
              </span>
              <br />
              をワンストップで。
            </h1>
          </div>

          {/* サブコピー */}
          <div
            style={{
              transition: "opacity 0.75s ease 0.34s, transform 0.75s ease 0.34s",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-10">
              AmNiss &amp; Co. Japan は、富山県を拠点に「軽バン単身引越し」「不用品回収・出張買取」、さらに「Python自動化やカスタムPC製造などのIT/DXソリューション」を融合させた、誠実でクリーンな総合次世代グループです。
            </p>
          </div>

          {/* 信頼バッジ */}
          <div
            className="flex flex-wrap justify-center gap-3 mb-12"
            style={{
              transition: "opacity 0.75s ease 0.5s, transform 0.75s ease 0.5s",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {[
              { icon: "✅", text: "富山県公安委員会許可" },
              { icon: "🚚", text: "軽貨物運送登録済" },
              { icon: "⚡", text: "迅速DX対応" },
            ].map((b) => (
              <span
                key={b.text}
                className="inline-flex items-center gap-2 text-[10px] font-black text-slate-200 bg-white/8 border border-white/15 px-4 py-2 rounded-xl backdrop-blur-sm"
              >
                {b.icon} {b.text}
              </span>
            ))}
          </div>

          {/* CTAボタン */}
          <div
            className="flex flex-col sm:flex-row gap-4"
            style={{
              transition: "opacity 0.75s ease 0.65s, transform 0.75s ease 0.65s",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <a
              href="https://line.me/R/ti/p/@022lhymn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-[#06C755] text-white px-9 py-4 rounded-2xl font-black text-sm hover:brightness-110 transition-all duration-300 shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5"
            >
              <span className="text-lg">💬</span> LINEで無料相談
            </a>
            <Link
              href="/company"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/25 px-9 py-4 rounded-2xl font-black text-sm hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
            >
              会社概要を見る <span className="opacity-70">→</span>
            </Link>
          </div>
        </div>

        {/* 底部フェード */}
        <div className="absolute bottom-0 left-0 right-0 h-24 z-10" style={{ background: "linear-gradient(to bottom, transparent, rgb(248,250,252))" }} />
      </section>

      {/* ─── コア・サービスセクション ─── */}
      <section className="bg-white py-24 sm:py-36 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={servicesRef}>

            {/* セクション見出し */}
            <div className="text-center mb-16" {...anim(servicesInView)}>
              <span className="inline-block text-emerald-700 text-[10px] font-black uppercase tracking-[0.35em] bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-5">
                Our Primary Divisions
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                AmNissを支える3つの基幹事業
              </h2>
              <div className="h-1 w-16 mx-auto mt-5 rounded-full" style={{ background: "linear-gradient(90deg, #10b981, #14b8a6)" }} />
            </div>

            {/* サービスカードグリッド */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {SERVICES.map((s, i) => (
                <div
                  key={s.href}
                  className="group bg-white border border-slate-200/80 rounded-3xl overflow-hidden flex flex-col hover:shadow-2xl hover:border-slate-300 transition-all duration-500 hover:-translate-y-1.5"
                  style={{
                    transition: `opacity 0.7s ease ${i * 140}ms, transform 0.7s ease ${i * 140}ms, box-shadow 0.4s ease, border-color 0.3s ease`,
                    opacity: servicesInView ? 1 : 0,
                    transform: servicesInView ? "translateY(0)" : "translateY(36px)",
                  }}
                >
                  {/* カラーアクセントバー */}
                  <div className={`h-1 bg-linear-to-r ${s.accentGrad} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`} />

                  <div className="p-7 flex flex-col flex-1">
                    {/* 画像 */}
                    <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden relative mb-6 shadow-sm">
                      <Image
                        src={s.image}
                        alt={s.alt}
                        fill
                        className="object-cover group-hover:scale-[1.06] transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                    </div>

                    {/* タグ */}
                    <span className={`${s.tagCls} text-[10px] font-black uppercase tracking-widest border px-2.5 py-1 rounded-lg w-fit mb-3`}>
                      {s.tag}
                    </span>

                    {/* タイトル */}
                    <h3 className="text-xl font-black text-slate-900 leading-snug mb-1">{s.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4">【{s.sub}】</p>

                    {/* 説明 */}
                    <p className="text-xs text-slate-500 leading-relaxed font-medium flex-1 mb-7">{s.desc}</p>

                    {/* CTAボタン */}
                    <Link
                      href={s.href}
                      className={`w-full text-center bg-slate-900 text-white border-2 border-slate-900 ${s.ctaHover} py-3.5 rounded-xl font-black text-xs transition-all duration-300 tracking-wide`}
                    >
                      {s.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 選ばれる理由セクション ─── */}
      <section className="bg-slate-50 py-24 sm:py-32 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={whyRef}>

            {/* 見出し */}
            <div className="text-center mb-16" {...anim(whyInView)}>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                AmNissが選ばれる3つの理由
              </h2>
              <p className="text-slate-500 font-medium mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                物流・再販・IT。3つの専門性を掛け合わせることで、他社には真似できない圧倒的な「利便性」と「コストパフォーマンス」を実現しています。
              </p>
            </div>

            {/* 強みカード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STRENGTHS.map((s, i) => (
                <div
                  key={s.num}
                  className="relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 overflow-hidden group"
                  style={{
                    transition: `opacity 0.7s ease ${i * 140}ms, transform 0.7s ease ${i * 140}ms, box-shadow 0.4s ease`,
                    opacity: whyInView ? 1 : 0,
                    transform: whyInView ? "translateY(0)" : "translateY(36px)",
                  }}
                >
                  {/* 背景ナンバー */}
                  <span className="absolute top-3 right-5 text-7xl font-black text-slate-100 group-hover:text-slate-150 transition-colors select-none pointer-events-none leading-none">
                    {s.num}
                  </span>

                  <div className={`w-14 h-14 ${s.lightBg} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                    <span className="text-2xl">{s.icon}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-4 leading-snug">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* 導線ボタン */}
            <div
              className="mt-14 text-center"
              style={{
                transition: "opacity 0.7s ease 420ms, transform 0.7s ease 420ms",
                opacity: whyInView ? 1 : 0,
                transform: whyInView ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <Link
                href="/company"
                className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:-translate-y-0.5"
              >
                私たちの経営理念と代表挨拶を見る
                <span className="w-7 h-7 bg-white/15 rounded-full flex items-center justify-center text-xs">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 最新ブログセクション ─── */}
      <section id="blog" className="bg-white py-24 sm:py-32 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={blogRef}>

            {/* 見出し */}
            <div className="text-center mb-12" {...anim(blogInView)}>
              <span className="inline-block text-emerald-700 text-[10px] font-black uppercase tracking-[0.35em] bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-5">
                Latest Insights
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                公式ブログ・お役立ち豆知識
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-2">
                富山のお客様の暮らしをスマートにする、プロ直伝のノウハウを発信中
              </p>
            </div>

            {/* ブログカード */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {latestPosts.map((post, i) => (
                <article
                  key={post.slug}
                  className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 flex flex-col"
                  style={{
                    transition: `opacity 0.7s ease ${i * 150}ms, transform 0.7s ease ${i * 150}ms, box-shadow 0.4s ease`,
                    opacity: blogInView ? 1 : 0,
                    transform: blogInView ? "translateY(0)" : "translateY(32px)",
                  }}
                >
                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`${post.categoryBg} text-[10px] font-black px-2.5 py-1 rounded-lg border`}>
                        {post.category}
                      </span>
                      <time className="text-[11px] font-bold text-slate-400">{post.date}</time>
                    </div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug mb-3 flex-1">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium mb-5">{post.excerpt}</p>
                    <div className="pt-4 border-t border-slate-200 flex justify-end">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-black text-emerald-600 hover:text-emerald-500 inline-flex items-center gap-1.5 group/lnk"
                      >
                        この記事を読む
                        <span className="group-hover/lnk:translate-x-1 transition-transform inline-block">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ブログ一覧リンク */}
            <div
              className="text-center mb-12"
              style={{
                transition: "opacity 0.7s ease 300ms, transform 0.7s ease 300ms",
                opacity: blogInView ? 1 : 0,
                transform: blogInView ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-emerald-600 transition-all duration-300 shadow-md hover:-translate-y-0.5"
              >
                📚 ブログ記事一覧をすべて見る
              </Link>
            </div>

            {/* SNSエリア */}
            <div
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 text-center"
              style={{
                transition: "opacity 0.7s ease 420ms, transform 0.7s ease 420ms",
                opacity: blogInView ? 1 : 0,
                transform: blogInView ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.28em] mb-7">
                Follow Our Daily Updates
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
                <a
                  href="https://x.com/amniss_reuse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-slate-900 text-white hover:bg-emerald-600 px-7 py-3.5 rounded-xl font-black text-xs transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                >
                  <span className="font-black text-base">𝕏</span> X (Twitter) をフォロー
                </a>
                <a
                  href="https://www.instagram.com/amniss_ryuji1724"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 text-white px-7 py-3.5 rounded-xl font-black text-xs transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-sm"
                  style={{ background: "linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #6366f1 100%)" }}
                >
                  <span>📷</span> Instagram をフォロー
                </a>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                現場のリアルタイムや、制作風景、代表のプライベートも配信中！
                <br className="hidden sm:block" />
                ぜひフォローして最新情報をチェックしてください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── よくある質問セクション ─── */}
      <section className="py-24 sm:py-32 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div ref={faqRef}>

            {/* 見出し */}
            <div className="text-center mb-14" {...anim(faqInView)}>
              <span className="inline-block text-emerald-700 text-[10px] font-black uppercase tracking-[0.35em] bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-5">
                Q &amp; A
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">よくあるご質問</h2>
              <p className="text-xs text-slate-500 font-medium mt-2">ご依頼前の不安や疑問を解消します</p>
            </div>

            {/* アコーディオン */}
            <div className="space-y-3">
              {FAQS.map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-colors duration-300 ${openFaq === idx ? "border-emerald-400" : "border-slate-200 hover:border-slate-300"}`}
                  style={{
                    transition: `opacity 0.6s ease ${idx * 80}ms, transform 0.6s ease ${idx * 80}ms, border-color 0.3s ease`,
                    opacity: faqInView ? 1 : 0,
                    transform: faqInView ? "translateY(0)" : "translateY(16px)",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-start gap-4 p-6 text-left hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span className="flex items-start gap-3 font-black text-sm text-slate-900">
                      <span className="text-emerald-500 font-black text-[11px] mt-0.5 shrink-0 bg-emerald-50 w-6 h-6 rounded-lg flex items-center justify-center">
                        Q
                      </span>
                      {item.q}
                    </span>
                    <span
                      className="text-emerald-500 shrink-0 mt-0.5 transition-transform duration-300 text-sm"
                      style={{ transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)" }}
                    >
                      ▾
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: openFaq === idx ? "320px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-600 font-medium leading-relaxed flex gap-3">
                        <span className="text-emerald-500 font-black text-[11px] mt-0.5 shrink-0 bg-emerald-50 w-6 h-6 rounded-lg flex items-center justify-center">
                          A
                        </span>
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 総合お問い合わせセクション ─── */}
      <section id="contact" className="py-24 sm:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div ref={contactRef}>

            {/* 見出し */}
            <div className="text-center mb-12" {...anim(contactInView)}>
              <span className="inline-block text-emerald-700 text-[10px] font-black uppercase tracking-[0.35em] bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-5">
                COMPANY CONTACT
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">総合お問い合わせ窓口</h2>
              <p className="text-sm text-slate-500 font-medium mt-3">
                引越し、片付け、買取、IT·DX開発のご相談など、お気軽にお寄せください。
              </p>
            </div>

            {/* メインカード */}
            <div
              className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-6"
              style={{
                transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
                opacity: contactInView ? 1 : 0,
                transform: contactInView ? "translateY(0)" : "translateY(28px)",
              }}
            >
              {/* LINE CTA */}
              <a
                href="https://line.me/R/ti/p/@022lhymn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 bg-[#06C755] hover:brightness-105 transition-all p-6 sm:p-8 group"
              >
                <span className="text-4xl shrink-0">💬</span>
                <div>
                  <div className="text-white/75 text-[9px] font-black uppercase tracking-widest mb-0.5">24時間 LINE受付中</div>
                  <div className="text-white text-base sm:text-lg font-black">公式LINEから写真添付でかんたん無料相談</div>
                </div>
                <span className="ml-auto text-white/50 group-hover:translate-x-1 transition-transform text-xl shrink-0">→</span>
              </a>

              {/* フォーム */}
              <div className="p-8 sm:p-10">
                {formStatus === "success" ? (
                  <div className="text-center py-14 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <div className="text-5xl mb-4">✅</div>
                    <h5 className="text-xl font-black text-emerald-700 mb-2">送信が完了しました！</h5>
                    <p className="text-sm text-slate-500 font-medium">お問い合わせありがとうございます。内容を確認次第、折り返しご連絡いたします。</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? ""} />

                    {/* お名前 */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
                        お名前 <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="Name"
                        required
                        type="text"
                        placeholder="例：山田 太郎"
                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>

                    {/* メール */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
                        メールアドレス <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="Email"
                        required
                        type="email"
                        placeholder="例：example@mail.com"
                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>

                    {/* 相談内容 */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
                        ご相談内容 <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="Message"
                        required
                        placeholder="例：引越しと不用品買取をセットで相談したい..."
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none placeholder:text-slate-300"
                      />
                    </div>

                    {/* 送信ボタン */}
                    <button
                      type="submit"
                      disabled={formStatus === "loading"}
                      className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                    >
                      {formStatus === "loading" ? "送信中..." : "上記の内容で送信する"}
                    </button>

                    {formStatus === "error" && (
                      <p className="text-center text-xs text-red-500 font-bold pt-1">
                        送信に失敗しました。お手数ですがLINEよりご連絡ください。
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Googleレビューカード */}
            <div
              className="bg-white border-2 border-emerald-400 rounded-3xl p-8 text-center shadow-lg"
              style={{
                transition: "opacity 0.7s ease 0.26s, transform 0.7s ease 0.26s",
                opacity: contactInView ? 1 : 0,
                transform: contactInView ? "translateY(0)" : "translateY(28px)",
              }}
            >
              <h4 className="text-sm font-black text-slate-900 mb-3 tracking-wide">
                ＼ 富山の皆様の信頼を大切にしています ／
              </h4>
              <p className="text-xs text-slate-600 font-medium mb-6 leading-relaxed">
                これまでの実績やお客様からの口コミは、Googleビジネスプロフィールにて公開中です。
                <br />ご依頼前の参考にぜひご覧ください。
              </p>
              <a
                href="https://share.google/Lh1GlId3AZCH9D9NT"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-slate-900 text-white font-black px-8 py-4 rounded-xl hover:bg-emerald-600 transition-all duration-300 shadow-md hover:-translate-y-0.5"
              >
                ⭐ Googleの口コミ・実績を見る
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* LINE フローティングボタン */}
      <a
        href="https://line.me/R/ti/p/@022lhymn"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#06C755] text-white px-5 py-3.5 rounded-full shadow-2xl md:hidden animate-bounce flex items-center gap-2 font-black text-sm"
      >
        <span>💬</span> LINEで相談
      </a>
    </div>
  );
}
