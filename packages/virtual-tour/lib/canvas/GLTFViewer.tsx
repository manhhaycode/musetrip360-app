'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

export interface GLTFViewerProps {
  /** URL or path to GLTF model */
  modelUrl: string;
  /** Canvas className */
  className?: string;
  /** Enable auto-rotation */
  autoRotate?: boolean;
  /** Enable zoom controls */
  enableZoom?: boolean;
  /** Enable pan controls */
  enablePan?: boolean;
  /** Camera initial position */
  cameraPosition?: [number, number, number];
  /** Loading component */
  fallback?: React.ReactNode;
  /** Environment preset */
  environmentPreset?:
    | 'sunset'
    | 'dawn'
    | 'night'
    | 'warehouse'
    | 'forest'
    | 'apartment'
    | 'studio'
    | 'city'
    | 'park'
    | 'lobby';
  /** Scale of the model */
  scale?: number | [number, number, number];
  /** Position of the model */
  position?: [number, number, number];
  /** Show contact shadows */
  showShadows?: boolean;
  /** Animation controls */
  animations?: {
    autoPlay?: boolean;
    loop?: boolean;
  };
}

interface GLTFModelProps {
  modelUrl: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  animations?: {
    autoPlay?: boolean;
    loop?: boolean;
  };
}

function GLTFModel({ modelUrl, scale = 1, position = [0, 0, 0], animations }: GLTFModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene, animations: gltfAnimations } = useGLTF(modelUrl);
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));

  // Setup animations
  useState(() => {
    if (gltfAnimations.length > 0 && animations?.autoPlay) {
      gltfAnimations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        if (animations.loop) {
          action.setLoop(THREE.LoopRepeat, Infinity);
        }
        action.play();
      });
    }
    return mixer;
  });

  // Update mixer on frame
  useState(() => {
    const animate = () => {
      mixer.update(0.016); // ~60fps
      requestAnimationFrame(animate);
    };
    if (gltfAnimations.length > 0 && animations?.autoPlay) {
      animate();
    }
  });

  return (
    <group ref={meshRef} scale={scale} position={position}>
      <primitive object={scene} />
    </group>
  );
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-white">Loading 3D Model...</span>
      </div>
    </Html>
  );
}

export function GLTFViewer({
  modelUrl,
  className = '',
  autoRotate = false,
  enableZoom = true,
  enablePan = true,
  cameraPosition = [0, 0, 100],
  fallback,
  environmentPreset = 'studio',
  scale = 1,
  position = [0, 0, 0],
  showShadows = true,
  animations = { autoPlay: false, loop: true },
}: GLTFViewerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        shadows={showShadows}
        dpr={[1, 2]}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow={showShadows}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />

        {/* Environment */}
        <Environment preset={environmentPreset} />

        {/* Model */}
        <Suspense fallback={fallback || <LoadingSpinner />}>
          <GLTFModel modelUrl={modelUrl} scale={scale} position={position} animations={animations} />
        </Suspense>

        {/* Contact shadows */}
        {showShadows && <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={1} />}

        {/* Controls */}
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enableZoom={enableZoom}
          enablePan={enablePan}
          minDistance={1}
          maxDistance={100}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </div>
  );
}

// Preload utility
export function preloadGLTF(url: string) {
  useGLTF.preload(url);
}
