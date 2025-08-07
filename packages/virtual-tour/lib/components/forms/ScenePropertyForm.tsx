'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useStudioStore } from '@/store';
import { FormDropZone, useBulkUpload } from '@musetrip360/shared';
import { MediaType } from '@musetrip360/shared/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { useEffect, useState } from 'react';
import type { IVirtualTourScene } from '../../api/types';
import { useShallow } from 'zustand/shallow';
import { Button } from '@musetrip360/ui-core/button';

// Form schema for scene properties
export const scenePropertyFormSchema = z.object({
  sceneName: z.string().nonempty('Scene name is required').max(100, 'Scene name must be less than 100 characters'),
  sceneDescription: z.string().max(500, 'Description must be less than 500 characters').optional(),
  thumbnail: z.any().optional(),
});

export type ScenePropertyFormData = z.infer<typeof scenePropertyFormSchema>;

export interface ScenePropertyFormProps {
  scene: IVirtualTourScene;
  onUpdate: (sceneId: string, data: Partial<IVirtualTourScene>) => void;
  isLoading?: boolean;
  className?: string;
}

export function ScenePropertyForm({ scene, isLoading = false }: ScenePropertyFormProps) {
  const bulkUpload = useBulkUpload();
  const { isSyncing, updateScene } = useStudioStore(
    useShallow((state) => ({
      isSyncing: state.isSyncing,
      updateScene: state.updateScene,
    }))
  );
  const [disabled, setDisabled] = useState(false);

  const form = useForm<ScenePropertyFormData>({
    disabled: disabled || isSyncing,
    resolver: zodResolver(scenePropertyFormSchema),
    defaultValues: {
      sceneName: scene.sceneName || '',
      sceneDescription: scene.sceneDescription || '',
      thumbnail: typeof scene.thumbnail === 'string' ? { file: scene.thumbnail } : null,
    },
  });

  const handleSubmit = async () => {
    setDisabled(true);
    try {
      if (bulkUpload && bulkUpload?.getPendingFiles()?.length > 0) {
        const isAccept = await bulkUpload?.openConfirmDialog();
        if (isAccept) {
          await bulkUpload?.uploadAll();
        }
      }
      const formData = form.getValues();
      updateScene(scene.sceneId!, {
        sceneName: formData.sceneName,
        sceneDescription: formData.sceneDescription,
        thumbnail: formData.thumbnail?.file,
      });
    } finally {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (scene) {
      form.reset({
        sceneName: scene.sceneName || '',
        sceneDescription: scene.sceneDescription || '',
        thumbnail: typeof scene.thumbnail === 'string' ? { file: scene.thumbnail } : null,
      });
    } else {
      form.reset({
        sceneName: '',
        sceneDescription: '',
        thumbnail: null,
      });
    }
    // Reset form when scene changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <div className="p-2 space-y-6">
      <div className="border-b border-border pb-2">
        <h3 className="font-medium text-sm text-muted-foreground">Scene Properties</h3>
        <p className="text-xs text-muted-foreground mt-1">ID: {scene.sceneId}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="sceneName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-xs">
                  Scene Name {fieldState.error && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter scene name..." {...field} disabled={isLoading} className="h-8 text-sm" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sceneDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe this scene..."
                    rows={3}
                    {...field}
                    disabled={isLoading}
                    className="text-sm resize-none"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormDropZone
              name="thumbnail"
              control={form.control}
              mediaType={MediaType.IMAGE}
              label="Thumbnail"
              direction="vertical"
            />
          </div>
          <Button type="submit" variant="outline" className="w-full">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
