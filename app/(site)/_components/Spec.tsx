import type { ReactNode } from "react";

type Props = {
  /** 字間を開けた日本語のラベル。`積 め る サ イ ズ` など */
  label: string;
  /** 明朝で出す本体。寸法・計算式など */
  value: ReactNode;
  /** 補足。省略可 */
  children?: ReactNode;
  /** value の文字サイズを落とす（計算式など長いもの用） */
  small?: boolean;
};

/**
 * 枠線1本の仕様ボックス。
 * このデザインで「囲む」ことを許しているのはここだけ。
 * 影・角丸・背景色は付けない。
 */
export default function Spec({ label, value, children, small }: Props) {
  return (
    <div className="spec">
      <div className="k">{label}</div>
      <div className="v mincho" style={small ? { fontSize: "17px", marginTop: "12px" } : undefined}>
        {value}
      </div>
      {children ? <div className="d">{children}</div> : null}
    </div>
  );
}
