import { useFileUpload } from '@/api/hooks/useUpload';
import { BulkUploadProps, useBulkUpload } from '@/contexts/UploadFileContext';
import { FileData, MediaType } from '@/types';
import { formatFileSize, validateFileByMediaType } from '@/utils';
import { UploadProgress, UploadStatus } from '@musetrip360/query-foundation';
import React, { useCallback } from 'react';

interface UseUploadPreviewProps extends BulkUploadProps {
  onUpload?: (url: string) => void;
  mediaType: MediaType;
  fileData: FileData;
}

export const useUploadPreview = ({
  onUpload,
  mediaType,
  fileData,
  uploadId,
  autoRegister = true,
}: UseUploadPreviewProps) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<UploadProgress | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

  // Get bulk upload context (may be null if not within provider)
  const bulkUploadContext = useBulkUpload();

  const uploadFileMutation = useFileUpload(
    (progress: UploadProgress) => {
      setUploadProgress((prev) => ({ ...prev, ...progress }));
    },
    {
      onMutate: () => {
        setUploadProgress({ status: UploadStatus.UPLOADING, loaded: 0, total: 0, percentage: 0 });
      },
      onSuccess: (res) => {
        setUploadProgress((prev) => (prev ? { ...prev, status: UploadStatus.SUCCESS } : null));
        onUpload?.(res.data.url);
        setTimeout(() => setUploadProgress(null), 2000);
      },
      onError: () => {
        setUploadProgress((prev) => (prev ? { ...prev, status: UploadStatus.ERROR } : null));
        setTimeout(() => setUploadProgress(null), 3000);
      },
    }
  );

  const validateFile = useCallback((file: File, mediaType: MediaType) => {
    // Check validation before upload
    const validation = validateFileByMediaType(file, mediaType);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return null;
    } else return file;
  }, []);

  const handleUpload = useCallback(async () => {
    if (!(fileData.file instanceof File)) return null;

    const fileValidation = validateFile(fileData.file, mediaType);
    if (!fileValidation) return null;

    return uploadFileMutation.mutateAsync(fileData.file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileData.file, mediaType, validateFile]);

  // Validate file when it changes
  React.useEffect(() => {
    if (fileData.file instanceof File) {
      const validation = validateFileByMediaType(fileData.file, mediaType);
      setValidationErrors(validation.isValid ? [] : validation.errors);
    } else {
      setValidationErrors([]);
    }
  }, [fileData.file, mediaType]);

  // Register with bulk upload context if uploadId is provided
  React.useEffect(() => {
    const file = fileData.file;
    if (uploadId && bulkUploadContext && autoRegister && file instanceof File) {
      bulkUploadContext.registerDropzone({
        id: uploadId,
        uploader: () => handleUpload(),
        validateFile: () => validateFileByMediaType(file, mediaType),
        // Check if the dropzone has a file to upload
        hasFile: () => file instanceof File,
        getCurrentValue: () => file,
      });

      return () => {
        bulkUploadContext.unregisterDropzone(uploadId);
      };
    }
  }, [mediaType, fileData.file, handleUpload, validateFile, uploadId, bulkUploadContext, autoRegister]);

  React.useEffect(() => {
    if (fileData.file instanceof File) {
      const url = URL.createObjectURL(fileData.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(fileData.file);
    }
  }, [fileData.file]);

  const getFileSize = () => {
    if (fileData.file instanceof File) {
      return formatFileSize(fileData.file.size);
    }
    return null;
  };

  const getFileName = () => {
    if (fileData.fileName) return fileData.fileName;
    if (fileData.file instanceof File) return fileData.file.name;
    return fileData.file?.split('/').pop() || 'Unknow File';
  };

  return {
    previewUrl,
    uploadProgress,
    validationErrors,
    handleUpload,
    getFileSize,
    getFileName,
  };
};
