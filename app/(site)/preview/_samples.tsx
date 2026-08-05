import type { ReactNode } from "react";
import LicenseStrip from "../_components/LicenseStrip";
import Split from "../_components/Split";
import PriceTable from "../_components/PriceTable";
import ReasonList from "../_components/ReasonList";
import Spec from "../_components/Spec";
import Faq from "../_components/Faq";
import Cta from "../_components/Cta";
import Photo from "../_components/Photo";
import { images, SIZES_CONTENT } from "@/lib/images";

/**
 * 共通コンポーネントの見本。
 * 段階2の確認用で、公開ページの中身ではない。
 * 本番ビルドでは preview/[c]/page.tsx 側で 404 にしている。
 */

export type PreviewEntry = { title: string; note: string; render: () => ReactNode };

export const PREVIEWS: Record<string, PreviewEntry> = {
  header: {
    title: "Header",
    note: "sticky top:0。960px以下でナビと電話を隠す。ページ上部を参照",
    render: () => (
      <Split kicker="ヘ ッ ダ ー" title="ページ上部を見てください" first>
        <p className="lead" style={{ marginTop: 0 }}>
          Header はレイアウトが常に描画しています。ロゴ／ナビ／電話番号／CTAボタン。
          960px 以下ではナビと電話番号が消え、代わりに下部の MobileBar が受けます。
        </p>
        <div style={{ height: "60vh" }} />
        <p className="lead">（sticky の確認用に高さを取っています）</p>
      </Split>
    ),
  },

  licensestrip: {
    title: "LicenseStrip",
    note: "許認可の帯。文字だけ。背景 --paper-2、上下に罫線",
    render: () => <LicenseStrip />,
  },

  split: {
    title: "Split",
    note: "見出し列284px（sticky）＋本文列。840px以下で1カラム",
    render: () => (
      <>
        <Split kicker="考 え 方" title={<>安い業者との違いは、<br />先に書いてあるかどうか。</>} first>
          <p className="lead" style={{ marginTop: 0 }}>
            見出し列は 284px 固定で、スクロール中も上に貼り付きます。本文列はその右。
            左右対称の3列グリッドではなく、紙面のような非対称の2カラムです。
          </p>
          <p className="lead">
            ラベルは字間を開けた日本語で書きます。SERVICES / WHY US のような英語の
            eyebrow は使いません。セクションどうしは罫線1本で区切り、箱では囲みません。
          </p>
        </Split>
        <Split kicker="料 金" title="背景を敷く場合" note="tint を付けると --paper-2 になります。" tint>
          <p className="lead" style={{ marginTop: 0 }}>
            背景の色を変える以外に、影や角丸は付けません。
          </p>
        </Split>
      </>
    ),
  },

  pricetable: {
    title: "PriceTable",
    note: "罫線だけの仕様表。600px以下で縦積み（名称→説明→金額）",
    render: () => (
      <Split kicker="料 金" title="料金" note="すべて税込。お見積りは作業前に確定します。" first>
        <PriceTable
          rows={[
            { name: "単身引越し", desc: "ワンルーム〜1K　富山市内・作業員1名・平日", price: "20,000円〜" },
            { name: "家具・家電の運搬", desc: "1〜3点　富山市内・平日", price: "12,000円〜" },
            { name: "県外へのお引越し（長距離）", desc: "高速代・燃料込みの総額　日帰りは片道300kmまで", price: "30,000円〜" },
            { name: "法人スポット便", desc: "富山県内・1配送　時間チャーターは1時間8,000円（2時間〜）", price: "8,000円〜" },
            { name: "出張買取", desc: "査定のみで終わっても費用はいただきません", price: "査定無料" },
          ]}
          note={
            <>
              <b>複数に当てはまる場合は、高いほうだけを適用します。</b>
              重ねがけはしません。
            </>
          }
        />
      </Split>
    ),
  },

  reasonlist: {
    title: "ReasonList",
    note: "一二三四のぶら下げ番号リスト。箱を使わない",
    render: () => (
      <Split kicker="考 え 方" title="安い業者との違い" first>
        <ReasonList
          items={[
            {
              title: "積める寸法を公開しています",
              body: "荷室の内寸と最大積載量を明記しています。「行ってみたら運べませんでした」が一番ご迷惑をおかけするので、先に潰しています。",
              evidence: "幅140cm × 高さ142cm × 奥行190cm ／ 最大積載350kg",
            },
            {
              title: "お手伝いをお願いしません",
              body: "大型家具の積み下ろしをお客様に手伝っていただくことはありません。2名必要と判断した内容は2名で伺います。",
              evidence: "人数が増えても追加料金はいただきません",
            },
            {
              title: "養生と保険を別料金にしません",
              body: "毛布・養生材・ラップでの保護、ラッシングベルトでの固定、運送保険。安く見せるために外す、という考え方は取っていません。",
              evidence: "運送保険 補償上限500万円に加入済み",
            },
            {
              title: "できないことを先に伝えます",
              body: "400L以上の大型冷蔵庫、2トントラックが必要な物量、ピアノ・金庫。そして廃棄物の有料回収は、許可がないため行っていません。",
              evidence: "一般廃棄物収集運搬業の許可は受けていません",
            },
          ]}
        />
      </Split>
    ),
  },

  spec: {
    title: "Spec",
    note: "枠線1本の仕様ボックス。囲むことを許しているのはここだけ",
    render: () => (
      <Split kicker="仕 様" title="積める寸法" first>
        <Spec label="積 め る サ イ ズ" value="幅 140cm × 高さ 142cm × 奥行 190cm ／ 最大積載 350kg">
          スズキ・エブリイ（ハイルーフ）のカタログ表記です。冷蔵庫は高さ142cmまで、
          洗濯機は縦型・ドラム式とも積めます。
        </Spec>
        <Spec label="金 額 の 出 し 方 を 公 開 し て い ま す" value="（ 出動料 ＋ 荷物の量 ＋ 距離 ＋ 建物の条件 ）× 日程" small>
          <b>出動料 5,000円</b>　軽バン1台／毛布・養生材・ラップ／運送保険（補償上限500万円）／
          2階までの階段作業／搬入後の設置まで、すべて含みます。
        </Spec>
      </Split>
    ),
  },

  faq: {
    title: "Faq",
    note: "<details> ベース。1問目だけ open",
    render: () => (
      <Split kicker="質 問" title="よくあるご質問" first>
        <Faq
          items={[
            {
              q: "当日に追加料金がかかることはありますか？",
              a: "ありません。お見積りは作業前に確定します。有料駐車場しかない場合のパーキング代のみ、実費をご負担いただいています。",
            },
            {
              q: "不用品の処分もお願いできますか？",
              a: "値がつく物は買い取れます。ただし当社は一般廃棄物収集運搬業の許可を受けていないため、廃棄物の有料回収は行っていません。",
            },
            {
              q: "大型の冷蔵庫は運べますか？",
              a: "高さ142cmまでの2ドアタイプであれば積めます。400L以上の大型冷蔵庫はお受けできません。重さではなく高さの問題です。",
            },
          ]}
        />
      </Split>
    ),
  },

  cta: {
    title: "Cta",
    note: "濃紺の帯。電話・LINE・フォーム",
    render: () => <Cta id="cta-preview" />,
  },

  footer: {
    title: "Footer",
    note: "サービス／会社情報の2列＋許認可＋廃棄物の但し書き。ページ下部を参照",
    render: () => (
      <Split kicker="フ ッ タ ー" title="ページ下部を見てください" first>
        <p className="lead" style={{ marginTop: 0 }}>
          Footer もレイアウトが常に描画しています。廃棄物の但し書きは既存の文言のままです。
        </p>
      </Split>
    ),
  },

  mobilebar: {
    title: "MobileBar",
    note: "960px以下で表示。body に padding-bottom:60px",
    render: () => (
      <Split kicker="モ バ イ ル" title="画面幅を960px以下にしてください" first>
        <p className="lead" style={{ marginTop: 0 }}>
          960px 以下で画面下部に固定バーが出ます。ヘッダーのナビと電話番号が消えるのと同じ
          ブレークポイントです。バーの高さぶんは body の padding-bottom で逃がしています。
        </p>
      </Split>
    ),
  },

  photo: {
    title: "Photo（画像処理）",
    note: "暗くするのは背景が散らかっている写真だけ。PC系はそのまま",
    render: () => (
      <>
        <Split kicker="画 像" title="暗くする" note="屋外・作業風景。青空や白線を落とす。" first>
          <Photo image={images.vanExterior01} sizes={SIZES_CONTENT} caption="van-exterior-01.jpg ／ treatment: dark" />
        </Split>
        <Split kicker="画 像" title="そのまま" note="背景が整理されている。暗くすると情報が潰れる。">
          <Photo image={images.pcDellSsd} sizes={SIZES_CONTENT} caption="pc-dell-ssd.jpg ／ treatment: plain" />
        </Split>
        <Split kicker="画 像" title="ヒーローに敷く場合" note="文字を読ませるためのグラデーションを重ねる。">
          <Photo image={images.sagyouLoading01} sizes={SIZES_CONTENT} overlay caption="sagyou-loading-01.jpg ／ dark + overlay" />
        </Split>
      </>
    ),
  },
};

export const PREVIEW_KEYS = Object.keys(PREVIEWS);
