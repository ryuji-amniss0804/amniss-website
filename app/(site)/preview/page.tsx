import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PREVIEWS } from "./_samples";
import Split from "../_components/Split";

export const metadata: Metadata = {
  title: "コンポーネント確認",
  robots: { index: false, follow: false },
};

export default function PreviewIndex() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Split kicker="段 階 2" title="共通コンポーネント" note="開発サーバーでのみ表示されます。" first>
      <table className="price">
        <thead>
          <tr>
            <th>コンポーネント</th>
            <th className="r">仕様</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(PREVIEWS).map(([key, entry]) => (
            <tr key={key}>
              <td>
                <div className="nm">
                  <Link className="tl" href={`/preview/${key}`}>
                    {entry.title}
                  </Link>
                </div>
                <div className="ds">{entry.note}</div>
              </td>
              <td className="r" style={{ fontSize: "13px", fontFamily: "inherit" }}>
                /preview/{key}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Split>
  );
}
