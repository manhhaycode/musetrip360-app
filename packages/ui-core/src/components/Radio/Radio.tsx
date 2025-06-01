import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { radioVariants } from './Radio.variants';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof radioVariants> {
  label?: string;
  description?: string;
  error?: string;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  error?: string;
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size, variant, label, description, error, id, checked, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const actualVariant = hasError ? 'error' : variant;

    return (
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input
            type="radio"
            className={cn(radioVariants({ size, variant: actualVariant }), className)}
            ref={ref}
            id={radioId}
            checked={checked}
            {...props}
          />
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={cn(
                  'rounded-full bg-primary-500',
                  size === 'sm' && 'h-1.5 w-1.5',
                  size === 'md' && 'h-2 w-2',
                  size === 'lg' && 'h-2.5 w-2.5'
                )}
              />
            </div>
          )}
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={radioId}
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

Radio.displayName = 'Radio';

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, value, onValueChange, children, className, error, label, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(event.target.value);
    };

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {label && <div className="text-sm font-medium text-neutral-900">{label}</div>}
        <div className="space-y-2" onChange={handleChange}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement<RadioProps>(child) && child.type === Radio) {
              return React.cloneElement(child, {
                ...child.props,
                name,
                checked: child.props.value === value,
                error: error,
              });
            }
            return child;
          })}
        </div>
        {error && <p className="text-xs text-error-600">{error}</p>}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export { Radio, RadioGroup };
