"use client";

import React from "react";
import Link from "next/link";

export default function PersonalComputerRelocationSeoBlog() {
  return (
    // 💡 外側の黒を完全にシャットアウトし、画面を100%真っ白なブログ紙面にします
    <div className="w-full bg-white text-slate-800 min-h-screen">
      <article className="max-w-4xl mx-auto px-4 py-12 bg-white text-slate-800 antialiased font-medium leading-relaxed">
        
        {/* パンくずナビ */}
        <nav className="text-xs sm:text-sm text-slate-400 mb-8 font-bold">
          <Link href="/" className="hover:text-blue-600 transition-colors">HOME</Link>
          <span className="mx-2">➔</span>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">公式ブログ</Link>
          <span className="mx-2">➔</span>
          <span className="text-slate-500 truncate">自作PC・ゲーミングPCを壊さずに引越しする方法</span>
        </nav>

        {/* ヘッダー */}
        <header className="mb-12 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              ガジェット・引越しノウハウ
            </span>
            <time className="text-sm font-bold text-slate-400">2026.05.28</time>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            【プロ直伝】自作PC・高級ゲーミングPCを壊さずに引越しする方法！梱包手順と不用パーツ処分・新居のネットワーク設定まで完全解説
          </h1>
          <p className="text-base md:text-lg text-slate-600 font-medium">
            「大事な自作PCや、数十万円したゲーミングPCを引越しで壊されたくない…」「引越しを機に古いパーツや壊れたカメラ、レトロゲームを一括で処分したいけれど、どうすればいい？」そんなお悩みを抱えていませんか？精密機器であるパソコンは、一般的な荷物と同じ感覚で梱包すると、輸送時の振動で内部パーツが破損する致命的なリスクがあります。本記事では、プロのITエンジニアであり物流のスペシャリストでもある視点から、PCを安全に運ぶための完璧な梱包手順、不要なジャンクパーツの賢い売却法、安全な配送手段の選び方までを網羅して余すことなく解説します！
          </p>
        </header>

        {/* 導入おすすめリスト */}
        <div className="mb-12">
          <div className="bg-slate-50 border-l-4 border-blue-600 p-6 rounded-r-3xl mb-8">
            <h2 className="text-lg font-black text-slate-900 mb-2">この記事は以下のような方におすすめです</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 font-bold">
              <li>グラフィックボードや大型CPUクーラーを搭載した自作PC・ゲーミングPCを安全に運びたい方</li>
              <li>引越し業者に「パソコンは補償対象外」「自分で運んでください」と言われて困っている方</li>
              <li>部屋の片付けで出てきた「古いPC」「故障したカメラ」「レトロゲーム」を高く売りたい方</li>
              <li>新居に引っ越した初日から、面倒なWi-Fi設定やPC初期設定をトラブルなく終わらせたい方</li>
            </ul>
          </div>
        </div>

        {/* 目次 */}
        <nav className="mb-12 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <span>📚</span> 目次
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-slate-700 font-bold">
            <li><a href="#section1" className="hover:text-blue-600 transition-colors">1. なぜ危険？引越しで自作PC・ゲーミングPCが壊れる2大原因</a></li>
            <li><a href="#section2" className="hover:text-blue-600 transition-colors">2. プロが実践する「完璧なパソコン梱包手順」5ステップ</a></li>
            <li><a href="#section3" className="hover:text-blue-600 transition-colors">3. 引越し業者の選び方：一般業者と単身向け格安配送の比較</a></li>
            <li><a href="#section4" className="hover:text-blue-600 transition-colors">4. 荷造りと同時にやりたい！古いPC・ジャンクパーツのスマートな断捨離法</a></li>
            <li><a href="#section5" className="hover:text-blue-600 transition-colors">5. 新居でのトラブル回避！PC設置とネットワーク開通の注意点</a></li>
            <li><a href="#summary" className="hover:text-blue-600 transition-colors">まとめ：AmNiss＆Co.Japanが提案する最強のワンストップ引越しソリューション</a></li>
          </ol>
        </nav>

        {/* ─── 各セクション内容（完全PC特化リライト版） ─── */}
        
        {/* 1章 */}
        <section id="section1" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-blue-600">01</span> なぜ危険？引越しで自作PC・ゲーミングPCが壊れる2大原因
          </h2>
          <p className="text-base text-slate-600 mb-4">
            デスクトップPC、特に独自にカスタマイズされた自作PCや大型のゲーミングPCは、一般的な家電製品の中でも群を抜いてデリケートです。「壊れやすい精密機器だから、プチプチで外側をたくさん巻けば大丈夫」と考えていたら大間違い。実は、引越し輸送中にデスクトップPCが壊れる原因のほとんどは、外からの衝撃ではなく<b>「ケースの内部」</b>で発生しています。主な原因は以下の2点に集約されます。
          </p>
          <h3 className="text-lg font-black text-slate-800 mt-6 mb-2">原因①：重量級グラフィックボード（GPU）の自重によるマザーボードの破断</h3>
          <p className="text-base text-slate-600 mb-4">
            近年の高性能グラフィックボード（GeForce RTX 4070、4080、4090など）は、トリプルファンや巨大なヒートシンクを搭載しており、総重量が1.5kg〜2kgを超えるものが当たり前になっています。
          </p>
          <p className="text-base text-slate-600 mb-4">
            これらの重量級パーツは、マザーボードの「PCI Expressスロット」というわずか数センチのプラスチック基盤の隙間に挿し込まれ、ケース背面のネジ数本だけで支えられています。トラックが走行中に道路の段差を乗り越えたり、急ブレーキをかけたりした際、上下一方向への激しいG（重力・縦揺れ）がかかることで、<b>スロットが根こそぎ引きちぎれたり、マザーボードの基盤に目に見えないクラック（ひび割れ）が入り、一瞬で通電しなくなる</b>という致命的な破損事故が多発しています。
          </p>
          <h3 className="text-lg font-black text-slate-800 mt-6 mb-2">原因②：超大型CPUクーラーの脱落、および簡易水冷の液漏れ</h3>
          <p className="text-base text-slate-600 mb-4">
            CPUを冷やすための大型空冷クーラー（重量のある金属製ヒートシンク）も同様です。横揺れや縦揺れの振動が続くことで、マザーボードを固定しているネジ山が歪み、固定金具ごと脱落してケース内部で暴れ回り、他のパーツを巻き込んで全損させるリスクがあります。
          </p>
          <p className="text-base text-slate-600 mb-4">
            また、トレンドである「簡易水冷クーラー（AIO）」の場合はさらに深刻です。持続的な細かい振動によってチューブの継ぎ目やラジエーターの接続部に目に見えない隙間が生まれ、新居で電源を入れた瞬間に<b>冷却液がブシャッと漏れ出してマザーボードや電源ユニットを直撃、ショートして火花が散る</b>という最悪のケースも実際に報告されています。
          </p>
        </section>

        {/* 2章 */}
        <section id="section2" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-blue-600">02</span> プロが実践する「完璧なパソコン梱包手順」5ステップ
          </h2>
          <p className="text-base text-slate-600 mb-4">
            このような内部破損のリスクを100%回避するためには、梱包の段階で正しい「内部対策」を行う必要があります。元PCショップ店長であり、パソコンの内部構造を知り尽くしたプロが実践している完璧なパッキング手順がこちらです。
          </p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
            <h3 className="text-base font-black text-slate-900 mb-4">📝 PC梱包の5ステップチェックリスト</h3>
            <ol className="list-decimal pl-5 space-y-4 text-sm text-slate-600 font-bold">
              <li>
                <span className="text-slate-900 text-base block mb-0.5">データのフルバックアップと完全シャットダウン</span>
                <p className="font-medium text-xs sm:text-sm text-slate-500">
                  万が一のOS破損に備え、最重要データは外付けSSDやクラウドストレージ（GoogleドライブやOneDriveなど）に必ず退避させてください。その後シャットダウンし、背面にある電源ユニットの主電源スイッチ（○と｜のスイッチ）を「○（OFF）」にしてから、コンセントや各種ケーブルをすべて引き抜きます。
                </p>
              </li>
              <li>
                <span className="text-slate-900 text-base block mb-0.5">グラフィックボードの取り外し（最重要作業！）</span>
                <p className="font-medium text-xs sm:text-sm text-slate-500">
                  PCケースのサイドガラス、またはサイドパネルを取り外し、グラフィックボードをマザーボードから完全に抜き取ってください。これが最強の防衛策です。外したグラフィックボードは「静電気防止袋」に入れ、プチプチ（エアキャップ）で厚さ5cm以上になるよう厳重に包み、PC本体とは別の小さな箱に入れて手荷物として運ぶか、新居まで衝撃が当たらないように個別に保護・管理してください。
                </p>
              </li>
              <li>
                <span className="text-slate-900 text-base block mb-0.5">ケース内部の空隙（デッドスペース）養生</span>
                <p className="font-medium text-xs sm:text-sm text-slate-500">
                  グラフィックボードを抜いた後のケース内部ですが、もし大型の空冷CPUクーラーや長い水冷チューブがある場合は、ケース内の空きスペースに「静電気の起きにくい不織布」や「専用のエアバッグ」、あるいはパーツに直接触れないよう細心の注意を払って「プチプチ」を優しく詰めてください。これにより、輸送時の細かな振動によるCPUクーラーやその他内部パーツの揺れを物理的にピタッと抑え込むことができます。
                </p>
              </li>
              <li>
                <span className="text-slate-900 text-base block mb-0.5">「元箱」と専用緩衝材による外部保護</span>
                <p className="font-medium text-xs sm:text-sm text-slate-500">
                  PCケースを包む際、一番安全なのは「ケース購入時の元箱と発泡スチロール」です。もし処分してしまっている場合は、一回り大きな頑丈なダンボールを用意し、底面と側面に厚さ5cm以上のプチプチを敷き詰めてクッションを作ります。PC本体を縦型（通常の設置スタイル）のまま入れ、隙間が一切なくなるまで緩衝材を隙間なく敷き詰めます。
                </p>
              </li>
              <li>
                <span className="text-slate-900 text-base block mb-0.5">外箱への「精密機器・天地無用」のデカデカ明記</span>
                <p className="font-medium text-xs sm:text-sm text-slate-500">
                  ダンボールを閉じたら、運送スタッフがひと目で超デリケートな荷物だと判別できるよう、マジックで大きく「精密機器」「天地無用（この面を上に）」「水濡れ厳禁」「ガラスパネルあり」と目立つように書き入れます。
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* 3章 */}
        <section id="section3" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-blue-600">03</span> 引越し業者の選び方：一般業者と単身向け格安配送の比較
          </h2>
          <p className="text-base text-slate-600 mb-4">
            どれだけ自分自身で梱包を完璧に仕上げても、それを運ぶ「業者の選び方」を間違えると、すべてが水の泡になってしまうことがあります。
          </p>
          <p className="text-base text-slate-600 mb-4">
            大手の引越し業者の一般的なプラン（混載便など）に依頼する場合、約款（契約ルール）の中に<b>「パソコンの内部破損・データ消失は補償対象外」</b>とハッキリ明記されているケースがほとんどです。「外箱のダンボールにボコッと穴が空くほどの外傷」がない限り、新居で画面が映らなくなっても一切弁償してもらえません。また、巨大なトラックに何十件もの家財と一緒にギチギチに積み重ねられ、何度も積み替えが行われるため、精密マシンにとっては非常に過酷な環境となります。
          </p>
          <p className="text-base text-slate-600 mb-6">
            そこでおすすめなのが、1台の車両をあなたのためだけに丸ごと貸し切る<b>「軽バン（チャーター便）による単身引越し」</b>です。他の人の荷物と混ざらず、積み替えの衝撃もゼロ。自分の荷物だけを丁寧に固定してダイレクトに新居へ運べるため、ハイスペックPCを運ぶならこれ以上ない最適な配送手段となります。
          </p>

          <div className="overflow-x-auto mb-6 rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-black">
                  <th className="p-4 w-1/4">比較項目</th>
                  <th className="p-4 w-3/8">大手引越し業者（一般的な混載便）</th>
                  <th className="p-4 w-3/8">軽バン貸切チャーター（単身引越し）</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 font-medium">
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50">PCの取り扱い</td>
                  <td className="p-4">他の家財と混載。コンテナ内での高積みや、拠点での積み替えによる強い衝撃リスクあり。</td>
                  <td className="p-4 text-blue-600 font-bold">完全貸切。助手席や一番揺れの少ないフロア床面に単独で配置し、毛布等で超厳重に固定。</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50">万が一の補償</td>
                  <td className="p-4">「外箱が無傷な場合の内部故障（起動しない等）」は、経年劣化とみなされ補償されないケースが大。</td>
                  <td className="p-4 text-slate-700">運送責任保険が適用されやすく、貸切のため責任の所在が100%明確。</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50">料金目安（単身）</td>
                  <td className="p-4">30,000円〜80,000円（春先の繁忙期などは基本料金が数倍に跳ね上がる）</td>
                  <td className="p-4 text-emerald-600 font-bold">12,100円〜（移動距離に応じた完全定額制で、時期による価格の吊り上げなし）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4章 */}
        <section id="section4" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-blue-600">04</span> 荷造りと同時にやりたい！古いPC・ジャンクパーツのスマートな断捨離法
          </h2>
          <p className="text-base text-slate-600 mb-4">
            引越しの荷造りを進めていると、クローゼットや押し入れの奥から<b>「5年前に使っていた古いデスクトップPC」「アップグレードした時に余った古いマザーボード、引き抜いた古いグラフィックボード、余剰メモリなどのパーツ類」「レンズにカビが生えた古い一眼レフカメラ」「学生時代に遊んだレトロゲーム機やソフト」</b>などが大量に出てきて、作業の手が止まってしまったことはありませんか？
          </p>
          <p className="text-base text-slate-600 mb-4">
            「いつかサブ機を組むかも…」とこれらをそのまま新居へ持っていってしまうと、引越しトラックの荷台容積を無駄に圧迫し、引越し基本料金が高くなる原因になります。しかし、いざ捨てようとしても、パソコンは「資源有効利用促進法（パソコンリサイクル法）」があるため自治体の普通の不燃ゴミとしては回収してもらえず、メーカーに連絡して数千円の処分リサイクル券を購入するなど、膨大な時間と手間がかかります。
          </p>
          
          <div className="bg-blue-50/60 border-l-4 border-emerald-500 p-6 rounded-r-3xl my-6">
            <h3 className="text-base font-black text-slate-900 mb-2">💡 知らなきゃ損：他社が「ゴミ」と判定するジャンクパーツは、海外ルートなら「宝物」</h3>
            <p className="text-sm text-slate-600">
              日本国内の一般的なリサイクルショップに「電源の入らない古いPC」や「動作未確認のジャンクパーツ」を持っていっても、査定額は0円、もしくは数百円の引き取り手数料を取られるのがオチです。
            </p>
            <p className="text-sm text-slate-600 mt-2">
              しかし、<b>アジアや中東、アフリカといったグローバルな海外市場に目を向けると、日本の型落ち精密機器や壊れたカメラ、レトロゲームは、修理用の補修パーツやコレクターズアイテムとして「凄まじい高値」で取引されています。</b>これらの強力な海外直販ルートを自社で直接持っている「出張買取専門サービス」に荷造りと同時に依頼すれば、面倒な廃棄手続きをすべてスキップできるだけでなく、不用品をその場でガッツリ現金化して、引越し費用を大幅に相殺・マイナスさせることが可能になります。
            </p>
          </div>
        </section>

        {/* 5章 */}
        <section id="section5" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-blue-600">05</span> 新居でのトラブル回避！PC設置とネットワーク開通の注意点
          </h2>
          <p className="text-base text-slate-600 mb-4">
            無事に新居へ引越し荷物が搬入された後も、すぐにPCの電源コンセントを挿して起動させるのは絶対にやめてください。
          </p>
          <p className="text-base text-slate-600 mb-4">
            特に冬場や雨の日の引越しの場合、トラックの荷台と暖かい新居の室内の温度差により、<b>PCケース内部の金属パーツや基盤に「結露（細かい水滴）」が発生している可能性</b>が非常に高いです。水分がついたまま通電させると、一瞬でバチッとショートしてマザーボードやCPU、高額なグラフィックボードが物理的に全損します。新居に運び込んだら、まずは部屋の温度に馴染むまで最低でも1〜2時間はそのまま放置してください。その後、内部の緩衝材を優しく取り除き、グラフィックボードを再度カチッと慎重に装着し、各種内部配線に輸送時の緩みがないか指先で軽くチェックしてから電源を入れましょう。
          </p>
          <p className="text-base text-slate-600 mb-4">
            さらに、引越し当日に10人中9人が頭を抱えてパニックになるのが<b>「新居でのインターネット（Wi-Fi）の初期設定」</b>です。
          </p>
          <p className="text-base text-slate-600 mb-4">
            光回線のONU（回線終端装置）とWi-FiルーターをどのLANポートに繋げばいいのか、プロバイダから届いた契約書類（ID・パスワード）をルーターの管理画面にどう入力すれば認証が開通するのか。これらはITの専門知識がないと非常に難解で、スマホのテザリングだけでしのいでギガが枯渇したり、開通まで数日間ネット難民になるケースが後を絶ちません。在宅ワーカーやPCゲーマーにとって、新居ですぐにネットが繋がらない環境は死活問題となります。
          </p>
        </section>

        {/* ─── まとめセクション ─── */}
        <section id="summary" className="mt-16 pt-8 border-t-2 border-slate-200 scroll-mt-6">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
            まとめ：AmNiss＆Co.Japanが提案する最強のワンストップ引越しソリューション
          </h2>
          <p className="text-base text-slate-600 mb-6">
            大切な自作PCを壊さないための厳重な取り外しと梱包、最適な格安配送業者の手配、部屋の奥から出てきた古いジャンクパーツの処分、軽量かつ安全な運搬、そして新居での面倒極まるWi-Fi・ルーターのネット初期設定……。これらをすべて別々の業者（引越し屋、リサイクルショップ、IT出張サポート）に手配して、スケジュール調整や立ち会いを何度も行うのは、気が遠くなるほどの労力と無駄な出費がかかります。
          </p>
          <p className="text-base text-slate-600 mb-8">
            私たち<b>AmNiss & Co. Japan</b>グループは、富山のお客様、そして全国のガジェット愛好家・自作PCユーザーの皆様の負担を完全にゼロにするため、業界で唯一の<b>「物流（単身引越し）× 買取（リユース）× ITサポート」</b>を完全に一つに統合した、隙のない最強のワンストッププランをご提供しています。
          </p>
          
          {/* 当店だけの3大特典 */}
          <div className="bg-slate-50 border border-blue-200 rounded-3xl p-6 sm:p-8 mb-8 text-left">
            <h3 className="text-lg font-black text-slate-900 text-center mb-6">
              🎉 他の引越し業者には絶対に真似できない「当店だけの3大ワンストップ特典」
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 bg-blue-600 text-white font-black rounded-full flex items-center justify-center text-lg">1</div>
                <div>
                  <h4 className="text-base font-black text-slate-900 mb-1">【A.P.C LOGISTICS】軽バン（エブリイ）貸切の格安単身引越し</h4>
                  <p className="text-sm text-slate-600">
                    荷物の少ない単身赴任・一人暮らしの方や、PCを最優先で傷つけずに運びたい方に最適な、軽バン（スズキ・エブリイ）チャーター便を<b>12,100円〜</b>という地域最安級の爆安定額料金でご提供。完全貸切便のため積み替えがなく、元PC店長のドライバーが、お預かりした大切なPCをクッションで包み、一番揺れの少ない特等席へ固定して新居へダイレクトにお届けします。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 bg-emerald-600 text-white font-black rounded-full flex items-center justify-center text-lg">2</div>
                <div>
                  <h4 className="text-base font-black text-slate-900 mb-1">【re&apos;vive】他社が断る「古いPC・ジャンク・レトロゲーム」の高価買取＆引越し代金相殺</h4>
                  <p className="text-sm text-slate-600">
                    一般的な不用品回収業者なら「廃棄手数料」を取られるような、10年前の古いパソコン、動作未確認のパーツ、液晶割れのモニター、壊れたカメラ、数十年前のレトロゲームなどを独自の強力な海外直販ルートを駆使してどこよりも高く査定・出張買取！算出された買取額は、その場で<b>今回の引越し料金やお片付け費用から直接引き算（相殺割引）</b>するため、実質手出し0円以下での引越しも十分可能です。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 bg-purple-600 text-white font-black rounded-full flex items-center justify-center text-lg">3</div>
                <div>
                  <h4 className="text-base font-black text-slate-900 mb-1">【ITサポート】新居でのWi-Fi開通設定・デスクトップPCの配線起動が「完全無料」</h4>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/50">
                    💡 物流とITの両方に精通した当グループ最大の目玉サービス！お荷物をお届けしたその場で、新居のWi-Fiルーターの開通認証設定、取り外したグラフィックボードの再装着、PCの配線・起動確認、ネットへの接続テストまでを<b>【完全無料（0円）】</b>で代行いたします！通常なら出張設定業者に頼んで15,000円〜20,000円はかかるプロのサポートがコミコミのため、新居に届いたその日の初夜から、すぐに快適な爆速ネット環境（オンラインゲームやリモートワーク）へ復帰していただけます。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 強力なCTAエリア（LINE窓口誘導） */}
          <div className="text-center bg-linear-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl md:text-2xl font-black mb-3">【相談・査定0円】LINEでお写真をお送りください！</h3>
            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl mx-auto mb-6">
              「このスペックの古いPCや、余ったグラボは売れる？」「壊れたカメラとレトロゲームが山ほどあるけど引き取れる？」「引越しとWi-Fi設定をまとめて頼むといくらになる？」など、どんな些細な疑問もLINEから写真をお送りいただくだけで、代表の小川が即座にお答え・無料査定いたします。しつこい営業は一切ありませんので、お気軽に友だち追加してください！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/kaitori" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-black px-8 py-4 rounded-xl text-sm transition-all shadow-md">
                🔍 詳しい出張買取メニューを見る
              </Link>
              <a href="https://line.me/R/ti/p/@022lhymn" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[#06C755] hover:bg-[#05b34c] text-white font-black px-8 py-4 rounded-xl text-sm transition-all shadow-md">
                💬 LINEで写真を送って無料査定
              </a>
            </div>
          </div>
        </section>

      </article>
    </div>
  );
}