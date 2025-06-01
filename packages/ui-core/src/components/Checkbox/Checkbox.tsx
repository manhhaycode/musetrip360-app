import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { checkboxVariants } from './Checkbox.variants';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  error?: string;
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size, variant, label, description, error, id, checked, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const actualVariant = hasError ? 'error' : variant;

    return (
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            className={cn(checkboxVariants({ size, variant: actualVariant }), className)}
            ref={ref}
            id={checkboxId}
            checked={checked}
            data-state={checked ? 'checked' : 'unchecked'}
            {...props}
          />
          {checked && <CheckIcon className="absolute inset-0 h-full w-full p-0.5 text-white pointer-events-none" />}
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium leading-none cursor-pointer',
                  hasError ? 'text-error-900' : 'text-neutral-900',
                  props.disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn('text-xs mt-1', hasError ? 'text-error-600' : 'text-neutral-600')}>{description}</p>
            )}
            {error && <p className="text-xs text-error-600 mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
