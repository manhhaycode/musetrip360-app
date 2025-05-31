/**
 * Class Variance Authority utilities for MuseTrip360
 * Type-safe component variant management with className generation
 */

import { cva, type VariantProps } from 'class-variance-authority';

// Re-export CVA for consistent usage
export { cva, type VariantProps };

// Common component variant patterns for MuseTrip360

// Button variants using design tokens
export const buttonVariants = cva(
  // Base styles that apply to all buttons
  [
    'inline-flex items-center justify-center',
    'rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-primary-500 text-white shadow hover:bg-primary-600', 'focus-visible:ring-primary-500'],
        secondary: [
          'bg-transparent border border-neutral-300 text-neutral-900',
          'hover:bg-neutral-100 focus-visible:ring-neutral-500',
        ],
        ghost: ['bg-transparent text-neutral-700 hover:bg-neutral-100', 'focus-visible:ring-neutral-500'],
        destructive: ['bg-error-500 text-white shadow hover:bg-error-600', 'focus-visible:ring-error-500'],
        outline: [
          'bg-transparent border border-primary-500 text-primary-700',
          'hover:bg-primary-50 focus-visible:ring-primary-500',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

// Card variants
export const cardVariants = cva(
  [
    'rounded-lg border bg-white shadow-sm transition-shadow',
    'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default: 'border-neutral-200',
        interactive: ['border-neutral-200 hover:border-neutral-300 hover:shadow-md', 'cursor-pointer'],
        elevated: 'border-neutral-200 shadow-lg',
        outlined: 'border-2 border-primary-200 bg-primary-50',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

// Input variants
export const inputVariants = cva(
  [
    'flex w-full rounded-md border px-3 py-2 text-sm transition-colors',
    'placeholder:text-neutral-500',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-neutral-300 bg-white',
          'hover:border-neutral-400 focus-visible:border-primary-500 focus-visible:ring-primary-500',
        ],
        error: [
          'border-error-500 bg-white text-error-900',
          'focus-visible:border-error-500 focus-visible:ring-error-500',
        ],
        success: [
          'border-success-500 bg-white text-success-900',
          'focus-visible:border-success-500 focus-visible:ring-success-500',
        ],
      },
      size: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Badge variants
export const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    'border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary-100 text-primary-800 border-primary-200',
        secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200',
        success: 'bg-success-100 text-success-800 border-success-200',
        warning: 'bg-warning-100 text-warning-800 border-warning-200',
        error: 'bg-error-100 text-error-800 border-error-200',
        neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
        outline: 'bg-transparent text-neutral-700 border-neutral-300',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Museum-specific component variants

// Artifact card variants for museum content
export const artifactCardVariants = cva(
  [
    'group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all',
    'hover:shadow-md focus-within:ring-2 focus-within:ring-primary-500',
  ],
  {
    variants: {
      layout: {
        vertical: 'flex flex-col',
        horizontal: 'flex flex-row',
        grid: 'aspect-square',
      },
      featured: {
        true: 'ring-2 ring-accent-200 shadow-lg',
        false: 'border border-neutral-200',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-105 transition-transform',
        false: '',
      },
    },
    defaultVariants: {
      layout: 'vertical',
      featured: false,
      interactive: true,
    },
  }
);

// Gallery layout variants
export const galleryVariants = cva('grid gap-4', {
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      auto: 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))]',
    },
    spacing: {
      tight: 'gap-2',
      normal: 'gap-4',
      loose: 'gap-6',
      spacious: 'gap-8',
    },
  },
  defaultVariants: {
    columns: 3,
    spacing: 'normal',
  },
});

// Navigation variants
export const navigationVariants = cva(
  [
    'flex items-center px-3 py-2 text-sm font-medium rounded-md',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default: ['text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100', 'focus:ring-neutral-500'],
        active: ['text-primary-700 bg-primary-50 hover:bg-primary-100', 'focus:ring-primary-500'],
        ghost: ['text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50', 'focus:ring-neutral-500'],
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Export types for component props
export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type CardVariants = VariantProps<typeof cardVariants>;
export type InputVariants = VariantProps<typeof inputVariants>;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type ArtifactCardVariants = VariantProps<typeof artifactCardVariants>;
export type GalleryVariants = VariantProps<typeof galleryVariants>;
export type NavigationVariants = VariantProps<typeof navigationVariants>;
