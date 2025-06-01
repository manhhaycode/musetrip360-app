import React, { useState, useRef, useEffect } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { selectVariants, selectTriggerVariants } from './Select.variants';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof selectVariants> {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  variant?: 'default' | 'error';
  onChange?: (value: string) => void;
}

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      size,
      options,
      value,
      placeholder = 'Select an option...',
      disabled,
      error,
      label,
      variant = 'default',
      onChange,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const selectRef = useRef<HTMLDivElement>(null);
    const actualVariant = error ? 'error' : variant;

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const selectedOption = options.find((option) => option.value === selectedValue);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      setIsOpen(false);
      onChange?.(optionValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          setIsOpen(!isOpen);
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          }
          break;
      }
    };

    return (
      <div className="w-full">
        {label && <label className="mb-2 block text-sm font-medium text-neutral-900">{label}</label>}

        <div ref={selectRef} className={cn(selectVariants({ size }), className)} {...props}>
          <button
            type="button"
            className={cn(selectTriggerVariants({ variant: actualVariant, size }))}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className={cn('block truncate text-left', !selectedOption && 'text-neutral-500')}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDownIcon className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg">
              <ul className="max-h-60 overflow-auto py-1" role="listbox">
                {options.map((option) => (
                  <li
                    key={option.value}
                    className={cn(
                      'relative cursor-pointer select-none px-3 py-2 text-sm transition-colors',
                      option.disabled ? 'cursor-not-allowed text-neutral-400' : 'hover:bg-neutral-100',
                      option.value === selectedValue && 'bg-primary-50 text-primary-700'
                    )}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    role="option"
                    aria-selected={option.value === selectedValue}
                  >
                    <div className="flex items-center">
                      <span className="block truncate">{option.label}</span>
                      {option.value === selectedValue && <CheckIcon className="ml-2 h-4 w-4" />}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
