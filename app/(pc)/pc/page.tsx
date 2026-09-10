import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AREA, LICENSES } from "@/lib/site";
import { CASES, DIAGNOSIS_FEE, LABOR, PC_JOURNAL_HREF, SYMPTOMS, yen } from "@/lib/pc";
import PcIcon from "../_components/PcIcon";

/**
 * /pc のトップページ。
 * 手本：D:\revive_toyama_marketing\mockup_pc_site_v1.html の `#/`
 *
 * ⚠ 金額はすべて `lib/pc.ts` から引く。ページに直接書かないこと。
 * ⚠ セクション番号（01 ／ SYMPTOMS）は `.pc-top` のカウンタで出る。
 *   **トップページだけ。**下層ページ（77以降）に `.pc-top` を付けないこと。
 * ⚠ 背景（`.sec.band`）を敷いてよいのは最後のCTAの1か所だけ。
 *   （2か所あると帯が繋がって「ここは他と違う」が伝わらない。）
 *
 * 料金・事例・中古PC・お問い合わせの各ページは 77 以降で作る。
 * それまでリンク先は 404 になる（想定どおり。`app/sitemap.ts` には載せていない）。
 */

export const metadata: Metadata = {
  title: "パソコン修理・出張診断 | re'vive_doc 富山",
  // description はレイアウト（PC_META.top）を継承する。ここに書かないこと。
  alternates: { canonical: "/pc" },
};

/**
 * 修理事例は `lib/pc.ts` の `CASES` から描く。**実在するものだけ。**
 * 「準備中」のダミーで枠を埋めないこと。事例が増えたらここは触らなくてよい。
 *
 * 3列に1枚だけ置くと2枚ぶんが空いて欠けて見えるので、
 * 3件に満たないあいだはグリッドを使わない（1件＝`.g1` ／ 2件＝`.g2`）。
 * `CASES` はタプル型（いまは長さ1）で、そのまま `=== 2` と比べると
 * 型が重ならず tsc が落ちる。number に落としてから比べている。
 */
const caseCount: number = CASES.length;
const caseGrid = caseCount >= 3 ? "g3" : caseCount === 2 ? "g2" : "g1";

/**
 * お知らせ・記事（05）を出すかどうか。
 * 記事がまだ1本も無いので false。**判定はこの1か所だけ。**
 * 1本でも公開したら true にすればセクションが戻る。
 * ⚠ 05 が消えているあいだ、セクション番号は 01〜04 になる。それが正しい状態。
 */
const HAS_JOURNAL: boolean = false;

/**
 * お知らせ・記事の3枚（`HAS_JOURNAL` が true のときだけ描く）。
 * ⚠ 置き場所が未決（既存ブログにPCカテゴリを足すか、`content/pc/` を別に作るか）。
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

          {/* 器は件数で変わる（`caseGrid`）。3件に満たないあいだは3列に置かない。 */}
          <div className={`grid ${caseGrid}`}>
            {CASES.map((c) => (
              <Link key={c.slug} className="card" href={`/pc/case/${c.slug}`}>
                <Image
                  className="thumb"
                  src={c.image}
                  alt={c.imageAlt}
                  width={c.imageW}
                  height={c.imageH}
                  sizes="(max-width: 640px) 100vw, 560px"
                />
                <div className="body">
                  <div className="card-meta">
                    <span>{c.date}</span>
                    <span className="tag">
                      {c.area} ／ {c.machine}
                    </span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.summary}</p>
                  <div className="foot-of-card">
                    {c.hasReport && <span className="tag ok">診断報告書あり</span>}
                    <span className="read-on">読む →</span>
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

      {/* ---------- 04 診断書付き中古PC（背景を敷く1か所目） ----------
          ⚠ **在庫が0件なのでカタログの形にしない。**
            価格・構成・バッテリー健全度の数字は1つも書かないこと。実在庫が無く、
            出どころのない数字になる。「在庫あり」「商談中」のタグも同じ理由で出さない。
            `used-desktop.jpg` `used-gaming.jpg` も実在庫の写真ではないので使わない
            （ファイルは残してある。在庫が入る80でカタログに戻すときに使う）。 */}
      <section className="sec">
        <div className="w">
          <p className="eyebrow">USED PC</p>
          <h2>診断書付きの中古パソコン</h2>
          <p className="lead">
            修理より買い替えのほうが良いときのために、整備済みの中古パソコンもご用意しています。
            <b>どの個体にも、修理のときと同じ項目を測った診断報告書が付きます。</b>
            バッテリーの健全度もSSDの使用時間も、隠さず書いてあります。
          </p>

          <p className="sec-body">
            いまご案内できる在庫はありません。ご希望の用途とご予算を伺って、入荷したときにご連絡することもできます。
          </p>
          <p className="sec-body">
            新品のパーツで組むこともできます。用途とご予算を伺って構成をご提案します。
            <b>構成のご相談は無料</b>です。組み立てと初期設定までお引き受けします。
          </p>

          <Link className="btn p" href="/pc/contact">
            中古パソコン・BTOの相談をする
          </Link>
        </div>
      </section>

      {/* ---------- 05 お知らせ・記事 ---------- */}
      {/* ⚠ 記事が0本のあいだは**見出しも枠も出さない。**空の枠は作りかけに見える。
          出し戻しは `HAS_JOURNAL` の1か所だけで済むようにしてある。 */}
      {HAS_JOURNAL && (
        <section className="sec">
          <div className="w">
            <p className="eyebrow">JOURNAL</p>
            <h2>お知らせ・記事</h2>

            <div className="grid g3">
              {JOURNAL.map((j) => (
                <Link key={j.title} className="card" href={PC_JOURNAL_HREF}>
                  <div className="body">
                    <div className="card-meta">
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
      )}

      {/* ---------- CTA（背景を敷く唯一の場所） ----------
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
