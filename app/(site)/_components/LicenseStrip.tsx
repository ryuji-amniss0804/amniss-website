import { LICENSES } from "@/lib/site";

/**
 * 許認可の帯。文字だけ。背景 --paper-2、上下に罫線。
 * バッジ・アイコンは使わない。
 */
export default function LicenseStrip() {
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
