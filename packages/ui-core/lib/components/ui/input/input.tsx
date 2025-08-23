import * as React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { cn } from '@/libs/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  className?: string;
  type?: string;
}

export interface PriceInputProps extends Omit<NumericFormatProps, 'onChange'> {
  className?: string;
  onChange?: (value: string | number) => void;
  value?: string | number;
}

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

function NumberInput({ className, onChange, value, type = 'text', ...props }: PriceInputProps) {
  return (
    <NumericFormat
      type={type}
      customInput={Input}
      thousandSeparator=","
      decimalSeparator="."
      allowNegative={false}
      decimalScale={0}
      fixedDecimalScale={false}
      onValueChange={(values) => {
        onChange?.(values.floatValue!);
      }}
      value={value}
      className={className}
      {...props}
    />
  );
}

export { Input, NumberInput };
