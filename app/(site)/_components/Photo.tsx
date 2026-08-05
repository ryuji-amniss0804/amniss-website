import Image from "next/image";
import type { SiteImage } from "@/lib/images";

type Props = {
  image: SiteImage;
  /** next/image の sizes。lib/images.ts の SIZES_* を渡す */
  sizes: string;
  /** ヒーローの1枚だけ true。それ以外に付けないこと */
  priority?: boolean;
  caption?: string;
  className?: string;
};

/**
 * 画像の共通ラッパ。
 *
 * 加工の判断は lib/images.ts の treatment に持たせてあり、ここでは指定できない。
 * 「この1枚だけ暗くしたい」という都度の判断が入ると、方針が文章にしか残らなくなるため。
 *
 *  plain … 素のまま
 *  muted … saturate(.72) contrast(1.06) brightness(.94)
 *  dark  … 強い減光 ＋ 可読性のオーバーレイ。**オーバーレイは外せない。**
 *          この数字は上に白い文字を乗せて初めて成立するもので、
 *          文字が乗らない場所に当てると露出に失敗した写真になる。
 *
 * object-fit で切り取るときの位置（objectPosition）も同じ理由で lib/images.ts 側にある。
 */
export default function Photo({ image, sizes, priority, caption, className }: Props) {
  const treat =
    image.treatment === "dark" ? "fig-dark" : image.treatment === "muted" ? "fig-muted" : "";
  const figClass = ["fig", treat, className].filter(Boolean).join(" ");

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
          style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
        />
      </div>
      {caption ? <figcaption className="cap">{caption}</figcaption> : null}
    </figure>
  );
}
