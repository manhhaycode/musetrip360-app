import { SpringConfig } from '@react-spring/web';

// Animation configurations for different spring types
export const springConfigs = {
  gentle: {
    tension: 120,
    friction: 20,
    mass: 1,
  } as SpringConfig,

  bouncy: {
    tension: 180,
    friction: 12,
    mass: 1,
  } as SpringConfig,

  swift: {
    tension: 300,
    friction: 30,
    mass: 1,
  } as SpringConfig,

  slow: {
    tension: 80,
    friction: 20,
    mass: 1,
  } as SpringConfig,

  // Optimized for lazy children - faster open, smooth close
  lazyOptimized: {
    tension: 200,
    friction: 25,
    mass: 0.8,
  } as SpringConfig,
} as const;

// Modal size variants
export const sizeVariants = {
  sm: {
    width: 'min(90vw, 400px)',
    height: 'min(80vh, 300px)',
    maxWidth: '400px',
    maxHeight: '300px',
  },
  md: {
    width: 'min(90vw, 600px)',
    height: 'min(85vh, 500px)',
    maxWidth: '600px',
    maxHeight: '500px',
  },
  lg: {
    width: 'min(95vw, 900px)',
    height: 'min(90vh, 700px)',
    maxWidth: '900px',
    maxHeight: '700px',
  },
  xl: {
    width: 'min(95vw, 1200px)',
    height: 'min(90vh, 800px)',
    maxWidth: '1200px',
    maxHeight: '800px',
  },
  fullscreen: {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    maxHeight: '100vh',
  },
} as const;

// Animation states
export const animationStates = {
  backdrop: {
    closed: {
      opacity: '0%',
      backdropFilter: 'blur(0px)',
    },
    open: {
      opacity: '50%',
      backdropFilter: 'blur(8px)',
    },
  },
  modal: {
    closed: {
      scale: 0.95,
      opacity: 0,
      y: 20,
    },
    open: {
      scale: 1,
      opacity: 1,
      y: 0,
    },
  },
} as const;
