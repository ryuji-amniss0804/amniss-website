import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CASES, DIAGNOSIS_FEE, LABOR, MENU, TRAVEL, TRAVEL_MAX, yen } from "@/lib/pc";
import { getAllPcPosts } from "@/lib/pc-posts";
import PcLastCta from "../_components/PcLastCta";
import PcLicense from "../_components/PcLicense";
import RestockForm from "../_components/RestockForm";
import PcEstimate from "./PcEstimate";

/**
 * /pc のトップページ。
 * 見た目・動き・文言の正：D:\revive_toyama_marketing\Claude outputs\top_mock_20261008\PcTop.dc.html（94）
 *
 * 順番：ヒーロー → 許認可の帯 → 症状（目安が出る）→ 料金 → 事例 → 中古PC（準備中・入荷通知）→ 記事 → 最後の案内
 *
 * ⚠ 金額はすべて `lib/pc.ts` から引く。ページに直接書かないこと。
 * ⚠ 中身はすべて最初の HTML に出す（動きで出すものも、文字は最初から入っている）。
 */

export const metadata: Metadata = {
  title: "パソコン修理・出張診断 | re'vive_doc 富山",
  // description はレイアウト（PC_META.top）を継承する。ここに書かないこと。
  alternates: { canonical: "/pc" },
};

/** 料金の札に出すメニュー。金額が決まっているものだけ（null ＝ 要見積り は出さない） */
const PRICED_MENU = MENU.filter((m) => m.price !== null);

/** トップに出す記事の本数 */
const JOURNAL_MAX = 3;

export default function PcTopPage() {
  // 記事は `content/pc-blog/` の実物から。新しい順（並べ替えは getAllPcPosts の中）。
  // 0本のときは節ごと出さない。**架空の見出しで枠を埋めないこと。**
  const posts = getAllPcPosts().slice(0, JOURNAL_MAX);

  return (
    <>
      {/* ---------- ヒーロー ---------- */}
      <section className="hero">
        <div className="w hero-in">
          <div className="hero-t">
            <p className="hero-k mono a1">PC REPAIR ／ 富山県全域に出張</p>
            <h1 className="hero-h kp a2">
              買い替える前に、
              <br />
              <span className="mark">ご相談ください。</span>
            </h1>
            <p className="hero-lead kp a3">
              まず測って、直せるかどうかを報告書でお渡しします。
              <br />
              直せないときは、その理由もお伝えします。
            </p>

            {/* 心電図のような線。飾りなので読み上げない */}
            <svg className="ecg a3" viewBox="0 0 320 36" width="320" height="36" aria-hidden="true">
              <path d="M0 18 H110 L122 4 L134 32 L146 10 L156 18 H320" fill="none" stroke="currentColor" strokeWidth="2.5" />
            </svg>

            <div className="offers a4">
              <div className="offer">
                <b>無料</b>
                <span>ご相談・お見積り</span>
              </div>
              <div className="offer">
                <b>
                  {yen(DIAGNOSIS_FEE)}
                  <small>円</small>
                </b>
                <span>出張診断</span>
              </div>
              <div className="offer">
                <b>最短翌日</b>
                <span>お預かりの返却</span>
              </div>
            </div>

            <div className="hero-acts a4">
              <Link className="btn btn-g pulse" href="/pc/contact">
                無料で相談する
              </Link>
              <a className="btn btn-o" href="#price">
                料金を見る
              </a>
            </div>
          </div>

          {/* 診断報告書の2枚重ね。ヒーローなので priority（遅延させない）。
              width / height を必ず渡す。読み込み中に下の要素が飛ばないようにするため。
              上を走る緑の線は飾り。 */}
          <div className="stack a3">
            <Image
              className="b"
              src="/pc/report-2.jpg"
              alt="診断報告書の見本 2枚目"
              width={560}
              height={791}
              sizes="(max-width: 860px) 58vw, 330px"
              priority
            />
            <Image
              className="a"
              src="/pc/report-1.jpg"
              alt="パソコン診断報告書の見本"
              width={680}
              height={961}
              sizes="(max-width: 860px) 66vw, 380px"
              priority
            />
            <span className="scan" aria-hidden="true" />
            <span className="cap">お渡しする診断報告書（見本）</span>
          </div>
        </div>
      </section>

      {/* ---------- 許認可の帯 ---------- */}
      <PcLicense />

      {/* ---------- 症状（目安が出る） ---------- */}
      <section className="sec" id="sym">
        <div className="w">
          <div className="sec-hd">
            <p className="eyebrow">SYMPTOMS</p>
            <h2 className="h2 kp">
              症状を押すと、<span className="mark">費用の目安</span>が出ます
            </h2>
          </div>
          <PcEstimate />
        </div>
      </section>

      {/* ---------- 料金 ---------- */}
      <section className="sec bg2" id="price">
        <div className="w">
          <div className="sec-hd">
            <p className="eyebrow">PRICE</p>
            <h2 className="h2 kp">
              金額は、<span className="mark">開けるかどうか</span>で3段
            </h2>
            <p className="lead">
              診断料は作業工賃に充てます。直せなかったときは、診断料と出張費だけです。
            </p>
          </div>

          {/* 4つの箱。数字はすべて `lib/pc.ts` から */}
          <div className="formula rv">
            <div className="fx">
              <b>出張診断</b>
              <span>{`${yen(DIAGNOSIS_FEE)}円`}</span>
              <small>工賃に充当</small>
            </div>
            <span className="fx-op" aria-hidden="true">
              ＋
            </span>
            <div className="fx g">
              <b>作業工賃</b>
              <span>{`${yen(LABOR[0].price)}円〜`}</span>
              <small>{`${LABOR.length}段`}</small>
            </div>
            <span className="fx-op" aria-hidden="true">
              ＋
            </span>
            <div className="fx">
              <b>出張費</b>
              <span>{`${yen(TRAVEL[0].fee)}〜${yen(TRAVEL_MAX)}円`}</span>
              <small>{`${TRAVEL[0].label}は${yen(TRAVEL[0].fee)}円`}</small>
            </div>
            <span className="fx-op" aria-hidden="true">
              ＋
            </span>
            <div className="fx">
              <b>部品代</b>
              <span>実費</span>
              <small>必要なときだけ</small>
            </div>
          </div>

          <div className="labor">
            {LABOR.map((l) => {
              const pop = "popular" in l && l.popular;
              return (
                <div key={l.key} className={pop ? "lb pop rv" : "lb rv"}>
                  {pop && <span className="lb-tag">いちばん多いご依頼</span>}
                  <h3>{l.name}</h3>
                  <p className="rule">{l.rule}</p>
                  <ul>
                    {l.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <span className="lb-p">
                    {yen(l.price)}
                    <small>円</small>
                  </span>
                  <span className="lb-n">＋出張費・部品代</span>
                </div>
              );
            })}
          </div>

          {/* 個別メニューのうち、金額が決まっているもの */}
          <div className="note-g">
            {PRICED_MENU.map((m) => (
              <span key={m.key}>
                {`${m.name} ${yen(m.price as number)}円`}
                <small>{`（${m.note}）`}</small>
              </span>
            ))}
          </div>

          <Link className="btn btn-n more" href="/pc/price">
            全メニューと出張費を見る
          </Link>
        </div>
      </section>

      {/* ---------- 事例 ----------
          `lib/pc.ts` の `CASES` から描く。**実在するものだけ。**「準備中」のダミーで埋めないこと。
          横長の大きなカードを縦に並べるので、1件のときは1枚が全幅になる。 */}
      <section className="sec" id="case">
        <div className="w">
          <div className="sec-hd">
            <p className="eyebrow">CASE</p>
            <h2 className="h2">修理事例</h2>
            <p className="lead">実際の作業を、診断報告書とあわせて公開しています。</p>
          </div>

          <div className="cases">
            {CASES.map((c) => (
              <Link key={c.slug} className="case rv" href={`/pc/case/${c.slug}`}>
                <Image
                  src={c.image}
                  alt={c.imageAlt}
                  width={c.imageW}
                  height={c.imageH}
                  sizes="(max-width: 860px) 100vw, 560px"
                />
                <div className="case-b">
                  <div className="meta">
                    <span>{c.date}</span>
                    <span>{`${c.area} ／ ${c.machine}`}</span>
                    {c.hasReport && <span className="ok">診断報告書あり</span>}
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.summary}</p>
                  <span className="case-go">事例を読む →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 中古PC（準備中・入荷通知）と記事 ----------
          ⚠ **在庫が0件。**「ご用意しています」のような、在庫があるように読める書き方をしないこと。
            価格・構成の数字、「在庫あり」の札、実在庫でない写真（used-*.jpg）も出さない。
          ⚠ ここは `PC_NAV` の `/pc/used`（`ready: false`）とは別。/pc/used のページはまだ無い。 */}
      <section className="sec flush">
        <div className="w stackcol">
          <div className="soon rv" id="used">
            <div className="soon-t">
              <span className="soon-tag">準備中</span>
              <h2>診断書付きの中古パソコン</h2>
              <p className="kp">
                修理より買い替えが合うときのために、整備した中古パソコンを準備しています。どの1台にも、修理のときと同じ項目を測った診断報告書を付けます。
              </p>
            </div>
            <RestockForm />
          </div>

          {posts.length > 0 && (
            <div>
              <div className="sec-hd tight">
                <p className="eyebrow">JOURNAL</p>
                <h2 className="h2 sm">記事</h2>
              </div>
              <div className="posts">
                {posts.map((post) => (
                  <Link key={post.slug} className="post" href={`/pc/blog/${post.slug}`}>
                    <time className="num">{post.date}</time>
                    <b>{post.title}</b>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---------- 最後の案内 ---------- */}
      <PcLastCta />
    </>
  );
}
