'use client';

import { animated, useSpring } from '@react-spring/web';
import { PreviewBackdropProps } from './PreviewModal.types';
import { springConfigs, animationStates } from './PreviewModal.variants';

export function PreviewBackdrop({ isVisible, onClick, enableBlur = true }: PreviewBackdropProps) {
  const backdropStyles = useSpring({
    ...animationStates.backdrop[isVisible ? 'open' : 'closed'],
    backdropFilter: enableBlur ? (isVisible ? 'blur(8px)' : 'blur(0px)') : 'none',
    config: springConfigs.gentle,
  });

  return (
    <animated.div
      style={backdropStyles}
      onClick={onClick}
      className="fixed inset-0 bg-black z-50 cursor-pointer"
      aria-hidden="true"
    />
  );
}
