export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* タイトル：清潔感のあるデザイン */}
        <h1 className="text-4xl font-black mb-12 text-slate-900 border-b-4 border-emerald-500 pb-6">
          プライバシーポリシー
        </h1>
        
        <div className="space-y-12 leading-relaxed">
          {[
            { 
              title: "1. 基本方針", 
              content: "AmNiss & Co. Japan（以下「当社」）は、個人情報の保護を重要な責務と認識し、「個人情報の保護に関する法律」に基づき、お客様の個人情報を適切に管理・保護いたします。" 
            },
            { 
              title: "2. 個人情報の取得と利用目的", 
              content: "当社は、以下の目的のために必要な範囲で個人情報を取得し、利用いたします。・単身引越し・不用品回収・買取サービス等の提供・連絡 ・カスタムPC製造、IT/DXソリューション導入に関するご相談・サポート ・お問い合わせに対する回答および資料送付 ・サービス改善のための分析・マーケティング" 
            },
            { 
              title: "3. 個人情報の管理・安全対策", 
              content: "当社は、個人情報の漏洩、紛失、破壊、改ざんを防ぐため、適切なセキュリティ対策を講じます。また、従業者に対しても必要かつ適切な監督を行い、情報の安全管理を徹底いたします。" 
            },
            { 
              title: "4. 第三者への提供禁止", 
              content: "当社は、法令に基づく場合を除き、お客様の同意を得ることなく個人情報を第三者に提供・開示することはいたしません。" 
            },
            { 
              title: "5. 免責事項", 
              content: "当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。" 
            },
            { 
              title: "6. お問い合わせ先", 
              content: "当社のプライバシーポリシーに関するお問い合わせは、お問い合わせフォームまたは公式LINEよりご連絡ください。" 
            }
          ].map((item, idx) => (
            <section key={idx} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
              <h2 className="text-lg font-black mb-4 text-emerald-700 flex items-center gap-3">
                {item.title}
              </h2>
              <p className="text-slate-600 font-medium">
                {item.content}
              </p>
            </section>
          ))}
        </div>

        {/* 💡 別枠で最後に記載（フッター風の締めくくり） */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm font-black text-slate-800 mb-2">AmNiss & Co. Japan</p>
          <p className="text-xs text-slate-500 font-bold">
            制定日：2026年5月30日
          </p>
        </div>
      </div>
    </div>
  );
}