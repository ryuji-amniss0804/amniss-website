import { LINE_URL, TEL_HREF } from "@/lib/site";

/**
 * スマホ固定の電話／LINE。960px 以下でのみ表示される。
 * バーの高さぶんは site.css 側で `body.rv` に padding-bottom:60px を入れて逃がしてある
 * （バーが出ない幅では余白も付けない）。
 */
export default function MobileBar() {
  return (
    <div className="mbar">
      <a className="p" href={TEL_HREF}>
        電話する
      </a>
      <a href={LINE_URL} target="_blank" rel="noopener noreferrer">
        LINEで相談
      </a>
    </div>
  );
}
