import { cn } from '@/libs/utils';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ModelViewerControls } from './ModelViewerControls';

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
}

export function ModelViewer({ modelUrl, className }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [, setHasError] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const webViewRef = useRef<WebView>(null);

  // Functions to control 3D model via WebView messages
  const toggleRotation = () => {
    const script = `
      toggleRotation();
      true; // Required for injectedJavaScript
    `;
    webViewRef.current?.injectJavaScript(script);
  };

  const resetCamera = () => {
    const script = `
      resetCamera();
      true; // Required for injectedJavaScript
    `;
    webViewRef.current?.injectJavaScript(script);
  };

  // Create HTML content for 3D model viewing using model-viewer with design system
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>3D Model Viewer</title>
      <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
      <style>
        :root {
          /* Import design system variables */
          --background: #fff6ed;
          --foreground: #2d1f13;
          --card: #ffffff;
          --card-foreground: #2d1f13;
          --primary: #ff914d;
          --primary-foreground: #fff6ed;
          --secondary: #ffe3cc;
          --secondary-foreground: #2d1f13;
          --muted: #f5e9dd;
          --muted-foreground: #a67c52;
          --accent: #ffb672;
          --accent-foreground: #2d1f13;
          --destructive: #f87171;
          --destructive-foreground: #fff6ed;
          --border: #ffd2b2;
          --input: #ffd2b2;
          --ring: #ff914d;
          --font-sans: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
          --radius: 10px;
        }
        body {
          margin: 0;
          padding: 0;
          background: var(--background);
          font-family: var(--font-sans);
          overflow: hidden;
        }
        
        model-viewer {
          width: 100vw;
          height: 100vh;
          background-color: var(--background);
          --poster-color: transparent;
          --progress-bar-color: transparent;
          --progress-mask: transparent;
        }
        
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--foreground);
          text-align: center;
          z-index: 1000;
        }
        
        .error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--destructive);
          text-align: center;
          z-index: 1000;
          padding: 20px;
          max-width: 80%;
        }
      </style>
    </head>
    <body>
      <div class="loading" id="loading">
        <!-- No text, just visual loading indicator -->
      </div>
      
      <model-viewer
        id="model"
        src="${modelUrl}"
        alt="3D Model của hiện vật"
        auto-rotate
        auto-rotate-delay="1000"
        rotation-per-second="30deg"
        camera-controls
        camera-orbit="0deg 75deg 105%"
        max-camera-orbit="Infinity 180deg auto"
        min-camera-orbit="-Infinity 0deg 50%"
        max-field-of-view="45deg"
        min-field-of-view="25deg"
        touch-action="pan-y"
        interaction-prompt="none"
        environment-image="neutral"
        shadow-intensity="1"
        shadow-softness="1"
        style="opacity: 0; transition: opacity 0.5s ease;"
        loading="eager"
      ></model-viewer>
      
      <script>
        let modelElement = document.getElementById('model');
        let isAutoRotating = true;
        
        modelElement.addEventListener('load', function() {
          document.getElementById('loading').style.display = 'none';
          document.getElementById('model').style.opacity = '1';
          
          // Send success message to React Native
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'modelLoaded',
            success: true
          }));
        });
        
        modelElement.addEventListener('error', function() {
          document.getElementById('loading').innerHTML = 
            '<div class="error">' +
              '<div>❌</div>' +
              '<div style="margin-top: 10px;">Không thể tải mô hình</div>' +
            '</div>';
          
          // Send error message to React Native
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'modelError',
            success: false
          }));
        });

        // Remove message listener since we're using injectedJavaScript
        // window.addEventListener('message', function(event) {
        //   try {
        //     const data = JSON.parse(event.data);
        //     if (data.type === 'toggleRotation') {
        //       toggleRotation();
        //     } else if (data.type === 'resetCamera') {
        //       resetCamera();
        //     }
        //   } catch (error) {
        //     console.log('Error parsing message from React Native:', error);
        //   }
        // });
        
        function toggleRotation() {
          isAutoRotating = !isAutoRotating;
          modelElement.autoRotate = isAutoRotating;
          
          // Send message to React Native
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'rotationToggled',
            isAutoRotating: isAutoRotating
          }));
        }
        
        function resetCamera() {
          // Reset both turntable and camera position
          modelElement.resetTurntableRotation();
          modelElement.cameraOrbit = '0deg 75deg 105%';
          modelElement.jumpCameraToGoal();
          
          // Send message to React Native
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'cameraReset',
            success: true
          }));
        }
        
        // Hide loading after timeout
        setTimeout(() => {
          if (document.getElementById('loading').style.display !== 'none') {
            modelElement.dispatchEvent(new Event('error'));
          }
        }, 15000);
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case 'modelLoaded':
          setIsLoading(false);
          setHasError(false);
          break;

        case 'modelError':
          setIsLoading(false);
          setHasError(true);
          break;

        case 'rotationToggled':
          setIsAutoRotating(data.isAutoRotating);
          break;

        case 'cameraReset':
          break;

        default:
          break;
      }
    } catch {
      // Handle parsing errors silently
    }
  };

  return (
    <View className={cn('flex-1 bg-background', className)}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        className="flex-1 bg-background"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={handleWebViewMessage}
        onError={(error) => {
          setHasError(true);
          setIsLoading(false);
        }}
        onHttpError={(error) => {
          setHasError(true);
          setIsLoading(false);
        }}
      />

      {/* React Native Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-background/90 justify-center items-center z-50">
          <ActivityIndicator size="large" color="#ff914d" />
        </View>
      )}

      {/* Native Controls using design system */}
      {!isLoading && (
        <View className="absolute bottom-0 left-0 right-0 items-center pb-5">
          <ModelViewerControls
            onToggleRotation={toggleRotation}
            onResetCamera={resetCamera}
            isAutoRotating={isAutoRotating}
          />
        </View>
      )}
    </View>
  );
}
