import type { ReactNode } from "react";

/**
 * 症状カードの線画アイコン。
 *
 * キーは `lib/pc.ts` の `SYMPTOMS` が持つ `icon` の値。
 * 文字だけだと4枚並んだときに読み分けられないので、必ず出す。
 *
 * ⚠ 24×24・線画・`stroke` で描く。塗り（`fill`）で描いたものを混ぜないこと。
 *   太さ・線の端・色は `pc.css` の `.ic` が持つ。ここには書かない。
 * ⚠ 知らないキーが来ても落とさない（何も描かずに null を返す）。
 *   `SYMPTOMS` に症状を足してアイコンを足し忘れても、ページは出る。
 */
const PATHS: Record<string, ReactNode> = {
  pw: (
    <>
      <path d="M12 3.2v8" />
      <path d="M6.8 6.6a7.6 7.6 0 1 0 10.4 0" />
    </>
  ),
  slow: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 6.9v5.3l3.4 2" />
    </>
  ),
  disp: (
    <>
      <rect x="2.7" y="4" width="18.6" height="12.3" rx="1.6" />
      <path d="M8.6 20h6.8M12 16.3V20" />
      <path d="M4.6 5.9 19.4 14.4" />
    </>
  ),
  heat: (
    <>
      <path d="M14 13.6V5.5a2 2 0 1 0-4 0v8.1a4 4 0 1 0 4 0z" />
      <path d="M12 9.7v4.5" />
    </>
  ),
  /** ゲーム中に落ちる。コントローラ */
  game: (
    <>
      <path d="M7.5 10.5h3M9 9v3" />
      <circle cx="15.4" cy="10.4" r=".9" />
      <circle cx="17.4" cy="12.6" r=".9" />
      <path d="M6.6 7.5h10.8a3.2 3.2 0 0 1 3.1 2.4l1.1 4.4a2.3 2.3 0 0 1-4.1 1.9l-1.3-1.7H7.8l-1.3 1.7a2.3 2.3 0 0 1-4.1-1.9l1.1-4.4a3.2 3.2 0 0 1 3.1-2.4z" />
    </>
  ),
  /** 周辺機器がつながらない。電波 */
  wifi: (
    <>
      <path d="M2.9 8.7a14 14 0 0 1 18.2 0" />
      <path d="M6.3 12.4a9 9 0 0 1 11.4 0" />
      <path d="M9.6 16.1a4.3 4.3 0 0 1 4.8 0" />
      <path d="M12 19.4h.01" />
    </>
  ),
  /** ウイルスの警告が消えない。盾に「！」 */
  shield: (
    <>
      <path d="M12 3.2 4.8 6v5.4c0 4.3 3 8.2 7.2 9.4 4.2-1.2 7.2-5.1 7.2-9.4V6L12 3.2z" />
      <path d="M12 8.6v4" />
      <path d="M12 15.4h.01" />
    </>
  ),
  /** 新しいパソコンの設定。画面の中にコマンド行 */
  setup: (
    <>
      <rect x="2.7" y="4.4" width="18.6" height="12" rx="1.6" />
      <path d="M8.6 20h6.8M12 16.4V20" />
      <path d="M9 10.4l2 2-2 2" />
      <path d="M13.2 14.4h2.4" />
    </>
  ),
  water: <path d="M12 3.4s5.5 5.6 5.5 9.1a5.5 5.5 0 1 1-11 0C6.5 9 12 3.4 12 3.4z" />,
  data: (
    <>
      <path d="M12 3.5v10.2" />
      <path d="M8.3 10.1 12 13.8l3.7-3.7" />
      <path d="M4.5 15.4v3.1a1.6 1.6 0 0 0 1.6 1.6h11.8a1.6 1.6 0 0 0 1.6-1.6v-3.1" />
    </>
  ),
};

export default function PcIcon({ name }: { name: string }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
      {d}
    </svg>
  );
}
