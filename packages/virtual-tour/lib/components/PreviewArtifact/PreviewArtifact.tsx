'use client';

import { useEffect, useState } from 'react';
import type { Artifact } from '@musetrip360/artifact-management';
import { useArtifact } from '@musetrip360/artifact-management/api';
import { GLTFViewer } from '../../canvas/GLTFViewer';
import { ControlBar } from './ControlBar';
import { InfoPanel } from './InfoPanel';
import { ImagesPanel } from './ImagesPanel';

export interface PreviewArtifactProps {
  /** Artifact ID to preview */
  artifactId: string;
  /** Whether the preview is open */
  isOpen: boolean;
  /** Called when user closes the preview */
  onClose: () => void;
  /** Optional list of artifacts for navigation */
  artifacts?: Artifact[];
  /** Current artifact index in the list */
  currentIndex?: number;
  /** Called when navigating to previous artifact */
  onPrevious?: () => void;
  /** Called when navigating to next artifact */
  onNext?: () => void;
}

export function PreviewArtifact({ artifactId, isOpen, onClose, artifacts, onPrevious, onNext }: PreviewArtifactProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showImages, setShowImages] = useState(false);

  // Use artifact management hook
  const {
    data: artifactResponse,
    isLoading,
    error,
  } = useArtifact(artifactId, {
    enabled: isOpen && !!artifactId,
  });

  const artifact = artifactResponse?.data;

  // Reset panels when artifact changes
  useEffect(() => {
    setShowInfo(false);
    setShowImages(false);
  }, [artifactId]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p className="text-gray-400">Đang tải thông tin artifact...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || (!isLoading && !artifact)) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Lỗi</h2>
          <p className="text-gray-400 mb-6">{error?.message || 'Không thể tải thông tin artifact'}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  // Check if 3D model URL exists
  if (artifact && !artifact.model3DUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4">{artifact.name}</h2>
          <p className="text-gray-400 mb-6">Model 3D không có sẵn cho artifact này.</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  const hasMultiple = artifacts && artifacts.length > 1;

  // Don't render if no artifact data
  if (!artifact) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* 3D Model Viewer */}
      <div className="absolute inset-0">
        <GLTFViewer
          modelUrl={artifact.model3DUrl}
          autoRotate={false}
          environmentPreset="studio"
          showShadows={true}
          cameraPosition={[50, 0, 50]}
          animations={{ autoPlay: true, loop: true }}
          className="w-full h-full"
        />
      </div>

      {/* Control Bar */}
      <ControlBar
        onClose={onClose}
        onToggleInfo={() => {
          setShowInfo(!showInfo);
          setShowImages(false); // Close images panel when opening info
        }}
        onToggleImages={() => {
          setShowImages(!showImages);
          setShowInfo(false); // Close info panel when opening images
        }}
        showInfo={showInfo}
        showImages={showImages}
      />

      {/* Info Panel */}
      <InfoPanel
        artifact={artifact}
        isOpen={showInfo}
        onPrevious={onPrevious}
        onNext={onNext}
        hasMultiple={hasMultiple}
      />

      {/* Images Panel */}
      <ImagesPanel
        artifact={artifact}
        isOpen={showImages}
        onPrevious={onPrevious}
        onNext={onNext}
        hasMultiple={hasMultiple}
      />
    </div>
  );
}
