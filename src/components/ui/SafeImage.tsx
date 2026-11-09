"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = "/images/products/fallback-snack.svg",
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(
    typeof src === "string" && src.trim().length > 0 ? src : fallbackSrc
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof src === "string" && src.trim().length > 0) {
      setCurrentSrc(src);
      setHasError(false);
    } else {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    }
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : currentSrc}
      alt={alt || "Snack item preview"}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

