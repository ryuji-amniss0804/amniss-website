import { AREA, LICENSES } from "@/lib/site";

/**
 * 許認可の帯。紺の地にバッジ（本体のトップと同じ形。チェックの色だけグリーン）。
 *
 * 古物商許可とSDGsは `lib/site.ts` の `LICENSES` が唯一の出どころ。**文字を書き写さないこと。**
 * 94 で「富山県SDGs宣言事業者」→「富山県SDGs宣言企業」に直した（`LICENSES` のラベルをそのまま出す）。
 * 貨物軽自動車運送事業はパソコン修理に関係がないので出さない。
 */
const kobutsu = LICENSES.find((l) => l.label === "古物商許可");
const sdgs = LICENSES.find((l) => l.label === "富山県SDGs宣言企業");

/** 「第…号」を折り返させないために、最後の空白で割る。番号はここに書き写さない */
function split(label: string, value: string): [string, string | null] {
  const i = value.lastIndexOf(" ");
  if (i < 0) return [`${label} ${value}`, null];
  return [`${label} ${value.slice(0, i)} `, value.slice(i + 1)];
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

export default function PcLicense() {
  const k = kobutsu ? split(kobutsu.label, kobutsu.value) : null;
  return (
    <div className="lic">
      <div className="w lic-in">
        {k && (
          <span className="badge">
            <Check />
            <span>
              {k[0]}
              {k[1] ? <span className="nw">{k[1]}</span> : null}
            </span>
          </span>
        )}
        {sdgs && (
          <span className="badge">
            <Check />
            <span>{sdgs.label}</span>
          </span>
        )}
        <span className="badge">
          <Check />
          <span>{`${AREA} 出張対応`}</span>
        </span>
      </div>
    </div>
  );
}
