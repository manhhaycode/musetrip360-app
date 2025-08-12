# Virtual Tour Package - Complete Specification & Implementation Guide

## 🎯 **UPDATED ARCHITECTURE: Cubemap-Based with Hybrid Face Types**

The virtual-tour package has been **completely redefined** to use cubemap technology with support for both URL and File sources, incremental face rendering, and progressive loading.

---

## 📋 **Core Requirements & Data Structure**

### **Hybrid Face Type System**

```typescript
// Union type for maximum flexibility
type FaceSource = string | File;

interface CubeMapLevel {
  px: FaceSource; // Positive X (Right) - URL or File
  nx: FaceSource; // Negative X (Left) - URL or File
  py: FaceSource; // Positive Y (Top) - URL or File
  ny: FaceSource; // Negative Y (Bottom) - URL or File
  pz: FaceSource; // Positive Z (Front) - URL or File
  nz: FaceSource; // Negative Z (Back) - URL or File
}

interface CubeMapData {
  cubeMaps: CubeMapLevel[]; // Array of resolution levels (low to high)
  metadata?: {
    title?: string;
    description?: string;
    totalLevels: number;
    hasLocalFiles?: boolean; // Track if contains File objects
  };
}
```

### **Usage Scenarios**

#### **Scenario 1: All URLs (Production Content)**

```typescript
const productionCubemap: CubeMapData = {
  cubeMaps: [
    {
      px: 'https://cdn.museum.com/level0/right.jpg',
      nx: 'https://cdn.museum.com/level0/left.jpg',
      py: 'https://cdn.museum.com/level0/top.jpg',
      ny: 'https://cdn.museum.com/level0/bottom.jpg',
      pz: 'https://cdn.museum.com/level0/front.jpg',
      nz: 'https://cdn.museum.com/level0/back.jpg',
    },
    {
      px: 'https://cdn.museum.com/level1/right.jpg', // Higher resolution
      nx: 'https://cdn.museum.com/level1/left.jpg',
      // ... other faces
    },
  ],
  metadata: { hasLocalFiles: false, totalLevels: 2 },
};
```

#### **Scenario 2: All Files (Preview Mode)**

```typescript
const previewCubemap: CubeMapData = {
  cubeMaps: [
    {
      px: selectedFiles.right, // File object from input
      nx: selectedFiles.left, // File object from input
      py: selectedFiles.top, // File object from input
      ny: selectedFiles.bottom, // File object from input
      pz: selectedFiles.front, // File object from input
      nz: selectedFiles.back, // File object from input
    },
  ],
  metadata: { hasLocalFiles: true, totalLevels: 1 },
};
```

#### **Scenario 3: Mixed Sources (Partial Edit)**

```typescript
const mixedCubemap: CubeMapData = {
  cubeMaps: [
    {
      px: 'https://cdn.museum.com/level0/right.jpg', // Existing URL
      nx: 'https://cdn.museum.com/level0/left.jpg', // Existing URL
      py: newTopFile, // User's new file replacement
      ny: newBottomFile, // User's new file replacement
      pz: 'https://cdn.museum.com/level0/front.jpg', // Existing URL
      nz: 'https://cdn.museum.com/level0/back.jpg', // Existing URL
    },
  ],
  metadata: { hasLocalFiles: true },
};
```

---

## 🚀 **Key Innovation: Incremental Face Rendering**

### **Revolutionary Loading Approach**

**❌ OLD WAY**: Wait for all 6 faces before rendering

```typescript
// BAD: Blocking approach
const faces = await Promise.all([face1, face2, face3, face4, face5, face6]);
render(new CubeTexture(faces)); // User waits for everything
```

**✅ NEW WAY**: Render each face immediately as it loads

```typescript
// GOOD: Incremental approach
async loadCubeMapLevelIncremental(level: CubeMapLevel): Promise<void> {
  // 1. Show placeholders immediately
  this.renderWithPlaceholders();

  // 2. Load each face individually and update immediately
  Object.entries(level).forEach(async ([faceName, faceSource], index) => {
    const texture = await this.loadFaceTexture(faceSource);
    this.updateFace(index, texture); // Render immediately!
    this.onFaceLoaded?.(index); // Progress callback
  });
}
```

### **User Experience Timeline**

```
Time 0ms:    [🔲🔲🔲🔲🔲🔲] Placeholders shown immediately
Time 50ms:   [✅🔲🔲🔲🔲🔲] Front face loaded and displayed
Time 80ms:   [✅✅🔲🔲🔲🔲] Left face loaded and displayed
Time 120ms:  [✅✅✅🔲🔲🔲] Right face loaded and displayed
Time 200ms:  [✅✅✅✅🔲🔲] Top and bottom faces loaded
Time 300ms:  [✅✅✅✅✅✅] All faces complete, full quality
```

---

## 🏗️ **Technical Implementation Architecture**

### **Hybrid Texture Loading System**

```typescript
class HybridCubemapLoader {
  async loadFaceTexture(faceSource: FaceSource): Promise<THREE.Texture> {
    if (this.isFileSource(faceSource)) {
      return this.loadFromFile(faceSource);
    } else {
      return this.loadFromUrl(faceSource);
    }
  }

  private async loadFromFile(file: File): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const loader = new THREE.TextureLoader();
        loader.load(imageUrl, (texture) => {
          URL.revokeObjectURL(imageUrl); // Cleanup memory
          resolve(texture);
        });
      };
      reader.readAsDataURL(file);
    });
  }

  private async loadFromUrl(url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(url, resolve, undefined, reject);
    });
  }
}
```

### **Progressive Loading with Network Awareness**

```typescript
class ProgressiveCubemapLoader extends HybridCubemapLoader {
  async loadProgressively(cubeMapData: CubeMapData): Promise<void> {
    // 1. Load lowest resolution immediately
    await this.loadCubeMapLevelIncremental(cubeMapData.cubeMaps[0]);

    // 2. Check network capacity
    const networkSpeed = await this.detectBandwidth();

    // 3. Load higher resolutions based on network
    for (let i = 1; i < cubeMapData.cubeMaps.length; i++) {
      if (this.shouldLoadLevel(i, networkSpeed)) {
        await this.loadCubeMapLevelIncremental(cubeMapData.cubeMaps[i]);
      }
    }

    // 4. Zoom-based ultra-high resolution
    this.onZoomChange((zoomLevel) => {
      if (zoomLevel > 5.0) {
        this.loadUltraHighResolution();
      }
    });
  }
}
```

---

## 📦 **Package Structure (Updated)**

```
packages/virtual-tour/lib/
├── cubemap/                         # Cubemap Processing Core
│   ├── HybridCubemapLoader.ts      # URL + File loading system
│   ├── IncrementalRenderer.tsx     # Face-by-face rendering
│   ├── ProgressiveLoader.ts        # Multi-resolution loading
│   └── index.ts                    # Cubemap exports
├── components/                     # React Components
│   ├── CubemapViewer.tsx          # Main viewer component
│   ├── CubemapFileSelector.tsx    # File selection for preview
│   ├── LoadingIndicator.tsx       # Per-face loading progress
│   └── index.ts                   # Component exports
├── utils/                          # Utilities
│   ├── networkUtils.ts             # Network speed detection
│   ├── textureUtils.ts             # Three.js texture utilities
│   ├── fileUtils.ts                # File validation and processing
│   ├── urlUtils.ts                 # URL validation and processing
│   └── index.ts                    # Utils exports
├── types/                          # TypeScript Definitions
│   ├── cubemap.ts                  # CubeMapLevel, CubeMapData, FaceSource
│   ├── network.ts                  # Network quality types
│   ├── loading.ts                  # Loading state types
│   └── index.ts                    # Type exports
├── hooks/                          # React Hooks
│   ├── useCubemapLoader.ts        # Cubemap loading hook
│   ├── useNetworkDetection.ts     # Network monitoring hook
│   ├── useFilePreview.ts          # File preview hook
│   └── index.ts                   # Hook exports
└── index.ts                       # Main package exports
```

---

## 🎨 **Component Usage Examples**

### **Production Viewer (URLs Only)**

```tsx
import { CubemapViewer } from '@musetrip360/virtual-tour';

<CubemapViewer
  cubeMapData={productionCubemap}
  enableProgressiveLoading={true}
  controls={{
    enableZoom: true,
    maxZoom: 10,
    enableAutoRotate: true,
  }}
  onResolutionUpgrade={(level) => console.log('Upgraded to:', level)}
/>;
```

### **Content Creation with Preview**

```tsx
import { CubemapFileSelector, CubemapViewer } from '@musetrip360/virtual-tour';

function ContentCreator() {
  const [previewCubemap, setPreviewCubemap] = useState<CubeMapData | null>(null);

  return (
    <div>
      {/* File Selection */}
      <CubemapFileSelector
        onFilesSelected={(cubemap) => {
          setPreviewCubemap(cubemap); // Immediate preview
        }}
      />

      {/* Live Preview */}
      {previewCubemap && (
        <div>
          <h3>🔍 Preview Mode</h3>
          <CubemapViewer cubeMapData={previewCubemap} previewMode={true} />
          <button onClick={() => uploadCubemap(previewCubemap)}>Upload & Save</button>
        </div>
      )}
    </div>
  );
}
```

### **Content Editing (Mixed Sources)**

```tsx
function ContentEditor({ existingCubemap }: { existingCubemap: CubeMapData }) {
  const [editedCubemap, setEditedCubemap] = useState(existingCubemap);

  const replaceFace = (face: keyof CubeMapLevel, newFile: File) => {
    const updated = {
      ...editedCubemap,
      cubeMaps: [
        {
          ...editedCubemap.cubeMaps[0],
          [face]: newFile, // Mix File with existing URLs
        },
      ],
      metadata: { ...editedCubemap.metadata, hasLocalFiles: true },
    };
    setEditedCubemap(updated);
  };

  return <CubemapViewer cubeMapData={editedCubemap} enableFaceReplacement={true} onFaceReplace={replaceFace} />;
}
```

---

## ⚡ **Performance Benefits**

### **Cubemap vs Equirectangular Advantages**

- ✅ **Better Performance**: 6 separate textures vs 1 massive texture
- ✅ **Selective Loading**: Load only visible faces at high resolution
- ✅ **Memory Efficiency**: Smaller individual texture sizes
- ✅ **Quality Optimization**: Better pixel distribution
- ✅ **Zoom Efficiency**: Load high-res only for zoomed areas

### **Incremental Rendering Benefits**

- ✅ **Immediate Display**: User sees something in < 50ms
- ✅ **Progressive Enhancement**: Each face improves as it loads
- ✅ **No Blocking**: Fast faces don't wait for slow faces
- ✅ **Better Feedback**: Visual progress per face

### **Hybrid Source Benefits**

- ✅ **Instant Preview**: No upload required to see results
- ✅ **Flexible Editing**: Mix new files with existing URLs
- ✅ **Memory Safety**: Automatic ObjectURL cleanup
- ✅ **Error Recovery**: Graceful fallback for failed loads

---

## 🎯 **Implementation Phases**

### **Phase 1: Core Foundation** (HIGH Priority)

1. **TypeScript Interfaces**: Define CubeMapLevel, CubeMapData with FaceSource
2. **HybridCubemapLoader**: Support both URL and File loading
3. **IncrementalRenderer**: Face-by-face rendering system
4. **Network Detection**: Bandwidth measurement for quality selection

### **Phase 2: React Components** (HIGH Priority)

5. **CubemapViewer**: Main viewer component with controls
6. **CubemapFileSelector**: File selection UI for preview mode
7. **LoadingIndicator**: Per-face loading progress display
8. **Error Handling**: Robust fallback and error recovery

### **Phase 3: Advanced Features** (MEDIUM Priority)

9. **Progressive Loading**: Multi-resolution based on network
10. **Zoom-Based Loading**: Ultra-high resolution on zoom
11. **Memory Management**: Efficient texture cleanup
12. **Performance Monitoring**: Loading metrics and optimization

### **Phase 4: Integration & Polish** (LOW Priority)

13. **Museum Portal Integration**: Examples and documentation
14. **Visitor Portal Integration**: Public viewer implementation
15. **Unit Testing**: Comprehensive test coverage
16. **Documentation**: Complete API reference and guides

---

## 🔧 **Technical Specifications**

### **Face Loading Strategy**

```typescript
interface FaceLoadingState {
  faceIndex: number;
  faceName: 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz';
  status: 'placeholder' | 'loading' | 'loaded' | 'error';
  sourceType: 'file' | 'url';
  resolution: 'low' | 'medium' | 'high' | 'ultra';
  loadTime?: number;
  fileSize?: number;
}
```

### **Network Adaptation Logic**

```typescript
interface NetworkAdaptation {
  slow: { maxResolutionLevels: 2; faceSize: '512x512' };
  medium: { maxResolutionLevels: 3; faceSize: '1024x1024' };
  fast: { maxResolutionLevels: 4; faceSize: '2048x2048' };
  ultra: { maxResolutionLevels: 5; faceSize: '4096x4096' };
}
```

### **Memory Management**

```typescript
class CubemapMemoryManager {
  private objectUrls: Set<string> = new Set();
  private textureCache: Map<string, THREE.Texture> = new Map();

  trackObjectUrl(url: string): void {
    this.objectUrls.add(url);
  }

  cleanup(): void {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.textureCache.forEach((texture) => texture.dispose());
    this.objectUrls.clear();
    this.textureCache.clear();
  }
}
```

---

## 🚀 **Success Criteria**

### **Performance Targets**

- ✅ **Instant Display**: First placeholder render < 50ms
- ✅ **Progressive Loading**: First face loaded < 200ms
- ✅ **Full Quality**: All faces loaded within 2-5 seconds (network dependent)
- ✅ **Memory Efficiency**: < 150MB GPU memory usage
- ✅ **Network Adaptive**: Automatic quality adjustment

### **User Experience Goals**

- ✅ **Immediate Feedback**: User sees progress instantly
- ✅ **Preview Without Upload**: Content creators can preview immediately
- ✅ **Flexible Editing**: Mix existing and new content seamlessly
- ✅ **Error Recovery**: Graceful handling of failed loads
- ✅ **Cross-Platform**: Works on desktop and mobile browsers

### **Technical Requirements**

- ✅ **Type Safety**: Complete TypeScript coverage
- ✅ **Tree Shaking**: Optimized imports and exports
- ✅ **Memory Safety**: No memory leaks from ObjectURLs
- ✅ **Error Handling**: Comprehensive error recovery
- ✅ **Browser Support**: Modern browsers with WebGL support

---

## 💡 **Key Innovations Summary**

1. **Cubemap Technology**: Superior to equirectangular for performance and quality
2. **Hybrid Face Sources**: Support both URLs and Files for maximum flexibility
3. **Incremental Rendering**: Render faces as they load, not after all complete
4. **Network-Aware Loading**: Automatic quality adaptation based on bandwidth
5. **Preview Mode**: Immediate preview without upload requirement
6. **Mixed Source Editing**: Seamlessly combine existing URLs with new Files

This architecture provides **museum-quality 360° viewing** with **excellent performance**, **immediate feedback**, and **flexible content management** - all while maintaining **zero server infrastructure overhead** for the core viewing experience.

---

## 🔮 **Future Considerations** (Out of Current Scope)

- **Hotspot System**: Interactive elements within cubemap
- **Scene Transitions**: Navigation between different cubemap scenes
- **Socket Control**: Real-time camera synchronization
- **AR/VR Support**: Extended reality integration
- **Compression**: Advanced texture compression (KTX2, ASTC)
- **CDN Optimization**: Advanced caching strategies

The current specification focuses on delivering **exceptional cubemap viewing** with **hybrid source support** and **incremental rendering** - the foundation for all future enhancements.
