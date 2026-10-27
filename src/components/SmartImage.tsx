import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "../lib/format";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
  loading?: "lazy" | "eager";
}

/**
 * Image with an elegant branded fallback so the layout stays complete
 * even if an asset fails to load.
 */
export default function SmartImage({
  src,
  alt,
  fallbackLabel,
  className,
  loading = "lazy",
  ...rest
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cn("img-fallback", className)} role="img" aria-label={alt}>
        <span className="px-4 text-center uppercase tracking-[0.25em] text-xs">
          {fallbackLabel ?? "UXT"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
