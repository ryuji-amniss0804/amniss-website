"use client";

import React, { useState, useEffect, useRef } from "react";
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
      transform: inView ? "translateY(0)" : "translateY(24px)",
    },
  };
}

const BLOG_POSTS = [...BLOG_POSTS_META].sort((a, b) => b.date.localeCompare(a.date));

export default function BlogIndex() {
  const [ready, setReady] = useState(false);
  const [cardsRef, cardsInView] = useInView();

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-16 sm:py-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* パンくずリスト */}
        <nav
          style={{
            transition: "opacity 0.6s ease 0ms",
            opacity: ready ? 1 : 0,
          }}
          className="text-xs sm:text-sm text-slate-400 mb-6 font-bold"
        >
          <Link href="/" className="hover:text-blue-600 transition-colors">HOME</Link>
          <span className="mx-2">➔</span>
          <span className="text-slate-600">公式ブログ・豆知識</span>
        </nav>

        {/* ヘッダー */}
        <div
          style={{
            transition: "opacity 0.8s ease 80ms, transform 0.8s ease 80ms",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(24px)",
          }}
          className="border-b border-slate-200 pb-8 mb-12"
        >
          <span className="text-blue-600 text-xs font-black tracking-widest uppercase block mb-2">
            Official Blog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            AmNiss 総合ブログ & 豆知識
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-2">
            富山のお客様へ届ける、引越し・お片付け・パソコン・DXに関する役立つコンテンツSEOメディアです。
          </p>
          <div className="w-12 h-1 bg-blue-500 mt-4 rounded-full" />
        </div>

        {/* 記事一覧リスト */}
        <div ref={cardsRef} className="space-y-8">
          {BLOG_POSTS.map((post, i) => (
            <article
              key={post.slug}
              {...anim(cardsInView, i * 130)}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-400 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`${post.accent} text-xs font-black px-2.5 py-1 rounded-full`}>
                    {post.category}
                  </span>
                  <time className="text-xs font-bold text-slate-400">{post.date}</time>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed font-medium mb-6">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-black text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-1.5 group/link"
                >
                  この記事を詳しく読む
                  <span className="group-hover/link:translate-x-1 transition-transform inline-block">➔</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* トップへ戻るリンク */}
        <div
          style={{
            transition: "opacity 0.8s ease 400ms",
            opacity: cardsInView ? 1 : 0,
          }}
          className="text-center mt-16 pt-8 border-t border-slate-200"
        >
          <Link
            href="/"
            className="text-sm font-black text-slate-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            ➔ トップページへ戻る
          </Link>
        </div>

      </div>
    </div>
  );
}
