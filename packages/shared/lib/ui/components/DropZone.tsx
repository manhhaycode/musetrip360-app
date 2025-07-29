import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Upload, FileText, Image, Video, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { MediaType } from '@/types';
import { cn } from '@musetrip360/ui-core/utils';
import { getAcceptConfig, validateFileByMediaType } from '@/utils';
import React from 'react';

const getMediaTypeText = (mediaType: MediaType) => {
  const mediaTypeText = {
    Image: 'hình ảnh',
    Video: 'video',
    Document: 'tài liệu',
  };
  return mediaTypeText[mediaType] || mediaType.toLowerCase();
};

interface DropZoneProps {
  mediaType: MediaType;
  onFileSelected: (file: File) => void;
  onValidationError?: (errors: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export function DropZone({ mediaType, onFileSelected, onValidationError, disabled = false, className }: DropZoneProps) {
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

  const handleDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const validation = validateFileByMediaType(file, mediaType);
      if (validation.isValid) {
        onFileSelected(file);
      } else {
        setValidationErrors(validation.errors);
        if (onValidationError) {
          onValidationError(validation.errors);
        }
        return;
      }
    },
    [mediaType, onFileSelected, onValidationError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: getAcceptConfig(mediaType),
    disabled,
    onDrop: handleDrop,
  });

  const getMediaIcon = () => {
    const iconClass = cn(
      'h-8 w-8 transition-all duration-300',
      isDragAccept && 'text-primary animate-bounce',
      isDragReject && 'text-destructive animate-pulse',
      !isDragActive && 'text-muted-foreground'
    );

    if (isDragAccept) return <CheckCircle className={iconClass} />;
    if (isDragReject) return <XCircle className={iconClass} />;

    switch (mediaType) {
      case 'Image':
        return <Image className={iconClass} />;
      case 'Video':
        return <Video className={iconClass} />;
      case 'Document':
        return <FileText className={iconClass} />;
      default:
        return <Upload className={iconClass} />;
    }
  };

  return (
    <div className={cn('relative pt-[56.25%] min-h-fit w-full', className)}>
      <div {...getRootProps()} className="absolute inset-0 flex flex-1">
        <input {...getInputProps()} />

        <Card
          className={cn(
            'transition-all duration-300 ease-in-out border-dashed border-2 justify-center flex-1',
            'hover:border-primary/50 hover:bg-secondary/40',
            isDragActive && !isDragAccept && !isDragReject && 'border-primary bg-accent scale-[1.01]',
            isDragAccept && 'border-primary bg-primary/10 text-primary  scale-[1.02] shadow-lg shadow-primary/20',
            isDragReject &&
              'border-destructive bg-destructive/10 text-destructive ring-destructive/30 ring-2 scale-[0.98] animate-pulse',
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'cursor-pointer'
          )}
        >
          <CardContent className="flex flex-col items-center justify-center text-center overflow-y-hidden">
            {getMediaIcon()}

            <div className="mt-4 space-y-2">
              <h3 className="font-medium text-sm first-letter:uppercase">
                {isDragAccept && `Thả ${getMediaTypeText(mediaType)} vào đây`}
                {isDragReject && `${getMediaTypeText(mediaType)} không hợp lệ`}
                {isDragActive && !isDragAccept && !isDragReject && 'Thả tệp vào đây'}
                {!isDragActive && !isDragReject && `Tải lên ${getMediaTypeText(mediaType)}`}
              </h3>
              <p className="text-xs text-muted-foreground">Kéo và thả tệp vào đây, hoặc nhấp để chọn</p>
            </div>

            {validationErrors.length > 0 && (
              <div className="mt-4 max-w-xs">
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

            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {mediaType}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
