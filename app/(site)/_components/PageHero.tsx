type Props = {
  /** 英字の小見出し（黄色）。`COMPANY` など */
  kicker: string;
  /** 見出し。1行 */
  title: string;
  /** 見出しの下の一言。省いてよい */
  lead?: string;
};

/**
 * 小さいページ用のヒーロー。紺の地・英字の小見出し＋見出し1行（93_other_pages）。
 * /company・/contact・/blog・/tokushoho・/privacy で使う
 * （記事ページは同じクラスを直に組んでいる。パンくずと日付が入るため）。
 *
 * 見た目の正は参考モック（top_mock_20261008/Others.dc.html の `phero`）。
 * 料金のページの PriceHero（見出し2行・黄色の塗り・ボタン）より低く、動きも付けない。
 */
export default function PageHero({ kicker, title, lead }: Props) {
  return (
    <section className="op-phero">
      <div className="tw">
        <p className="op-phero-k">{kicker}</p>
        <h1>{title}</h1>
        {lead ? <p className="op-phero-lead">{lead}</p> : null}
      </div>
    </section>
  );
}
