import React from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "会社概要・代表挨拶・企業理念 | AmNiss & Co. Japan",
  description: "IT、物流、リユースの融合で富山の暮らしをスマートにするAmNiss & Co. Japanの会社概要・代表メッセージ・企業理念のページです。",
};

export default function CompanyPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16 md:pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ページヘッダー */}
        <div className="text-center mb-16">
          <span className="text-emerald-600 text-sm font-black tracking-widest uppercase block mb-2">
            COMPANY PROFILE
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            会社概要・代表挨拶
          </h1>
          <div className="w-12 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* ─── セクション1：代表挨拶 ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* 左側：代表写真 ＆ 肩書き・名前 */}
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8 flex flex-col items-center md:items-start text-center md:text-left">
              
              {/* 代表写真枠（Tailwind v4 標準の max-w-50 で警告をクリーンアップ！） */}
              <div className="w-full max-w-50 md:max-w-full aspect-3/4 bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200 mb-6 shadow-xs">
                <Image
                  src="/images/face (2).jpg"
                  alt="代表：小川 竜司"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 200px, 260px"
                  priority
                  unoptimized
                />
              </div>

              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                AmNiss & Co. Japan
              </span>
              <span className="text-sm font-bold text-emerald-600 block mb-2">
                代 表
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-wide mb-4">
                小川 竜司
              </h2>
              <p className="text-xs font-bold text-slate-400 leading-relaxed">
                自らPCリユース・EC物販事業を立ち上げ、パーツ選定から初期設定、カスタムPCのビルドまでを実践の中で深く検証。物流×ITのノウハウを融合した独自のワンストップサービスを形にする。
              </p>
            </div>

            {/* 右側：挨拶本文 */}
            <div className="md:col-span-2 space-y-6 text-slate-600 text-sm md:text-base leading-relaxed font-medium pt-4 md:pt-0">
              <h3 className="text-lg md:text-xl font-black text-slate-900 leading-snug">
                「物流 × IT × リユース」で、<br className="sm:hidden" />
                富山の暮らしとビジネスを、どこよりもスマートに。
              </h3>
              <p>
                はじめまして、代表の小川 竜司です。
              </p>
              <p>
                現代のライフスタイルやビジネスにおいて、引越しや不用品の処分、新居・オフィスでの通信環境の整備は、誰もが直面する「大きな負担」です。多くの場合、それぞれの専門業者へ個別に連絡を取り、調整しなければなりません。
              </p>
              <p>
                私自身、これまでパソコンの組み立てや内部コンポーネントの選定、ネットショップの運用、精度を追求したカスタムPCビルド、そして軽貨物の運送業務まで、様々な現場を経験し、学びながら形にしてきました。だからこそ、お客様やビジネスパートナー様がどこで迷い、どこで「面倒くさい」と感じるのかが痛いほどよく分かります。
              </p>
              <p>
                AmNissはその経験をすべて1つに統合しました。軽貨物物流の機動力に加え、不要品を自社のルートで賢く現金化するリユース力、保持するEC販路、親身で丁寧なトータルサポート、そして面倒なネットワーク設定まで、<strong className="text-slate-900">「窓口を一本化することで、個人・法人を問わず、あらゆる複雑な課題をスマートに完結させるソリューション」</strong>を提供しています。
              </p>
              <p>
                私たちのフットワークの軽さと、丁寧な対話でお客様に寄り添い、富山の皆様の新生活やビジネスシーンをどこよりも誠実かつスマートに応援することをお約束いたします。
              </p>
            </div>
          </div>
        </section>


        {/* ─── 💡 新設セクション2：企業理念・3大クレド（白ベース） ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80 mb-12">
          <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block" />
            企業理念
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider pl-4 mb-8">
            Our Core Mission & Values
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 理念1 */}
            <div className="bg-slate-50/60 rounded-2xl p-6 border border-slate-100">
              <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center font-black text-sm text-emerald-700 mb-4">
                01
              </div>
              <h4 className="font-black text-slate-900 text-base mb-2 tracking-wide">
                不便の「全解決」をワンストップで
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                引越し・片付け・PC設定など、新生活やビジネスの転換期に生じる面倒なタスクを分断せず、一括で解決。お客様の時間とコストを徹底的に守ります。
              </p>
            </div>

            {/* 理念2 */}
            <div className="bg-slate-50/60 rounded-2xl p-6 border border-slate-100">
              <div className="w-9 h-9 bg-cyan-50 border border-cyan-100 rounded-lg flex items-center justify-center font-black text-sm text-cyan-700 mb-4">
                02
              </div>
              <h4 className="font-black text-slate-900 text-base mb-2 tracking-wide">
                独自の再販網で「価値」を還流する
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                眠っているガジェットやパーツ、不要になった家財に強固なEC販売網で新たな価値を付与。処分ではなく次世代へ繋ぐ「誠実なリユース」を徹底します。
              </p>
            </div>

            {/* 理念3 */}
            <div className="bg-slate-50/60 rounded-2xl p-6 border border-slate-100">
              <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center font-black text-sm text-blue-700 mb-4">
                03
              </div>
              <h4 className="font-black text-slate-900 text-base mb-2 tracking-wide">
                富山の暮らしをIT×物流で最適化
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                軽貨物の機動力と、Python等による自動化・カスタムPCビルドのIT力を融合。地域密着でありながら、一歩先を行くスマートな仕組みを提供し続けます。
              </p>
            </div>

          </div>
        </section>


        {/* ─── セクション3：会社概要（テーブル） ─── */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-slate-200/80">
          <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block" />
            事業概要
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider pl-4 mb-8">
            Company Overview
          </p>

          <div className="border-t border-slate-200 divide-y divide-slate-100 text-sm md:text-base">
            
            {/* 商号 */}
            <div className="grid grid-cols-1 md:grid-cols-4 py-5 gap-2 md:gap-4">
              <div className="font-black text-slate-900 md:col-span-1">商号 / 屋号</div>
              <div className="text-slate-600 font-medium md:col-span-3">AmNiss & Co. Japan（アムニス・アンド・カンパニー・ジャパン）</div>
            </div>

            {/* 代表者 */}
            <div className="grid grid-cols-1 md:grid-cols-4 py-5 gap-2 md:gap-4">
              <div className="font-black text-slate-900 md:col-span-1">代表者</div>
              <div className="text-slate-600 font-medium md:col-span-3">小川 竜司</div>
            </div>

            {/* 本社所在地 */}
            <div className="grid grid-cols-1 md:grid-cols-4 py-5 gap-2 md:gap-4">
              <div className="font-black text-slate-900 md:col-span-1">本社所在地</div>
              <div className="text-slate-600 font-medium md:col-span-3">
                〒150-0043<br />
                東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル2F−C
              </div>
            </div>

            {/* 富山ベース */}
            <div className="grid grid-cols-1 md:grid-cols-4 py-5 gap-2 md:gap-4">
              <div className="font-black text-slate-900 md:col-span-1">富山営業所・物流センター</div>
              <div className="text-slate-600 font-medium md:col-span-3">
                富山県富山市内（※実務・車庫・在庫仕分け拠点）<br />
                <span className="text-xs text-slate-400 font-bold">※地域密着の出張対応、および富山発着の軽貨物運送の拠点となります。</span>
              </div>
            </div>

            {/* 事業内容 */}
            <div className="grid grid-cols-1 md:grid-cols-4 py-5 gap-2 md:gap-4">
              <div className="font-black text-slate-900 md:col-span-1">事業内容</div>
              <div className="text-slate-600 font-medium md:col-span-3">
                <ul className="list-disc pl-4 space-y-1">
                  <li>単身引越し・緊急配送・貨物軽自動車運送事業（A.P.C LOGISTICS）</li>
                  <li>不用品回収・お片付け・出張買取事業（re&apos;vive）</li>
                  <li>
                    BTO・ゲーミングPCおよびカスタムPCの受注製造・販売<br />
                    <span className="text-xs text-emerald-600 font-black">※お客様のご予算や用途（ゲーム・配信・動画編集など）に合わせて、パーツ選定から組み立て・初期設定まで完全オーダーメイドで対応。</span>
                  </li>
                  <li>パソコン・IT周辺機器・ゲーミングPCのパーツ買取およびリユース販売</li>
                  <li>個人・店舗向けITサポート、ネットワークインフラ構築支援</li>
                </ul>
              </div>
            </div>

            {/* 各種許認可 */}
            <div className="grid grid-cols-1 md:grid-cols-4 py-5 gap-2 md:gap-4">
              <div className="font-black text-slate-900 md:col-span-1">各種許認可・届出</div>
              <div className="text-slate-600 font-medium md:col-span-3 space-y-1">
                <div>• 貨物軽自動車運送事業 届出済</div>
                <div>• 富山県公安委員会 古物商許可 第501310001234号</div>
              </div>
            </div>

          </div>
        </section>

        {/* トップに戻るリンク */}
        <div className="text-center mt-12">
          <Link href="/" className="text-sm font-black text-slate-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1">
            ➔ トップページへ戻る
          </Link>
        </div>

      </div>
    </div>
  );
}