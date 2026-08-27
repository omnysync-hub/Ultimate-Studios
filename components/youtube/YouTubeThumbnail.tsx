"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function YouTubeThumbnail({
  src,
  fallbackSrc,
  alt,
  className,
  sizes = "(max-width: 768px) 80vw, 320px"
}: Props) {
  const [url, setUrl] = useState(src);

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => {
        if (url !== fallbackSrc) setUrl(fallbackSrc);
      }}
    />
  );
}
