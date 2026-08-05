import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PREVIEWS, PREVIEW_KEYS } from "../_samples";

/**
 * 共通コンポーネントの確認用。開発サーバーでのみ表示する。
 * 本番ビルドでは 404 にしてあるので、公開ページとしては存在しない。
 */

export const metadata: Metadata = {
  title: "コンポーネント確認",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return PREVIEW_KEYS.map((c) => ({ c }));
}

export default async function PreviewPage({ params }: { params: Promise<{ c: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();

  const { c } = await params;
  const entry = PREVIEWS[c];
  if (!entry) notFound();

  return <>{entry.render()}</>;
}
