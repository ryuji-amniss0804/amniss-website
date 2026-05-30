'use client'; // <-- これを追加！
// components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 backdrop-blur-md bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* 左側：ロゴエリア */}
        <Link href="/" className="flex flex-col group cursor-pointer select-none">
          <span className="text-xl sm:text-2xl font-black tracking-widest text-white group-hover:text-emerald-400 transition-colors">
            AmNiss&Co.Japan
          </span>
          <span className="text-[10px] text-slate-300 tracking-wider font-bold uppercase mt-0.5 group-hover:text-slate-100 transition-colors">
            Reuse & Logistics Group
          </span>
        </Link>

        {/* 中央：PC用公式メニュー */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-200">
          <Link 
  href="/" 
  className="hover:text-emerald-400 transition-colors"
  onClick={() => {
    // どんな状態からでも強制的にトップへ
    window.scrollTo({ top: 0, behavior: 'auto' });
  }}
>
  トップ
</Link>
          <Link href="/transport" className="hover:text-emerald-400 transition-colors">単身引越し</Link>
          <Link href="/shucho-kaitori" className="hover:text-emerald-400 transition-colors">出張買取</Link>
          <Link href="/pc-sales" className="hover:text-emerald-400 transition-colors">PC販売・IT/DX</Link>
          <Link href="/company" className="hover:text-emerald-400 transition-colors">会社概要</Link>
          <Link href="/blog" className="hover:text-emerald-400 transition-colors">ブログ</Link>
        </nav>

        {/* 右側：アクションボタンエリア */}
        <div className="flex items-center gap-4">
          <Link 
            href="/#contact" 
            className="hidden sm:inline-block border border-white/20 hover:bg-white/10 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            ✉️ メール見積もり
          </Link>
          <a href="https://line.me/R/ti/p/@022lhymn" target="_blank" rel="noopener noreferrer" className="bg-[#06C755] hover:bg-[#05b34c] text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl transition-colors shadow-lg whitespace-nowrap">
            💬 LINE総合窓口
          </a>

          {/* スマホ用メニューボタン */}
          <a href="#footer-menu" className="lg:hidden text-white font-black text-xl px-2">
            ≡
          </a>
        </div>
      </div>
    </header>
  );
}