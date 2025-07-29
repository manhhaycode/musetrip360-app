# Lexical API Comprehensive Guide

## Core Concepts

### Editor State Management

- **Source of Truth**: Not the DOM, but an underlying state model
- **Two Phases**: Mutable during updates, immutable after updates
- **Core Elements**: Node tree + editor selection

### Key API Patterns

#### 1. Editor Creation & Updates

```javascript
import { createEditor } from 'lexical';

const editor = createEditor({
  namespace: 'MyEditor',
  theme: {
    /* optional theming */
  },
});

// Update pattern - CRITICAL for all modifications
editor.update(() => {
  const root = $getRoot();
  const paragraphNode = $createParagraphNode();
  const textNode = $createTextNode('Hello world');
  paragraphNode.append(textNode);
  root.append(paragraphNode);
});
```

#### 2. Selection Management

**Selection Types:**

- `RangeSelection`: Most common (anchor, focus, format properties)
- `NodeSelection`: Multiple arbitrary nodes
- `TableSelection`: Grid-like selections
- `null`: No active selection

**Key Selection APIs:**

```javascript
// MUST be called within editor.update() or editor.read()
const selection = $getSelection();
$setSelection(newSelection);

// Selection creation
$createRangeSelection();
$createNodeSelection();
```

#### 3. State Listeners

```javascript
editor.registerUpdateListener(({ editorState }) => {
  editorState.read(() => {
    // Process state changes
    const selection = $getSelection();
    const root = $getRoot();
  });
});
```

#### 4. Command System

```javascript
// Create custom commands
const HELLO_WORLD_COMMAND = createCommand();

// Dispatch commands
editor.dispatchCommand(HELLO_WORLD_COMMAND, 'payload');

// Register command listeners
editor.registerCommand(
  HELLO_WORLD_COMMAND,
  (payload) => {
    // Handle command
    return false; // Allow propagation
  },
  COMMAND_PRIORITY_LOW
);
```

## React Integration Patterns

### Essential Setup

```jsx
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';

<LexicalComposer initialConfig={initialConfig}>
  <RichTextPlugin contentEditable={<ContentEditable />} ErrorBoundary={LexicalErrorBoundary} />
  <HistoryPlugin />
  <AutoFocusPlugin />
</LexicalComposer>;
```

### Built-in React Plugins

- **PlainTextPlugin**: Basic text editing
- **RichTextPlugin**: Advanced formatting (bold, italic, etc.)
- **HistoryPlugin**: Undo/redo functionality
- **LinkPlugin**: Link management
- **ListPlugin**: List support
- **TablePlugin**: Table editing
- **AutoLinkPlugin**: Automatic link conversion
- **MarkdownShortcutPlugin**: Markdown shortcuts

## Critical Rules for Plugin Development

### 1. $ Functions Must Be Called in Closures

```javascript
// CORRECT - within editor.update()
editor.update(() => {
  const selection = $getSelection();
  const root = $getRoot();
});

// WRONG - outside closures will throw errors
const selection = $getSelection(); // ERROR!
```

### 2. Transforms for Efficient State Reactions

```javascript
editor.registerNodeTransform(TextNode, (textNode) => {
  if (textNode.getTextContent() === 'blue') {
    textNode.setTextContent('green');
  }
});
```

### 3. Serialization/Deserialization

```javascript
// JSON serialization
const jsonState = JSON.stringify(editorState);
const parsedState = editor.parseEditorState(jsonState);

// HTML conversion
const htmlString = $generateHtmlFromNodes(editor, selection);
const nodes = $generateNodesFromDOM(editor, dom);
```

## Common Anti-Patterns to Avoid

1. **Never call $ functions outside editor.update()/read()**
2. **Don't use update listeners for node modifications** - use transforms instead
3. **Avoid synchronous DOM reads** during updates
4. **Don't modify editor state directly** - always use editor.update()

## Performance Best Practices

1. **Batch updates** using editor.update()
2. **Use discrete updates** `{discrete: true}` for immediate commits
3. **Implement transforms** for efficient state reactions
4. **Minimize selection listeners** - use centralized state management
5. **Leverage command system** for decoupled interactions
