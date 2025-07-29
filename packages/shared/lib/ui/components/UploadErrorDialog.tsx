import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from '@musetrip360/ui-core';
import { FileText, Image, Video, XCircle } from 'lucide-react';

interface UploadErrorDialogProps {
  open: boolean;
  onClose: () => void;
  files: Array<{ id: string; file: File }>;
}

export function UploadErrorDialog({ open, onClose, files }: UploadErrorDialogProps) {
  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();

    if (type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-primary" />;
    }
    if (type.startsWith('video/')) {
      return <Video className="h-5 w-5 text-secondary-foreground" />;
    }
    // Document types (PDF, DOC, TXT, etc.)
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = files.reduce((sum, { file }) => sum + file.size, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-lg font-semibold text-destructive">Tải lên thất bại</DialogTitle>
          </div>
          <DialogDescription>
            {files.length === 1
              ? 'Có 1 tệp tin không thể tải lên được.'
              : `Có ${files.length} tệp tin không thể tải lên được.`}
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <ScrollArea className="max-h-64">
            <div className="space-y-3 pr-4">
              {files.map(({ id, file }) => (
                <div
                  key={id}
                  className="flex items-center gap-4 p-3 rounded-xl border bg-destructive/5 border-destructive/20 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-background rounded-xl border border-destructive/20 flex items-center justify-center shadow-sm">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate mb-1">{file.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Thất bại:</span>
            <span className="font-semibold text-destructive">
              {files.length} tệp tin • {formatFileSize(totalSize)}
            </span>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
