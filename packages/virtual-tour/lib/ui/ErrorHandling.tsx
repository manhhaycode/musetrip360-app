/**
 * ErrorHandling
 *
 * Robust error handling and recovery mechanisms for cubemap loading.
 * Includes Error Boundaries, fallbacks, and recovery strategies.
 */

import React, { Component, ErrorInfo, ReactNode, useState, useCallback, useEffect } from 'react';
import type { LoadingError, NetworkQuality } from '../types';

// Error Boundary Props
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

// Error Boundary State
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

// React Error Boundary Component
export class CubemapErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random()}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);

    // Log error for debugging
    console.error('CubemapErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && !prevProps.resetKeys && resetKeys) {
      // Reset keys added
      this.resetErrorBoundary();
    } else if (hasError && resetKeys && prevProps.resetKeys) {
      // Check if reset keys changed
      const hasResetKeyChanged = resetKeys.some((key, index) => key !== prevProps.resetKeys![index]);
      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    } else if (hasError && resetOnPropsChange) {
      // Auto reset on any props change
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: '',
      });
    }, 100);
  };

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

// Default Error Fallback Component
interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetErrorBoundary: () => void;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ error, errorInfo, resetErrorBoundary }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>😵</div>

      <h3 style={{ margin: '0 0 8px 0', color: '#dc3545' }}>Cubemap Viewer Error</h3>

      <p style={{ margin: '0 0 16px 0', color: '#6c757d', maxWidth: '400px' }}>
        Something went wrong while rendering the cubemap. This might be due to browser limitations, memory constraints,
        or incompatible image formats.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button
          onClick={resetErrorBoundary}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Try Again
        </button>

        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {showDetails && error && (
        <div
          style={{
            maxWidth: '600px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '12px',
            color: '#721c24',
            textAlign: 'left',
            overflow: 'auto',
            maxHeight: '200px',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Error Details:</div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Message:</strong> {error.message}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Stack:</strong>
            <pre style={{ margin: '4px 0', whiteSpace: 'pre-wrap', fontSize: '11px' }}>{error.stack}</pre>
          </div>
          {errorInfo && (
            <div>
              <strong>Component Stack:</strong>
              <pre style={{ margin: '4px 0', whiteSpace: 'pre-wrap', fontSize: '11px' }}>
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Network Error Recovery Hook
export interface NetworkErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number) => void;
  onMaxRetriesReached?: () => void;
}

export const useNetworkErrorRecovery = (options: NetworkErrorRecoveryOptions = {}) => {
  const { maxRetries = 3, retryDelay = 1000, backoffFactor = 2, onRetry, onMaxRetriesReached } = options;

  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(
    async (operation: () => Promise<any>) => {
      if (retryCount >= maxRetries) {
        onMaxRetriesReached?.();
        return Promise.reject(new Error('Maximum retry attempts reached'));
      }

      setIsRetrying(true);
      const delay = retryDelay * Math.pow(backoffFactor, retryCount);

      try {
        await new Promise((resolve) => setTimeout(resolve, delay));
        const result = await operation();
        setRetryCount(0); // Reset on success
        setIsRetrying(false);
        return result;
      } catch (error) {
        const newCount = retryCount + 1;
        setRetryCount(newCount);
        setIsRetrying(false);
        onRetry?.(newCount);
        throw error;
      }
    },
    [retryCount, maxRetries, retryDelay, backoffFactor, onRetry, onMaxRetriesReached]
  );

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    reset,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries,
  };
};

// Loading Error Display Component
export interface LoadingErrorDisplayProps {
  error: LoadingError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const LoadingErrorDisplay: React.FC<LoadingErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  style,
  className,
}) => {
  const [detailsVisible, setDetailsVisible] = useState(showDetails);

  const getErrorIcon = (type: LoadingError['type']) => {
    switch (type) {
      case 'network':
        return '🌐';
      case 'file':
        return '📁';
      case 'validation':
        return '⚠️';
      case 'memory':
        return '💾';
      case 'timeout':
        return '⏰';
      default:
        return '❌';
    }
  };

  const getErrorColor = (type: LoadingError['type']) => {
    switch (type) {
      case 'network':
        return '#fd7e14'; // Orange
      case 'file':
        return '#6f42c1'; // Purple
      case 'validation':
        return '#ffc107'; // Yellow
      case 'memory':
        return '#dc3545'; // Red
      case 'timeout':
        return '#17a2b8'; // Cyan
      default:
        return '#dc3545'; // Red
    }
  };

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        maxWidth: '300px',
        backgroundColor: '#fff',
        border: `2px solid ${getErrorColor(error.type)}`,
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        zIndex: 1000,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ fontSize: '24px', flexShrink: 0 }}>{getErrorIcon(error.type)}</div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 'bold',
              color: getErrorColor(error.type),
              marginBottom: '4px',
              fontSize: '14px',
            }}
          >
            {error.type.charAt(0).toUpperCase() + error.type.slice(1)} Error
          </div>

          <div
            style={{
              fontSize: '13px',
              color: '#333',
              marginBottom: '8px',
              lineHeight: '1.4',
            }}
          >
            {error.message}
          </div>

          {error.faceName && (
            <div
              style={{
                fontSize: '11px',
                color: '#666',
                marginBottom: '8px',
              }}
            >
              Face: {error.faceName} • {error.resolution}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {error.recoverable && onRetry && (
              <button
                onClick={onRetry}
                style={{
                  padding: '4px 8px',
                  backgroundColor: getErrorColor(error.type),
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            )}

            <button
              onClick={() => setDetailsVisible(!detailsVisible)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Details
            </button>

            {onDismiss && (
              <button
                onClick={onDismiss}
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  border: '1px solid #6c757d',
                  borderRadius: '3px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Dismiss
              </button>
            )}
          </div>

          {detailsVisible && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '10px',
                color: '#495057',
              }}
            >
              <div>
                <strong>Time:</strong> {error.timestamp.toLocaleTimeString()}
              </div>
              <div>
                <strong>Type:</strong> {error.type}
              </div>
              <div>
                <strong>Recoverable:</strong> {error.recoverable ? 'Yes' : 'No'}
              </div>
              {error.originalError && (
                <div style={{ marginTop: '4px' }}>
                  <strong>Stack:</strong>
                  <pre
                    style={{
                      margin: '2px 0 0 0',
                      fontSize: '9px',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '60px',
                      overflow: 'auto',
                    }}
                  >
                    {error.originalError.stack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Browser Compatibility Checker
export const checkBrowserCompatibility = (): {
  compatible: boolean;
  issues: string[];
  warnings: string[];
} => {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check WebGL support
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      issues.push('WebGL is not supported');
    }
  } catch (error) {
    issues.push('WebGL context creation failed');
  }

  // Check File API support
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    issues.push('File API is not supported');
  }

  // Check URL.createObjectURL support
  if (!window.URL || !window.URL.createObjectURL) {
    issues.push('Object URL creation is not supported');
  }

  // Check for mobile device limitations
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    warnings.push('Mobile devices may have performance limitations with large textures');
  }

  // Check available memory (if supported)
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) {
    warnings.push('Low device memory detected, consider using lower quality settings');
  }

  return {
    compatible: issues.length === 0,
    issues,
    warnings,
  };
};
