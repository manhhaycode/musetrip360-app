'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { IVirtualTour, useCreateMuseumVirtualTour, useUpdateVirtualTour } from '@/api';
import { useStudioStore } from '@/store';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { toast } from '@musetrip360/ui-core/sonner';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

// Form schema for virtual tour basic information
export const virtualTourFormSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for updates
  name: z.string().nonempty('Tour name is required').max(100, 'Tour name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export type VirtualTourFormData = z.infer<typeof virtualTourFormSchema>;

export interface VirtualTourFormProps {
  defaultValues?: Partial<VirtualTourFormData>;
  mode?: 'create' | 'edit'; // Mode can be 'create' or 'edit'
  onSuccess?: (data: IVirtualTour) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  showCancelButton?: boolean;
  className?: string;
  museumId: string; // ID of the museum to create the virtual tour for
}

export function VirtualTourForm({
  mode = 'create',
  onSuccess,
  onCancel,
  museumId,
  submitLabel = 'Save',
  showCancelButton = false,
}: VirtualTourFormProps) {
  const virtualTour = useStudioStore(useShallow((state) => state.virtualTour));
  const createVirtualTourMutation = useCreateMuseumVirtualTour(museumId, {
    onSuccess: (data) => {
      toast.success('Virtual tour created successfully!');
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create virtual tour');
    },
  });

  const updateVirtualTourMutation = useUpdateVirtualTour({
    onSuccess: () => {
      toast.success('Virtual tour updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update virtual tour');
    },
  });

  const form = useForm<VirtualTourFormData>({
    mode: 'onBlur',
    disabled: createVirtualTourMutation.isPending,
    resolver: zodResolver(virtualTourFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleSubmit = (data: VirtualTourFormData) => {
    const submitFunc = mode === 'create' ? createVirtualTourMutation.mutate : updateVirtualTourMutation.mutate;
    // Create the virtual tour with basic settings
    const virtualTourData: Partial<IVirtualTour> = {
      ...virtualTour,
      id: data?.id || '',
      name: data.name,
      description: data.description || '',
    };
    submitFunc(virtualTourData as IVirtualTour);
  };

  const handleReset = () => {
    form.reset();
  };

  useEffect(() => {
    if (virtualTour) {
      form.reset(virtualTour);
    }
  }, [virtualTour, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-2 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Virtual Tour Name {fieldState.error && <span className="text-destructive">*</span>}</FormLabel>
              <FormControl>
                <Input placeholder="Enter tour name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your virtual tour..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          {showCancelButton && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleReset();
                onCancel?.();
              }}
              disabled={createVirtualTourMutation.isPending || updateVirtualTourMutation.isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={createVirtualTourMutation.isPending || updateVirtualTourMutation.isPending}
            className="flex-1"
          >
            {(createVirtualTourMutation.isPending || updateVirtualTourMutation.isPending) && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
