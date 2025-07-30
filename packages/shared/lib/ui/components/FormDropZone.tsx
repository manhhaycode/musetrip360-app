import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@musetrip360/ui-core/form';
import { DropZoneWithPreview } from './FilePreview';
import { cn } from '@musetrip360/ui-core/utils';
import { MediaType } from '@/types';

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
  label,
  description,
  required = false,
  direction = 'vertical',
}: FormDropZoneProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      control={control}
      rules={{
        required: required ? `${label || 'File'} không được để trống` : true,
      }}
      render={({ field: { value, onChange, onBlur, disabled } }) => (
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
            <DropZoneWithPreview
              uploadId={name}
              autoRegister={true}
              value={value?.file || null}
              onChange={(newValue) => {
                if (!newValue) {
                  onChange(null);
                  return;
                } else {
                  onChange({
                    ...value,
                    file: newValue,
                    mediaType: mediaType,
                    ...(newValue instanceof File ? { fileName: newValue.name } : {}),
                  });
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
          </FormControl>
        </FormItem>
      )}
    />
  );
}
