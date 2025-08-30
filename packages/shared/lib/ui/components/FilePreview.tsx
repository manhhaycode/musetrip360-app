import { useUploadPreview } from '@/hooks/useUploadPreview';
import { FileData, MediaType } from '@/types';
import { formatFileSize, getFileName } from '@/utils';
import { UploadProgress, UploadStatus } from '@musetrip360/query-foundation';
import { Button } from '@musetrip360/ui-core/button';
import { cn } from '@musetrip360/ui-core/utils';
import { AlertTriangle, CheckCircle, Download, FileText, Loader2, Upload, XCircle } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { DropZone } from './DropZone';
import { BulkUploadProps } from '@/contexts/UploadFileContext';
import { saveAs } from 'file-saver';
import { FormLabel } from '@musetrip360/ui-core/form';
import { Switch } from '@musetrip360/ui-core/switch';

// PreviewContainer Types
interface PreviewContainerProps extends BulkUploadProps {
  children: React.ReactNode;
  uploadProgress: UploadProgress | null;
  onUpload: () => void;
  onRemove: () => void;
  manualUpload?: boolean;
  disabled?: boolean;
  fileData: FileData;
  className?: string;
  isInteract?: boolean;
  noAction?: boolean;
}

// PreviewContainer Component
function PreviewContainer({
  children,
  uploadProgress,
  onUpload,
  onRemove,
  manualUpload,
  disabled,
  fileData,
  className,
  isInteract,
  noAction,
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
      {!isInteract && (
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
          {!!manualUpload && fileData.file instanceof File && (
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
          {typeof fileData.file === 'string' && (
            <Button
              onClick={() => saveAs(fileData.file!, getFileName(fileData))}
              type="button"
              variant="secondary"
              size="sm"
              className="opacity-90 hover:opacity-100"
            >
              <Download className="h-4 w-4 mr-1" />
              Tải xuống
            </Button>
          )}
          {!noAction && (
            <Button
              variant="destructive"
              size="sm"
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="opacity-90 hover:opacity-100"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          )}
        </div>
      )}

      {/* Top-right positioned buttons when isInteract is true */}
      {isInteract && (
        <div
          className={cn(
            'absolute top-0 transform -translate-y-1/2 right-2 flex gap-2 z-10',
            uploadProgress &&
              (uploadProgress.status === UploadStatus.UPLOADING ||
                uploadProgress.status === UploadStatus.SUCCESS ||
                uploadProgress.status === UploadStatus.ERROR) &&
              'hidden'
          )}
        >
          {!!manualUpload && fileData.file instanceof File && (
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
          {typeof fileData.file === 'string' && (
            <Button
              onClick={() => saveAs(fileData.file!, getFileName(fileData))}
              type="button"
              variant="secondary"
              size="sm"
              className="opacity-90 hover:opacity-100"
            >
              <Download className="h-4 w-4 mr-1" />
              Tải xuống
            </Button>
          )}
          {!noAction && (
            <Button
              variant="destructive"
              size="sm"
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="opacity-90 hover:opacity-100"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// FilePreviewCard Types
interface FilePreviewCardProps extends BulkUploadProps {
  fileData: FileData;
  mediaType: MediaType;
  onRemove: () => void;
  onChange?: (file: FileData) => void;
  onUpload?: (url: string) => void; // Optional upload handler
  onInteract?: (file: FileData) => void;
  manualUpload?: boolean; // Optional prop to control manual upload
  disabled?: boolean;
  className?: string;
  ImageComponent?: React.ComponentType<any>; // Optional component to wrap image (e.g., Next.js Image)
  noAction?: boolean;
}

// FilePreviewCard Component
export function FilePreviewCard({
  fileData,
  mediaType,
  onChange,
  onRemove,
  onUpload,
  onInteract,
  manualUpload,
  disabled = false,
  className,
  uploadId,
  autoRegister = true, // Default to true for auto-registration
  ImageComponent,
  noAction = false,
}: FilePreviewCardProps) {
  const { previewUrl, uploadProgress, validationErrors, handleUpload, getFileSize, getFileName } = useUploadPreview({
    onUpload,
    mediaType,
    fileData,
    uploadId,
    autoRegister,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = fileData.audioOptions?.volume ?? 1;
      audioRef.current.loop = fileData.audioOptions?.loop ?? false;
      if (fileData.audioOptions?.autoPlay) {
        audioRef.current.play();
      }
    }
  }, [audioRef, fileData.audioOptions]);

  const renderPreview = () => {
    // Handle string files (URLs) - they should always render a preview
    if (typeof fileData.file === 'string') {
      const containerProps = {
        uploadProgress,
        onUpload: handleUpload,
        onRemove,
        manualUpload,
        disabled,
        fileData,
        noAction,
      };

      switch (mediaType) {
        case MediaType.IMAGE:
          return (
            <PreviewContainer {...containerProps}>
              <div className="w-full pt-[56.25%] rounded-2xl relative flex flex-1">
                <div className="absolute top-0 left-0 bottom-0 right-0 h-full">
                  {ImageComponent ? (
                    <ImageComponent
                      src={fileData.file}
                      alt="Preview"
                      fill
                      className={cn('object-cover rounded-2xl', className)}
                    />
                  ) : (
                    <img
                      src={fileData.file}
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
                src={fileData.file}
                className={cn('w-full h-32 object-cover rounded-2xl', className)}
                controls={false}
              />
            </PreviewContainer>
          );

        case MediaType.AUDIO:
          return (
            <PreviewContainer {...containerProps} isInteract>
              <div className="w-full pt-[56.25%] rounded-2xl relative flex flex-1">
                <div className="absolute top-0 left-0 bottom-0 right-0 flex flex-col p-4 items-center justify-center h-full">
                  <audio
                    onVolumeChange={(event) => {
                      fileData.audioOptions = {
                        ...fileData.audioOptions,
                        volume: event.currentTarget.volume,
                      };
                      onChange?.(fileData);
                    }}
                    ref={audioRef}
                    src={fileData.file}
                    className="w-full"
                    controls
                  />
                  <div className="mt-2 space-y-4 text-center">
                    <p className="text-sm font-medium">{getFileName()}</p>
                    <div className="grid grid-cols-2">
                      <div className="flex gap-2">
                        <FormLabel>AutoPlay</FormLabel>
                        <Switch
                          checked={fileData.audioOptions?.autoPlay}
                          onCheckedChange={(value) => {
                            fileData.audioOptions = {
                              ...fileData.audioOptions,
                              autoPlay: value,
                            };
                            onChange?.(fileData);
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <FormLabel>Loop</FormLabel>
                        <Switch
                          checked={fileData.audioOptions?.loop}
                          onCheckedChange={(value) => {
                            fileData.audioOptions = {
                              ...fileData.audioOptions,
                              loop: value,
                            };
                            onChange?.(fileData);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PreviewContainer>
          );

        case MediaType.MODEL3D:
        case MediaType.DOCUMENT:
        default:
          return (
            <PreviewContainer {...containerProps} isInteract={mediaType === MediaType.MODEL3D}>
              <div className="w-full pt-[56.25%] rounded-2xl relative flex flex-1">
                <div className="absolute z-10 inset-0 flex items-center">
                  <div
                    onClick={() => onInteract?.(fileData)}
                    className="flex flex-1 gap-2 p-4 items-center justify-center min-w-0 cursor-pointer"
                  >
                    <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium break-words">{getFileName()}</p>
                      <p className="text-xs text-muted-foreground">File đã tải lên</p>
                    </div>
                  </div>
                </div>
              </div>
            </PreviewContainer>
          );
      }
    }

    // Handle File objects - require previewUrl from useUploadPreview
    if (!previewUrl) return null;

    const containerProps = {
      uploadProgress,
      onUpload: handleUpload,
      onRemove,
      manualUpload,
      disabled,
      fileData,
      noAction: true,
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

      case MediaType.AUDIO:
        return (
          <PreviewContainer {...containerProps} isInteract>
            <div className="w-full pt-[56.25%] rounded-2xl relative flex flex-1">
              <div className="absolute top-0 left-0 bottom-0 p-4 flex flex-col justify-center items-center right-0 h-full">
                <audio
                  onVolumeChange={(event) => {
                    fileData.audioOptions = {
                      ...fileData.audioOptions,
                      volume: event.currentTarget.volume,
                    };
                    onChange?.(fileData);
                  }}
                  ref={audioRef}
                  src={previewUrl}
                  className="w-full"
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{getFileName()}</p>
                  <div className="grid grid-cols-2">
                    <div className="flex gap-2">
                      <FormLabel>AutoPlay</FormLabel>
                      <Switch
                        checked={fileData.audioOptions?.autoPlay}
                        onCheckedChange={(value) => {
                          fileData.audioOptions = {
                            ...fileData.audioOptions,
                            autoPlay: value,
                          };
                          onChange?.(fileData);
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <FormLabel>Loop</FormLabel>
                      <Switch
                        checked={fileData.audioOptions?.loop}
                        onCheckedChange={(value) => {
                          fileData.audioOptions = {
                            ...fileData.audioOptions,
                            loop: value,
                          };
                          onChange?.(fileData);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PreviewContainer>
        );

      case MediaType.MODEL3D:
      case MediaType.DOCUMENT:
        return (
          <PreviewContainer {...containerProps} isInteract={mediaType === MediaType.MODEL3D}>
            <div className="w-full pt-[56.25%] rounded-2xl relative flex flex-1">
              <div className="absolute inset-0 flex items-center">
                <div
                  onClick={() => onInteract?.(fileData)}
                  className="flex flex-1 gap-2 p-4 items-center justify-center min-w-0 cursor-pointer"
                >
                  <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
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
  value?: FileData | null;
  onChange: (value: FileData | null) => void;
  onInteract?: (file: FileData) => void;
  onRemove?: () => void;
  mediaType: MediaType;
  disabled?: boolean;
  className?: string;
  manualUpload?: boolean; // Optional prop to control manual upload
  ImageComponent?: React.ComponentType<any>; // Optional component to wrap image (e.g., Next.js Image)
  noAction?: boolean;
}

// DropZoneWithPreview Component
export function DropZoneWithPreview({
  value,
  onChange,
  onRemove,
  onInteract,
  mediaType,
  disabled = false,
  className,
  manualUpload = false, // Default to false
  uploadId,
  autoRegister,
  ImageComponent,
  noAction,
}: DropZoneWithPreviewProps) {
  const handleRemove = () => {
    // onChange(null);
    onRemove?.();
  };

  // Show preview if we have a file
  if (value) {
    return (
      <FilePreviewCard
        onInteract={onInteract}
        uploadId={uploadId}
        autoRegister={autoRegister}
        fileData={value}
        mediaType={mediaType}
        onUpload={(url) =>
          onChange({
            file: url,
            fileName: value.fileName,
            mediaType: mediaType,
          })
        }
        onChange={onChange}
        onRemove={handleRemove}
        disabled={disabled}
        className={className}
        manualUpload={manualUpload}
        ImageComponent={ImageComponent}
        noAction={noAction}
      />
    );
  }

  // Show dropzone if no file
  return (
    <DropZone
      mediaType={mediaType}
      onFileSelected={(file) =>
        onChange({
          file,
          fileName: file.name,
          mediaType,
        })
      }
      disabled={disabled}
      className={className}
    />
  );
}
