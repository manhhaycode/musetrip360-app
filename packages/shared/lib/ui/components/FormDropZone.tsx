import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { DropZoneWithPreview } from './FilePreview';
import { cn } from '@musetrip360/ui-core/utils';
import { MediaType, FileData } from '@/types';
import { useState, useEffect } from 'react';

/**
 * Props for the FormDropZone component
 * @template TFieldValues - The type of field values in the form
 * @template TName - The name of the field in the form
 */
// This component integrates with react-hook-form to provide a drop zone for file uploads
// It supports different media types and allows for manual uploads

interface FormDropZoneProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  control: Control<TFieldValues>;
  mediaType: MediaType;
  className?: string;
  manualUpload?: boolean;
  onRemove?: () => void;
  // Form-specific props
  label?: string;
  description?: string;
  required?: boolean;
  direction?: 'vertical' | 'horizontal'; // Optional prop to control layout direction
  withUrl?: boolean; // Show URL input field
  urlPlaceholder?: string; // Placeholder for URL input
  onInteract?: (file: FileData) => void;
}

export function FormDropZone<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  mediaType,
  className,
  manualUpload = false,
  onRemove,
  onInteract,
  label,
  description,
  required = false,
  direction = 'vertical',
  withUrl = false,
  urlPlaceholder = 'https://example.com/file.jpg',
}: FormDropZoneProps<TFieldValues, TName>) {
  const [urlInput, setUrlInput] = useState('');

  return (
    <FormField
      name={name}
      control={control}
      rules={{
        required: required ? `${label || 'File'} không được để trống` : true,
      }}
      render={({ field: { value, onChange, onBlur, disabled } }) => {
        // Sync urlInput with field value when it's a string
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (value && typeof value.file === 'string') {
            setUrlInput(value.file);
          } else {
            setUrlInput('');
          }
        }, [value]);

        return (
          <FormItem className={cn(direction === 'horizontal' ? 'grid grid-cols-2 gap-4' : '', className)}>
            <div className="grid gap-2 h-fit">
              {label && (
                <FormLabel>
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
              )}

              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </div>

            <FormControl>
              <div className="space-y-4">
                {withUrl && (
                  <>
                    <Input
                      type="url"
                      placeholder={urlPlaceholder}
                      value={urlInput}
                      disabled={disabled}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onBlur={async () => {
                        const fileData: FileData = {
                          file: urlInput,
                          fileName: urlInput.split('/').pop() || 'File',
                          mediaType: mediaType,
                        };
                        onChange(urlInput ? fileData : null);
                        onBlur();
                      }}
                    />
                    <div className="text-sm text-gray-500 text-center">Hoặc tải lên file:</div>
                  </>
                )}

                <DropZoneWithPreview
                  onInteract={onInteract}
                  uploadId={name}
                  autoRegister={true}
                  value={value || null}
                  onChange={(newValue) => {
                    if (!newValue) {
                      onChange(null);
                      return;
                    } else {
                      onChange(newValue);
                    }
                    onBlur();
                  }}
                  onRemove={() => {
                    onChange(null);
                    onRemove?.();
                    onBlur();
                  }}
                  mediaType={mediaType}
                  disabled={disabled}
                  manualUpload={manualUpload}
                />
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
