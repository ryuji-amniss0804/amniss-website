import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AREA, LICENSES } from "@/lib/site";
import { DIAGNOSIS_FEE, LABOR, PC_JOURNAL_HREF, SYMPTOMS, yen } from "@/lib/pc";
import PcIcon from "../_components/PcIcon";

/**
 * /pc のトップページ。
 * 手本：D:\revive_toyama_marketing\mockup_pc_site_v1.html の `#/`
 *
 * ⚠ 金額はすべて `lib/pc.ts` から引く。ページに直接書かないこと。
 * ⚠ セクション番号（01 ／ SYMPTOMS）は `.pc-top` のカウンタで出る。
 *   **トップページだけ。**下層ページ（77以降）に `.pc-top` を付けないこと。
 * ⚠ 背景（`.sec.band`）を敷いてよいのは中古PCと最後のCTAの2か所だけ。
 *
 * 料金・事例・中古PC・お問い合わせの各ページは 77 以降で作る。
 * それまでリンク先は 404 になる（想定どおり。`app/sitemap.ts` には載せていない）。
 */

export const metadata: Metadata = {
  title: "パソコン修理・出張診断 | re'vive_doc 富山",
  // description はレイアウト（PC_META.top）を継承する。ここに書かないこと。
  alternates: { canonical: "/pc" },
};

const CASES = [
  {
    href: "/pc/case/01-raiden",
    img: "/pc/case-cooler.jpg",
    w: 760,
    h: 760,
    alt: "取り外したCPUクーラー",
    tag: "富山市 ／ デスクトップ",
    title: "落雷で起動しなくなった1台が、部品交換なしで戻った",
    desc: "コントローラの完全放電。原因を特定できれば、部品を買わずに済むことがあります。",
    date: "2026.08",
  },
  {
    href: "/pc/case",
    img: "/pc/case-memory.jpg",
    w: 760,
    h: 760,
    alt: "取り外したメモリと冷却ファン",
    tag: "高岡市 ／ ノート",
    title: "「動作が遅い」の正体が、埃と熱だった1台",
    desc: "部品を替える前に、まず測る。清掃と再組み立てだけで戻った例です。",
    date: "準備中",
  },
  {
    href: "/pc/case",
    img: "/pc/case-report.jpg",
    w: 680,
    h: 886,
    alt: "お渡しした診断報告書",
    tag: "射水市 ／ 自作PC",
    title: "買い替えをすすめた1台。その理由も報告書に書いた",
    desc: "直せないと判断することもあります。何を見てそう決めたかをお伝えします。",
    date: "準備中",
  },
] as const;

/**
 * 中古PCの3枚。
 * ⚠ 価格と構成（SSDの使用時間など）は**在庫の実データ**で、まだ出どころがない。
 *   モックアップの「42,000円」「SSD 使用 1,240時間」は見本の数字なので写さない。
 *   在庫は 79（/pc/used）で作る。それまでは「準備中」を出す。
 */
const USED = [
  {
    img: "/pc/used-desktop.jpg",
    w: 520,
    h: 520,
    title: "デスクトップ／事務・学習向け",
  },
  {
    img: "/pc/used-gaming.jpg",
    w: 520,
    h: 520,
    title: "デスクトップ／ゲーミング",
  },
  {
    img: "/pc/used-desktop.jpg",
    w: 520,
    h: 520,
    title: "デスクトップ／省スペース",
  },
] as const;

/**
 * お知らせ・記事の3枚。
 * ⚠ 置き場所が未決（既存ブログにPCカテゴリを足すか、`content/pc/` を別に作るか）。
 *   記事はまだ1本も無いので、日付は書かずに「準備中」を出す。
 *   見出しはモックアップの予定タイトルをそのまま置いている。
 */
const JOURNAL = [
  { cat: "お知らせ", title: "9月の出張スケジュールについて" },
  { cat: "記事", title: "パソコンが遅いとき、買い替える前に確かめる3つのこと" },
  { cat: "記事", title: "高校のBYOD、どんなパソコンを買えばいいのか" },
] as const;

/** 許認可バーに出す3つ。古物商許可とSDGsは `lib/site.ts` が唯一の出どころ */
const kobutsu = LICENSES.find((l) => l.label === "古物商許可");
const sdgs = LICENSES.find((l) => l.label === "富山県SDGs宣言企業");

export default function PcTopPage() {
  return (
    <div className="pc-top">
      {/* ---------- ヒーロー ---------- */}
      <section className="hero">
        <div className="w">
          <div>
            <h1>
              買い替える前に、
              <br />
              <b>ご相談ください。</b>
            </h1>
            <p className="sub">
              富山県内どこでも伺います。まず測って、直せるか直せないかを報告書でお出しします。
              <b>直せないと判断したときは、その理由もお伝えします。</b>
            </p>

            <div className="offers">
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

            <Link className="btn p" href="/pc/contact">
              まずは無料で相談する
            </Link>
            <Link className="btn s" href="/pc/price">
              料金を見る
            </Link>
          </div>

          {/* 診断報告書の2枚重ね。ヒーローなので priority（遅延させない）。
              width / height を必ず渡す。読み込み中に下の要素が飛ばないようにするため。 */}
          <div className="stack">
            <Image
              className="b"
              src="/pc/report-2.jpg"
              alt="診断報告書の見本 2枚目"
              width={560}
              height={791}
              priority
            />
            <Image
              className="a"
              src="/pc/report-1.jpg"
              alt="パソコン診断報告書の見本"
              width={680}
              height={961}
              priority
            />
            <span className="cap">お渡しする診断報告書（見本）</span>
          </div>
        </div>
      </section>

      {/* ---------- 許認可バー ---------- */}
      <div className="lic">
        <div className="w">
          {kobutsu && (
            <span>
              <i>✓</i>
              {kobutsu.label} {kobutsu.value}
            </span>
          )}
          {sdgs && (
            <span>
              <i>✓</i>富山県SDGs宣言事業者
            </span>
          )}
          <span>
            <i>✓</i>
            {AREA} 出張対応
          </span>
        </div>
      </div>

      {/* ---------- 01 症状から探す ---------- */}
      <section className="sec">
        <div className="w">
          <p className="eyebrow">SYMPTOMS</p>
          <h2>こんなときに、お呼びください</h2>
          <p className="lead">
            当てはまるものを選ぶと、考えられる原因と費用の目安をその場でお出しします。
          </p>

          {/* カードは `lib/pc.ts` の `SYMPTOMS` から描く。ここに症状を書き足さないこと。
              べた書きにすると /pc/symptom の選択肢と食い違い、押した人が
              自分の症状を選べない行き止まりができる。
              リンクの `?s=` で押した症状を引き継ぎ、選ばれた状態で開く。 */}
          <div className="grid g4">
            {SYMPTOMS.map((s) => (
              <Link key={s.key} className="card sym" href={`/pc/symptom?s=${s.key}`}>
                <div className="body">
                  <PcIcon name={s.icon} />
                  <h3>{s.card}</h3>
                  <p>{s.cardNote}</p>
                </div>
              </Link>
            ))}
          </div>

          <Link className="more" href="/pc/symptom">
            症状から費用の目安を出す →
          </Link>
        </div>
      </section>

      {/* ---------- 02 料金 ---------- */}
      <section className="sec">
        <div className="w">
          <p className="eyebrow">PRICE</p>
          <h2>料金</h2>
          <p className="lead">
            出張診断 {yen(DIAGNOSIS_FEE)}円 ＋ 作業工賃 ＋ 出張費 ＋
            部品代。診断料は作業工賃に充当します。
            <b>直せなかった場合は、診断料と出張費のみです。</b>
          </p>

          <div className="grid g3">
            {LABOR.map((l) => (
              <div key={l.key} className="card">
                <div className="body">
                  {"popular" in l && l.popular && (
                    <span className="tag ok top">いちばん多いご依頼</span>
                  )}
                  <h3>{l.name}</h3>
                  <p className="rule-line">{l.rule}</p>
                  <ul className="items">
                    {l.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="foot-of-card">
                    <span className="price">
                      {yen(l.price)}
                      <small> 円</small>
                    </span>
                    <span className="foot-note">＋出張費・部品代</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link className="more" href="/pc/price">
            全メニューと内訳を見る →
          </Link>
        </div>
      </section>

      {/* ---------- 03 修理事例 ---------- */}
      <section className="sec">
        <div className="w">
          <p className="eyebrow">CASE</p>
          <h2>修理事例</h2>
          <p className="lead">
            実際にお受けした作業を、診断報告書とあわせて公開しています。
          </p>

          <div className="grid g3">
            {CASES.map((c) => (
              <Link key={c.title} className="card" href={c.href}>
                <Image
                  className="thumb"
                  src={c.img}
                  alt={c.alt}
                  width={c.w}
                  height={c.h}
                  sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 340px"
                />
                <div className="body">
                  <span className="tag top">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="foot-of-card">
                    <span className="tag ok">診断報告書あり</span>
                    <span className="num foot-note">{c.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link className="more" href="/pc/case">
            事例をすべて見る →
          </Link>
        </div>
      </section>

      {/* ---------- 04 診断書付き中古PC（背景を敷く1か所目） ---------- */}
      <section className="sec band">
        <div className="w">
          <p className="eyebrow">USED PC</p>
          <h2>診断書付きの中古パソコン</h2>
          <p className="lead">
            修理より買い替えのほうが良いときのために、整備済みの中古パソコンもご用意しています。
            <b>どの個体にも、新品と同じ項目を測った診断報告書が付きます。</b>
          </p>

          <div className="grid g3">
            {USED.map((u) => (
              <Link key={u.title} className="card" href="/pc/used">
                <Image
                  className="thumb"
                  src={u.img}
                  alt={u.title}
                  width={u.w}
                  height={u.h}
                  sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 340px"
                />
                <div className="body">
                  <h3>{u.title}</h3>
                  <p>
                    <span className="tag ok">診断報告書つき</span>
                  </p>
                  <div className="foot-of-card">
                    {/* 在庫の実データ（構成・価格・使用時間）は 79 で入れる */}
                    <span className="num foot-note">在庫を準備中</span>
                    <span className="foot-note">税込・保証3か月</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link className="more" href="/pc/used">
            在庫をすべて見る →
          </Link>
        </div>
      </section>

      {/* ---------- 05 お知らせ・記事 ---------- */}
      <section className="sec">
        <div className="w">
          <p className="eyebrow">JOURNAL</p>
          <h2>お知らせ・記事</h2>

          <div className="grid g3">
            {JOURNAL.map((j) => (
              <Link key={j.title} className="card" href={PC_JOURNAL_HREF}>
                <div className="body">
                  <div className="card-meta">
                    <span>準備中</span>
                    <span className="tag">{j.cat}</span>
                  </div>
                  <h3>{j.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          <Link className="more" href={PC_JOURNAL_HREF}>
            すべての記事を見る →
          </Link>
        </div>
      </section>

      {/* ---------- CTA（背景を敷く2か所目） ----------
          LINE のボタンは出さない。PC専用の公式アカウントが未開設で、
          `PC_LINE_URL` が null のため。引越し用の LINE_URL で代用しないこと。 */}
      <section className="sec band">
        <div className="w center">
          <h2>まずは、状態を聞かせてください</h2>
          <p className="lead">
            ご相談とお見積りは無料です。写真を送っていただければ、伺う前におおよその見当をお伝えできます。
          </p>
          <Link className="btn p" href="/pc/contact">
            無料で相談する
          </Link>
        </div>
      </section>
    </div>
  );
}
