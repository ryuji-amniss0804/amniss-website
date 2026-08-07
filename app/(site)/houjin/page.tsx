import type { Metadata } from "next";
import Link from "next/link";
import Hero from "../_components/Hero";
import LicenseStrip from "../_components/LicenseStrip";
import Split from "../_components/Split";
import PriceTable from "../_components/PriceTable";
import Spec from "../_components/Spec";
import ItemList from "../_components/ItemList";
import Cta from "../_components/Cta";
import { SPOT_FEE } from "../_fees";
import { LICENSES, TEL, TEL_HREF } from "@/lib/site";
import { DIST, yen } from "@/lib/pricing";

/**
 * 法人のお客様。
 *
 * **価格では勝負しない。「1時間から受ける」で勝負する。**
 * 軽貨物のスポット便は2時間・4時間単位が普通で、1時間から受けると
 * 公表している事業者が見当たらない。そこが空いているので、そこを言う。
 *
 * **他社名は一切出さない。**「2時間・4時間単位の縛りはありません」までは書いてよいが、
 * 「他社は2時間から」のような比較は書かない（比較は裏が取れないうえ、
 * 根拠のない数字を出さないというこのサイトの主張と噛み合わない）。
 *
 * 【料金の出どころ】
 *  - 距離料は **lib/pricing.ts の DIST**（個人と同じ距離表）。ここに書かない。
 *  - スポット便の 8,000円 だけは式から出ない。理由は _fees.ts の SPOT_FEE。
 *    **同じ数字をトップの「メニュー」も出すので、定義はこのファイルに戻さないこと。**
 *  - **日程係数（COEF）を法人の計算に通さないこと。**個人向けの土日1.20・当日1.50は
 *    法人には適用しない。そのため lib/pricing.ts から COEF / applyCoef を import しない。
 *
 * 【ヒーローに画像を置かない】
 * image_decision.md の枠C（雰囲気）は画像を使わない。
 * /moving の荷室断面図をここに流用しないこと。
 *
 * 「不用品回収」「不用品処分」「引き取り」「処分します」をサービスとして書かない。
 * 「格安」「業界最安」「絶対」「100%」「積み放題」、口コミ、他社比較も書かない。
 */

/** 許認可は lib/site.ts の LICENSES から引く。番号をこのファイルに書き写さない */
function license(label: string) {
  const l = LICENSES.find((x) => x.label === label);
  if (!l) throw new Error(`許認可 "${label}" が lib/site.ts の LICENSES にありません`);
  return l;
}

const KOBUTSU = license("古物商許可");
const HOKEN = license("運送保険");
const UNSOU = license("貨物軽自動車運送事業");
const SDGS = license("富山県SDGs宣言企業");

/**
 * 「富山県公安委員会 第501310007877号」を、発行者と番号に割る。
 * 番号だけ `.nw`（折り返し禁止）で束ねないと、幅しだいで
 * **「…公安委員会第 ／ 501310007877号」と、第と数字が別の行に割れる。**
 * word-break: auto-phrase は「第」と数字を別の文節と見るので、これでは直らない。
 * トップ（/）でも同じことをしている。
 */
const [KOBUTSU_ISSUER, KOBUTSU_NO] = (() => {
  const v: string = KOBUTSU.value;
  const i = v.indexOf(" ");
  if (i < 0) throw new Error(`古物商許可の value に半角スペースがありません: ${v}`);
  return [v.slice(0, i), v.slice(i + 1)];
})();

export const metadata: Metadata = {
  title: `富山の法人向け軽貨物｜スポット便 1時間 ${yen(SPOT_FEE)}〜 ｜ re'vive 富山`,
  description: `富山県全域。軽貨物のスポット便を1時間からお受けします。2時間・4時間単位の縛りはありません。当日でも土日祝でも割増なし、富山市内・1時間まで${yen(SPOT_FEE)}。事務所移転、什器・備品の移動、複数箇所の配送・集荷。請求書払い（月締め）可。運送保険 補償上限500万円／貨物軽自動車運送事業 届出済。`,
  alternates: { canonical: "/houjin" },
  openGraph: {
    title: `富山の法人向け軽貨物｜スポット便 1時間 ${yen(SPOT_FEE)}〜 ｜ re'vive 富山`,
    description: `富山県全域。軽貨物のスポット便を1時間からお受けします。2時間・4時間単位の縛りはありません。当日でも土日祝でも割増なし、富山市内・1時間まで${yen(SPOT_FEE)}。事務所移転、什器・備品の移動、複数箇所の配送・集荷。請求書払い（月締め）可。運送保険 補償上限500万円／貨物軽自動車運送事業 届出済。`,
    url: "https://amniss-japan.jp/houjin",
    siteName: "re'vive 富山",
    locale: "ja_JP",
    type: "website",
  },
};

/** ① 料金 */
const PRICE_ROWS = [
  { name: "スポット便", desc: "富山市内・1時間まで", price: yen(SPOT_FEE) },
  { name: "市外", desc: "富山市外へ出る場合。距離料は下の表のとおり", price: `${yen(SPOT_FEE)} ＋ 距離料` },
  {
    name: "事務所移転・什器の搬出入",
    desc: "1時間で終わらない量のとき",
    price: "荷物の量で算出",
  },
  { name: "長時間のチャーター", desc: "半日・1日の貸切", price: "お見積り" },
  { name: "高速代・有料駐車場", desc: "コインパーキングしかない場合など", price: "実費" },
];

/**
 * ② 距離料。**個人と同じ lib/pricing.ts の距離表をそのまま使う。**
 * 表に出すのは代表値だけ（射水・滑川／高岡・氷見・黒部・南砺／金沢）。
 * 全部は /moving の距離表が受ける。
 */
const DIST_ROWS = DIST.slice(1, 4).map((d) => ({
  name: d.area,
  desc: `片道〜${d.km}km`,
  price: `＋${yen(d.fee)}`,
}));

/** ④ 対応できること */
const CAN_DO = [
  { name: "軽バンに積める荷物全般" },
  { name: "当日・翌日の急ぎ" },
  { name: "複数箇所の配送・集荷" },
  { name: "事務所移転、什器・備品の移動" },
  { name: "不要になった機材・什器の買取", note: `${KOBUTSU.label}あり` },
];

/** ⑤ 事業者様向けの体制。許認可は LICENSES から組む。番号を書き写さない */
const KITAI = [
  { name: "請求書払い可", note: "月締め対応" },
  { name: `${HOKEN.label}加入済み`, note: HOKEN.value },
  {
    name: KOBUTSU.label,
    note: (
      <>
        {`${KOBUTSU_ISSUER} `}
        <span className="nw">{KOBUTSU_NO}</span>
      </>
    ),
  },
  { name: `${UNSOU.label} ${UNSOU.value}` },
  { name: SDGS.label },
];

/** ⑥ お受けできないこと */
const CANNOT = [
  { name: "廃棄物の運搬、処分場への持込", note: "一般廃棄物収集運搬業の許可がないため" },
  { name: "危険物、液体類" },
];

export default function HoujinPage() {
  return (
    <>
      {/* ① ヒーロー。**画像を置かない。**
          見出しはお客さんの言葉。リードでこちらが答える。
          リードは JSX で折らずに文字列1本で渡す（行末で折ると半角スペースが1つ入る） */}
      <Hero
        size="md"
        kicker="法 人 の お 客 様 ／ 富 山 県 全 域"
        title="1時間だけ、お願いできますか。"
        lead="軽貨物のスポット便を、1時間からお受けします。当日でも土日祝でも、割増はありません。"
        actions={
          <>
            <a className="btn btn-fill" href={TEL_HREF}>
              {TEL}
            </a>
            <Link className="btn" href="/contact">
              見積りフォーム
            </Link>
          </>
        }
      />

      {/* ② 許認可 */}
      <LicenseStrip />

      {/* ③ 料金。**日程係数は掛けない。**土日・当日を指定しても金額は動かない */}
      <Split kicker="料 金" title="1時間からお受けします" first>
        <PriceTable head={["ご依頼の内容", "料金"]} rows={PRICE_ROWS} />

        {/* 距離料は個人と同じ距離表。代表値だけを出す */}
        <div className="pt">
          <PriceTable
            head={["距離料（片道・高速代と燃料込み）", "加算額"]}
            rows={DIST_ROWS}
            note={
              <>
                これより遠い行き先の距離料は、
                <Link className="tl" href="/moving">
                  単身引越し
                </Link>
                の距離表と同じです。
              </>
            }
          />
        </div>

        {/* 個人向けの日程係数（土日1.20・当日1.50）は法人には適用しない */}
        <Spec label="割 増 に つ い て" value="当日でも土日祝でも、割増はありません。" small>
          {"個人のお引越しでは日程によって係数が掛かりますが、法人のお客様には掛けません。お伝えした金額のままです。"}
        </Spec>

        {/* このページの主題。他社の話は書かない */}
        <Spec
          label="最 低 の 単 位"
          value="1時間からお受けします。2時間・4時間単位の縛りはありません。"
          small
        >
          {"1時間で終わる用事のために2時間ぶんをお支払いいただく必要はありません。1時間を超える場合は、超えたぶんをお見積りします。"}
        </Spec>
      </Split>

      {/* ④ 対応できること */}
      <Split kicker="対 応" title="お受けしている内容" tint>
        <ItemList items={CAN_DO} />
      </Split>

      {/* ⑤ 事業者様向けの体制。取引の前に確認されることを先に出す */}
      <Split kicker="体 制" title="お取引の前に">
        <ItemList items={KITAI} />
      </Split>

      {/* ⑥ お受けできないこと。許可がないことを先に書く */}
      <Split kicker="お 断 り" title="お受けできないこと" tint>
        <ItemList items={CANNOT} deny />
      </Split>

      {/* ⑦ */}
      <Cta
        title="まずは、お電話ください。"
        lead="運ぶ物と、行き先と、ご希望の時間を教えてください。その場で金額をお伝えします。請求書払い・月締めのご相談も承ります。"
      />
    </>
  );
}
