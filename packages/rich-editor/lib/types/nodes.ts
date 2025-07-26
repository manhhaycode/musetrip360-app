import type { SerializedLexicalNode } from 'lexical';

export interface ArtifactNodeData {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  museumId?: string;
}

export interface ExhibitionNodeData {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  museumId?: string;
}

export interface MediaNodeData {
  url: string;
  type: 'image' | 'video' | 'audio';
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface SerializedArtifactNode extends SerializedLexicalNode {
  data: ArtifactNodeData;
}

export interface SerializedExhibitionNode extends SerializedLexicalNode {
  data: ExhibitionNodeData;
}

export interface SerializedMediaNode extends SerializedLexicalNode {
  data: MediaNodeData;
}
