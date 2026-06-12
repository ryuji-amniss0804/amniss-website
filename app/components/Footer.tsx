import Link from "next/link";

export default function Footer() {
  return (
    <footer 
      id="footer-menu" 
      // ほぼ白に近い背景色、薄いグレーの境界線、文字色は暗めにして視認性を確保
      className="bg-white border-t border-slate-200 text-slate-600 py-16 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
        
        {/* 左カラム：ブランド・信頼性 */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-slate-900 font-black text-xl tracking-widest">AmNiss&Co.Japan</span>
            <span className="block text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1">Reuse & Logistics Group</span>
          </div>
          
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-slate-500 font-bold bg-white px-3 py-1.5 rounded border border-slate-200 inline-block w-fit">
              古物商：富山県公安委員会 第501310007877号
            </span>
            <Link href="/company" className="text-[11px] text-slate-600 hover:text-emerald-600 transition-colors underline decoration-slate-300 underline-offset-4 font-bold">
              会社概要・特定商取引法に基づく表記
            </Link>
            <Link href="/privacy" className="text-[11px] text-slate-600 hover:text-emerald-600 transition-colors underline decoration-slate-300 underline-offset-4 font-bold">
              プライバシーポリシー
            </Link>
          </div>
        </div>

        {/* 中央カラム：ナビゲーション */}
        <div className="flex flex-col gap-4 text-sm font-bold">
          <span className="text-slate-900 text-[10px] font-black tracking-[0.2em] uppercase mb-2">Navigation</span>
          {[
            { name: 'トップページ', href: '/#hero' },
            { name: '単身引越し・運送詳細', href: '/transport' },
            { name: '不用品回収・出張買取詳細', href: '/shucho-kaitori' },
            { name: 'PC販売・IT/DXソリューション', href: '/pc-sales' },
            { name: '会社概要・代表挨拶', href: '/company' },
            { name: '公式ブログ・豆知識', href: '/blog' }
          ].map((item) => (
            <Link key={item.name} href={item.href} className="hover:text-emerald-600 hover:translate-x-1 transition-all flex items-center gap-2 text-slate-600">
              <span className="text-emerald-500">/</span> {item.name}
            </Link>
          ))}
        </div>

        {/* 右カラム：拠点情報 */}
        <div className="text-xs space-y-5">
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">Toyama Base</p>
            <p className="text-slate-900 font-bold">富山県富山市内（配送・買取拠点）</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 text-center text-[10px] text-slate-500 font-bold border-t border-slate-200 pt-8">
        &copy; 2026 AmNiss&Co.Japan. All rights reserved.
      </div>
    </footer>
  );
}