import type { Metadata } from "next";
import { DIAGNOSIS_FEE, LABOR, MENU, PAYMENTS, PC_META, TRAVEL, TRAVEL_MAX, yen } from "@/lib/pc";
import PcLastCta from "../../_components/PcLastCta";
import PcLicense from "../../_components/PcLicense";
import PcPageHero from "../../_components/PcPageHero";

/**
 * /pc/price 料金ページ。
 *
 * 【94】本体（re'vive）と同じトーンに載せ替えた。**文と金額は前のまま。**
 * 4つの箱と工賃の3枚はトップ（/pc）の料金の節と同じ形、出張費とメニューの表は本体の 92 の表の形。
 *
 * ⚠ 金額はすべて `lib/pc.ts` から引く。ページに直接書かないこと。
 *   工賃の3枚はトップページと同じ `LABOR` を読む。**ズレたらそれはバグ。**
 *
 * robots はレイアウト（`app/(pc)/layout.tsx`）で一括して見ている。ここでは指定しない。
 */

export const metadata: Metadata = {
  title: "料金 | パソコン修理・出張診断 re'vive_doc 富山",
  description: PC_META.price,
  alternates: { canonical: "/pc/price" },
};

export default function PcPricePage() {
  return (
    <>
      {/* ---------- 料金（このページの h1） ---------- */}
      <PcPageHero kicker="PRICE" title="料金">
        お支払いは4つの合計です。
        <b>
          出張診断 {yen(DIAGNOSIS_FEE)}円 ＋ 作業工賃 ＋ 出張費 ＋ 部品代
        </b>
        。診断料は作業工賃に充当するので、そのまま作業に進む場合の実質負担はありません。
      </PcPageHero>
      <PcLicense />

      {/* ---------- 作業工賃 ----------
          4つの箱と3枚は、トップページと同じ `LABOR` を読む。 */}
      <section className="sec">
        <div className="w">
          <div className="formula">
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

          <div className="sec-hd">
            <h2 className="h2 sm">作業工賃</h2>
            <p className="lead">
              <b>本体を開けるかどうかで、3段に分けています。</b>
              作業時間ではなく作業の内容で決まるので、伺う前におおよその金額をお伝えできます。
            </p>
          </div>

          <div className="labor">
            {LABOR.map((l) => {
              const pop = "popular" in l && l.popular;
              return (
                <div key={l.key} className={pop ? "lb pop" : "lb"}>
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
        </div>
      </section>

      {/* ---------- 出張費 ---------- */}
      <section className="sec bg2">
        <div className="w">
          <div className="sec-hd">
            <h2 className="h2 sm">出張費（富山県内）</h2>
          </div>

          <div className="tw">
            <table className="tbl">
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
                    <td className="n p">
                      {yen(t.fee)}
                      <small> 円</small>
                    </td>
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
          <div className="sec-hd">
            <h2 className="h2 sm">個別メニュー</h2>
          </div>

          <div className="tw">
            <table className="tbl">
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
                    {m.price === null ? (
                      <td className="n est">要見積り</td>
                    ) : (
                      <td className="n p">
                        {yen(m.price)}
                        <small> 円</small>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- 直せないとき ---------- */}
      <section className="sec bg2">
        <div className="w">
          <div className="sec-hd">
            <h2 className="h2 sm">直せないとき</h2>
          </div>
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
          <div className="sec-hd">
            <h2 className="h2 sm">お支払い方法</h2>
          </div>

          <div className="pays">
            {PAYMENTS.map((p) => (
              <div key={p.name} className={p.ready ? "pay" : "pay off"}>
                <span className={p.ready ? "tag ok" : "tag"}>
                  {p.ready ? "ご利用いただけます" : "準備中"}
                </span>
                <h3>{p.name}</h3>
              </div>
            ))}
          </div>

          <p className="note">
            クレジットカードとQRコード決済は準備中です。開通しましたら、このページでお知らせします。
          </p>
        </div>
      </section>

      <PcLastCta />
    </>
  );
}
