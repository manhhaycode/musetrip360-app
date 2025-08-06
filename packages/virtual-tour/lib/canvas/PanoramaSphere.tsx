import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping, SRGBColorSpace } from 'three';
import { PanoramaSphereProps } from './types';

export const PanoramaSphere: React.FC<PanoramaSphereProps> = ({
  texture,
  radius = 500,
  widthSegments = 64,
  heightSegments = 32,
  opacity = 1,
  wireframe = false,
}) => {
  // Load texture if string URL is provided
  const loadedTexture = useLoader(TextureLoader, typeof texture === 'string' ? texture : '');

  // Use provided texture or loaded texture
  const finalTexture = useMemo(() => {
    const tex = typeof texture === 'string' ? loadedTexture : texture;

    if (tex) {
      // Configure texture for panorama
      tex.wrapS = RepeatWrapping;
      tex.repeat.x = -1; // Flip horizontally for inside-out sphere
      tex.colorSpace = SRGBColorSpace;
    }

    return tex;
  }, [texture, loadedTexture]);

  return (
    <mesh rotation={[0, Math.PI, 0]}>
      <sphereGeometry args={[radius, widthSegments, heightSegments]} />
      <meshBasicMaterial
        map={finalTexture}
        side={2} // DoubleSide to render inside the sphere
        transparent={opacity < 1}
        opacity={opacity}
        wireframe={wireframe}
      />
    </mesh>
  );
};
