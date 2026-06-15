"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BLOG_POSTS_META } from "@/lib/posts-meta";

function useInView() {
  const ref = useRef<HTMLElement>(null);
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

const BLOG_POSTS = [...BLOG_POSTS_META].sort((a, b) => b.date.localeCompare(a.date));

export default function BlogIndex() {
  const [ready, setReady] = useState(false);
  const [listRef, listInView] = useInView();

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}>

      {/* ページヘッダー */}
      <section
        className="pt-36 pb-16 sm:pt-44 sm:pb-20 px-6"
        style={{ backgroundColor: "var(--color-surface-alt)", borderBottom: "1px solid var(--color-border)" }}
      >
        <div
          className="max-w-4xl mx-auto"
          style={{
            transition: "opacity 0.8s ease 80ms, transform 0.8s ease 80ms",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p
            className="text-xs font-black tracking-widest uppercase mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Official Blog
          </p>
          <h1
            className="text-3xl sm:text-4xl font-black mb-4"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            AmNiss 公式ブログ
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
            富山のお客様へ届ける、引越し・お片付け・パソコン・DXに関する役立つコンテンツです。
          </p>
          <div className="w-10 h-0.5 mt-6" style={{ backgroundColor: "var(--color-primary)" }} />
        </div>
      </section>

      {/* 記事一覧 */}
      <section
        ref={listRef as React.RefObject<HTMLElement>}
        className="py-16 sm:py-24 px-6"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div style={{ borderTop: "1px solid var(--color-border)" }}>
            {BLOG_POSTS.map((post, i) => (
              <article
                key={post.slug}
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  transition: `opacity 0.7s ease ${i * 100}ms, transform 0.7s ease ${i * 100}ms`,
                  opacity: listInView ? 1 : 0,
                  transform: listInView ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10 py-8 group"
                >
                  {/* 日付・カテゴリ */}
                  <div className="shrink-0 sm:w-40">
                    <time
                      className="text-xs font-bold block mb-1"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {post.date}
                    </time>
                    <span
                      className="text-xs font-black"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* タイトル・抜粋 */}
                  <div className="flex-1 min-w-0">
                    <h2
                      className="font-black text-base sm:text-lg leading-snug mb-2 group-hover:opacity-60 transition-opacity"
                      style={{ color: "var(--color-text)" }}
                    >
                      {post.title}
                    </h2>
                    <p
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
