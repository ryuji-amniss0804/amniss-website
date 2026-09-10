import { HOURS_RANGE, LINE_URL, TEL_HREF } from "@/lib/site";

/**
 * スマホ固定の電話／LINE。960px 以下でのみ表示される。
 * バーの高さぶんは site.css 側で `body.rv` に padding-bottom:60px を入れて逃がしてある
 * （バーが出ない幅では余白も付けない）。
 *
 * 電話にだけ受付時間を添える。**LINE は24時間受けられるので足さない**
 * （足すと嘘になる）。並べておけば「電話は日中、LINEはいつでも」が言葉なしで伝わる。
 * ⚠ いまが受付時間内かで出し分けないこと。サーバーとブラウザで時刻がずれる。
 */
export default function MobileBar() {
  return (
    <div className="mbar">
      <a className="p" href={TEL_HREF}>
        <b>電話する</b>
        <span>{HOURS_RANGE}</span>
      </a>
      <a href={LINE_URL} target="_blank" rel="noopener noreferrer">
        LINEで相談
      </a>
    </div>
  );
}
