import { images, type ImageName } from "../data/images";

interface PictureProps {
  name: ImageName;
  alt: string;
  /** `sizes` is required: getting it wrong is the usual cause of oversized downloads. */
  sizes: string;
  className?: string;
  /** above-the-fold images opt out of lazy loading and get fetch priority */
  priority?: boolean;
  style?: React.CSSProperties;
  imgRef?: React.Ref<HTMLImageElement>;
}

const srcset = (name: string, widths: readonly number[], ext: string) =>
  widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(", ");

/** AVIF with a WebP fallback, correct intrinsic ratio, and no layout shift. */
export function Picture({
  name,
  alt,
  sizes,
  className,
  priority = false,
  style,
  imgRef,
}: PictureProps) {
  const meta = images[name];
  const widest = meta.widths[meta.widths.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcset(name, meta.widths, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(name, meta.widths, "webp")} sizes={sizes} />
      <img
        ref={imgRef}
        src={`/img/${name}-${widest}.webp`}
        alt={alt}
        width={meta.width}
        height={meta.height}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
      />
    </picture>
  );
}
