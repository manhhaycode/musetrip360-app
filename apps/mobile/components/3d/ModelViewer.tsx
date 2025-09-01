import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
}

export function ModelViewer({ modelUrl, className }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [, setHasError] = useState(false);

  // Create HTML content for 3D model viewing using model-viewer
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>3D Model Viewer</title>
      <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: #000;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          overflow: hidden;
        }
        
        model-viewer {
          width: 100vw;
          height: 100vh;
          background-color: #000;
          --poster-color: transparent;
          --progress-bar-color: #ff914d;
          --progress-mask: transparent;
        }
        
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          text-align: center;
          z-index: 1000;
        }
        
        .error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ff6b6b;
          text-align: center;
          z-index: 1000;
          padding: 20px;
          max-width: 80%;
        }

        .controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 10px 20px;
          display: flex;
          gap: 15px;
          align-items: center;
          z-index: 1000;
        }

        .control-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          color: white;
          padding: 8px 16px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .control-btn.active {
          background: #ff914d;
          border-color: #ff914d;
        }
      </style>
    </head>
    <body>
      <div class="loading" id="loading">
        <div style="margin-top: 10px;">Đang tải mô hình 3D...</div>
        <div style="margin-top: 5px; font-size: 12px; opacity: 0.7;">Vui lòng đợi</div>
      </div>
      
      <model-viewer
        id="model"
        src="${modelUrl}"
        alt="3D Model của hiện vật"
        auto-rotate
        camera-controls
        touch-action="pan-y"
        interaction-prompt="none"
        environment-image="neutral"
        shadow-intensity="1"
        style="opacity: 0; transition: opacity 0.5s ease;"
        loading="eager"
      ></model-viewer>

      <div class="controls" id="controls" style="display: none;">
        <button class="control-btn" id="rotateBtn" onclick="toggleRotation()">
          <span id="rotateText">Tắt xoay</span>
        </button>
        <button class="control-btn" onclick="resetCamera()">
          Đặt lại góc nhìn
        </button>
      </div>
      
      <script>
        let modelElement = document.getElementById('model');
        let isAutoRotating = true;
        
        modelElement.addEventListener('load', function() {
          console.log('Model loaded successfully');
          document.getElementById('loading').style.display = 'none';
          document.getElementById('model').style.opacity = '1';
          document.getElementById('controls').style.display = 'flex';
          
          // Send success message to React Native
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'modelLoaded',
            success: true
          }));
        });
        
        modelElement.addEventListener('error', function() {
          console.log('Model failed to load');
          document.getElementById('loading').innerHTML = \`
            <div class="error">
              <div>❌</div>
              <div style="margin-top: 10px;">Không thể tải mô hình 3D</div>
              <div style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                Có thể do định dạng file không hỗ trợ hoặc lỗi mạng
              </div>
            </div>
          \`;
          
          // Send error message to React Native
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'modelError',
            success: false
          }));
        });
        
        function toggleRotation() {
          isAutoRotating = !isAutoRotating;
          modelElement.autoRotate = isAutoRotating;
          document.getElementById('rotateText').innerText = isAutoRotating ? 'Tắt xoay' : 'Bật xoay';
        }
        
        function resetCamera() {
          modelElement.resetTurntableRotation();
          modelElement.jumpCameraToGoal();
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
      if (data.type === 'modelLoaded') {
        setIsLoading(false);
        setHasError(false);
      } else if (data.type === 'modelError') {
        setIsLoading(false);
        setHasError(true);
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  };

  return (
    <View className={className} style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={handleWebViewMessage}
        onError={(error) => {
          console.log('WebView error:', error);
          setHasError(true);
          setIsLoading(false);
        }}
        onHttpError={(error) => {
          console.log('HTTP error:', error);
          setHasError(true);
          setIsLoading(false);
        }}
      />

      {/* React Native Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff914d" />
          <Text style={styles.loadingText}>Đang khởi tạo 3D viewer...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: 'white',
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
  },
});
