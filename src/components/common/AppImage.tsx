"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { canUseNextImage } from "@/src/lib/media";

export type AppImageProps = ImageProps & {
  /** Show skeleton + spinner while the image loads. Default: true */
  showLoader?: boolean;
  /** Wrapper class when not using `fill` */
  wrapperClassName?: string;
};

function ImageLoader() {
  return (
    <div
      className="absolute inset-0 z-2 flex items-center justify-center bg-base-200"
      aria-hidden
    >
      <span className="loading loading-spinner loading-md text-primary/70" />
    </div>
  );
}

export default function AppImage({
  src,
  alt,
  className,
  wrapperClassName,
  showLoader = true,
  fill,
  unoptimized,
  onLoad,
  onError,
  ...rest
}: AppImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const srcStr = typeof src === "string" ? src : "";
  const supportsOptimization =
    unoptimized !== undefined ? !unoptimized : canUseNextImage(srcStr);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      onLoad?.(event);
    },
    [onLoad],
  );

  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setError(true);
      onError?.(event);
    },
    [onError],
  );

  useEffect(() => {
    setLoaded(false);
    setError(false);
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [srcStr]);

  const overlay =
    showLoader && !loaded && !error ? <ImageLoader /> : null;

  const errorFallback = error ? (
    <div className="absolute inset-0 z-2 flex items-center justify-center bg-base-200 px-4 text-center text-xs text-base-content/45">
      Unable to load image
    </div>
  ) : null;

  const image = (
    <Image
      ref={imgRef}
      src={src}
      alt={alt}
      fill={fill}
      unoptimized={!supportsOptimization}
      className={cn(
        showLoader && "transition-opacity duration-500",
        showLoader && (loaded ? "opacity-100" : "opacity-0"),
        className,
      )}
      onLoad={handleLoad}
      onError={handleError}
      {...rest}
    />
  );

  if (fill) {
    return (
      <>
        {overlay}
        {errorFallback}
        {image}
      </>
    );
  }

  return (
    <span className={cn("relative block overflow-hidden", wrapperClassName)}>
      {overlay}
      {errorFallback}
      {image}
    </span>
  );
}
