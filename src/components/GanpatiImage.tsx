'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface GanpatiImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  fallbackSrc?: string;
  alt: string;
}

export const GanpatiImage: React.FC<GanpatiImageProps> = ({
  src,
  fallbackSrc = '/images/ganpati/fallback.webp',
  alt,
  className = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
};
