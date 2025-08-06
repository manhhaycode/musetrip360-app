'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTransition } from '@react-spring/web';
import { PreviewModalProps } from './PreviewModal.types';
import { springConfigs } from './PreviewModal.variants';
import { PreviewBackdrop } from './PreviewBackdrop';
import { PreviewContent } from './PreviewContent';
import { PreviewHeader } from './PreviewHeader';

export function PreviewModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'lg',
  showBackButton = true,
  showCloseButton = false,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  style,
  lazyChildren = false,
  onOpenComplete,
  onCloseStart,
}: PreviewModalProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // State for conditional children rendering
  const [shouldRenderChildren, setShouldRenderChildren] = useState(!lazyChildren);
  const [isClosing, setIsClosing] = useState(false);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus modal when opened
    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 100);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';

      // Restore focus when closed
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  // Handle focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  };

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle closing state and children unmounting
  useEffect(() => {
    if (!isOpen && !isClosing) {
      setIsClosing(true);
      onCloseStart?.();

      if (lazyChildren) {
        setShouldRenderChildren(false);
      }
    } else if (isOpen && isClosing) {
      setIsClosing(false);
    }
  }, [isOpen, isClosing, lazyChildren, onCloseStart]);

  // Use transition for mount/unmount animations
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, scale: 0.95, y: 20 },
    enter: { opacity: 1, scale: 1, y: 0 },
    leave: { opacity: 0, scale: 0.95, y: 20 },
    config: lazyChildren ? springConfigs.lazyOptimized : springConfigs.gentle,
    onStart: (result, ctrl, item) => {
      // When starting to open
      if (item && lazyChildren) {
        setShouldRenderChildren(false);
      }
    },
    onRest: (result, ctrl, item) => {
      // When open animation completes
      if (item && lazyChildren && !shouldRenderChildren) {
        setShouldRenderChildren(true);
        onOpenComplete?.();
      }
    },
  });

  return transitions((animationStyle, item) =>
    item
      ? createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            ref={modalRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
          >
            <PreviewBackdrop isVisible={isOpen} onClick={handleBackdropClick} enableBlur={size !== 'fullscreen'} />

            <PreviewContent
              size={size}
              isVisible={isOpen}
              className={className}
              style={style}
              animationStyle={animationStyle}
              onClick={handleContentClick}
            >
              <PreviewHeader
                title={title}
                showBackButton={showBackButton}
                showCloseButton={showCloseButton}
                onClose={onClose}
              />

              <div className="flex-1 flex overflow-auto">{shouldRenderChildren ? children : null}</div>

              {size !== 'fullscreen' && (
                <div className="px-6 pb-6 text-sm text-gray-600 text-center bg-white">
                  {closeOnEscape && 'Press ESC to close'}
                  {closeOnEscape && closeOnBackdropClick && ' • '}
                  {closeOnBackdropClick && 'Click outside to close'}
                </div>
              )}
            </PreviewContent>
          </div>,
          document.body
        )
      : null
  );
}
