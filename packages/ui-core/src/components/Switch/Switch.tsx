import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { switchVariants, switchThumbVariants } from './Switch.variants';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof switchVariants> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size, checked = false, onCheckedChange, label, description, error, disabled, id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const handleClick = () => {
      if (!disabled) {
        onCheckedChange?.(!checked);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <div className="flex items-start space-x-3">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? `${switchId}-label` : undefined}
          aria-describedby={description ? `${switchId}-description` : undefined}
          data-state={checked ? 'checked' : 'unchecked'}
          className={cn(switchVariants({ size }), className)}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          ref={ref}
          id={switchId}
          {...props}
        >
          <span data-state={checked ? 'checked' : 'unchecked'} className={cn(switchThumbVariants({ size }))} />
        </button>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                id={`${switchId}-label`}
                className={cn(
                  'text-sm font-medium leading-none cursor-pointer',
                  hasError ? 'text-error-900' : 'text-neutral-900',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
                onClick={!disabled ? handleClick : undefined}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={`${switchId}-description`}
                className={cn('text-xs mt-1', hasError ? 'text-error-600' : 'text-neutral-600')}
              >
                {description}
              </p>
            )}
            {error && <p className="text-xs text-error-600 mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
