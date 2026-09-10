import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CASES, LABOR, yen } from "@/lib/pc";

/**
 * /pc/case/01-raiden 事例01の本文。
 * 手本：D:\revive_toyama_marketing\mockup_pc_site_v1.html の `#/case/01`
 *
 * 【なぜ markdown ではないか】`lib/pc.ts` の `CASES` のコメントに書いた。
 *   一覧に出す情報（題・日付・地域・要約・写真）は `CASES`、本文はここ。
 *
 * ⚠ **測定値は報告書の実データ。**出どころは
 *   D:\tool developer\pc_check_tool\reports\20260904_A520M-HDV_診断報告書.html。
 *   丸めたり、それらしく書き換えたりしないこと。この数値がこのページの価値。
 * ⚠ **構成の型番（マザーボード名・GPU名・メモリ規格）は本文に書かない。**
 *   お客様の機体が特定されないようにするため。出すのは測定値だけ。
 * ⚠ **費用の表は「当時の金額」。**`priceOf()` で組み立てないこと。
 *   料金改定のときに過去の請求の記録まで書き換わる。過去の請求額は直書きが正しい。
 *   逆に注記の「いまの料金では標準作業（◯円）」は**現在の料金**なので、
 *   `LABOR` の `std` から引く（直書きするとズレる）。
 * ⚠ 「お客様の声」の引用は**お客様が書いた文そのまま。**整えない・短くしない・順序を変えない。
 *   名前とアイコンは出さない（本文も報告書画像も匿名化してある。そろえる）。
 *   「（中略）」は抜いたことが読み手に分かる印なので消さない。★は文字で出す（画像にしない）。
 *   **この引用を `/pc/case`（一覧）や `/pc` トップに転記しないこと。**
 *   同じ声を何か所にも置くと、1件を水増しして見せている形になる。出すのはこのページだけ。
 * ⚠ `voice` が null のあいだは「お客様の声」の節を**見出しごと出さない。**
 *   空の引用枠を本番に出すと、作りかけに見える。2件目以降はクチコミが無いことがある。
 * ⚠ `.pc-top` を付けないこと。付けるとセクション番号（01 ／ …）が出る。
 *
 * robots はレイアウト（`app/(pc)/layout.tsx`）で一括して見ている。ここでは指定しない。
 */

const CASE = CASES.find((c) => c.slug === "01-raiden")!;

/** いまの料金表での位置づけ。**現在の料金**なので `lib/pc.ts` から引く */
const STD = LABOR.find((l) => l.key === "std")!;

export const metadata: Metadata = {
  title: `${CASE.title} | 修理事例 | re'vive_doc 富山`,
  description: CASE.summary,
  alternates: { canonical: "/pc/case/01-raiden" },
};

export default function PcCase01Page() {
  return (
    <section className="sec">
      <div className="w">
        <article className="article">
          <div className="card-meta">
            <span>{CASE.date}</span>
            <span className="tag">
              {CASE.area} ／ {CASE.machine}
            </span>
            {CASE.hasReport && <span className="tag ok">診断報告書あり</span>}
          </div>

          <h1>
            落雷で起動しなくなった1台が、
            <br />
            部品交換なしで戻った
          </h1>

          <p className="ld">
            「雷が鳴ったあとから、電源を押しても何も起きない」。そういうご相談でした。
            <b>結果からお伝えすると、この1台は部品をひとつも替えずに戻っています。</b>
          </p>

          <figure>
            <Image
              src={CASE.image}
              alt="お預かりした個体の内部"
              width={CASE.imageW}
              height={CASE.imageH}
              sizes="(max-width: 760px) 100vw, 720px"
              priority
            />
            <figcaption>
              お預かりした個体（お客様の許可を得て撮影し、個体が特定できないよう処理しています）
            </figcaption>
          </figure>

          <h2>落雷のあとは、まず「どこまでやられたか」がわからない</h2>
          <p>
            雷が原因の故障でいちばん困るのは、外から見ても壊れた場所がわからないことです。電源が入らないという症状ひとつでも、電源ユニット、マザーボード、SSD、そのどれが原因でもあり得ます。
          </p>
          <p>
            ここで部品を疑って先に買ってしまうと、直らなかったときに部品代だけが手元に残ります。だから
            <b>部品を買う前に、測ります。</b>
          </p>

          <h2>お客様のWindowsには、ログインしていません</h2>
          <p>
            USBメモリの中に作った検査システムから起動して、ハードウェア単体の状態だけを読み取ります。内蔵ディスクへの書き込みは行いません。写真も書類も、中のデータには一切触れていません。
          </p>

          <h2>測った結果、SSDは壊れていませんでした</h2>
          <p>
            落雷でSSDのコントローラが一時的に停止し、起動不良に至った個体でした。記憶素子とデータ経路そのものには、損傷が残っていませんでした。
          </p>

          {/* ⚠ 測定値は報告書の実データ。1つも変えないこと */}
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">測った項目</th>
                  <th scope="col">結果</th>
                  <th scope="col" className="n">
                    数値
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">データ破損エラー</th>
                  <td>損傷なし</td>
                  <td className="n">0 件</td>
                </tr>
                <tr>
                  <th scope="row">予備領域（残存）</th>
                  <td>消費されていない</td>
                  <td className="n">100 %</td>
                </tr>
                <tr>
                  <th scope="row">消耗度</th>
                  <td>寿命の92%が残存</td>
                  <td className="n">8 %</td>
                </tr>
                <tr>
                  <th scope="row">累積稼働時間</th>
                  <td>—</td>
                  <td className="n">18,585 時間</td>
                </tr>
                <tr>
                  <th scope="row">異常終了の回数</th>
                  <td>落雷時を含む累計</td>
                  <td className="n">41 回</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="note">
            メモリは全パターン検査を完走してエラー0件、CPUは12スレッド5分間の連続負荷で演算エラー0件。落雷の侵入経路として最も多いLANポートにも損傷はありませんでした。
          </p>

          <div className="callout">
            <p>
              <b>ここが判断の分かれ目です。</b>
              「落雷のあとだから、SSDは交換しておきましょう」と言えば、この個体でも部品代をいただけました。でも測ってみれば、寿命は92%残っていました。替える理由がありません。
            </p>
          </div>

          <h2>やったのは、清掃とグリスの塗り替えです</h2>
          <p>
            起動を回復させたあと、内部の分解清掃とCPUグリスの塗り替えを行いました。そのうえで、全コアに5分間の連続負荷をかけて冷却が効いているかを確かめています。
          </p>

          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">冷却の確認</th>
                  <th scope="col" className="n">
                    測定値
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">負荷開始時の温度</th>
                  <td className="n">70.0 ℃</td>
                </tr>
                <tr>
                  <th scope="row">5分後の最高温度</th>
                  <td className="n">81.2 ℃</td>
                </tr>
                <tr>
                  <th scope="row">保護動作が働く目安</th>
                  <td className="n">95 ℃</td>
                </tr>
                <tr>
                  <th scope="row">CPUファン回転数</th>
                  <td className="n">1,091 → 1,948 rpm</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            81.2℃で頭打ちになり、そこから横ばいで安定しました。温度による性能低下も起きていません。
          </p>

          <figure>
            <Image
              src="/pc/case-report-anon.jpg"
              alt="この案件でお渡しした診断報告書"
              width={680}
              height={771}
              sizes="(max-width: 760px) 100vw, 720px"
            />
            <figcaption>この案件でお渡しした診断報告書（実物・匿名化しています）</figcaption>
          </figure>

          <h2>かかった費用は 12,000円でした</h2>

          {/* ⚠ ここは当時の請求額。`priceOf()` で組み立てないこと。
              料金改定のときに、過去の請求の記録まで書き換わってしまう。 */}
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">項目</th>
                  <th scope="col">内容</th>
                  <th scope="col" className="n">
                    金額
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">出張診断</th>
                  <td>作業工賃に充当</td>
                  <td className="n">3,000 円</td>
                </tr>
                <tr>
                  <th scope="row">作業工賃</th>
                  <td>起動の回復・分解清掃・グリスの塗り替え・各部診断（診断料を含む）</td>
                  <td className="n">12,000 円</td>
                </tr>
                <tr>
                  <th scope="row">出張費</th>
                  <td>富山市内</td>
                  <td className="n">0 円</td>
                </tr>
                <tr>
                  <th scope="row">部品代</th>
                  <td>交換した部品なし</td>
                  <td className="n">0 円</td>
                </tr>
                <tr className="total">
                  <th scope="row">合計</th>
                  <td />
                  <td className="n">12,000 円</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <b>部品をひとつも買っていないので、部品代は0円です。</b>
            「落雷のあとだからSSDは交換しましょう」と言っていれば、ここに1万円以上が乗っていました。
          </p>

          <p className="note box">
            ※
            これは現在の料金表を定める前にお受けした案件で、当時の金額です。本体を開けて分解清掃とグリスの塗り替えを行っているので、
            <Link href="/pc/price">いまの料金</Link>では{STD.name}（{yen(STD.price)}円）にあたります。
          </p>

          <h2>お預かりは、月曜から金曜まででした</h2>
          <p>
            作業そのものは1日で終わっています。ただ、そのときほかの作業が立て込んでいて、この個体に手をつけられたのが週の後半でした。月曜日にお預かりして、金曜日のお返しです。
          </p>
          <p>
            サイトに「最短翌日返却」と書いているのは、
            <b>部品の取り寄せがなく、その日に手が空いていれば、という意味です。</b>
            混んでいればこの案件のように数日いただきます。お預かりのときに、必ず目安の日をお伝えします。
          </p>

          <h2>最後にお伝えしたこと</h2>
          <p>直って終わり、にはしていません。同じことが起きないように、3つお伝えしました。</p>
          <ul>
            <li>
              <b>雷サージ保護付きの電源タップを入れてください。</b>
              数千円で買えます。今回は電源側から入ったと考えられるので、同じ経路での再発は防げます。
            </li>
            <li>
              <b>大事なデータは、本体とは別の場所にも置いてください。</b>
              外付けHDDでもクラウドでも構いません。
            </li>
            <li>SSDは寿命が92%残っているので、当面の交換は不要です。</li>
          </ul>

          {/* お客様の声。⚠ `voice` が null のあいだは見出しも引用枠も出さない。
              本文は `lib/pc.ts` の `CASES[].voice`。文言を触らないこと。
              <footer> は出典の1行。**どこの・いつの・抜いてあることが分かる形**を保つ。 */}
          {CASE.voice && (
            <>
              <h2>このあと、お客様からいただいた評価</h2>
              <blockquote className="voice">
                <p>{CASE.voice}</p>
                <footer>Google のクチコミより（2026年9月・★5・中略）</footer>
              </blockquote>
            </>
          )}

          <div className="callout warn">
            <p>
              <b>ひとつだけ、正直にお伝えしていることがあります。</b>
              雷を受けた機体は、部分的な損傷が数か月後に出てくることがあります。今回の診断時点では全項目が正常でしたが、この先の無故障を保証するものではありません。だからこそバックアップをおすすめしています。
            </p>
          </div>
        </article>

        <div className="center article-cta">
          <Link className="btn p" href="/pc/contact">
            同じような症状で相談する
          </Link>
          <Link className="btn s" href="/pc/case">
            ほかの事例を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
