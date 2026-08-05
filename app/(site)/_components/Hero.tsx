import type { ReactNode } from "react";
import Photo from "./Photo";
import { SIZES_CONTENT, type SiteImage } from "@/lib/images";

type Props = {
  /** 字間を開けた日本語のラベル。`出 張 買 取 ／ 富 山 県 全 域` など */
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** ボタンなど */
  actions?: ReactNode;
  image?: SiteImage;
  caption?: string;
  /** トップは "lg"（40px）、下層ページは "md"（33px） */
  size?: "lg" | "md";
};

/**
 * ヒーロー。帯ではなく紙面として組む。
 *
 * **文字を写真に重ねない。**見出し・リード・ボタンを先に置き、写真はその下。
 * 重ねると写真側を暗く落とす必要が出るが、背景が整理されている写真では
 * 暗くした時点で写っている情報が潰れてしまう。
 * 写真に文字を重ねたい場合は treatment: "dark" の画像を使うこと。
 */
export default function Hero({ kicker, title, lead, actions, image, caption, size = "lg" }: Props) {
  return (
    <section className={size === "md" ? "hero md" : "hero"}>
      <div className="w in">
        {kicker ? <div className="kicker">{kicker}</div> : null}
        <h1 className="mincho">{title}</h1>
        {lead ? <p className="sub">{lead}</p> : null}
        {actions ? <div className="acts">{actions}</div> : null}
        {image ? <Photo image={image} sizes={SIZES_CONTENT} priority caption={caption} /> : null}
      </div>
    </section>
  );
}
