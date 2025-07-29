import { APIResponse } from '@musetrip360/query-foundation';
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { UploadConfirmDialog } from '../ui/components/UploadConfirmDialog';
import { UploadErrorDialog } from '../ui/components/UploadErrorDialog';

export interface BulkUploadProps {
  uploadId?: string; // Optional ID for bulk upload registration
  autoRegister?: boolean; // Whether to auto-register with bulk upload context
}

// Types for individual dropzone registration
interface DropzoneRegistration {
  id: string;
  uploader: () => Promise<APIResponse<{ url: string }> | null>; // Returns upload URL
  hasFile: () => boolean; // Check if dropzone has a File (not uploaded)
  validateFile: () => { isValid: boolean; errors: string[] }; // Validate file
  getCurrentValue: () => File | string | null; // Get current value
}

// Upload result for bulk operations
interface BulkUploadResult {
  success: Record<string, string>; // id -> url mapping for successful uploads
  errors: Record<string, any>; // id -> error mapping for failed uploads
}

// Context interface
export interface BulkUploadContextType {
  // Registration system for dropzones
  registerDropzone: (registration: DropzoneRegistration) => void;
  unregisterDropzone: (id: string) => void;

  getPendingFiles: () => Array<{ id: string; file: File }>;

  // Bulk upload coordination
  uploadAll: () => Promise<BulkUploadResult>;
  isUploading: boolean;

  // Confirm dialog methods
  openConfirmDialog: () => Promise<boolean>;
}

export const BulkUploadContext = createContext<BulkUploadContextType | null>(null);

// Provider component
interface BulkUploadProviderProps {
  children: React.ReactNode;
}

export function BulkUploadProvider({ children }: BulkUploadProviderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);
  const [errorFiles, setErrorFiles] = useState<Array<{ id: string; file: File }>>([]);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Use ref to store registry to avoid stale closures
  const registryRef = useRef<Map<string, DropzoneRegistration>>(new Map());

  // Registry management
  const registerDropzone = useCallback((registration: DropzoneRegistration) => {
    registryRef.current.set(registration.id, registration);
  }, []);

  const unregisterDropzone = useCallback((id: string) => {
    registryRef.current.delete(id);
  }, []);

  // Status tracking methods
  const getPendingUploads = useCallback((): string[] => {
    const pending: string[] = [];

    registryRef.current.forEach((registration, id) => {
      if (registration.hasFile()) {
        if (registration.validateFile().isValid) {
          pending.push(id);
        } else {
          console.warn(`Dropzone "${id}" has an invalid file:`, registration.validateFile().errors);
        }
      }
    });
    return pending;
  }, []);

  // Get pending files for confirm dialog
  const getPendingFiles = useCallback(() => {
    const pendingFiles: Array<{ id: string; file: File }> = [];

    registryRef.current.forEach((registration, id) => {
      if (registration.hasFile()) {
        const value = registration.getCurrentValue();
        if (value instanceof File) {
          pendingFiles.push({ id, file: value });
        }
      }
    });

    return pendingFiles;
  }, []);

  // Confirm dialog methods
  const openConfirmDialog = useCallback(() => {
    setShowConfirmDialog(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const closeConfirmDialog = useCallback(() => {
    setShowConfirmDialog(false);
    resolver?.(false);
  }, [resolver]);

  // Error dialog methods
  const closeErrorDialog = useCallback(() => {
    setShowErrorDialog(false);
    setErrorFiles([]);
  }, []);

  const getFailedFiles = useCallback((errorIds: string[]): Array<{ id: string; file: File }> => {
    const failedFiles: Array<{ id: string; file: File }> = [];

    errorIds.forEach((id) => {
      const registration = registryRef.current.get(id);
      if (registration) {
        const value = registration.getCurrentValue();
        if (value instanceof File) {
          failedFiles.push({ id, file: value });
        }
      }
    });

    return failedFiles;
  }, []);

  // Individual upload method
  const uploadSingle = useCallback(async (id: string): Promise<string | null> => {
    const registration = registryRef.current.get(id);
    if (!registration) {
      throw new Error(`Dropzone with id "${id}" is not registered`);
    }

    if (!registration.hasFile()) {
      throw new Error(`Dropzone with id "${id}" has no file to upload`);
    }

    const response = await registration.uploader();
    if (response?.data && response.data.url) {
      return response.data.url;
    } else {
      throw new Error(`Upload failed for dropzone "${id}"`);
    }
  }, []);

  // Bulk upload coordination
  const uploadAll = useCallback(async (): Promise<BulkUploadResult> => {
    const pendingIds = getPendingUploads();

    if (pendingIds.length === 0) {
      return { success: {}, errors: {} };
    }

    setIsUploading(true);

    try {
      // Create upload promises for all pending dropzones
      const uploadPromises = pendingIds.map(async (id) => {
        try {
          const url = await uploadSingle(id);
          return { id, success: true, result: url, error: null };
        } catch (error) {
          return { id, success: false, result: null, error: error };
        }
      });

      // Execute all uploads in parallel
      const results = await Promise.all(uploadPromises);

      // Separate successful and failed uploads
      const success: Record<string, string> = {};
      const errors: Record<string, any> = {};

      results.forEach(({ id, success: isSuccess, result, error }) => {
        if (isSuccess && result) {
          success[id] = result;
        } else if (error) {
          errors[id] = error;
        }
      });

      // Show error dialog if there are failed uploads
      if (Object.keys(errors).length > 0) {
        const failedFiles = getFailedFiles(Object.keys(errors));
        setErrorFiles(failedFiles);
        setShowErrorDialog(true);
      }

      return { success, errors };
    } finally {
      setIsUploading(false);
    }
  }, [getPendingUploads, uploadSingle, getFailedFiles]);

  const confirmUpload = useCallback(async () => {
    setShowConfirmDialog(false);
    resolver?.(true);
  }, [resolver]);

  // Context value
  const contextValue: BulkUploadContextType = {
    registerDropzone,
    unregisterDropzone,
    uploadAll,
    isUploading,
    openConfirmDialog,
    getPendingFiles,
  };

  return (
    <BulkUploadContext.Provider value={contextValue}>
      {children}
      <UploadConfirmDialog
        open={showConfirmDialog}
        onClose={closeConfirmDialog}
        onConfirm={confirmUpload}
        files={getPendingFiles()}
      />
      <UploadErrorDialog open={showErrorDialog} onClose={closeErrorDialog} files={errorFiles} />
    </BulkUploadContext.Provider>
  );
}

// Hook to use the context
export function useBulkUpload(): BulkUploadContextType | null {
  const context = useContext(BulkUploadContext);
  return context;
}
