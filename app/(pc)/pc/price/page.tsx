import type { Metadata } from "next";
import { DIAGNOSIS_FEE, LABOR, MENU, PAYMENTS, TRAVEL, TRAVEL_MAX, yen } from "@/lib/pc";

/**
 * /pc/price 料金ページ。
 * 手本：D:\revive_toyama_marketing\mockup_pc_site_v1.html の `#/price`
 *
 * ⚠ 金額はすべて `lib/pc.ts` から引く。ページに直接書かないこと。
 *   工賃の3枚はトップページと同じ `LABOR` を読む。**ズレたらそれはバグ。**
 * ⚠ `.pc-top` を付けないこと。付けるとセクション番号（01 ／ …）が出る。
 *   番号はトップページだけのもの。
 * ⚠ 背景（`.sec.band`）は敷かない。セクションは余白と罫線で区切る。
 * ⚠ マーカー（`.lead b` と `.mk`）は1セクションにつき1か所まで。
 *   このページで引くのは3か所（リード文／作業工賃／直せないとき）だけ。
 *
 * noindex はレイアウト（`app/(pc)/layout.tsx`）の `robots` が効いている。
 * ここでは指定しない（外すのは81）。
 */

export const metadata: Metadata = {
  title: "料金 | パソコン修理・出張診断 re'vive_doc 富山",
  description:
    "出張診断3,000円＋作業工賃＋出張費＋部品代。作業工賃は本体を開けるかどうかで3段（8,000円／14,000円／20,000円）。出張費は富山県内どこでも6,000円が上限です。直せないときは診断料と出張費のみ。",
  alternates: { canonical: "/pc/price" },
};

export default function PcPricePage() {
  return (
    <>
      {/* ---------- 料金（このページの h1） ---------- */}
      <section className="sec">
        <div className="w">
          <p className="eyebrow">PRICE</p>
          <h1>料金</h1>
          <p className="lead">
            お支払いは4つの合計です。
            <b>
              出張診断 {yen(DIAGNOSIS_FEE)}円 ＋ 作業工賃 ＋ 出張費 ＋ 部品代
            </b>
            。診断料は作業工賃に充当するので、そのまま作業に進む場合の実質負担はありません。
          </p>
        </div>
      </section>

      {/* ---------- 作業工賃 ----------
          トップページの3枚と同じ `LABOR` を読む詳細版。
          判定基準（rule）と中身（items）を出すぶんが、トップとの違い。 */}
      <section className="sec">
        <div className="w">
          <h2>作業工賃</h2>
          <p className="lead">
            <b>本体を開けるかどうかで、3段に分けています。</b>
            作業時間ではなく作業の内容で決まるので、伺う前におおよその金額をお伝えできます。
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
        </div>
      </section>

      {/* ---------- 出張費 ----------
          表は `.tw` の箱で包む。390px では表が収まらないので、
          箱の中だけが横に動く（ページ本体は横スクロールさせない）。 */}
      <section className="sec">
        <div className="w">
          <h2>出張費（富山県内）</h2>

          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">エリア</th>
                  <th scope="col">市町村</th>
                  <th scope="col" className="n">
                    出張費
                  </th>
                </tr>
              </thead>
              <tbody>
                {TRAVEL.map((t) => (
                  <tr key={t.label}>
                    <th scope="row">{t.label}</th>
                    <td>{t.cities.join("・")}</td>
                    <td className="n">{yen(t.fee)} 円</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="note">
            県内はいくら遠くても {yen(TRAVEL_MAX)}円が上限です。
          </p>
        </div>
      </section>

      {/* ---------- 個別メニュー ----------
          `price` が null のものは「要見積り」。金額を書かないこと。 */}
      <section className="sec">
        <div className="w">
          <h2>個別メニュー</h2>

          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">内容</th>
                  <th scope="col">備考</th>
                  <th scope="col" className="n">
                    料金
                  </th>
                </tr>
              </thead>
              <tbody>
                {MENU.map((m) => (
                  <tr key={m.name}>
                    <th scope="row">{m.name}</th>
                    <td>{m.note}</td>
                    <td className="n">
                      {m.price === null ? "要見積り" : `${yen(m.price)} 円`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- 直せないとき ---------- */}
      <section className="sec">
        <div className="w">
          <h2>直せないとき</h2>
          <div className="callout">
            <p>
              <b className="mk">
                直せないと判断したときは、診断料と出張費のみをいただきます。
              </b>
              作業工賃も部品代もかかりません。「とりあえず開けてみましょう」で費用が積み上がることはありません。
            </p>
          </div>
        </div>
      </section>

      {/* ---------- お支払い方法 ----------
          ⚠ カードとQRは未開通。`ready: false` は「準備中」と出す。
            使えるかのように書かないこと。 */}
      <section className="sec">
        <div className="w">
          <h2>お支払い方法</h2>

          <div className="grid g4">
            {PAYMENTS.map((p) => (
              <div key={p.name} className="card">
                <div className="body">
                  <span className={p.ready ? "tag ok top" : "tag top"}>
                    {p.ready ? "ご利用いただけます" : "準備中"}
                  </span>
                  <h3>{p.name}</h3>
                </div>
              </div>
            ))}
          </div>

          <p className="note">
            クレジットカードとQRコード決済は準備中です。開通しましたら、このページでお知らせします。
          </p>
        </div>
      </section>
    </>
  );
}
