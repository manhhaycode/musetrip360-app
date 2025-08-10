'use client';

import { DragControls } from '@react-three/drei';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { HotspotContent } from './HotspotContent';
import type { Hotspot } from './types';
export interface InteractiveHotspotProps {
  hotspot: Hotspot & { onClick?: () => void };
  isEditing?: boolean;
  isDragMode?: boolean; // New prop for drag tool mode
  onSelect?: () => void;
  onPositionChange?: (hotspotId: string, newPosition: [number, number, number]) => void;
}

/**
 * Modern interactive 3D hotspot component for panorama viewers
 * Features oval white design with yellow tooltip, similar to museum tour hotspots
 */
export function InteractiveHotspot({
  hotspot,
  isEditing = false,
  isDragMode = false,
  onSelect,
  onPositionChange,
}: InteractiveHotspotProps) {
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const groupRef = useRef<THREE.Group>(null!);
  const dragRef = useRef<THREE.Group>(null!);
  const [position, setPosition] = useState<[number, number, number]>(hotspot.position);

  useEffect(() => {
    if (isDragMode) {
      dragRef.current.updateMatrix();
    }
    setPosition(hotspot.position);
  }, [hotspot.position, isDragMode]);

  // Simple click handler
  const handleClick = useCallback(() => {
    if (isEditing && onSelect) {
      onSelect();
    } else if (hotspot.onClick) {
      hotspot.onClick();
    }
  }, [hotspot, isEditing, onSelect]);

  // DragControls event handlers
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    onSelect?.();
  }, [onSelect]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    const newPosition = groupRef.current.getWorldPosition(new Vector3()).toArray() as [number, number, number];
    onPositionChange?.(hotspot.id, newPosition);
    // setPosition(newPosition);
  }, [hotspot.id, onPositionChange]);

  if (isDragMode) {
    return (
      <DragControls ref={dragRef} autoTransform={true} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <HotspotContent
          ref={groupRef}
          hotspot={hotspot}
          position={position}
          hovered={hovered}
          isDragging={isDragging}
          isDragMode={isDragMode}
          isEditing={isEditing}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={handleClick}
        />
      </DragControls>
    );
  }

  // Wrap with DragControls only in drag mode
  return (
    <HotspotContent
      ref={groupRef}
      hotspot={hotspot}
      position={position}
      hovered={hovered}
      isDragging={isDragging}
      isDragMode={isDragMode}
      isEditing={isEditing}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
    />
  );
}
