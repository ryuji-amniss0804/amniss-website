import { Fragment } from "react";
import Hero from "../_components/Hero";
import Split from "../_components/Split";

/**
 * プライバシーポリシー（法定表示に準じる）。
 *
 * 【21_corporate で (corporate) から (site) へ移した】
 * 移したのはレイアウトだけ。**文言は1字も変えていない。**
 * 条文は Split（左に見出し・右に本文）で1条ずつ置いている。
 * 見出しの「1.」「2.」は文字列の一部なので、`.reasons` のぶら下げ番号には
 * 割らないこと（「1.」と「基本方針」に分けると、そこで文言が動く）。
 *
 * 英語のラベル `Privacy Policy` も、(site) の流儀（字間を開けた日本語）とは
 * 違うが**表示文言なので触っていない。**
 *
 * 【25_answers で6条から9条にした】
 * 見積り依頼フォーム（/contact）が個人情報を受け取るようになったため。
 * **文言は 25_answers に書かれた文字列をそのまま使っている。判断はしていない。**
 * 1条・5条・8条・9条は旧3条・旧5条・旧6条を含めて1バイトも動かしていない
 * （条番号だけが変わった）。
 *
 * content は段落の配列。1要素が1段落で、要素の中の配列は箇条書き
 * （箇条書きの行間は本文の段落間より詰めたいので、<br> でつないでいる）。
 */

export const metadata = {
  title: "プライバシーポリシー | re'vive",
  description:
    "AmNiss & Co. Japan / re'viveのプライバシーポリシー・免責事項。個人情報の取得・利用目的・管理方針を掲載しています。",
  // canonical はレイアウトに置けない（子に継承されるため）。各ページで自分自身を指す。
  alternates: { canonical: "/privacy" },
  // og:title は <title> と、og:description は description と同じにする。
  // 書かないとレイアウトのもの（トップの文）がそのまま継承される
  openGraph: {
    title: "プライバシーポリシー | re'vive",
    description:
      "AmNiss & Co. Japan / re'viveのプライバシーポリシー・免責事項。個人情報の取得・利用目的・管理方針を掲載しています。",
    url: "https://amniss-japan.jp/privacy",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

/** 1段落。文字列の配列は箇条書き */
type Block = string | string[];

const POLICY_SECTIONS: { title: string; content: Block[] }[] = [
  {
    title: "1. 基本方針",
    content: [
      "AmNiss & Co. Japan（以下「当社」）は、個人情報の保護を重要な責務と認識し、「個人情報の保護に関する法律」に基づき、お客様の個人情報を適切に管理・保護いたします。",
    ],
  },
  {
    title: "2. 個人情報の取得と利用目的",
    content: [
      "当社は、以下の目的のために必要な範囲で個人情報を取得し、利用いたします。",
      [
        "・単身引越し・運送・買取サービス等の提供・連絡",
        "・お問い合わせに対する回答および資料送付",
        "・サービス改善のための分析・マーケティング",
      ],
      "お見積り依頼フォームでは、次の情報をお預かりします。",
      [
        "・お名前",
        "・ご連絡先（お電話番号またはメールアドレス）",
        "・ご依頼の内容としてご記入いただいた文章",
        "・お荷物の写真（お送りいただいた場合のみ）",
        "・料金シミュレーターの計算結果（お荷物の品目と量、作業員の人数、距離、建物の条件、ご希望の日程、および画面に表示された金額）",
      ],
      "いずれもお見積りとご連絡のために使います。それ以外の目的には使いません。",
    ],
  },
  {
    title: "3. 保管と削除",
    content: [
      "お見積り依頼フォームでお送りいただいたお荷物の写真は、お預かりした日から90日を過ぎたものを、順次自動的に削除します。",
      "お名前・ご連絡先・ご依頼の内容は、お取引の記録として保管します。",
      "期間内であっても、削除をご希望の場合はお申し出のとおりに削除いたします。下記のお問い合わせ先までご連絡ください。",
    ],
  },
  {
    title: "4. 外部サービスの利用",
    content: [
      "当社は、お見積り依頼フォームの運用のために、次の事業者のサービスを利用しています。いずれも当社が委託しているものであり、これらの事業者が独自の目的でお客様の情報を利用することはありません。",
      [
        "・Vercel Inc.（アメリカ合衆国）　ウェブサイトの提供、およびお荷物の写真の保管",
        "・Resend（アメリカ合衆国）　お見積り依頼を当社へ知らせるメールの送信",
        "・Cloudflare, Inc.（アメリカ合衆国）　フォームの不正な送信をふせぐしくみ",
      ],
      "これらの事業者のサーバーは日本国外にあります。上記の目的のために、お客様の情報が国外に保管・送信されることをご了承ください。",
      "お荷物の写真は、当社がお送りするURLをご存じない方には参照できない形で保管しています。",
      // 60_ga4 で追記。**新しい条は作らない**（条番号が動くと他の書類との整合が崩れる）。
      // このページには小見出しの形が無く、条文はすべて .lead の段落なので、
      // 「アクセス解析ツールについて」も段落として置いている。
      // リンクにもしない。このページには <a> が1つも無く、URLは地の文で出すのが既存の形。
      "アクセス解析ツールについて",
      "当サイトでは、サイトの利用状況を把握し改善するために、Google LLC が提供するアクセス解析ツール「Google アナリティクス」を使用しています。",
      "Google アナリティクスは Cookie を使用し、閲覧されたページのURL、参照元、ブラウザやOSの種類、IPアドレスなどの情報を Google LLC に送信します。氏名・住所・電話番号など、お客様個人を特定できる情報は含まれません。",
      "送信された情報は、Google 社のプライバシーポリシーに基づいて管理されます。",
      "Cookie の使用を望まれない場合は、ご利用のブラウザの設定で Cookie を無効にしていただくか、Google が提供する「Google アナリティクス オプトアウト アドオン」をご利用ください。",
      [
        "・Google アナリティクス利用規約　https://marketingplatform.google.com/about/analytics/terms/jp/",
        "・Google プライバシーポリシー　https://policies.google.com/privacy?hl=ja",
        "・Google アナリティクス オプトアウト アドオン　https://tools.google.com/dlpage/gaoptout?hl=ja",
      ],
    ],
  },
  {
    title: "5. 個人情報の管理・安全対策",
    content: [
      "当社は、個人情報の漏洩、紛失、破壊、改ざんを防ぐため、適切なセキュリティ対策を講じます。また、従業者に対しても必要かつ適切な監督を行い、情報の安全管理を徹底いたします。",
    ],
  },
  {
    title: "6. 第三者への提供",
    content: [
      "当社は、法令に基づく場合を除き、お客様の同意を得ることなく個人情報を第三者に提供・開示することはいたしません。",
      "「4. 外部サービスの利用」に記載した事業者は、当社がサービスの提供のために委託しているものです。当社の指示する範囲を超えて利用することはありません。",
    ],
  },
  {
    title: "7. 開示・訂正・削除のご請求",
    content: [
      "お客様ご本人から、当社が保有する個人情報の開示・訂正・追加・削除・利用の停止のお求めがあった場合は、ご本人であることを確認したうえで、速やかに対応いたします。下記のお問い合わせ先までご連絡ください。",
    ],
  },
  {
    title: "8. 免責事項",
    content: [
      "当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。",
    ],
  },
  {
    title: "9. お問い合わせ先",
    content: [
      "当社のプライバシーポリシーに関するお問い合わせは、お問い合わせフォームまたは公式LINEよりご連絡ください。",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Hero size="md" kicker="個 人 情 報" title="プライバシーポリシー" />

      {POLICY_SECTIONS.map((item, i) => (
        <Split key={item.title} title={item.title} first={i === 0} tint={i % 2 === 1}>
          {item.content.map((block, b) => {
            // URLは途中に折り返せる場所が無い1語なので、`.lead` の word-break: auto-phrase
            // のままだと桁があふれる。**360px で横スクロールが出た**（実測：本文の
            // scrollWidth が 345px → 489px）。URLを含む段落にだけ、必要なときは
            // どこでも折り返してよいと足す。site.css は触らない（CSSチャンクを動かさないため）。
            // break-word ではなく anywhere。min-content に効くのは anywhere のほうだけで、
            // 桁があふれる原因は段の最小幅が URL の長さまで広がることだった。
            const hasUrl = Array.isArray(block) && block.some((l) => l.includes("https://"));
            const style = {
              ...(b === 0 ? { marginTop: 0 } : null),
              ...(hasUrl ? { overflowWrap: "anywhere" as const } : null),
            };

            return (
              <p className="lead" key={b} style={Object.keys(style).length > 0 ? style : undefined}>
                {Array.isArray(block)
                  ? block.map((line, n) => (
                      <Fragment key={n}>
                        {n > 0 ? <br /> : null}
                        {line}
                      </Fragment>
                    ))
                  : block}
              </p>
            );
          })}
        </Split>
      ))}

      <section className="sec">
        <div className="w">
          <p className="pnote" style={{ marginTop: 0, textAlign: "right" }}>
            AmNiss &amp; Co. Japan
            <br />
            制定日：2026年5月30日
          </p>
        </div>
      </section>
    </>
  );
}
