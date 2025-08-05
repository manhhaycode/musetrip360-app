import { useUploadPreview } from '@/hooks/useUploadPreview';
import { MediaType } from '@/types';
import { formatFileSize } from '@/utils';
import { UploadProgress, UploadStatus } from '@musetrip360/query-foundation';
import { Button } from '@musetrip360/ui-core/button';
import { cn } from '@musetrip360/ui-core/utils';
import { AlertTriangle, CheckCircle, FileText, Loader2, Upload, XCircle } from 'lucide-react';
import React from 'react';
import { DropZone } from './DropZone';
import { BulkUploadProps } from '@/contexts/UploadFileContext';

// PreviewContainer Types
interface PreviewContainerProps extends BulkUploadProps {
  children: React.ReactNode;
  uploadProgress: UploadProgress | null;
  onUpload: () => void;
  onRemove: () => void;
  manualUpload?: boolean;
  disabled?: boolean;
  file: File | string;
  className?: string;
}

// PreviewContainer Component
function PreviewContainer({
  children,
  uploadProgress,
  onUpload,
  onRemove,
  manualUpload,
  disabled,
  file,
  className,
}: PreviewContainerProps) {
  return (
    <div className={cn('relative group', className)}>
      {children}
      {/* Upload Status Overlay - Always visible during upload states */}
      {uploadProgress &&
        (uploadProgress.status === UploadStatus.UPLOADING ||
          uploadProgress.status === UploadStatus.SUCCESS ||
          uploadProgress.status === UploadStatus.ERROR) && (
          <div className="absolute inset-0 bg-black/70 opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
            <div className="text-white text-center">
              {uploadProgress.status === UploadStatus.UPLOADING && (
                <>
                  <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p className="text-sm font-medium">{Math.round(uploadProgress.percentage)}%</p>
                  <p className="text-xs opacity-80">
                    {formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)}
                  </p>
                  <p className="text-xs opacity-60">Đang tải lên...</p>
                </>
              )}
              {uploadProgress.status === UploadStatus.SUCCESS && (
                <>
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                  <p className="text-sm font-medium">Đã tải lên</p>
                  <p className="text-xs opacity-80">{formatFileSize(uploadProgress.total)}</p>
                </>
              )}
              {uploadProgress.status === UploadStatus.ERROR && (
                <>
                  <XCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                  <p className="text-sm font-medium">Tải lên thất bại</p>
                  <Button onClick={onUpload} variant="secondary" size="sm" className="mt-2">
                    Thử lại
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

      {/* Hover Buttons - Hidden during upload states */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex gap-3 items-center justify-center',
          uploadProgress &&
            (uploadProgress.status === UploadStatus.UPLOADING ||
              uploadProgress.status === UploadStatus.SUCCESS ||
              uploadProgress.status === UploadStatus.ERROR) &&
            'hidden'
        )}
      >
        {!!manualUpload && file instanceof File && (
          <Button
            onClick={onUpload}
            variant="secondary"
            size="sm"
            disabled={disabled}
            className="opacity-90 hover:opacity-100"
          >
            <Upload className="h-4 w-4 mr-1" />
            Tải lên
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={onRemove}
          disabled={disabled}
          className="opacity-90 hover:opacity-100"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Xóa
        </Button>
      </div>
    </div>
  );
}

// FilePreviewCard Types
interface FilePreviewCardProps extends BulkUploadProps {
  file: File | string;
  mediaType: MediaType;
  onRemove: () => void;
  onUpload?: (url: string) => void; // Optional upload handler
  manualUpload?: boolean; // Optional prop to control manual upload
  disabled?: boolean;
  className?: string;
  ImageComponent?: React.ComponentType<any>; // Optional component to wrap image (e.g., Next.js Image)
}

// FilePreviewCard Component
export function FilePreviewCard({
  file,
  mediaType,
  onRemove,
  onUpload,
  manualUpload,
  disabled = false,
  className,
  uploadId,
  autoRegister = true, // Default to true for auto-registration
  ImageComponent,
}: FilePreviewCardProps) {
  const { previewUrl, uploadProgress, validationErrors, handleUpload, getFileSize, getFileName } = useUploadPreview({
    onUpload,
    mediaType,
    file,
    uploadId,
    autoRegister,
  });
  const renderPreview = () => {
    if (!previewUrl) return null;

    const containerProps = {
      uploadProgress,
      onUpload: handleUpload,
      onRemove,
      manualUpload,
      disabled,
      file,
    };

    switch (mediaType) {
      case MediaType.IMAGE:
        return (
          <PreviewContainer {...containerProps}>
            <div className="w-full pt-[56.25%] rounded-2xl relative flex flex-1">
              <div className="absolute top-0 left-0 bottom-0 right-0 h-full">
                {ImageComponent ? (
                  <ImageComponent
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className={cn('object-cover rounded-2xl', className)}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className={cn('object-cover w-full h-full rounded-2xl', className)}
                  />
                )}
              </div>
            </div>
          </PreviewContainer>
        );

      case MediaType.VIDEO:
        return (
          <PreviewContainer {...containerProps}>
            <video
              src={previewUrl}
              className={cn('w-full h-32 object-cover rounded-2xl', className)}
              controls={false}
            />
          </PreviewContainer>
        );

      case MediaType.DOCUMENT:
        return (
          <PreviewContainer {...containerProps}>
            <div className="w-full pt-[56.25%] rounded-2xl relative flex flex-1">
              <div className="absolute inset-0 flex items-center">
                <div className="flex flex-1 gap-2 p-4 items-center justify-center min-w-0">
                  <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium break-words">{getFileName()}</p>
                    {getFileSize() && <p className="text-xs text-muted-foreground">{getFileSize()}</p>}
                  </div>
                </div>
              </div>
            </div>
          </PreviewContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border-2 border-primary border-dashed rounded-2xl h-fit">
      {renderPreview()}
      {validationErrors.length > 0 && (
        <div className="p-3 border-t border-destructive/20 bg-destructive/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-xs text-destructive font-medium">Lỗi xác thực:</span>
          </div>
          {validationErrors.map((error, index) => (
            <p key={index} className="text-xs text-destructive mb-1">
              • {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// DropZoneWithPreview Types
interface DropZoneWithPreviewProps extends BulkUploadProps {
  value?: File | string | null;
  onChange: (value: File | string | null) => void;
  onRemove?: () => void;
  mediaType: MediaType;
  disabled?: boolean;
  className?: string;
  manualUpload?: boolean; // Optional prop to control manual upload
  ImageComponent?: React.ComponentType<any>; // Optional component to wrap image (e.g., Next.js Image)
}

// DropZoneWithPreview Component
export function DropZoneWithPreview({
  value,
  onChange,
  onRemove,
  mediaType,
  disabled = false,
  className,
  manualUpload = false, // Default to false
  uploadId,
  autoRegister,
  ImageComponent,
}: DropZoneWithPreviewProps) {
  const handleRemove = () => {
    // onChange(null);
    onRemove?.();
  };

  console.log(value, 'DropZoneWithPreview value');

  // Show preview if we have a file
  if (value) {
    return (
      <FilePreviewCard
        uploadId={uploadId}
        autoRegister={autoRegister}
        file={value}
        mediaType={mediaType}
        onUpload={(url) => onChange(url)}
        onRemove={handleRemove}
        disabled={disabled}
        className={className}
        manualUpload={manualUpload}
        ImageComponent={ImageComponent}
      />
    );
  }

  // Show dropzone if no file
  return (
    <DropZone
      mediaType={mediaType}
      onFileSelected={(file) => onChange(file)}
      disabled={disabled}
      className={className}
    />
  );
}
