import Link from "next/link";
import { AREA, COMPANY, HOURS, HOURS_RANGE, LICENSE_LINE, TEL, TEL_HREF } from "@/lib/site";
import { PC_JOURNAL_HREF, PC_LINE_URL, PC_NAV } from "@/lib/pc";

/**
 * まだ無いページへのリンクを出さないための判定。ヘッダーと同じ `PC_NAV` の `ready` を見る。
 *
 * ⚠ フッターの文言はヘッダーより長い（「診断書付き中古PC」「お知らせ・記事」）ので、
 *   `PC_NAV` の `label` ではなく `href` だけを照合する。出す・出さないの判断だけを借りる。
 */
function ready(href: string): boolean {
  return PC_NAV.some((item) => item.href === href && item.ready);
}

/**
 * /pc のフッターと、モバイルの固定バー。
 *
 * ⚠ `(site)/_components/Footer.tsx` `MobileBar.tsx` とは別物。
 *   あちらは `lib/site.ts` の `FOOTER_SERVICES` と引越し用の `LINE_URL` を使う。
 *   **そちらは1バイトも変更しない。**
 *
 * 会社名・電話番号・許認可の文言は `lib/site.ts` から引く。同じ値を2か所に置かない。
 * とくに許認可番号は Google ビジネスプロフィールと一字一句そろえる必要がある。
 *
 * 固定バーは 640px 以下でだけ出る（`pc.css` の `.fixbar`）。
 * バーの高さぶんは `body.pc` の padding-bottom:64px で逃がしてある。
 * 受けるのは電話と相談フォームの2本。LINE は下の理由で出さない。
 *
 * LINE は `PC_LINE_URL` が入るまで描画しない（リンク先の無いボタンを置かない）。
 * 引越し用の `LINE_URL` で代用しないこと。問い合わせを分けるために別アカウントを作る。
 */
export default function PcFooter() {
  return (
    <>
      <footer className="ft">
        <div className="w">
          <div>
            <div className="brand">
              re&apos;vive<em>_doc</em>
              <span>PC REPAIR / TOYAMA</span>
            </div>
            <p className="about">
              {AREA}に伺う出張型のパソコン修理・診断。
              <br />
              {COMPANY.legal} ／ {COMPANY.brand}
            </p>
          </div>

          <div>
            <h4>サービス</h4>
            <Link href="/pc/symptom">症状から探す</Link>
            <Link href="/pc/price">料金</Link>
            <Link href="/pc/case">修理事例</Link>
            {/* 中古PCのページはまだ無い。`lib/pc.ts` の PC_NAV を true にすると戻る */}
            {ready("/pc/used") && <Link href="/pc/used">診断書付き中古PC</Link>}
          </div>

          <div>
            <h4>知る</h4>
            {/* 記事が0本のあいだは出さない。トップの JOURNAL 節を出さないのと同じ判断 */}
            {ready(PC_JOURNAL_HREF) && <Link href={PC_JOURNAL_HREF}>お知らせ・記事</Link>}
            <Link href="/company">事業者情報</Link>
            <Link href="/privacy">プライバシーポリシー</Link>
          </div>

          <div>
            <h4>お問い合わせ</h4>
            <Link href="/pc/contact">相談フォーム</Link>
            {/* PC専用のLINE公式アカウントは開設待ち。URLが入るまで行を出さない */}
            {PC_LINE_URL && (
              <a href={PC_LINE_URL} target="_blank" rel="noopener noreferrer">
                LINEで相談
              </a>
            )}
            <a href={TEL_HREF}>お電話 {TEL}</a>
            {/* 電話に出られる時間。リンクではないので <a> の外に置く */}
            <span className="tel-h">受付 {HOURS}</span>
          </div>
        </div>

        <div className="bot">
          {LICENSE_LINE}
          <br />© {COMPANY.legal}
        </div>
      </footer>

      <div className="fixbar">
        {/* スクロールしても消えないボタンなので、受付時間を添える。
            `HOURS` は「年中無休」まで入っていてバーには長すぎるので `HOURS_RANGE` を使う。
            ⚠ いまが受付時間内かで出し分けないこと。サーバーとブラウザで時刻がずれる */}
        <a className="tel" href={TEL_HREF}>
          <b>お電話</b>
          <span>{HOURS_RANGE}</span>
        </a>
        <Link className="go" href="/pc/contact">
          無料で相談する
        </Link>
      </div>
    </>
  );
}
