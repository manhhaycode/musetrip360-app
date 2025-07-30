# ✏️ Rich Editor Package

A comprehensive, production-ready rich text editor for the MuseTrip360 platform. Built with Lexical framework, React, and TypeScript for creating museum content.

## ✨ Features

- **📝 Rich Text Editing**: Full-featured WYSIWYG editor based on Lexical
- **🏛️ Museum-Specific Nodes**: Custom nodes for artifacts, tours, and media embeds
- **🔌 Plugin Architecture**: Extensible plugin system for specialized functionality
- **🎨 Themed Content**: Consistent styling themes for editor and viewer
- **📱 Responsive Design**: Works seamlessly across all devices
- **♿ Accessibility**: Full ARIA support and keyboard navigation
- **⚡ Performance**: Lightweight, tree-shakeable, and optimized
- **🔧 Framework Agnostic**: Pure Lexical setup without data layer coupling

## 🚀 Quick Start

### Basic Editor Setup

```tsx
import { createRichEditor } from '@musetrip360/rich-editor';
import { RichEditorTheme } from '@musetrip360/rich-editor/themes';

function MyEditor() {
  const editor = createRichEditor({
    theme: RichEditorTheme,
    plugins: ['basic', 'artifact', 'tour'],
  });

  return (
    <LexicalComposer initialConfig={editor}>
      <RichTextPlugin />
      <HistoryPlugin />
      <ArtifactPlugin />
    </LexicalComposer>
  );
}
```

### Content Viewer

```tsx
import { ContentViewer } from '@musetrip360/rich-editor/config';

function MyViewer({ content }) {
  return <ContentViewer content={content} theme="museum" readonly={true} />;
}
```

## 📦 Package Structure

```
@musetrip360/rich-editor/
├── nodes/         # Custom Lexical nodes
├── plugins/       # Lexical plugins
├── themes/        # Styling themes
├── config/        # Editor configurations
```

## 🎯 Import Strategy

```tsx
// Specific imports for optimal tree-shaking
import { ArtifactNode, TourNode } from '@musetrip360/rich-editor/nodes';
import { ArtifactPlugin, TourPlugin } from '@musetrip360/rich-editor/plugins';
import { MuseumTheme } from '@musetrip360/rich-editor/themes';
import { createEditor } from '@musetrip360/rich-editor/config';
```

## 🏗️ Custom Nodes

### Artifact Node

Embed museum artifacts with rich metadata:

```tsx
import { ArtifactNode } from '@musetrip360/rich-editor/nodes';

// Renders: [Artifact: Ancient Vase | ID: art_123]
```

### Tour Node

Link to guided tours and experiences:

```tsx
import { TourNode } from '@musetrip360/rich-editor/nodes';

// Renders: [Tour: Egyptian Collection | Duration: 45min]
```

### Media Gallery Node

Rich media galleries with museum content:

```tsx
import { MediaGalleryNode } from '@musetrip360/rich-editor/nodes';

// Renders interactive media galleries
```

## 🔌 Available Plugins

- **BasicPlugin**: Essential formatting (bold, italic, links)
- **ArtifactPlugin**: Museum artifact embedding
- **TourPlugin**: Tour content integration
- **MediaPlugin**: Image and video handling
- **TablePlugin**: Data tables for exhibitions
- **CodePlugin**: Technical documentation

## 🎨 Themes

### Museum Theme

Default theme for museum content:

```tsx
import { MuseumTheme } from '@musetrip360/rich-editor/themes';

const editorConfig = {
  theme: MuseumTheme,
  // Includes: artifact styling, tour cards, media galleries
};
```

### Minimal Theme

Clean, distraction-free editing:

```tsx
import { MinimalTheme } from '@musetrip360/rich-editor/themes';
```

## ⚙️ Configuration

### Custom Editor Configuration

```tsx
import { createRichEditor } from '@musetrip360/rich-editor/config';

const customEditor = createRichEditor({
  theme: MuseumTheme,
  plugins: ['basic', 'artifact', 'tour', 'media'],
  nodes: [ArtifactNode, TourNode, MediaGalleryNode],
  editable: true,
  namespace: 'museum-content',
});
```

## 🏛️ Museum Integration

### Content Creation (Museum Portal)

```tsx
// Museum staff creating homepage content
import { MuseumEditor } from '@musetrip360/rich-editor';

function HomepageEditor() {
  const [content, setContent] = useState('');

  return (
    <MuseumEditor
      initialContent={content}
      onChange={setContent}
      plugins={['artifact', 'tour', 'media']}
      onSave={(data) => saveHomepage(data)}
    />
  );
}
```

### Content Display (Visitor Portal)

```tsx
// Visitors viewing museum homepage
import { ContentViewer } from '@musetrip360/rich-editor';

function MuseumHomepage({ museumId }) {
  const { data: content } = useMuseumContent(museumId);

  return (
    <ContentViewer
      content={content}
      theme="museum"
      interactive={true} // Allow artifact/tour clicks
    />
  );
}
```

## 🚀 Performance

- **Tree-shakeable**: Import only what you need
- **Lazy Loading**: Plugins loaded on demand
- **Optimized Rendering**: Efficient DOM updates
- **Small Bundle**: Core ~15KB gzipped

## 🧪 Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build package
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for the MuseTrip360 platform using Lexical framework.
