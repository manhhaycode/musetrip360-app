/**
 * Animation Design Tokens for MuseTrip360
 * Consistent animation timings, easing, and semantic animations
 */

// Animation durations
export const durations = {
  instant: '0ms',
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
  slowest: '750ms',
} as const;

// Easing functions
export const easings = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Custom cubic-bezier curves
  bounceIn: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  bounceOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  smoothIn: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  smoothOut: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  snappy: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Semantic animations for common use cases
export const semanticAnimations = {
  // Hover animations
  hover: {
    scale: {
      duration: durations.fast,
      easing: easings.snappy,
      transform: 'scale(1.05)',
    },
    lift: {
      duration: durations.normal,
      easing: easings.smoothOut,
      transform: 'translateY(-2px)',
    },
    glow: {
      duration: durations.normal,
      easing: easings.easeInOut,
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    },
  },

  // Focus animations
  focus: {
    ring: {
      duration: durations.fast,
      easing: easings.easeOut,
      outline: '2px solid currentColor',
      outlineOffset: '2px',
    },
    scale: {
      duration: durations.fast,
      easing: easings.spring,
      transform: 'scale(1.02)',
    },
  },

  // Loading animations
  loading: {
    spin: {
      duration: '1s',
      easing: easings.linear,
      iteration: 'infinite',
      transform: 'rotate(360deg)',
    },
    pulse: {
      duration: '2s',
      easing: easings.easeInOut,
      iteration: 'infinite',
      opacity: '0.5',
    },
    bounce: {
      duration: '1s',
      easing: easings.bounceOut,
      iteration: 'infinite',
      transform: 'translateY(-10px)',
    },
  },

  // Entrance animations
  entrance: {
    fadeIn: {
      duration: durations.normal,
      easing: easings.easeOut,
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    slideUp: {
      duration: durations.normal,
      easing: easings.smoothOut,
      from: {
        opacity: '0',
        transform: 'translateY(20px)',
      },
      to: {
        opacity: '1',
        transform: 'translateY(0)',
      },
    },
    scaleIn: {
      duration: durations.normal,
      easing: easings.spring,
      from: {
        opacity: '0',
        transform: 'scale(0.8)',
      },
      to: {
        opacity: '1',
        transform: 'scale(1)',
      },
    },
  },

  // Exit animations
  exit: {
    fadeOut: {
      duration: durations.fast,
      easing: easings.easeIn,
      from: { opacity: '1' },
      to: { opacity: '0' },
    },
    slideDown: {
      duration: durations.fast,
      easing: easings.smoothIn,
      from: {
        opacity: '1',
        transform: 'translateY(0)',
      },
      to: {
        opacity: '0',
        transform: 'translateY(20px)',
      },
    },
    scaleOut: {
      duration: durations.fast,
      easing: easings.easeIn,
      from: {
        opacity: '1',
        transform: 'scale(1)',
      },
      to: {
        opacity: '0',
        transform: 'scale(0.8)',
      },
    },
  },

  // Museum-specific animations
  museum: {
    artifactReveal: {
      duration: durations.slow,
      easing: easings.smoothOut,
      from: {
        opacity: '0',
        transform: 'translateY(30px)',
      },
      to: {
        opacity: '1',
        transform: 'translateY(0)',
      },
    },
    tourTransition: {
      duration: durations.slower,
      easing: easings.easeInOut,
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    gallerySlide: {
      duration: durations.slow,
      easing: easings.snappy,
      transform: 'translateX(-100%)',
    },
  },
} as const;

// Transition configurations
export const transitions = {
  // Common property transitions
  all: `all ${durations.normal} ${easings.easeInOut}`,
  opacity: `opacity ${durations.fast} ${easings.easeOut}`,
  transform: `transform ${durations.normal} ${easings.snappy}`,
  colors: `color ${durations.fast} ${easings.easeOut}, background-color ${durations.fast} ${easings.easeOut}, border-color ${durations.fast} ${easings.easeOut}`,
  shadow: `box-shadow ${durations.normal} ${easings.easeOut}`,

  // Smooth transitions for specific use cases
  smooth: {
    fast: `all ${durations.fast} ${easings.snappy}`,
    normal: `all ${durations.normal} ${easings.snappy}`,
    slow: `all ${durations.slow} ${easings.snappy}`,
  },

  // Interaction transitions
  interaction: {
    button: `all ${durations.fast} ${easings.snappy}`,
    input: `border-color ${durations.fast} ${easings.easeOut}, box-shadow ${durations.fast} ${easings.easeOut}`,
    card: `transform ${durations.normal} ${easings.snappy}, box-shadow ${durations.normal} ${easings.easeOut}`,
  },
} as const;

// CSS custom properties for animations
export const animationCssVars = {
  // Durations
  ...Object.entries(durations).reduce(
    (acc, [duration, value]) => {
      acc[`--duration-${duration}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),

  // Easings
  ...Object.entries(easings).reduce(
    (acc, [easing, value]) => {
      acc[`--easing-${easing}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),

  // Transitions
  ...Object.entries(transitions).reduce(
    (acc, [transition, value]) => {
      if (typeof value === 'string') {
        acc[`--transition-${transition}`] = value;
      }
      return acc;
    },
    {} as Record<string, string>
  ),
} as const;

// Animation helper functions
export const animationHelpers = {
  // Get duration by key
  getDuration: (key: keyof typeof durations) => durations[key],

  // Get easing by key
  getEasing: (key: keyof typeof easings) => easings[key],

  // Get semantic animation
  getSemantic: (category: string, variant: string) => {
    const categoryAnimations = semanticAnimations[category as keyof typeof semanticAnimations] as Record<string, any>;
    return categoryAnimations?.[variant];
  },

  // Create transition string
  createTransition: (property: string, duration: keyof typeof durations, easing: keyof typeof easings = 'easeOut') =>
    `${property} ${durations[duration]} ${easings[easing]}`,

  // Create keyframe animation
  createKeyframes: (name: string, frames: Record<string, Record<string, string>>) => {
    const keyframeString = Object.entries(frames)
      .map(([percentage, styles]) => {
        const styleString = Object.entries(styles)
          .map(([prop, value]) => `${prop}: ${value}`)
          .join('; ');
        return `${percentage} { ${styleString} }`;
      })
      .join(' ');

    return `@keyframes ${name} { ${keyframeString} }`;
  },

  // Get CSS variable reference
  toCssVar: (type: 'duration' | 'easing' | 'transition', key: string) => `var(--${type}-${key})`,
} as const;

// Export types
export type Duration = keyof typeof durations;
export type Easing = keyof typeof easings;
export type SemanticAnimations = typeof semanticAnimations;
export type Transitions = typeof transitions;
