import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { VirtualTourCanvasProps } from './types';

export const VirtualTourCanvas: React.FC<VirtualTourCanvasProps> = ({
  width,
  height,
  className = '',
  style = {},
  shadows = false,
  camera = {
    position: [0, 0, 0.1],
    fov: 75,
    near: 0.01,
    far: 1000,
  },
  children,
}) => {
  const canvasStyle = {
    width: width || '100%',
    height: height || '100%',
    display: 'block',
    ...style,
  };

  return (
    <Canvas
      className={className}
      style={canvasStyle}
      shadows={shadows}
      camera={camera}
      resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
      performance={{
        min: 0.5,
      }}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
};
