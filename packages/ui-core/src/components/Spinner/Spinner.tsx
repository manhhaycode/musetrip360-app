import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { spinnerVariants } from './Spinner.variants';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {
  label?: string;
  center?: boolean;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label, center = false, ...props }, ref) => {
    const spinner = (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, variant }), className)}
        role="status"
        aria-label={label || 'Loading'}
        {...props}
      >
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
    );

    if (center) {
      return <div className="flex items-center justify-center">{spinner}</div>;
    }

    return spinner;
  }
);

Spinner.displayName = 'Spinner';

// Loading component that includes text
export interface LoadingProps extends SpinnerProps {
  text?: string;
  description?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ text = 'Loading...', description, size = 'lg', className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col items-center justify-center space-y-3', className)}>
        <Spinner size={size} {...props} />
        {text && (
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-900">{text}</p>
            {description && <p className="text-xs text-neutral-600 mt-1">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);

Loading.displayName = 'Loading';

export { Spinner, Loading };
