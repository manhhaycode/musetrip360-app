import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from 'lexical';
import { useEffect, useState } from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { Label } from '@musetrip360/ui-core/label';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { $createImageNode, ImagePayload } from '@/nodes/ImageNode';
import { Image, Link, Upload } from 'lucide-react';

export interface ImagePluginProps {
  captionsEnabled?: boolean;
}

// Command for inserting images
export const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>('INSERT_IMAGE_COMMAND');

// Image insertion dialog component
function ImageInsertDialog({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (payload: ImagePayload) => void;
}) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [showCaption, setShowCaption] = useState(false);

  const handleInsert = () => {
    if (mode === 'url' && url) {
      onInsert({
        src: url,
        altText: altText || undefined,
        caption: caption || undefined,
        showCaption,
      });
    } else if (mode === 'upload') {
      // For upload mode, insert with null src to show DropZone
      onInsert({
        src: null,
        altText: altText || undefined,
        caption: caption || undefined,
        showCaption,
      });
    }

    // Reset form
    setUrl('');
    setAltText('');
    setCaption('');
    setShowCaption(false);
    onClose();
  };

  const canInsert = mode === 'url' ? url.trim() !== '' : true;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chèn hình ảnh</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Mode Selection */}
          <div className="flex space-x-2">
            <Button
              variant={mode === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('url')}
              className="flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              URL
            </Button>
            <Button
              variant={mode === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('upload')}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Tải lên
            </Button>
          </div>

          {/* URL Mode */}
          {mode === 'url' && (
            <div className="space-y-3">
              <Label htmlFor="image-url">URL hình ảnh</Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/hinh-anh.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}

          {/* Upload Mode Info */}
          {mode === 'upload' && (
            <div className="text-sm text-muted-foreground">
              Khu vực tải lên hình ảnh sẽ xuất hiện trong trình soạn thảo sau khi chèn.
            </div>
          )}

          {/* Common fields */}
          <div className="space-y-3">
            <Label htmlFor="alt-text">Văn bản thay thế (Tùy chọn)</Label>
            <Input
              id="alt-text"
              placeholder="Mô tả hình ảnh"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="show-caption" checked={showCaption} onCheckedChange={() => setShowCaption(!showCaption)} />
              <Label htmlFor="show-caption">Hiển thị chú thích</Label>
            </div>
            {showCaption && (
              <Input placeholder="Chú thích hình ảnh" value={caption} onChange={(e) => setCaption(e.target.value)} />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleInsert} disabled={!canInsert}>
              Chèn hình ảnh
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main plugin component
export function ImagePlugin({ captionsEnabled = true }: ImagePluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload: ImagePayload) => {
        const imageNode = $createImageNode({
          src: payload.src,
          altText: payload.altText,
          caption: captionsEnabled ? payload.caption : undefined,
          showCaption: captionsEnabled ? payload.showCaption : false,
        });

        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const paragraph = anchorNode.getTopLevelElement();

          if (paragraph) {
            // Replace the current paragraph with the image node
            paragraph.replace(imageNode);
            // Create a new paragraph after the image for continued editing
            const newParagraph = $createParagraphNode();
            imageNode.insertAfter(newParagraph);
            newParagraph.select();
          } else {
            // Fallback: insert directly
            $insertNodes([imageNode]);
          }
        }
        requestAnimationFrame(() => editor.focus());
        return true;
      },

      COMMAND_PRIORITY_EDITOR
    );
  }, [captionsEnabled, editor]);

  return null;
}

// Toolbar button component for inserting images
export function ImageToolbarButton() {
  const [editor] = useLexicalComposerContext();
  const [showDialog, setShowDialog] = useState(false);

  const handleInsertImage = (payload: ImagePayload) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2"
        title="Chèn hình ảnh"
      >
        <Image className="h-4 w-4" />
      </Button>

      <ImageInsertDialog open={showDialog} onClose={() => setShowDialog(false)} onInsert={handleInsertImage} />
    </>
  );
}
