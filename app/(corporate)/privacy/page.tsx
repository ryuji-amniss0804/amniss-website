"use client";

import React, { useState, useEffect, useRef } from "react";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
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

const POLICY_SECTIONS = [
  {
    title: "1. 基本方針",
    content: "AmNiss & Co. Japan（以下「当社」）は、個人情報の保護を重要な責務と認識し、「個人情報の保護に関する法律」に基づき、お客様の個人情報を適切に管理・保護いたします。",
  },
  {
    title: "2. 個人情報の取得と利用目的",
    content: "当社は、以下の目的のために必要な範囲で個人情報を取得し、利用いたします。・単身引越し・不用品回収・買取サービス等の提供・連絡 ・カスタムPC製造、IT/DXソリューション導入に関するご相談・サポート ・お問い合わせに対する回答および資料送付 ・サービス改善のための分析・マーケティング",
  },
  {
    title: "3. 個人情報の管理・安全対策",
    content: "当社は、個人情報の漏洩、紛失、破壊、改ざんを防ぐため、適切なセキュリティ対策を講じます。また、従業者に対しても必要かつ適切な監督を行い、情報の安全管理を徹底いたします。",
  },
  {
    title: "4. 第三者への提供禁止",
    content: "当社は、法令に基づく場合を除き、お客様の同意を得ることなく個人情報を第三者に提供・開示することはいたしません。",
  },
  {
    title: "5. 免責事項",
    content: "当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。",
  },
  {
    title: "6. お問い合わせ先",
    content: "当社のプライバシーポリシーに関するお問い合わせは、お問い合わせフォームまたは公式LINEよりご連絡ください。",
  },
];

export default function PrivacyPolicy() {
  const [ready, setReady] = useState(false);
  const [listRef, listInView] = useInView();
  const [footerRef, footerInView] = useInView();

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 py-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* タイトル */}
        <div
          style={{
            transition: "opacity 0.8s ease 0ms, transform 0.8s ease 0ms",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(28px)",
          }}
          className="mb-10"
        >
          <span className="text-emerald-600 text-xs font-black tracking-widest uppercase block mb-3">
            Privacy Policy
          </span>
          <h1 className="text-4xl font-black text-slate-900 border-b-4 border-emerald-500 pb-6">
            プライバシーポリシー
          </h1>
        </div>

        {/* ポリシーセクション */}
        <div ref={listRef} className="space-y-5 leading-relaxed">
          {POLICY_SECTIONS.map((item, idx) => (
            <section
              key={idx}
              {...anim(listInView, idx * 90)}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 group"
            >
              <h2 className="text-lg font-black mb-4 text-emerald-700 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-black text-emerald-600 group-hover:bg-emerald-100 transition-colors shrink-0">
                  {idx + 1}
                </span>
                {item.title}
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed pl-11">
                {item.content}
              </p>
            </section>
          ))}
        </div>

        {/* フッター */}
        <div
          ref={footerRef}
          {...anim(footerInView, 0)}
          className="mt-16 pt-8 border-t border-slate-200 text-center"
        >
          <p className="text-sm font-black text-slate-800 mb-2">AmNiss & Co. Japan</p>
          <p className="text-xs text-slate-500 font-bold">制定日：2026年5月30日</p>
        </div>
      </div>
    </div>
  );
}
