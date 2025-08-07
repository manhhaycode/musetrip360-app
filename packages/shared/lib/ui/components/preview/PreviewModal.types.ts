import { ReactNode } from 'react';

export type PreviewModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export interface PreviewModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Content to display in the modal */
  children: ReactNode;
  /** Optional title for the modal header */
  title?: string;
  /** Size variant for the modal */
  size?: PreviewModalSize;
  /** Whether to show the back button in header */
  showBackButton?: boolean;
  /** Whether to show the close (X) button in header */
  showCloseButton?: boolean;
  /** Whether clicking backdrop closes the modal */
  closeOnBackdropClick?: boolean;
  /** Whether pressing ESC closes the modal */
  closeOnEscape?: boolean;
  /** Additional CSS class for the modal content */
  className?: string;
  /** Custom styles for the modal content */
  style?: React.CSSProperties;
  /**
   * Whether children should only be mounted after open animation ends
   * and unmounted when close animation starts. Default: false
   */
  lazyChildren?: boolean;
  /**
   * Callback fired when open animation completes
   */
  onOpenComplete?: () => void;
  /**
   * Callback fired when close animation starts
   */
  onCloseStart?: () => void;
}

export interface PreviewBackdropProps {
  /** Whether the backdrop is visible */
  isVisible: boolean;
  /** Callback when backdrop is clicked */
  onClick?: () => void;
  /** Whether backdrop should blur */
  enableBlur?: boolean;
}

export interface PreviewContentProps {
  /** Content to display */
  children: ReactNode;
  /** Size variant */
  size: PreviewModalSize;
  /** Additional CSS class */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Animation styles from React Spring */
  animationStyle?: any;
  /** Whether content is visible (for animation) */
  isVisible: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
}

export interface PreviewHeaderProps {
  /** Header title */
  title?: string;
  /** Whether to show back button */
  showBackButton?: boolean;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Callback when back/close is clicked */
  onClose: () => void;
}
