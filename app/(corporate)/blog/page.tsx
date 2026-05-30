"use client";

import React from "react";
// 💡 Next.js専用の高速リンクパーツをインポートします
import Link from "next/link";

const BLOG_POSTS = [
  {
    slug: "jisaku-pc",
    title: "【プロ直伝】自作PC・高級ゲーミングPCを壊さずに引越しする方法！梱包手順と不用パーツ処分・新居のネットワーク設定まで完全解説",
    excerpt: "高性能グラボや水冷クーラー搭載のゲーミングPCを輸送振動から守る完璧な内部梱包5ステップ！元PCショップ店長が教える、余ったパーツの現金化相殺テクニックと新居での即日Wi-Fi無料開通まで徹底解説。",
    date: "2026.05.28",
    category: "ガジェット・引越しノウハウ",
  },
  {
    slug: "how-to-pack",
    title: "【プロが直伝】単身引越しを驚くほど格安＆スムーズに終わらせる荷造り・梱包の裏ワザ5選",
    excerpt: "一人暮らしや単身赴任の方必見！軽バン引越しを限界まで安く抑えるための事前準備と、ダンボールの詰め方のコツを物流のプロが解説。",
    date: "2026.05.28",
    category: "引越し豆知識",
  },
  {
    slug: "toyama-fuyohin-tips",
    title: "【富山密着】不用品回収の費用を限界まで安く抑える5つのコツ！処分と買取を組み合わせる裏ワザとは？",
    excerpt: "富山県内で不用品回収やお片付けを安く抑える基本テクニックに加え、他社が処分とする『壊れたPC・古いカメラ・レトロゲーム』を独自の海外ルートで高価買取し、費用から直接相殺する裏ワザを公開！",
    date: "2026.05.28",
    category: "不用品回収・お片付け",
  },
];

export default function BlogIndex() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 sm:py-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* パンくずリスト */}
        <nav className="text-xs sm:text-sm text-slate-400 mb-6 font-bold">
          {/* 💡 <a> タグから <Link> タグに変更しました */}
          <Link href="/" className="hover:text-blue-600 transition-colors">HOME</Link>
          <span className="mx-2">➔</span>
          <span className="text-slate-600">公式ブログ・豆知識</span>
        </nav>

        {/* ヘッダー */}
        <div className="border-b border-slate-200 pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            AmNiss 総合ブログ & 豆知識
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-2">
            富山のお客様へ届ける、引越し・お片付け・パソコン・DXに関する役立つコンテンツSEOメディアです。
          </p>
        </div>

        {/* 記事一覧リスト */}
        <div className="space-y-8">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.slug} 
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-blue-50 text-blue-600 text-xs font-black px-2.5 py-1 rounded-full">
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
                  className="text-sm font-black text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-1.5"
                >
                  この記事を詳しく読む ➔
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* 💡 追加：トップへ戻るリンク */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
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