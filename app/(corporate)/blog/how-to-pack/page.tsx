"use client";
import React, { useState, useEffect } from "react";

export default function HowToPackPage() {
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
      <article
        className="max-w-4xl mx-auto px-4 pt-28 pb-12 antialiased font-medium leading-relaxed"
      >
        {/* ヘッダーセクション */}
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
              引越し豆知識
            </span>
            <time className="text-sm font-bold" style={{ color: "var(--color-muted)" }} dateTime="2026-05-28">2026.05.28</time>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black leading-tight mb-6 tracking-tight"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            【プロが直伝】単身引越しを驚くほど格安＆スムーズに終わらせる荷造り・梱包の裏ワザ5選
          </h1>
          <p className="text-base md:text-lg font-medium" style={{ color: "var(--color-muted)" }}>
            一人暮らしの引越しや単身赴任、同棲解消などの急な移動。「できるだけ費用を安く抑えたい」「でも荷造りや準備に時間をかけたくない」というのが本音ではないでしょうか。本記事では、富山県全域で軽バン（エブリイ）を駆使した格安・単身引越しを展開する物流のプロが、限られたスペースを最大限に活かし、引越し代金を限界まで引き下げるための「実践的な荷造り・梱包の裏ワザ」を徹底解説します。
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
              <li>富山県内、または富山から県外への単身引越しを予定している方</li>
              <li>大手引越し業者の見積もりが高すぎて、格安プランを探している方</li>
              <li>ダンボールの詰め方や、効率的な梱包手順が分からず困っている方</li>
              <li>新居でのWi-Fi設定やパソコンの初期設定に不安がある方</li>
            </ul>
          </div>
          <p className="text-base mb-6" style={{ color: "var(--color-muted)" }}>
            単身引越しの料金を圧倒的に安く抑える最大の鍵は、ズバリ<b style={{ color: "var(--color-text)" }}>「荷物の体積（ボリューム）を小さくすること」</b>と<b style={{ color: "var(--color-text)" }}>「徹底した事前準備」</b>にあります。特に軽バン（軽トラックやワンボックスカー）を利用した配送プランでは、積載スペースが限られている分、梱包のテクニックひとつで運べる量が劇的に変わり、結果として2往復分の料金を請求されたり、追加のトラックが必要になったりするリスクを100%回避できます。
          </p>
          <p className="text-base mb-6" style={{ color: "var(--color-muted)" }}>
            それでは、今日からすぐに実践できるプロ直伝の5つの裏ワザを具体的に見ていきましょう。
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
            <li><a href="#tip1" className="hover:opacity-60 transition-opacity">1. 【重さの法則】ダンボールの「大小使い分け」と底抜けを防ぐ「十字貼り」</a></li>
            <li><a href="#tip2" className="hover:opacity-60 transition-opacity">2. 【スペース圧縮】衣類は畳まない！「ロール梱包」とデッドスペースの完全消滅</a></li>
            <li><a href="#tip3" className="hover:opacity-60 transition-opacity">3. 【割れ物対策】新聞紙はもう古い？タオル・衣類を緩衝材にする一石二鳥の技</a></li>
            <li><a href="#tip4" className="hover:opacity-60 transition-opacity">4. 【即日開梱の極意】新居で最初に開ける「ダンボール0号」を必ず作る</a></li>
            <li><a href="#tip5" className="hover:opacity-60 transition-opacity">5. 【家電・ガジェット】配線迷子を防ぐ「スマホ写真撮影」とPC梱包の注意点</a></li>
            <li><a href="#summary" className="hover:opacity-60 transition-opacity">まとめ：富山で単身引越しを一番安く、快適に終わらせる最適解</a></li>
          </ol>
        </nav>

        {/* セクション1 */}
        <section id="tip1" className="mb-12 scroll-mt-6">
          <h2
            className="text-2xl font-black mb-4 flex items-center gap-2 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-primary)" }}>01</span> 【重さの法則】ダンボールの「大小使い分け」と底抜けを防ぐ「十字貼り」
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            荷造りを始めるとき、多くの人が「大きなダンボールになんでも詰め込んでしまおう」と考えがちですが、これは最大の罠です。引越しの荷造りには明確な<b style={{ color: "var(--color-text)" }}>「重量とサイズの反比例ルール」</b>が存在します。
          </p>

          <div className="overflow-x-auto mb-6 rounded-2xl" style={{ border: "1px solid var(--color-border)" }}>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--color-surface-alt)", borderBottom: "1px solid var(--color-border)" }}>
                  <th className="p-4 font-black w-1/3" style={{ color: "var(--color-text)" }}>ダンボールのサイズ</th>
                  <th className="p-4 font-black w-1/3" style={{ color: "var(--color-text)" }}>詰めるべき荷物（推奨）</th>
                  <th className="p-4 font-black w-1/3" style={{ color: "var(--color-text)" }}>NGな荷物（重量オーバー）</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="p-4 font-bold" style={{ color: "var(--color-text)", backgroundColor: "var(--color-surface-alt)" }}>小型（Mサイズ以下）</td>
                  <td className="p-4" style={{ color: "var(--color-muted)" }}>本、雑誌、アルバム、食器類、調味料、液体類</td>
                  <td className="p-4 font-bold text-red-500">特になし（重いものはすべてここ）</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold" style={{ color: "var(--color-text)", backgroundColor: "var(--color-surface-alt)" }}>大型（Lサイズ以上）</td>
                  <td className="p-4" style={{ color: "var(--color-muted)" }}>衣類、タオル、ぬいぐるみ、毛布、クッション</td>
                  <td className="p-4 font-bold text-red-500">本を詰め込む（底抜け・腰痛の原因）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            本や書類を大きな箱に満タンに入れてしまうと、総重量が30kgを超え、ダンボールの底が抜けるだけでなく、作業スタッフやあなた自身が腰を痛めて引越しどころではなくなってしまいます。重いものは「小さな箱に小分けに」、軽いものは「大きな箱にまとめて」が鉄則です。
          </p>
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}
          >
            <h3 className="text-sm font-black uppercase tracking-wider mb-2" style={{ color: "var(--color-primary)" }}>💡 プロの梱包テクニック：ガムテープは「十字貼り」</h3>
            <p className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
              ダンボールを組み立てる際、底のガムテープを「一本線」だけで留めていませんか？また、Hの字に留める「H字貼り」は一見頑丈そうですが、単身引越しでは<b style={{ color: "var(--color-text)" }}>中央の結合部に一番負荷がかかる「十字貼り（またはキの字貼り）」が最も高い強度を発揮します。</b>底の中心線を跨ぐように縦に一本、そして中央にクロスするように横に一本しっかり貼ることで、底抜けのリスクをほぼゼロにできます。
            </p>
          </div>
        </section>

        {/* セクション2 */}
        <section id="tip2" className="mb-12 scroll-mt-6">
          <h2
            className="text-2xl font-black mb-4 flex items-center gap-2 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-primary)" }}>02</span> 【スペース圧縮】衣類は畳まない！「ロール梱包」とデッドスペースの完全消滅
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            単身引越しで最も体積を占めるのが「衣類・洋服」です。普通に畳んでダンボールに重ねていくと、どうしても服と服の間に空気の層が生まれ、すぐに箱が満タンになってしまいます。
          </p>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            そこでおすすめなのが、Tシャツやパーカー、ジーンズなどを<b style={{ color: "var(--color-text)" }}>「クルクルと丸めて筒状にするロール梱包」</b>です。ミリタリーやバックパッカーが荷物をパッキングする際によく使う手法ですが、これを引越しに応用すると、普通の畳み方に比べて<b style={{ color: "var(--color-text)" }}>同じダンボールに約1.5倍〜1.8倍の量の衣類を詰め込むことが可能になります。</b>シワにもなりにくいため、新居ですぐにハンガーに掛ければアイロンがけの手間も省けます。
          </p>

          <div
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}
          >
            <h3 className="text-base font-black mb-2" style={{ color: "var(--color-text)" }}>軽バンの積載量を最大化する「隙間（デッドスペース）埋め」</h3>
            <p className="text-base" style={{ color: "var(--color-muted)" }}>
              当店の軽バン（スズキ・エブリイ）の積載能力は非常に高いですが、四角いダンボールを綺麗に並べたときに、車の天井付近やシートの横などにどうしても数センチの「隙間」が生まれます。荷造りの段階で、<b style={{ color: "var(--color-text)" }}>「最悪ダンボールに入らなくても、ビニール袋やゴミ袋（中身が綺麗なもの）に詰めたクッションやぬいぐるみ、カーテン」</b>をいくつか用意しておいてください。これらはトラックの隙間にクッション材（緩衝材）としてそのまま滑り込ませることができるため、積載効率が限界まで引き上がります。
            </p>
          </div>
        </section>

        {/* セクション3 */}
        <section id="tip3" className="mb-12 scroll-mt-6">
          <h2
            className="text-2xl font-black mb-4 flex items-center gap-2 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-primary)" }}>03</span> 【割れ物対策】新聞紙はもう古い？タオル・衣類を緩衝材にする一石二鳥の技
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            キッチン周りのお皿やコップ、グラスなどの食器類。これらを梱包するために、わざわざ新聞紙を買いに走ったり、大量のプチプチ（エアキャップ）を購入したりしていませんか？実はそれ、お金もスペースも無駄にしてしまっています。
          </p>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            一番賢いプロの裏ワザは、<b style={{ color: "var(--color-text)" }}>「あなたが新居に持っていくタオル、靴下、インナーシャツ、キッチンペーパーをそのまま緩衝材として使う」</b>ことです。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div
              className="rounded-2xl p-4 text-center"
              style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
            >
              <div className="text-2xl mb-2">🍽️ お皿・プレート</div>
              <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>フェイスタオルやハンドタオルを間に挟んで、数枚重ねて縦に並べて箱に入れます（横積みは衝撃で割れやすいのでNG）。</p>
            </div>
            <div
              className="rounded-2xl p-4 text-center"
              style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
            >
              <div className="text-2xl mb-2">🥛 グラス・マグカップ</div>
              <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>厚手の靴下（洗濯済みのもの）の中にすっぽりとコップを入れます。これだけで完璧な保護カバーに変身します。</p>
            </div>
            <div
              className="rounded-2xl p-4 text-center"
              style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
            >
              <div className="text-2xl mb-2">🍳 鍋・フライパン</div>
              <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>Tシャツやエプロンで包み込み、ダンボールの隙間を埋めるように配置。ゴミが出ないため新居での片付けが劇的に楽になります。</p>
            </div>
          </div>

          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            この方法の最大のメリットは、<b style={{ color: "var(--color-text)" }}>「緩衝材としてのゴミが一切出ない」</b>ことと、<b style={{ color: "var(--color-text)" }}>「食器の梱包とタオルの梱包が同時に終わる（箱の数を減らせる）」</b>ことです。引越し当日の夜、新居で大量の新聞紙やクシャクシャになったプチプチのゴミ袋に囲まれて絶望する必要はもうありません。
          </p>
        </section>

        {/* セクション4 */}
        <section id="tip4" className="mb-12 scroll-mt-6">
          <h2
            className="text-2xl font-black mb-4 flex items-center gap-2 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-primary)" }}>04</span> 【即日開梱の極意】新居で最初に開ける「ダンボール0号」を必ず作る
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            「引越し当日、新居に荷物は届いたけれど、どの箱に何が入っているか分からなくて、今すぐ使いたいスマホの充電器や歯ブラシが見つからない！」これは単身引越しで非常によくあるトラブルです。疲れている中、10箱以上あるダンボールをすべて片っ端から開けていくのは苦行でしかありません。
          </p>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            これを未然に防ぐために、<b style={{ color: "var(--color-text)" }}>「当日の夜と翌日の朝に使う最低限の必需品」だけを集めた、通称『ダンボール0号』</b>を1箱、絶対に作ってください。
          </p>

          <div
            className="rounded-3xl p-6 mb-6"
            style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}
          >
            <h3 className="text-base font-black mb-3 flex items-center gap-1.5" style={{ color: "var(--color-text)" }}>
              📦 ダンボール0号に絶対入れるべきチェックリスト
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold text-left" style={{ color: "var(--color-text)" }}>
              <div className="flex items-center gap-2"><span>✅</span> スマホ・PCの充電器・各種ケーブル</div>
              <div className="flex items-center gap-2"><span>✅</span> 現金、印鑑、新居の鍵、契約書類一式</div>
              <div className="flex items-center gap-2"><span>✅</span> 当晩の着替え、タオル（1〜2日分）</div>
              <div className="flex items-center gap-2"><span>✅</span> 歯ブラシ、シャンプー、洗面用具</div>
              <div className="flex items-center gap-2"><span>✅</span> ティッシュペーパー、トイレットペーパー1巻</div>
              <div className="flex items-center gap-2"><span>✅</span> カッターナイフ（他の箱を開けるための重要ツール）</div>
            </div>
          </div>

          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            この「0号箱」だけは、ダンボールの上面に赤マジックで大きく<b style={{ color: "var(--color-text)" }}>「0号！一番最初に開ける！」</b>と書き、トラックの一番手前（最後）に積み込むようにスタッフに伝えてください。新居に到着した瞬間、真っ先にこの箱を手元に確保すれば、当日の夜の快適さが10倍変わります。
          </p>
        </section>

        {/* セクション5 */}
        <section id="tip5" className="mb-12 scroll-mt-6">
          <h2
            className="text-2xl font-black mb-4 flex items-center gap-2 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-primary)" }}>05</span> 【家電・ガジェット】配線迷子を防ぐ「スマホ写真撮影」とPC梱包の注意点
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            テレビ、デスクトップパソコン、録画レコーダー、Wi-Fiルーターなどの精密機器。引越しの荷造りでコードを全て引き抜いた後、新居で「あれ？この黒いケーブル、どこに挿さってたっけ…？」とパニックになる方が続出します。
          </p>
          <p className="text-base mb-4" style={{ color: "var(--color-muted)" }}>
            これを一瞬で解決する裏ワザは、<b style={{ color: "var(--color-text)" }}>「ケーブルを抜く前に、機器の背面（配線部分）をスマホでパシャリと写真撮影しておくこと」</b>です。線の色、挿し込まれている端子の位置（HDMI1、LANポートなど）が画像として残っていれば、新居での再現作業が5分で終了します。また、コード類はまとめた後、マスキングテープ等で「テレビ用」「PC用」と書いて本体に直接貼り付けておくのがベストです。
          </p>

          <div
            className="rounded-3xl p-6 sm:p-8 mb-6 text-left"
            style={{ backgroundColor: "var(--color-primary-dark)", border: "1px solid #2d5a3d" }}
          >
            <h3 className="text-lg font-black mb-2 flex items-center gap-2" style={{ color: "var(--color-primary-light)" }}>
              💻 自作PCやゲーミングPC、ガジェットが大好きな方へ特別な警告
            </h3>
            <p className="text-sm leading-relaxed font-medium mb-4 text-slate-300">
              単身引越しをする方の中には、大切なデスクトップPC（自作PCやBTOゲーミングPC）をお持ちの方も多いかと思います。これらは振動に非常に弱く、大手引越し業者の一般的な混載便だと「補償対象外」と言われたり、専用のバカ高い精密機器輸送オプションを強制されるケースがあります。
            </p>
            <p className="text-sm font-bold text-slate-200">
              当店の単身引越しプラン（A.P.C LOGISTICS）では、代表の小川自身がPCの自作や内部コンポーネント、カメラに深い知見を持っているため、お客様の大切な精密機器やジャンクPCパーツに至るまで、毛布や専用の緩衝材を用いて、1台1台完全に貸切状態の軽バンで我が子のように優しく、安全に運搬します。
            </p>
          </div>
        </section>

        {/* まとめセクション */}
        <section id="summary" className="mt-16 pt-8 scroll-mt-6" style={{ borderTop: "2px solid var(--color-border)" }}>
          <h2
            className="text-2xl md:text-3xl font-black mb-4"
            style={{ color: "var(--color-text)", fontFamily: "'Noto Serif JP', serif" }}
          >
            まとめ：富山で単身引越しを一番安く、快適に終わらせる最適解
          </h2>
          <p className="text-base mb-6" style={{ color: "var(--color-muted)" }}>
            今回ご紹介した5つの荷造りの裏ワザを実践していただければ、単身の引越し荷物は驚くほどコンパクトになり、軽バンの限られたスペースにすっぽりと収まります。
          </p>
          <p className="text-base mb-6" style={{ color: "var(--color-muted)" }}>
            私たち<b style={{ color: "var(--color-text)" }}>A.P.C LOGISTICS（エーピーシーロジスティクス）</b>は、富山県発着の単身引越しを専門としており、無駄な大型トラックを使わない「軽バン（エブリイ）貸切プラン」を<b style={{ color: "var(--color-text)" }}>12,100円〜</b>という地域最安級の圧倒的な格安価格でご提供しています。大手の見積もりで3万、5万と言われて絶望している方は、ぜひ一度ご相談ください。
          </p>

          {/* 当店だけの3大特典 */}
          <div
            className="rounded-3xl p-6 sm:p-8 mb-8 text-left"
            style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}
          >
            <h3 className="text-lg font-black text-center mb-6" style={{ color: "var(--color-text)" }}>
              🎉 他の引越し業者には絶対に真似できない「当店だけの3大ワンストップ特典」
            </h3>
            <div className="space-y-4">
              <div
                className="flex gap-4 items-start p-4 rounded-2xl"
                style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <div className="text-white font-black text-xs px-2.5 py-1 rounded-md shrink-0 mt-0.5" style={{ backgroundColor: "var(--color-primary)" }}>特典 1</div>
                <div>
                  <h4 className="text-base font-black" style={{ color: "var(--color-text)" }}>新居でのWi-Fi開通・PC初期設定が【完全無料】</h4>
                  <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: "var(--color-muted)" }}>「ネットが繋がらない」「パソコンの設定がわからない」という引越しあるあるをプロが一瞬で解決。通常なら1万円以上かかる出張設定サポートを、引越しをご利用いただいた方には完全無料でその場で実施します！</p>
                </div>
              </div>
              <div
                className="flex gap-4 items-start p-4 rounded-2xl"
                style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <div className="text-white font-black text-xs px-2.5 py-1 rounded-md shrink-0 mt-0.5" style={{ backgroundColor: "var(--color-primary)" }}>特典 2</div>
                <div>
                  <h4 className="text-base font-black" style={{ color: "var(--color-text)" }}>不用品丸ごと査定で引越し代金から【直接割引・相殺】</h4>
                  <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: "var(--color-muted)" }}>引越し時に必ず出る「処分したいゴミやガラクタ」。当店（買取サービス re&apos;vive）がその場で丸ごと出張査定！古いカメラや壊れたゲーム機、自作PCパーツなど、世界基準のルートで高価買取し、引越し費用からマイナス（相殺割引）するため、実質手出し0円以下での引越しも十分可能です。</p>
                </div>
              </div>
              <div
                className="flex gap-4 items-start p-4 rounded-2xl"
                style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <div className="text-white font-black text-xs px-2.5 py-1 rounded-md shrink-0 mt-0.5" style={{ backgroundColor: "var(--color-primary)" }}>特典 3</div>
                <div>
                  <h4 className="text-base font-black" style={{ color: "var(--color-text)" }}>長距離引越しも驚くほど安い！日本全国どこでも対応</h4>
                  <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: "var(--color-muted)" }}>「富山から東京へ就職」「金沢から富山へUターン」などの県外・長距離移動も、貸切ダイレクト便のため大手のような『荷物の積み替え』や『数日間の待機』がなく、最速かつ破格の安さでお届け可能です。</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            className="-mx-4 px-6 sm:px-8 py-12 text-center text-white"
            style={{ backgroundColor: "var(--color-primary-dark)" }}
          >
            <h3 className="text-xl md:text-2xl font-black mb-3">荷造りのご相談から、お見積もりまで完全無料！</h3>
            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl mx-auto mb-6">
              「この荷物の量で軽バンに載りきる？」「不用品も一緒に見てほしい」など、どんな小さなことでもお気軽にご相談ください。代表の小川が迅速なフットワークでご対応いたします！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:07084500897"
                className="w-full sm:w-auto font-black px-8 py-4 rounded-xl transition-all text-sm text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                📞 お急ぎの方（直通）：070-8450-0897
              </a>
              <a
                href="https://lin.ee/845Fdsy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto font-black px-8 py-4 rounded-xl transition-all text-sm text-white hover:opacity-80"
                style={{ backgroundColor: "#06C755" }}
              >
                💬 LINEで無料相談・お見積もり
              </a>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
