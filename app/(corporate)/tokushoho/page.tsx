import React from "react";
import Link from "next/link";
import { INDOOR_FEE, SPOT_FEE } from "@/app/(site)/_fees";
import { DEPART, yen } from "@/lib/pricing";

/**
 * 特定商取引法に基づく表記（法定表示）。
 *
 * 【金額をこのファイルに書かない】
 * 18で、ここの「時間チャーター 1時間8,000円（2時間〜／4時間超は1時間7,000円）」が、
 * `/houjin` の「1時間からお受けします。2時間・4時間単位の縛りはありません」を
 * **正面から否定している**のが見つかった。7,000円という単価は、
 * サイトのどこにも `lib/pricing.ts` にも `_fees.ts` にも存在しなかった。
 *
 * 原因は、**法定表示ページに数字がベタ書きされていたこと**。だから誰も更新せず、
 * 料金改定から取り残された。文言だけ直しても、次の改定でまた同じことが起きる。
 *
 * **金額は必ず、ほかのページと同じソースから引くこと。**
 *  - 出動料 5,000 … `lib/pricing.ts` の DEPART
 *  - 室内作業のみ 8,000 … `app/(site)/_fees.ts` の INDOOR_FEE
 *  - 法人スポット便 8,000 … `app/(site)/_fees.ts` の SPOT_FEE
 *
 * INDOOR_FEE と SPOT_FEE は**同額だが別の定数のまま**にしてある。
 * 片方を改定したときに、もう片方が黙って一緒に動かないようにするため。
 *
 * 個別の金額（荷物の量・距離・建物の条件）はここに並べない。
 * 式の全項目は `/moving`、条件を入れた実額は `/simulator` が受ける。
 * **この2ページへのリンクが、役務の対価の開示の一部**なので外さないこと。
 */

export const metadata = {
  title: "特定商取引法に基づく表記 | re'vive 富山",
  description:
    "re'vive 富山（運営：AmNiss&Co. Japan）の特定商取引法に基づく表記。事業者名・所在地・連絡先・料金・キャンセル規定を掲載しています。富山県全域の単身引越し・出張買取・軽貨物運送。",
  // canonical はレイアウトに置けない（子に継承されるため）。各ページで自分自身を指す。
  alternates: { canonical: "/tokushoho" },
  // og:title は <title> と、og:description は description と同じにする。
  // 書かないとレイアウトのもの（トップの文）がそのまま継承される
  openGraph: {
    title: "特定商取引法に基づく表記 | re'vive 富山",
    description:
      "re'vive 富山（運営：AmNiss&Co. Japan）の特定商取引法に基づく表記。事業者名・所在地・連絡先・料金・キャンセル規定を掲載しています。富山県全域の単身引越し・出張買取・軽貨物運送。",
    url: "https://amniss-japan.jp/tokushoho",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

const TEL = "070-8450-0897";

const ROWS: { label: string; value: React.ReactNode }[] = [
  { label: "屋号（サービス名）", value: "re'vive 富山（リバイブ富山）" },
  { label: "運営事業者", value: "AmNiss&Co. Japan" },
  { label: "運営責任者", value: "小川 竜司" },
  {
    label: "所在地",
    value: (
      <>
        富山県富山市
        <span className="block text-xs mt-1" style={{ color: "var(--color-muted)" }}>
          ※ 番地を含む詳細住所は、ご請求があれば遅滞なく開示いたします。
        </span>
      </>
    ),
  },
  {
    label: "電話番号",
    value: (
      <>
        <a href={`tel:${TEL.replace(/-/g, "")}`} className="underline underline-offset-2">
          {TEL}
        </a>
        <span className="block text-xs mt-1" style={{ color: "var(--color-muted)" }}>
          受付 9:00〜21:00（年中無休）／作業中は折り返しになる場合があります
        </span>
      </>
    ),
  },
  {
    label: "お問い合わせ",
    value: (
      <>
        LINE公式アカウント：
        <a
          href="https://lin.ee/845Fdsy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          https://lin.ee/845Fdsy
        </a>
        <span className="block text-xs mt-1" style={{ color: "var(--color-muted)" }}>
          24時間受付。お見積りはLINEが最短です。
        </span>
      </>
    ),
  },
  {
    label: "事業内容",
    value: "単身引越し／軽貨物運送・配送代行／出張買取／不用品の買取",
  },
  {
    label: "許認可",
    value: (
      <>
        古物商許可：富山県公安委員会 第501310007877号
        <br />
        貨物軽自動車運送事業：届出済
      </>
    ),
  },
  {
    label: "対応エリア",
    value: "富山県全域（県外への輸送はご相談ください）",
  },
  {
    label: "役務の対価",
    value: (
      <>
        <span className="block font-black">お引越し・運搬</span>
        <span className="block mt-1">
          （出動料 {yen(DEPART)} ＋ 荷物の量 ＋ 距離 ＋ 建物の条件）× 日程係数
        </span>
        <span className="block">100円未満切り捨て・すべて税込。</span>
        <span className="block mt-2">
          計算式の全項目と金額は
          <Link href="/moving" className="underline underline-offset-2">
            単身引越し
          </Link>
          のページに掲載しています。
          <Link href="/simulator" className="underline underline-offset-2">
            お見積りシミュレーター
          </Link>
          で、ご自身の条件のまま金額をご確認いただけます。
        </span>

        <span className="block font-black mt-5">
          室内での作業のみ（車を出さない場合）　{yen(INDOOR_FEE)}
        </span>

        <span className="block font-black mt-5">
          法人のお客様のスポット便　富山市内・1時間まで {yen(SPOT_FEE)}
        </span>
        <span className="block mt-1">富山市外は距離に応じて加算します。</span>
        <span className="block">
          長時間のチャーター・事務所移転は、個別にお見積りします。
        </span>

        <span className="block font-black mt-5">出張買取</span>
        <span className="block mt-1">
          査定は無料です。買取価格は品物ごとに、その場で提示します。
        </span>

        <span className="block text-xs mt-4" style={{ color: "var(--color-muted)" }}>
          毛布・養生材・運送保険・2階までの階段作業を含みます。
          作業前にお見積り金額を確定させ、当日の追加請求は行いません。
        </span>
      </>
    ),
  },
  {
    label: "対価以外に必要な料金",
    value: (
      <>
        高速道路料金・有料駐車場代　実費
        <span className="block text-xs mt-1" style={{ color: "var(--color-muted)" }}>
          発生する場合は、お見積り時に金額をお伝えします。
        </span>
      </>
    ),
  },
  {
    label: "お支払い方法",
    value: "現金（作業完了時）／法人のお客様は請求書払い（月末締め）にも対応します",
  },
  {
    label: "お支払い時期",
    value: "作業完了時にお支払いください。事前のお預かりは行っておりません。",
  },
  {
    label: "サービスの提供時期",
    value:
      "ご予約いただいた日時に伺います。空き状況により最短で当日の対応も可能です。",
  },
  {
    label: "キャンセルについて",
    value: (
      <>
        <span className="block">・前々日まで：無料</span>
        <span className="block">・前日：料金の30%</span>
        <span className="block">・当日：料金の50%</span>
        <span className="block">・作業開始後：料金の全額</span>
        <span className="block text-xs mt-2" style={{ color: "var(--color-muted)" }}>
          荒天・災害・当方の都合による中止の場合はキャンセル料をいただきません。
          日程変更のご相談は、わかった時点でお早めにご連絡ください。
        </span>
      </>
    ),
  },
  {
    label: "お受けできない物品",
    value: (
      <>
        危険物、引火性のある液体、産業廃棄物、生き物、現金・有価証券・貴重品、ピアノ・金庫などの特殊重量物、軽バンの最大積載量（350kg）を超える物量。お見積りの段階でお伝えします。
        <span className="block mt-2">
          ・リサイクル料が必要な家電4品目（エアコン・テレビ・冷蔵庫・洗濯機）の処分
        </span>
        <span className="block">
          ・廃棄物の収集・運搬・処分（一般廃棄物収集運搬業の許可がないため）
        </span>
      </>
    ),
  },
  {
    label: "買取について",
    value:
      "出張買取は古物営業法に基づき、ご本人確認書類のご提示をお願いしております。古物営業法に定めるクーリング・オフ（訪問購入）の対象となる取引では、書面交付から8日間、契約の解除および物品の引渡しの拒絶ができます。",
  },
  {
    label: "免責事項",
    value:
      "貨物保険に加入しており、当方の責に帰すべき事由による破損・紛失は保険の範囲で対応いたします。ただし、経年劣化・内部構造上の理由による破損、事前に申告のない精密機器・美術品等については、責任を負いかねる場合があります。",
  },
];

export default function TokushohoPage() {
  return (
    <div
      className="min-h-screen pt-28 pb-20"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ページタイトル */}
        <div className="amn-animate mb-16" style={{ animationDelay: "0s" }}>
          <span
            className="text-xs font-black tracking-widest uppercase block mb-3"
            style={{ color: "var(--color-primary-light)" }}
          >
            Legal Notice
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            特定商取引法に基づく表記
          </h1>
          <div
            className="w-10 h-0.5 mt-5"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
        </div>

        {/* 表記テーブル */}
        <div style={{ borderTop: "1px solid var(--color-border)" }}>
          {ROWS.map((row, idx) => (
            <div
              key={row.label}
              className="amn-animate grid grid-cols-1 sm:grid-cols-4 gap-2 py-6 text-sm"
              style={{
                animationDelay: `${0.05 + idx * 0.03}s`,
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <div
                className="font-black sm:col-span-1 text-xs tracking-wide"
                style={{ color: "var(--color-muted)" }}
              >
                {row.label}
              </div>
              <div
                className="sm:col-span-3 font-medium leading-relaxed"
                style={{ color: "var(--color-text)" }}
              >
                {row.value}
              </div>
            </div>
          ))}
        </div>

        <div className="amn-animate mt-12 text-right" style={{ animationDelay: "0.7s" }}>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            re&apos;vive 富山（運営：AmNiss&amp;Co. Japan）
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
            最終更新：2026年8月7日
          </p>
        </div>

      </div>
    </div>
  );
}
