"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ToyamaFuyohinTips() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <article className="max-w-4xl mx-auto px-4 pt-28 pb-12 antialiased font-medium leading-relaxed">

        {/* ナビゲーション（パンくず） */}
        <nav
          className="text-xs sm:text-sm mb-8 font-bold"
          style={{ color: "var(--color-muted)", transition: "opacity 0.6s ease 0ms", opacity: ready ? 1 : 0 }}
        >
          <Link href="/" className="hover:opacity-60 transition-opacity">HOME</Link>
          <span className="mx-2">›</span>
          <Link href="/blog" className="hover:opacity-60 transition-opacity">公式ブログ</Link>
          <span className="mx-2">›</span>
          <span>富山の不用品回収を安く抑えるコツ</span>
        </nav>

        {/* 記事ヘッダー */}
        <header
          className="mb-12 pb-8"
          style={{
            borderBottom: "1px solid var(--color-border)",
            transition: "opacity 0.8s ease 80ms, transform 0.8s ease 80ms",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: "var(--color-surface-alt)", color: "var(--color-primary)" }}
            >
              不用品回収・お片付け
            </span>
            <time className="text-sm font-bold" style={{ color: "var(--color-muted)" }}>2026.05.28</time>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black leading-tight mb-6 tracking-tight"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            【富山密着】不用品回収の費用を限界まで安く抑える5つのコツ！処分と買取を組み合わせる裏ワザとは？
          </h1>
          <p className="text-base md:text-lg font-medium" style={{ color: "var(--color-muted)" }}>
            「実家のお片付けや引っ越しで、大量の不用品を処分しなければならなくなった…」「富山県内の不用品回収業者に見積もりを頼んだら、想像以上の高額で驚いた…」そんなお悩みを抱えていませんか？家の中を一気に綺麗にできる不用品回収サービスは非常に便利ですが、やはり気になるのが「費用」ですよね。今回は、富山を拠点に出張買取・お片付けを展開するプロが、処分費用を劇的に引き下げるための5つの実践的な裏ワザを徹底解説します。
          </p>
        </header>

        {/* 導入・リード文 */}
        <div className="mb-12">
          <div
            className="p-6 rounded-r-3xl mb-8"
            style={{ backgroundColor: "var(--color-surface-alt)", borderLeft: "4px solid var(--color-primary)" }}
          >
            <h2 className="text-lg font-black mb-2" style={{ color: "var(--color-text)" }}>この記事は以下のような方におすすめです</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm font-bold" style={{ color: "var(--color-muted)" }}>
              <li>富山県内で遺品整理や生前整理、ゴミ屋敷の片付けに悩んでいる方</li>
              <li>引越しと同時にいらなくなった家具・家電を格安で処分したい方</li>
              <li>古いカメラ、PC、ジャンクパーツ、レトロゲームの処分方法を知りたい方</li>
              <li>不当な追加料金をとる悪徳業者を避け、信頼できる地元の業者を探している方</li>
            </ul>
          </div>
          <p className="text-base mb-6" style={{ color: "var(--color-muted)" }}>
            不用品回収の総額を圧倒的に安く抑える最大の鍵は、ズバリ<b style={{ color: "var(--color-text)" }}>「民間業者に渡すゴミの体積（ボリューム）を減らすこと」</b>と<b style={{ color: "var(--color-text)" }}>「価値あるものの正しい買取・相殺」</b>にあります。コツさえ掴めば、事前の見積もりから数万円、場合によってはそれ以上のコストカットに成功することも決して珍しくありません。
          </p>
        </div>

        {/* 目次 */}
        <nav
          className="mb-12 rounded-2xl p-6 sm:p-8"
          style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}
        >
          <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
            <span>📚</span> 目次
          </h2>
          <ol className="space-y-2 text-sm sm:text-base font-bold" style={{ color: "var(--color-text)" }}>
            <li><a href="#tip1" className="hover:opacity-60 transition-opacity">1. コツ1：富山市や高岡市などの「自治体の戸別収集」をフル活用する</a></li>
            <li><a href="#tip2" className="hover:opacity-60 transition-opacity">2. コツ2：小さなゴミは小分けにして「通常のゴミの日」に出す</a></li>
            <li><a href="#tip3" className="hover:opacity-60 transition-opacity">3. コツ3：富山県内の業者で「必ず2社以上」の相見積もりを取る</a></li>
            <li><a href="#tip4" className="hover:opacity-60 transition-opacity">4. コツ4：トラックの「定額パック」を隙間なく使い切る</a></li>
            <li><a href="#tip5" className="hover:opacity-60 transition-opacity">5. コツ5：【最重要】「処分」ではなく「壊れていても高価買取」できる業者を選ぶ</a></li>
            <li><a href="#summary" className="hover:opacity-60 transition-opacity">まとめ：「もったいない」を循環させ、富山のお客様に最高の還元を</a></li>
          </ol>
        </nav>

        {/* セクション1 */}
        <section id="tip1" className="mb-12 scroll-mt-6">
          <h2
            className="text-2xl font-black mb-4 flex items-center gap-2 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-primary)" }}>01</span> コツ1：富山市や高岡市などの「自治体の戸別収集」をフル活用する
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            不用品回収の費用を安くする最大の基本は、<strong style={{ color: "var(--color-text)" }}>「民間業者に頼む量をできるだけ減らすこと」</strong>です。タンスやベッド、ソファーなどの大型家具は、自治体の粗大ゴミ収集を利用するのが最も安価です。
          </p>

          <div className="overflow-x-auto mb-6 rounded-2xl" style={{ border: "1px solid var(--color-border)" }}>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--color-surface-alt)", borderBottom: "1px solid var(--color-border)" }}>
                  <th className="p-4 font-black w-1/3" style={{ color: "var(--color-text)" }}>処分方法</th>
                  <th className="p-4 font-black w-1/3" style={{ color: "var(--color-text)" }}>費用の目安</th>
                  <th className="p-4 font-black w-1/3" style={{ color: "var(--color-text)" }}>メリット・デメリット</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="p-4 font-bold" style={{ color: "var(--color-text)", backgroundColor: "var(--color-surface-alt)" }}>自治体の大型ゴミ収集</td>
                  <td className="p-4 font-bold" style={{ color: "var(--color-primary)" }}>1点につき 数百円〜数千円</td>
                  <td className="p-4" style={{ color: "var(--color-muted)" }}>圧倒的に安いが、指定日時までに自分で指定場所（外）へ搬出する必要あり。</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold" style={{ color: "var(--color-text)", backgroundColor: "var(--color-surface-alt)" }}>一般的な不用品回収業者</td>
                  <td className="p-4 font-bold text-amber-600">数千円〜数万円（人件費込み）</td>
                  <td className="p-4" style={{ color: "var(--color-muted)" }}>部屋からの搬出をすべて丸投げできて楽だが、点数が多いと高額になる。</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            例えば富山市の場合、事前に「大型ゴミ受付センター」に申し込み、指定された分の「大型ゴミ処理券」をコンビニ等で購入して指定日に家の前に出しておけば、非常に安く処分してくれます。自分で安全に外まで運び出せる大型家具は、まず自治体を利用するのが賢い選択です。
          </p>
        </section>

        {/* セクション2 */}
        <section id="tip2" className="mb-12 scroll-mt-6">
          <h2
            className="text-2xl font-black mb-4 flex items-center gap-2 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-primary)" }}>02</span> コツ2：小さなゴミは小分けにして「通常のゴミの日」に出す
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            お片付けの現場でよく見かけるのが、衣類や食器、調理器具、雑誌といった「普段のゴミの日に出せるもの」までまとめて回収業者に依頼してしまうケースです。
          </p>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            不用品回収業者の料金プランは、多くが「トラック1台あたりいくら（定額パック）」や「ゴミの体積（立方メートル）」で計算されます。つまり、燃やすゴミや不燃ゴミで出せるような細かなものをトラックに詰め込んでしまうと、その分スペースを圧迫し、料金がワンランク上がってしまう原因になります。スケジュールに余裕を持って、小分けにできるゴミは日々の自治体のゴミ回収でコツコツ処分しておきましょう。
          </p>
        </section>

        {/* セクション3 */}
        <section id="tip3" className="mb-12 scroll-mt-6">
          <h2
            className="text-2xl font-black mb-4 flex items-center gap-2 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-primary)" }}>03</span> コツ3：富山県内の業者で「必ず2社以上」の相見積もりを取る
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            不用品回収業界は、業者によって料金設定が驚くほど異なります。中には基本料金の他に「階段料金」「出張料金」「スタッフ追加料金」などを後から上乗せして請求してくる不誠実な業者も残念ながら存在します。
          </p>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            そのため、必ず事前に2〜3社から見積もりを取りましょう。その際のチェックポイントは以下の通りです。
          </p>
          <ul
            className="list-disc pl-6 space-y-2 p-5 rounded-2xl text-sm font-bold mb-4"
            style={{ color: "var(--color-muted)", backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}
          >
            <li>見積書に「追加料金一切なし」としっかり明記されているか</li>
            <li>富山県内の出張費用や搬出作業費がすべてコミコミの明朗会計になっているか</li>
            <li>電話やLINEでの対応が丁寧で、質問に対して誤魔化さずに答えてくれるか</li>
          </ul>
        </section>

        {/* セクション4 */}
        <section id="tip4" className="mb-12 scroll-mt-6">
          <h2
            className="text-2xl font-black mb-4 flex items-center gap-2 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-primary)" }}>04</span> コツ4：トラックの「定額パック」を隙間なく使い切る
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            多くの不用品回収業者が導入している「軽トラパック」や「2tトラックパック」。もしこのプランを利用するのであれば、指定されたトラックの荷台スペースの限界まで不用品を積み込まなければ損をしてしまいます。
          </p>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            逆に、「あとダンボール2箱分だけ載らないから、もうワンサイズ上のトラックに変更になります」と言われると、料金が跳ね上がってしまいます。あらかじめ「絶対に業者に運んでもらうもの（大型）」と「最悪、自分で処分できるもの（小型）」をリストアップしておき、業者のトラックの積載量を100%効率よく使い切るように調整しましょう。
          </p>
        </section>

        {/* セクション5 */}
        <section id="tip5" className="mb-12 scroll-mt-6">
          <h2
            className="text-2xl font-black mb-4 flex items-center gap-2 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-primary)" }}>05</span> コツ5：【最重要】「処分」ではなく「壊れていても高価買取」できる業者を選ぶ
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            不用品回収の総額を下げる最大の鍵、それは<strong style={{ color: "var(--color-text)" }}>「回収費用を買取金額で相殺すること」</strong>です。世の中の多くの業者も「買取とセットで安くします！」と宣伝していますが、ここに大きな落とし穴があります。
          </p>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            実は、一般的な不用品回収業者は「ゴミを処分するプロ」であって、「物の価値を見極めるリユースのプロ」ではありません。そのため、ブランド品や新しめの家電以外の古いものや壊れたものは、すべて「価値なし（＝有料での引き取り処分）」と判定されてしまうケースがほとんどなのです。
          </p>

          <div
            className="rounded-3xl p-6 sm:p-8 mb-6 text-left"
            style={{ backgroundColor: "var(--color-primary-dark)", border: "1px solid #2d5a3d" }}
          >
            <h3 className="text-lg font-black mb-2 flex items-center gap-2" style={{ color: "var(--color-primary-light)" }}>
              📷 なぜ【re&apos;vive】は、他社が「ゴミ」と呼ぶ故障品を「宝物」に変えられるのか？
            </h3>
            <p className="text-sm leading-relaxed font-medium mb-4 text-slate-300">
              世の中の不用品回収業者が「これは古いから処分費用をいただきますね」「壊れているから引き取れません」と切り捨てるものを、私たち【re&apos;vive（リバイブ）】は全く違う視点で見つめています。
            </p>
            <p className="text-sm font-bold mb-4 text-slate-200">
              たとえば、起動しなくなった古いパソコン（自作PCやパーツ単位でも）、液晶が割れたりレンズにカビが生えた古いカメラ、電源の入らないレトロゲーム機（ファミコンやプレステなど）、音の出ない古いオーディオ機器。これらは、一般的な不用品回収業者に持っていっても価値はゼロ、あるいは有料処分です。しかし、当店ではこれらを驚くほどの高値で買い取ることができるケースが多々あります。
            </p>

            <div className="pt-4 mt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
              <h4 className="text-sm font-black uppercase tracking-wider mb-2" style={{ color: "var(--color-primary-light)" }}>💡 他社に真似できない高価買取ができる「2つの秘密」</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-medium">
                <li>
                  <b className="text-white block mb-0.5">① 世界中に広がる独自の直販ルート</b>
                  日本国内では「動かない粗大ゴミ」と扱われる精密機器やレトロホビーも、海外の市場に目を向けると修理パーツやコレクター向けとして凄まじい需要があります。私たちは独自のグローバルな海外販売ルートを直接持っているため、仲介業者を挟まずダイレクトに世界へ届けることができ、その分を買取額に限界まで還元しています。
                </li>
                <li>
                  <b className="text-white block mb-0.5">② 元PCショップ店長としての専門知識</b>
                  代表の小川は、元PCショップ店長としての経験があり、IT機器や精密マシンの内部パーツ、データの徹底的な完全消去技術を持っています。ただの回収作業員ではなく、製品の「隠れた価値（生きている部品の資産価値）」を正確に査定できる目を持っているため、スマホやPC処分時の情報流出リスクも完璧に解消します。
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* まとめセクション */}
        <section id="summary" className="mt-16 pt-8 scroll-mt-6" style={{ borderTop: "2px solid var(--color-border)" }}>
          <h2
            className="text-2xl md:text-3xl font-black mb-4"
            style={{ color: "var(--color-text)", fontFamily: "'Noto Serif JP', serif" }}
          >
            まとめ：「もったいない」を循環させ、富山のお客様に最高の還元を
          </h2>
          <p className="text-base mb-6" style={{ color: "var(--color-muted)" }}>
            押し入れの奥に眠っていた「これ売れるのかな？」という古い機材や趣味の品。それらを丁寧に査定し、ガチッとした買取金額を算出する。そして、その買取金額をそのまま「お片付け費用（人件費や運搬費）」から差し引くことで、お客様の持ち出し費用を他社では絶対に不可能なレベルにまで引き下げます。
          </p>

          {/* 3大特典 */}
          <div
            className="rounded-3xl p-6 sm:p-8 mb-8 text-left"
            style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}
          >
            <h3 className="text-lg font-black text-center mb-6" style={{ color: "var(--color-text)" }}>
              🎉 他の回収業者には絶対に真似できない「当店だけの3大ワンストップ特典」
            </h3>
            <div className="space-y-4">
              <div
                className="flex gap-4 items-start p-4 rounded-2xl"
                style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <div className="text-white font-black text-xs px-2.5 py-1 rounded-md shrink-0 mt-0.5" style={{ backgroundColor: "var(--color-primary)" }}>特典 1</div>
                <div>
                  <h4 className="text-base font-black" style={{ color: "var(--color-text)" }}>壊れたPC・古いカメラ・ゲームを【海外ルート高価買取】</h4>
                  <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: "var(--color-muted)" }}>他社なら「廃棄手数料」を取られるようなジャンク家電やカメラ、パソコンパーツを世界基準のルートで高価格査定。回収費用から直接マイナス（相殺）します！</p>
                </div>
              </div>
              <div
                className="flex gap-4 items-start p-4 rounded-2xl"
                style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <div className="text-white font-black text-xs px-2.5 py-1 rounded-md shrink-0 mt-0.5" style={{ backgroundColor: "var(--color-primary)" }}>特典 2</div>
                <div>
                  <h4 className="text-base font-black" style={{ color: "var(--color-text)" }}>引越しと不用品お片付けを同時に頼むと【セット特割】</h4>
                  <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: "var(--color-muted)" }}>当店は格安単身引越し（A.P.C LOGISTICS）のプロフェッショナルでもあります。お片付けと引越しを同時にご依頼いただくことで、別々の業者に頼むよりも人件費や車両費を限界までカットした爆安プランが可能です。</p>
                </div>
              </div>
              <div
                className="flex gap-4 items-start p-4 rounded-2xl"
                style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <div className="text-white font-black text-xs px-2.5 py-1 rounded-md shrink-0 mt-0.5" style={{ backgroundColor: "var(--color-primary)" }}>特典 3</div>
                <div>
                  <h4 className="text-base font-black" style={{ color: "var(--color-text)" }}>PCのデータ消去から新居でのネット設定まで【完全サポート】</h4>
                  <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: "var(--color-muted)" }}>元PCショップ店長の技術を活かし、処分するパソコンのハードディスク破壊（データ消去）をその場で実施。さらに、引越しを伴う場合は新居でのWi-Fi初期設定等もすべてワンストップでお手伝いします。</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            className="-mx-4 px-6 sm:px-8 py-12 text-center text-white"
            style={{ backgroundColor: "var(--color-primary-dark)" }}
          >
            <h3 className="text-xl md:text-2xl font-black mb-3">【相談・査定0円】LINEでお写真をお送りください！</h3>
            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl mx-auto mb-6">
              「これって買い取れる？」という古いPCやカメラ、お片付けしたいお部屋の写真をLINEで送るだけで、プロがその場でお答えします。代表の小川が迅速なフットワークでご対応いたします！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/kaitori"
                className="w-full sm:w-auto font-black px-8 py-4 rounded-xl text-sm transition-all text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                🔍 詳しい出張買取メニューを見る
              </Link>
              <a
                href="https://lin.ee/845Fdsy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto font-black px-8 py-4 rounded-xl text-sm transition-all hover:opacity-80 text-white"
                style={{ backgroundColor: "#06C755" }}
              >
                💬 LINEで写真を送って無料査定
              </a>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
