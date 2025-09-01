'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/libs/utils';

export interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  showLabel?: boolean;
  disabled?: boolean;
  disablePast?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
}

export interface DateTimePickerRef {
  revalidateTime: () => void;
}

export const DateTimePicker = React.forwardRef<DateTimePickerRef, DateTimePickerProps>(
  (
    {
      value,
      onChange,
      showLabel = false,
      disabled = false,
      disablePast = true,
      minDate,
      maxDate,
      placeholder = 'Select date',
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [timeValue, setTimeValue] = React.useState('09:00');

    // Determine minimum allowed date/time
    const minimumDateTime = React.useMemo(() => {
      if (minDate) return minDate;
      if (disablePast) return new Date();
      return undefined;
    }, [minDate, disablePast]);

    // Extract time from value when it changes
    React.useEffect(() => {
      if (value) {
        const hours = value.getHours().toString().padStart(2, '0');
        const minutes = value.getMinutes().toString().padStart(2, '0');
        setTimeValue(`${hours}:${minutes}`);
      }
    }, [value]);

    // Check if date should be disabled
    const isDateDisabled = React.useCallback(
      (date: Date) => {
        // Compare date only (ignore time)
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        // Check minimum date constraint
        if (minimumDateTime) {
          const minDateOnly = new Date(
            minimumDateTime.getFullYear(),
            minimumDateTime.getMonth(),
            minimumDateTime.getDate()
          );
          if (dateOnly < minDateOnly) return true;
        }

        // Check maximum date constraint
        if (maxDate) {
          const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
          if (dateOnly > maxDateOnly) return true;
        }

        return false;
      },
      [minimumDateTime, maxDate]
    );

    // Get minimum time for selected date
    const getMinTimeForDate = React.useCallback(
      (selectedDate: Date) => {
        if (!minimumDateTime) return undefined;

        // If selected date is same as minimum date, use minimum time
        const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const minDateOnly = new Date(
          minimumDateTime.getFullYear(),
          minimumDateTime.getMonth(),
          minimumDateTime.getDate()
        );

        if (selectedDateOnly.getTime() === minDateOnly.getTime()) {
          const hours = minimumDateTime.getHours().toString().padStart(2, '0');
          const minutes = (minimumDateTime.getMinutes() + 1).toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }

        return undefined;
      },
      [minimumDateTime]
    );

    // Get maximum time for selected date
    const getMaxTimeForDate = React.useCallback(
      (selectedDate: Date) => {
        if (!maxDate) return undefined;

        // If selected date is same as maximum date, use maximum time
        const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());

        if (selectedDateOnly.getTime() === maxDateOnly.getTime()) {
          const hours = maxDate.getHours().toString().padStart(2, '0');
          const minutes = (maxDate.getMinutes() - 1).toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }

        return undefined;
      },
      [maxDate]
    );

    const handleDateSelect = (selectedDate: Date | undefined) => {
      if (!selectedDate) {
        onChange?.(undefined);
        setOpen(false);
        return;
      }

      // Combine with existing time
      const timeComponents = timeValue.split(':');
      const hours = Number(timeComponents[0] || 9);
      const minutes = Number(timeComponents[1] || 0);

      if (!isNaN(hours) && !isNaN(minutes)) {
        const finalDateTime = new Date(selectedDate);
        finalDateTime.setHours(hours, minutes, 0, 0);

        // Validate against minimum and maximum datetime
        let validDateTime = finalDateTime;
        let needsTimeUpdate = false;

        if (minimumDateTime && finalDateTime <= minimumDateTime) {
          // Set to minimum valid time + 1 minute
          validDateTime = new Date(selectedDate);
          validDateTime.setHours(minimumDateTime.getHours(), minimumDateTime.getMinutes() + 1, 0, 0);
          needsTimeUpdate = true;
        } else if (maxDate && finalDateTime >= maxDate) {
          // Set to maximum valid time - 1 minute
          validDateTime = new Date(selectedDate);
          validDateTime.setHours(maxDate.getHours(), maxDate.getMinutes() - 1, 0, 0);
          needsTimeUpdate = true;
        }

        onChange?.(validDateTime);

        // Update time display if needed
        if (needsTimeUpdate) {
          const validHours = validDateTime.getHours().toString().padStart(2, '0');
          const validMinutes = validDateTime.getMinutes().toString().padStart(2, '0');
          setTimeValue(`${validHours}:${validMinutes}`);
        }
      } else {
        // No valid time, just set date
        onChange?.(selectedDate);
      }

      setOpen(false);
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTimeValue = event.target.value;
      setTimeValue(newTimeValue);
    };

    const handleTimeBlur = React.useCallback(() => {
      if (value && timeValue) {
        const timeComponents = timeValue.split(':');
        const hours = Number(timeComponents[0] || 0);
        const minutes = Number(timeComponents[1] || 0);

        if (!isNaN(hours) && !isNaN(minutes)) {
          const newDateTime = new Date(value);
          newDateTime.setHours(hours, minutes, 0, 0);

          // Validate against minimum and maximum datetime on blur
          if (minimumDateTime && newDateTime <= minimumDateTime) {
            // Reset to valid time if invalid
            const validTime = getMinTimeForDate(value);
            if (validTime) {
              setTimeValue(validTime);
              const validTimeComponents = validTime.split(':');
              const validHours = Number(validTimeComponents[0] || 0);
              const validMinutes = Number(validTimeComponents[1] || 0);
              newDateTime.setHours(validHours, validMinutes, 0, 0);
            }
          } else if (maxDate && newDateTime >= maxDate) {
            // Reset to valid time if invalid
            const validTime = getMaxTimeForDate(value);
            if (validTime) {
              setTimeValue(validTime);
              const validTimeComponents = validTime.split(':');
              const validHours = Number(validTimeComponents[0] || 0);
              const validMinutes = Number(validTimeComponents[1] || 0);
              newDateTime.setHours(validHours, validMinutes, 0, 0);
            }
          }

          onChange?.(newDateTime);
        }
      }
    }, [getMinTimeForDate, getMaxTimeForDate, minimumDateTime, maxDate, onChange, timeValue, value]);

    // Expose revalidateTime method via ref
    React.useImperativeHandle(
      ref,
      () => ({
        revalidateTime: () => handleTimeBlur(),
      }),
      [handleTimeBlur]
    );

    return (
      <div className={cn('flex gap-4', className)}>
        <div className="flex flex-col gap-3">
          {showLabel && (
            <Label htmlFor="date-picker" className="px-1">
              Date
            </Label>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger disabled={disabled} asChild>
              <Button variant="outline" id="date-picker" className="w-36 justify-between font-normal">
                {value ? format(value, 'dd/MM/yyyy') : placeholder}
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                captionLayout="dropdown"
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-3">
          {showLabel && (
            <Label htmlFor="time-picker" className="px-1">
              Time
            </Label>
          )}
          <Input
            type="time"
            id="time-picker"
            value={timeValue}
            onChange={handleTimeChange}
            onBlur={handleTimeBlur}
            disabled={disabled || !value}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-20 justify-center"
          />
        </div>
      </div>
    );
  }
);

DateTimePicker.displayName = 'DateTimePicker';
