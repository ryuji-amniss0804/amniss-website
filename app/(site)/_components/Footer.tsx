import Link from "next/link";
import {
  AREA,
  COMPANY,
  FOOTER_COMPANY,
  FOOTER_SERVICES,
  HOURS,
  LICENSE_LINE,
  TEL,
  TEL_HREF,
  WASTE_NOTICE,
} from "@/lib/site";

/**
 * フッター。サービス／会社情報の2列＋事業者情報、下に許認可と廃棄物の但し書き。
 * WASTE_NOTICE は法務確認済みの文言。ここで言い換えないこと。
 */
export default function Footer() {
  return (
    <footer className="site">
      <div className="w">
        <div className="fg">
          <div>
            <div className="lg">{COMPANY.brand}</div>
            <p style={{ marginTop: "14px", lineHeight: 2.1, fontSize: "13px" }}>
              運営：{COMPANY.legal}／代表 {COMPANY.representative}
              <br />
              {COMPANY.address}　対応エリア：{AREA}
              <br />
              TEL{" "}
              <a href={TEL_HREF}>{TEL}</a>（{HOURS}）
            </p>
          </div>

          <div>
            {/* 字間は CSS 側（letter-spacing:.18em）で開けている。文字列に空白を入れない */}
            <h4>サービス</h4>
            <ul>
              {FOOTER_SERVICES.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>会社情報</h4>
            <ul>
              {FOOTER_COMPANY.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="fnote">
          {LICENSE_LINE}
          <br />
          {WASTE_NOTICE}
          <br />
          &copy; 2026 AmNiss &amp; Co. Japan
        </div>
      </div>
    </footer>
  );
}
