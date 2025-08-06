/**
 * CubemapFileSelector
 *
 * UI component for selecting and previewing cubemap face files.
 * Provides drag-and-drop interface with visual face mapping.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CubeMapLevel, FACE_LABELS, FaceName, isFileSource, validateCubeMapLevel } from '../types';

export interface CubemapFileSelectorProps {
  /** Current face files */
  value?: Partial<CubeMapLevel>;
  /** Callback when files change */
  onChange?: (cubeMapLevel: CubeMapLevel) => void;
  /** Whether to show preview */
  showPreview?: boolean;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Accepted file types */
  acceptedTypes?: string[];
  /** Custom styling */
  className?: string;
  style?: React.CSSProperties;
  /** Event callbacks */
  onValidationError?: (errors: string[]) => void;
  onFileLoad?: (faceName: FaceName, file: File) => void;
  /** Disabled state */
  disabled?: boolean;
}

interface FaceDropZoneProps {
  faceName: FaceName;
  file?: File;
  onFileSelect: (faceName: FaceName, file: File) => void;
  onFileRemove: (faceName: FaceName) => void;
  disabled?: boolean;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

const FaceDropZone: React.FC<FaceDropZoneProps> = ({
  faceName,
  file,
  onFileSelect,
  onFileRemove,
  disabled,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate preview URL when file changes
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreview(null);
    }
  }, [file]);

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

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];

      if (file) {
        const error = validateFile(file);
        if (error) {
          alert(error); // TODO: Replace with proper error handling
          return;
        }

        onFileSelect(faceName, file);
      }
    },
    [disabled, faceName, onFileSelect, validateFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const error = validateFile(file);
        if (error) {
          alert(error); // TODO: Replace with proper error handling
          return;
        }

        onFileSelect(faceName, file);
      }
    },
    [faceName, onFileSelect, validateFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFileRemove(faceName);
    },
    [faceName, onFileRemove]
  );

  const faceLabel = FACE_LABELS[faceName] || faceName;

  return (
    <div
      className={`face-drop-zone ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
      style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: isDragOver ? '#f0f8ff' : file ? '#f9f9f9' : '#fafafa',
        borderColor: isDragOver ? '#007bff' : file ? '#28a745' : '#ccc',
        position: 'relative',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt={`${faceLabel} face`}
            style={{
              maxWidth: '80px',
              maxHeight: '80px',
              objectFit: 'cover',
              borderRadius: '4px',
              marginBottom: '8px',
            }}
          />
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>{faceLabel}</div>
          <div style={{ fontSize: '10px', color: '#666' }}>{file?.name}</div>
          <button
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              lineHeight: '1',
            }}
            title="Remove file"
          >
            ×
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: '24px', marginBottom: '8px', color: '#999' }}>📁</div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>{faceLabel}</div>
          <div style={{ fontSize: '10px', color: '#666' }}>Click or drag image here</div>
        </>
      )}
    </div>
  );
};

export const CubemapFileSelector: React.FC<CubemapFileSelectorProps> = ({
  value = {},
  onChange,
  showPreview = true,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className,
  style,
  onValidationError,
  onFileLoad,
  disabled = false,
}) => {
  const [faces, setFaces] = useState<Partial<CubeMapLevel>>(value);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Face order for visual layout (cube net layout)
  const faceLayout: FaceName[][] = [
    ['py'], // Top
    ['nx', 'pz', 'px', 'nz'], // Middle row
    ['ny'], // Bottom
  ];

  const handleFileSelect = useCallback(
    (faceName: FaceName, file: File) => {
      const newFaces = { ...faces, [faceName]: file };
      setFaces(newFaces);

      onFileLoad?.(faceName, file);

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
      }
    },
    [faces, onChange, onFileLoad, onValidationError]
  );

  const handleFileRemove = useCallback(
    (faceName: FaceName) => {
      const newFaces = { ...faces };
      delete newFaces[faceName];
      setFaces(newFaces);

      // Clear validation errors when removing files
      setValidationErrors([]);
    },
    [faces]
  );

  // Update internal state when value prop changes
  useEffect(() => {
    setFaces(value);
  }, [value]);

  const completionCount = Object.keys(faces).length;
  const isComplete = completionCount === 6;

  return (
    <div
      className={className}
      style={{
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Cubemap Face Selection</h3>
        <div style={{ fontSize: '14px', color: '#666' }}>Select 6 images for cubemap faces ({completionCount}/6)</div>
        {isComplete && (
          <div
            style={{
              fontSize: '12px',
              color: '#28a745',
              marginTop: '4px',
              fontWeight: 'bold',
            }}
          >
            ✓ All faces selected
          </div>
        )}
      </div>

      {/* Face Grid Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        {faceLayout.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: '10px' }}>
            {row.map((faceName) => {
              const faceSource = faces[faceName];
              const file = faceSource && isFileSource(faceSource) ? (faceSource as File) : undefined;

              return (
                <FaceDropZone
                  key={faceName}
                  faceName={faceName}
                  file={file}
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  disabled={disabled}
                  maxFileSize={maxFileSize}
                  acceptedTypes={acceptedTypes}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Validation Errors:</div>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {validationErrors.map((error, index) => (
              <li key={index} style={{ fontSize: '14px' }}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b8daff',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#004085',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Cubemap Face Guide:</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
          <div>
            <strong>PX:</strong> Positive X (Right)
          </div>
          <div>
            <strong>NX:</strong> Negative X (Left)
          </div>
          <div>
            <strong>PY:</strong> Positive Y (Top)
          </div>
          <div>
            <strong>NY:</strong> Negative Y (Bottom)
          </div>
          <div>
            <strong>PZ:</strong> Positive Z (Front)
          </div>
          <div>
            <strong>NZ:</strong> Negative Z (Back)
          </div>
        </div>
        <div style={{ marginTop: '8px', fontSize: '11px' }}>
          Supported formats: JPEG, PNG, WebP • Max size: {(maxFileSize / 1024 / 1024).toFixed(1)}MB
        </div>
      </div>
    </div>
  );
};
