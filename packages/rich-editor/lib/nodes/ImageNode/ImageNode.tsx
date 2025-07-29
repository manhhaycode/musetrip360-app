import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MediaType } from '@musetrip360/shared/types';
import { DropZoneWithPreview } from '@musetrip360/shared/ui';
import { $applyNodeReplacement, $getNodeByKey, DecoratorNode } from 'lexical';
import { JSX, useCallback } from 'react';

export interface ImagePayload {
  altText?: string;
  caption?: string;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  showCaption?: boolean;
  src: string | File | null;
  width?: number;
}

export type SerializedImageNode = Spread<
  {
    altText?: string;
    caption?: string;
    height?: number;
    maxWidth?: number;
    showCaption?: boolean;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode;
    const imageNode = $createImageNode({ altText, height: height || undefined, src, width: width || undefined });
    return { node: imageNode };
  }
  return null;
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string | File | null;
  __altText?: string;
  __width?: number;
  __height?: number;
  __maxWidth?: number;
  __showCaption?: boolean;
  __caption?: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src, showCaption, caption } = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      showCaption,
      src,
      width,
    });
    if (caption !== undefined) {
      node.setCaption(caption);
    }
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    const src = this.__src;

    // Only export if we have a string URL
    if (typeof src === 'string') {
      element.setAttribute('src', src);
      element.setAttribute('alt', this.__altText || '');
      if (this.__width) element.setAttribute('width', this.__width.toString());
      if (this.__height) element.setAttribute('height', this.__height.toString());
    }

    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string | File | null,
    altText?: string,
    maxWidth?: number,
    width?: number,
    height?: number,
    showCaption?: boolean,
    caption?: string,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width;
    this.__height = height;
    this.__showCaption = showCaption || false;
    this.__caption = caption;
  }

  exportJSON(): SerializedImageNode {
    // Only serialize string URLs, not File objects
    const src = this.__src;
    const srcToSerialize = typeof src === 'string' ? src : '';

    return {
      altText: this.getAltText(),
      caption: this.getCaption(),
      height: this.__height,
      maxWidth: this.__maxWidth,
      showCaption: this.__showCaption,
      src: srcToSerialize,
      type: 'image',
      version: 1,
      width: this.__width,
    };
  }

  setWidthAndHeight(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  setCaption(caption: string): void {
    const writable = this.getWritable();
    writable.__caption = caption;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string | File | null {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText || '';
  }

  getCaption(): string {
    return this.__caption || '';
  }

  getMaxWidth(): number | undefined {
    return this.__maxWidth;
  }

  getShowCaption(): boolean {
    return this.__showCaption || false;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  setSrc(src: string | File | null): void {
    const writable = this.getWritable();
    writable.__src = src;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        showCaption={this.__showCaption}
        caption={this.__caption}
      />
    );
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
  showCaption,
  caption,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText, maxWidth, width, height, showCaption, caption, key));
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}

interface ImageComponentProps {
  altText?: string;
  caption?: string;
  height?: number;
  maxWidth?: number;
  nodeKey: NodeKey;
  showCaption?: boolean;
  src: string | File | null;
  width?: number;
}

function ImageComponent({
  src,
  altText,
  width,
  height,
  maxWidth,
  showCaption,
  caption,
  nodeKey,
}: ImageComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const updateNodeSrc = useCallback(
    (newSrc: string | File | null) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.setSrc(newSrc);
        }
      });
    },
    [editor, nodeKey]
  );

  // If src is a File or null, show the DropZone
  if (src instanceof File || src === null) {
    return (
      <div className="w-4/5 mx-auto" contentEditable={false} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <DropZoneWithPreview
          value={src}
          onChange={(newValue) => {
            // Convert uploaded file to URL string when upload completes
            if (typeof newValue === 'string') {
              updateNodeSrc(newValue);
            } else {
              updateNodeSrc(newValue);
            }
          }}
          onRemove={() => updateNodeSrc(null)}
          mediaType={MediaType.IMAGE}
          uploadId={`image-node-${nodeKey}`}
          autoRegister={true}
          manualUpload={false}
        />
        {showCaption && caption && (
          <div
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontStyle: 'italic',
              marginTop: '0.5rem',
              textAlign: 'center',
            }}
          >
            {caption}
          </div>
        )}
      </div>
    );
  }

  // If src is a string (URL), show the image
  return (
    <div
      className="w-4/5 mx-auto"
      contentEditable={false}
      style={{ maxWidth, marginTop: '1rem', marginBottom: '1rem' }}
    >
      <img
        src={src}
        alt={altText}
        style={{
          height,
          maxWidth: '100%',
          width,
        }}
        draggable="false"
      />
      {showCaption && caption && (
        <div
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            fontStyle: 'italic',
            marginTop: '0.5rem',
            textAlign: 'center',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
