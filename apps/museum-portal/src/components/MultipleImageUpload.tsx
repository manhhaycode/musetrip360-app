import { DropZone, MediaType } from '@musetrip360/shared';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Button } from '@musetrip360/ui-core/button';
import { Badge } from '@musetrip360/ui-core/badge';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

// Multiple Image Upload Component using existing DropZone
interface MultipleImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onLocalFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  value = [],
  onChange,
  onLocalFilesChange,
  disabled = false,
}) => {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);

  const handleFileSelected = (file: File) => {
    // Create preview URL for the file
    const previewUrl = URL.createObjectURL(file);

    const newLocalFiles = [...localFiles, file];
    setLocalFiles(newLocalFiles);
    setFilePreviewUrls((prev) => [...prev, previewUrl]);

    // Notify parent component about local files
    onLocalFilesChange(newLocalFiles);
  };

  const handleValidationError = (errors: string[]) => {
    console.error('File validation errors:', errors);
    // You could show a toast notification here
  };

  const removeFile = (index: number) => {
    const newLocalFiles = localFiles.filter((_, i) => i !== index);
    setLocalFiles(newLocalFiles);

    setFilePreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the object URL to free memory
      const urlToRevoke = prev[index];
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
      return newUrls;
    });

    // Notify parent component about local files
    onLocalFilesChange(newLocalFiles);
  };

  const removeExistingImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  // Combine existing images with local file previews
  const allImages = [...value, ...filePreviewUrls];

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <DropZone
        mediaType={MediaType.IMAGE}
        onFileSelected={handleFileSelected}
        onValidationError={handleValidationError}
        disabled={disabled}
        className="min-h-[120px]"
      />

      {/* Image List */}
      {allImages.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((imageUrl, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <img src={imageUrl} alt={`Hình ảnh ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      if (index < value.length) {
                        removeExistingImage(index);
                      } else {
                        removeFile(index - value.length);
                      }
                    }}
                    disabled={disabled}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>

                  {/* Badge to show if it's a new file or existing image */}
                  {index >= value.length && (
                    <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                      Mới
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Image Count */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{value.length} hình ảnh hiện có</Badge>
            {localFiles.length > 0 && <Badge variant="outline">+{localFiles.length} hình ảnh mới</Badge>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload;
