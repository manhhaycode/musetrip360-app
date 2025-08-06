'use client';

import { animated } from '@react-spring/web';
import { PreviewContentProps } from './PreviewModal.types';
import { sizeVariants } from './PreviewModal.variants';
import { cn } from '@musetrip360/ui-core/utils';

export function PreviewContent({ children, size, className, style, animationStyle, onClick }: PreviewContentProps) {
  const sizeStyles = sizeVariants[size];

  return (
    <animated.div
      style={{
        ...animationStyle,
        ...style,
        ...sizeStyles,
      }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl shadow-2xl flex flex-col m-4 overflow-hidden relative z-50',
        'max-w-full max-h-full',
        className
      )}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </animated.div>
  );
}
