/**
 * useCubemapFileSelector Hook
 *
 * Custom hook for managing cubemap file selection state and validation.
 * Handles drag & drop, file validation, and preview generation.
 */

import { useState, useCallback, useEffect } from 'react';
import type { FaceName, CubeMapLevel, FaceSource } from '../types';
import { isFileSource, validateCubeMapLevel } from '../types';

export interface FileSelectorConfig {
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Accepted file types */
  acceptedTypes?: string[];
  /** Initial face values */
  initialValue?: Partial<CubeMapLevel>;
}

export interface FileSelectorCallbacks {
  /** Callback when files change */
  onChange?: (cubeMapLevel: CubeMapLevel) => void;
  /** Callback when validation error occurs */
  onValidationError?: (errors: string[]) => void;
  /** Callback when individual file is loaded */
  onFileLoad?: (faceName: FaceName, file: File) => void;
}

export interface FileSelectorState {
  faces: Partial<CubeMapLevel>;
  validationErrors: string[];
  completionCount: number;
  isComplete: boolean;
  previews: Record<FaceName, string | null>;
}

export interface FileSelectorActions {
  handleFileSelect: (faceName: FaceName, file: File) => void;
  handleFileRemove: (faceName: FaceName) => void;
  validateFile: (file: File) => string | null;
  clearErrors: () => void;
  reset: () => void;
}

export interface UseCubemapFileSelectorReturn {
  state: FileSelectorState;
  actions: FileSelectorActions;
  config: Required<FileSelectorConfig>;
}

export const useCubemapFileSelector = (
  config: FileSelectorConfig = {},
  callbacks: FileSelectorCallbacks = {}
): UseCubemapFileSelectorReturn => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    initialValue = {},
  } = config;

  const { onChange, onValidationError, onFileLoad } = callbacks;

  // State
  const [faces, setFaces] = useState<Partial<CubeMapLevel>>(initialValue);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previews, setPreviews] = useState<Record<FaceName, string | null>>({
    px: null,
    nx: null,
    py: null,
    ny: null,
    pz: null,
    nz: null,
  });

  // Computed state
  const completionCount = Object.keys(faces).length;
  const isComplete = completionCount === 6;

  // Validate individual file
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `Invalid file type. Expected: ${acceptedTypes.join(', ')}`;
      }

      if (file.size > maxFileSize) {
        return `File too large. Maximum size: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`;
      }

      return null;
    },
    [acceptedTypes, maxFileSize]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (faceName: FaceName, file: File) => {
      const error = validateFile(file);
      if (error) {
        setValidationErrors([error]);
        onValidationError?.([error]);
        return;
      }

      const newFaces = { ...faces, [faceName]: file };
      setFaces(newFaces);

      onFileLoad?.(faceName, file);

      // Generate preview
      const url = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [faceName]: url }));

      // Validate complete cubemap
      if (Object.keys(newFaces).length === 6) {
        const level = newFaces as CubeMapLevel;
        const validation = validateCubeMapLevel(level);

        if (validation.valid) {
          setValidationErrors([]);
          onChange?.(level);
        } else {
          setValidationErrors(validation.errors);
          onValidationError?.(validation.errors);
        }
      } else {
        // Clear errors when not complete
        setValidationErrors([]);
      }
    },
    [faces, validateFile, onFileLoad, onChange, onValidationError]
  );

  // Handle file removal
  const handleFileRemove = useCallback(
    (faceName: FaceName) => {
      const newFaces = { ...faces };
      delete newFaces[faceName];
      setFaces(newFaces);

      // Clean up preview
      const currentPreview = previews[faceName];
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
        setPreviews((prev) => ({ ...prev, [faceName]: null }));
      }

      // Clear validation errors when removing files
      setValidationErrors([]);
    },
    [faces, previews]
  );

  // Clear errors
  const clearErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  // Reset all
  const reset = useCallback(() => {
    // Clean up all previews
    Object.values(previews).forEach((url) => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    });

    setFaces({});
    setValidationErrors([]);
    setPreviews({
      px: null,
      nx: null,
      py: null,
      ny: null,
      pz: null,
      nz: null,
    });
  }, [previews]);

  // Update internal state when initialValue changes
  useEffect(() => {
    setFaces(initialValue);
  }, [initialValue]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  return {
    state: {
      faces,
      validationErrors,
      completionCount,
      isComplete,
      previews,
    },
    actions: {
      handleFileSelect,
      handleFileRemove,
      validateFile,
      clearErrors,
      reset,
    },
    config: {
      maxFileSize,
      acceptedTypes,
      initialValue,
    },
  };
};
