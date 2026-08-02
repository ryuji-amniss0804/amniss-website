"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

function useInView(threshold = 0.06) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function anim(inView: boolean, delay = 0) {
  return {
    style: {
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(22px)",
    },
  };
}

const LINE_URL = "https://lin.ee/845Fdsy";

export default function TopPage() {
  const [heroReady, setHeroReady] = useState(false);
  const [introRef, introInView] = useInView();
  const [movingRef, movingInView] = useInView();
  const [kaitorRef, kaitorInView] = useInView();
  const [iihinRef, iihinInView] = useInView();
  const [storyRef, storyInView] = useInView();

  const [ctaRef, ctaInView] = useInView();

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}>

      {/* ── 1. Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/IMG_1438.JPG"
            alt="re'vive 作業風景"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(27, 67, 50, 0.55)" }} />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-10 text-center pt-20">
          <h1
            className="font-black leading-tight mb-8"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              color: "var(--color-white)",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              transition: "opacity 0.9s ease 200ms, transform 0.9s ease 200ms",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(24px)",
            }}
          >
            今日引越しを決めました。
          </h1>

          <p
            className="mb-3 leading-loose"
            style={{
              fontSize: "1.15rem",
              color: "#ffffff",
              transition: "opacity 0.9s ease 400ms, transform 0.9s ease 400ms",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(20px)",
            }}
          >
            不用品はその場で現金に。
          </p>
          <p
            className="mb-12 leading-loose"
            style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.75)",
              transition: "opacity 0.9s ease 500ms, transform 0.9s ease 500ms",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(20px)",
            }}
          >
            富山県全域・最短当日対応 ｜ re&apos;vive
          </p>

          <div
            style={{
              transition: "opacity 0.9s ease 600ms",
              opacity: heroReady ? 1 : 0,
            }}
          >
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-black text-base sm:text-lg px-8 py-4 rounded-lg mb-8 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              LINEで無料見積もり
            </a>
          </div>

          <p
            className="text-xs"
            style={{
              color: "rgba(240,240,240,0.45)",
              transition: "opacity 0.9s ease 800ms",
              opacity: heroReady ? 1 : 0,
            }}
          >
            富山県SDGs宣言企業 ｜ 古物商許可取得済み
          </p>
        </div>
      </section>

      {/* ── 2. 代表紹介 ── */}
      <section
        className="py-20 sm:py-28"
        ref={introRef as React.RefObject<HTMLElement>}
        style={{ borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-alt)" }}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div {...anim(introInView, 0)} className="shrink-0">
              <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden relative">
                <Image
                  src="/images/face (2).jpg"
                  alt="代表 小川竜司"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 160px, 208px"
                />
              </div>
            </div>
            <div {...anim(introInView, 150)}>
              <h2
                className="text-xl sm:text-2xl font-black mb-5 leading-snug"
                style={{ fontFamily: "'Noto Serif JP', serif" }}
              >
                代表 小川 竜司が直接対応します。
              </h2>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>
                軽貨物運送・せどり4年・eBay輸出の経験から、<br />
                他店で断られたジャンク品・古い精密機器でも<br className="hidden sm:block" />
                価値を見出して高く買い取ります。<br />
                引越しから買取まで、すべて一人で責任を持って対応。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2b. Google口コミ導線 ── */}
      <div style={{ backgroundColor: "var(--color-surface-alt)" }}>
        <div className="max-w-4xl mx-auto px-6 sm:px-8 pb-16">
          <div
            {...anim(introInView, 300)}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: "var(--color-text)" }}>
                富山の皆様の信頼を大切にしています
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                これまでの実績やお客様からの口コミは、<br className="hidden sm:block" />
                Googleビジネスプロフィールにて公開中です。
              </p>
            </div>
            <a
              href="https://share.google/Lh1GlId3AZCH9D9NT"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 text-sm font-bold px-6 py-3 transition-opacity hover:opacity-70"
              style={{
                border: "1px solid var(--color-primary)",
                color: "var(--color-primary)",
              }}
            >
              Googleの口コミ・実績を見る
            </a>
          </div>
        </div>
      </div>

      {/* ── 4. 引越しサービス詳細 ── */}
      <section
        id="moving"
        className="py-20 sm:py-28"
        ref={movingRef as React.RefObject<HTMLElement>}
        style={{ borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div {...anim(movingInView, 0)} className="mb-16">
            <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: "var(--color-primary)" }}>
              Moving
            </p>
            <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              単身引越し
            </h2>
            <div className="w-10 h-0.5" style={{ backgroundColor: "var(--color-primary)" }} />
          </div>

          <div {...anim(movingInView, 80)} className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-20">
            <div className="w-full md:w-1/2 relative aspect-video overflow-hidden">
              <Image
                src="/images/logistics-car.png"
                alt="軽バンによる単身引越し"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: "var(--color-muted)" }}>
                富山県内の単身・小規模引越しに特化。軽バン（エブリイ）で機動力高く対応します。
                引越しのついでに不用品をその場で買取査定。買取額を引越し代から差し引きます。
                最短当日対応・代表が直接伺います。
              </p>
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white font-black text-sm px-6 py-3 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                LINEで無料見積もり
              </a>
            </div>
          </div>

          <div {...anim(movingInView, 120)} className="mb-20">
            <h3 className="text-lg font-black mb-6">料金目安</h3>
            <div style={{ borderTop: "1px solid var(--color-border)" }}>
              {[
                { label: "市内近距離（〜10km）", price: "15,000円〜" },
                { label: "市内中距離（10〜30km）", price: "20,000円〜" },
                { label: "県内遠距離（30km〜）", price: "25,000円〜" },
                { label: "不用品買取セット割引", price: "買取額を引越し代から差引" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <span className="text-sm" style={{ color: "var(--color-text)" }}>{row.label}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>{row.price}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-4" style={{ color: "var(--color-muted)" }}>
              ※ 料金は目安です。荷物量・距離・作業内容により変動します。正確な金額は現地見積もりにてご確認ください。
            </p>
          </div>

          <div {...anim(movingInView, 160)} className="mb-20">
            <h3 className="text-lg font-black mb-6">作業の流れ</h3>
            <div style={{ borderTop: "1px solid var(--color-border)" }}>
              {[
                { step: "01", title: "LINEで相談", desc: "荷物の量・引越し先・希望日をLINEで送ってください。写真があるとスムーズです。" },
                { step: "02", title: "現地見積もり（無料）", desc: "実際に伺って荷物を確認。その場で料金をお伝えします。" },
                { step: "03", title: "引越し当日", desc: "搬出・運搬・搬入を行います。不用品はその場で査定・買取。" },
                { step: "04", title: "買取額を差し引き", desc: "買取額を引越し代から差し引いてお支払いいただきます。" },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-6 py-6"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <span className="text-2xl font-black shrink-0" style={{ color: "var(--color-primary)" }}>
                    {item.step}
                  </span>
                  <div>
                    <p className="font-black mb-1">{item.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div {...anim(movingInView, 200)} className="text-center">
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-black text-base px-10 py-4 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              LINEで引越しを相談する
            </a>
          </div>
        </div>
      </section>

      {/* ── 5. 買取サービス詳細 ── */}
      <section
        id="kaitori"
        className="py-20 sm:py-28"
        ref={kaitorRef as React.RefObject<HTMLElement>}
        style={{ borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-alt)" }}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div {...anim(kaitorInView, 0)} className="mb-16">
            <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: "var(--color-primary)" }}>
              Buying
            </p>
            <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              出張買取
            </h2>
            <div className="w-10 h-0.5" style={{ backgroundColor: "var(--color-primary)" }} />
          </div>

          <div {...anim(kaitorInView, 80)} className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16 mb-20">
            <div className="w-full md:w-1/2 relative aspect-video overflow-hidden">
              <Image
                src="/images/gadgets-clean.png"
                alt="カメラ・PC・家電の出張買取"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: "var(--color-muted)" }}>
                カメラ・PC・家電・ジャンク品を出張査定。
                eBay海外販路があるため、他店で断られた品・壊れた精密機器でも
                価値を見出して高く買い取れるケースが多数あります。
                まずはLINEで写真を送ってください。
              </p>
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white font-black text-sm px-6 py-3 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                LINEで写真を送る
              </a>
            </div>
          </div>

          <div {...anim(kaitorInView, 120)} className="mb-20">
            <h3 className="text-lg font-black mb-6">買取できるもの</h3>
            <div style={{ borderTop: "1px solid var(--color-border)" }}>
              {[
                { item: "デジタルカメラ・レンズ", note: "ジャンク・動作未確認でもOK" },
                { item: "PC・ノートパソコン", note: "壊れていても可" },
                { item: "家電・AV機器", note: "動作品・不動品問わず" },
                { item: "ゲーム機・ソフト", note: "旧型・破損品も相談可" },
                { item: "ベビー用品・日用品", note: "ベビーカー・チャイルドシート・生活雑貨など" },
                { item: "その他精密機器", note: "他店断り品歓迎" },
              ].map((row) => (
                <div
                  key={row.item}
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{row.item}</span>
                  <span className="text-xs" style={{ color: "var(--color-muted)" }}>{row.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div {...anim(kaitorInView, 160)} className="mb-20">
            <h3 className="text-lg font-black mb-6">買取の流れ</h3>
            <div style={{ borderTop: "1px solid var(--color-border)" }}>
              {[
                { step: "01", title: "LINEで写真を送る", desc: "買取希望品の写真をLINEで送ってください。概算金額をすぐにお伝えします。" },
                { step: "02", title: "出張査定（無料）", desc: "ご自宅に伺って実物を確認。正式な買取金額をご提示します。" },
                { step: "03", title: "即日現金お支払い", desc: "金額にご納得いただけたらその場で現金でお支払いします。" },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-6 py-6"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <span className="text-2xl font-black shrink-0" style={{ color: "var(--color-primary)" }}>
                    {item.step}
                  </span>
                  <div>
                    <p className="font-black mb-1">{item.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-4" style={{ color: "var(--color-muted)" }}>
              古物商許可 富山県公安委員会 第501310007877号
            </p>
          </div>

          <div {...anim(kaitorInView, 200)} className="text-center">
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-black text-base px-10 py-4 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              LINEで買取を相談する
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. 遺品整理 ── */}
      <section
        ref={iihinRef as React.RefObject<HTMLElement>}
        style={{ borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div {...anim(iihinInView, 0)} className="mb-12">
            <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: "var(--color-primary)" }}>
              Estate
            </p>
            <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              遺品整理
            </h2>
            <div className="w-10 h-0.5" style={{ backgroundColor: "var(--color-primary)" }} />
          </div>
          <p {...anim(iihinInView, 80)} className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: "var(--color-muted)" }}>
            大切な方の遺品を丁寧に仕分け・買取・処分します。
            現在サービス準備中です。お問い合わせはLINEよりお気軽にどうぞ。
          </p>
          <div
            {...anim(iihinInView, 120)}
            className="py-10 px-8 text-center"
            style={{ border: "1px dashed var(--color-border)" }}
          >
            <p className="text-sm tracking-widest uppercase mb-4" style={{ color: "var(--color-muted)" }}>
              Coming Soon
            </p>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 transition-opacity hover:opacity-70"
              style={{ border: "1px solid var(--color-primary)", color: "var(--color-primary)" }}
            >
              お問い合わせはこちら
            </a>
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section
        className="py-20 sm:py-28"
        ref={storyRef as React.RefObject<HTMLElement>}
        style={{ borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-alt)" }}
      >
        <div className="max-w-3xl mx-auto px-6 sm:px-8">

          <div {...anim(storyInView, 0)} className="mb-16">
            <p
              className="text-xs font-black tracking-widest uppercase mb-2"
              style={{ color: "var(--color-primary)" }}
            >
              Our Vision
            </p>
            <h2
              className="text-2xl sm:text-3xl font-black mb-4"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              捨てられるはずのものを、もう一度世界へ。
            </h2>
            <div className="w-10 h-0.5" style={{ backgroundColor: "var(--color-primary)" }} />
          </div>

          <div
            {...anim(storyInView, 100)}
            className="flex flex-col gap-8 text-sm sm:text-base leading-loose"
            style={{ color: "var(--color-muted)" }}
          >
            <p>
              国内では「ゴミ」として処分されていくものが、海外では誰かが探し続けているものだったりする。壊れたカメラ、古いPC、他店で断られた精密機器。価値があるのに、届く場所がないだけ。
            </p>

            <p
              style={{
                borderLeft: "3px solid var(--color-primary)",
                paddingLeft: "1.25rem",
                color: "var(--color-text)",
                fontWeight: "bold",
              }}
            >
              re&apos;viveは、その橋渡しをする会社です。
            </p>

            <p>
              引越しで出た不用品も、長年眠っていた道具も、誰かの手に渡ることで「ゴミ」ではなくなる。モノを蘇らせることで、お客様の負担を減らし、廃棄物を減らす。
            </p>

            <p>
              富山から、日本の価値あるものを世界へ届ける。<br />
              それが、re&apos;viveのビジョンです。
            </p>

            <p
              className="text-right font-bold"
              style={{ color: "var(--color-text)" }}
            >
              富山県SDGs宣言企業　代表　小川 竜司
            </p>
          </div>

        </div>
      </section>

      {/* ── 5. ギャラリー（Coming Soon） ── */}
      <section
        style={{ borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p
            className="text-xs font-black tracking-widest uppercase mb-2"
            style={{ color: "var(--color-primary)" }}
          >
            Gallery
          </p>
          <h2
            className="text-2xl sm:text-3xl font-black mb-4"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            実際の作業風景
          </h2>
          <p className="text-sm mb-12" style={{ color: "var(--color-muted)" }}>
            現場の写真を準備中です。もうしばらくお待ちください。
          </p>
          <div
            className="py-16 px-8"
            style={{ border: "1px dashed var(--color-border)" }}
          >
            <p
              className="text-sm tracking-widest uppercase"
              style={{ color: "var(--color-muted)" }}
            >
              Coming Soon
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. CTA ── */}
      <section
        className="py-24 sm:py-32 text-center"
        ref={ctaRef as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="max-w-2xl mx-auto px-6 sm:px-8">
          <div {...anim(ctaInView, 0)}>
            <h2
              className="text-2xl sm:text-3xl font-black mb-4 text-white"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              まずはLINEで気軽に相談してください
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-10">
              見積もり無料・写真を送るだけでOK
            </p>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white font-black text-base px-10 py-4 rounded-lg transition-opacity hover:opacity-90"
              style={{ color: "var(--color-primary)" }}
            >
              LINEで相談する
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
