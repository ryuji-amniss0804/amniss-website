import { LICENSES } from "@/lib/site";

type Props = {
  /**
   * `badge` はトップだけの見た目（紺の地・黄色のチェックつきの丸いバッジ。91_top_lower）。
   * ★既定の見た目は変えないこと。下層の4ページ（moving・unpan・houjin・kaitori）が既定のまま使っている。
   */
  variant?: "badge";
};

/**
 * バッジの中身を「前の文字」と「折り返させない末尾」に割る。
 * 古物商許可の「第…号」を `.nw` で束ねるため。そのままだと幅しだいで
 * 「第」と数字が別の行に割れる。番号はここに書き写さない。
 * 前の文字は1本の文字列にしてある（JSX で割ると React が境目に `<!-- -->` を入れる）。
 */
function split(label: string, value: string): [string, string | null] {
  if (!value) return [label, null];
  const i = value.lastIndexOf(" ");
  if (i < 0) return [`${label} ${value}`, null];
  return [`${label} ${value.slice(0, i)} `, value.slice(i + 1)];
}

/**
 * 許認可の帯。文字だけ。背景 --paper-2、上下に罫線。
 * バッジ・アイコンは使わない（トップの `variant="badge"` を除く）。
 */
export default function LicenseStrip({ variant }: Props) {
  if (variant === "badge") {
    return (
      <div className="tp tp-lic">
        <div className="tw">
          {LICENSES.map((l) => {
            const [text, nw] = split(l.label, l.value);
            return (
              <span className="tp-badge" key={l.label}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
                <span>
                  {text}
                  {nw ? <span className="nw">{nw}</span> : null}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="lic">
      <div className="w">
        {LICENSES.map((l) => (
          <span key={l.label}>
            <b>{l.label}</b>
            {l.value ? `　${l.value}` : null}
          </span>
        ))}
      </div>
    </div>
  );
}
