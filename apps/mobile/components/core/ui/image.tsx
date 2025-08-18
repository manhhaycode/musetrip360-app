import { cn } from '@/libs/utils';
import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';

interface ImageProps extends Omit<RNImageProps, 'source'> {
  source: string | { uri: string } | number;
  className?: string;
}

export function Image({ className, source, ...props }: ImageProps) {
  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return <RNImage source={imageSource} className={cn('', className)} {...props} />;
}
