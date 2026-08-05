import Image from "next/image";
import type { SiteImage } from "@/lib/images";

type Props = {
  image: SiteImage;
  /** next/image の sizes。lib/images.ts の SIZES_* を渡す */
  sizes: string;
  /** ヒーローの1枚だけ true。それ以外に付けないこと */
  priority?: boolean;
  caption?: string;
  /** ヒーローの文字を読ませるためのグラデーションを重ねる */
  overlay?: boolean;
  className?: string;
};

/**
 * 画像の共通ラッパ。
 * 暗くする／そのままの判断は lib/images.ts の treatment に持たせてあり、
 * ここでは「一律に暗くする」ことはしない。
 * treatment: "dark" のときだけ filter + rgb(16,23,32) 34% のブレンドが乗る。
 */
export default function Photo({ image, sizes, priority, caption, overlay, className }: Props) {
  const figClass = ["fig", image.treatment === "dark" ? "fig-dark" : "", overlay ? "fig-hero" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <figure>
      <div className={figClass}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
        />
      </div>
      {caption ? <figcaption className="cap">{caption}</figcaption> : null}
    </figure>
  );
}
