'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { MediaType } from '@musetrip360/shared/types';
import { FormDropZone, PreviewModal } from '@musetrip360/shared/ui';
import { Button } from '@musetrip360/ui-core/button';
import { Form } from '@musetrip360/ui-core/form';
import { Loader2, Upload } from 'lucide-react';

import { PanoramaSphere } from '@/canvas';
import { useStudioStore } from '@/store';
import { FACE_LABELS, FaceName } from '@/types/cubemap';
import { useBulkUpload } from '@musetrip360/shared';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

// Form schema for cube map upload
export const sceneCubeMapUploadSchema = z
  .object({
    px: z.any().optional(), // Right face
    nx: z.any().optional(), // Left face
    py: z.any().optional(), // Top face
    ny: z.any().optional(), // Bottom face
    pz: z.any().optional(), // Front face
    nz: z.any().optional(), // Back face
  })
  .refine(
    (data) => {
      // Check if all 6 faces have files
      const faces = Object.values(data).filter((face) => face?.file instanceof File);
      return faces.length === 6;
    },
    {
      message: 'All 6 cube faces are required',
      path: ['root'],
    }
  );

export type SceneCubeMapUploadFormData = z.infer<typeof sceneCubeMapUploadSchema>;

export interface SceneCubeMapUploadFormProps {
  isLoading?: boolean;
  submitLabel?: string;
  showCancelButton?: boolean;
  defaultValues?: SceneCubeMapUploadFormData;
}

// Face layout configuration for the grid
const FACE_LAYOUT: { face: FaceName; row: number; col: number }[] = [
  { face: 'py', row: 0, col: 0 }, // Top
  { face: 'pz', row: 0, col: 1 }, // Front
  { face: 'px', row: 0, col: 2 }, // Right
  { face: 'ny', row: 1, col: 0 }, // Bottom
  { face: 'nz', row: 1, col: 1 }, // Back
  { face: 'nx', row: 1, col: 2 }, // Left
];

export function SceneCubeMapUploadForm({
  submitLabel = 'Upload Cube Map',
  defaultValues = {
    px: null,
    nx: null,
    py: null,
    ny: null,
    pz: null,
    nz: null,
  },
}: SceneCubeMapUploadFormProps) {
  const { selectedSceneId, updateScene, isSyncing, getSelectedScene } = useStudioStore(
    useShallow((state) => ({
      isSyncing: state.isSyncing,
      updateScene: state.updateScene,
      selectedSceneId: state.selectedSceneId,
      getSelectedScene: state.getSelectedScene,
    }))
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [disable, setDisable] = useState(false);

  const form = useForm<SceneCubeMapUploadFormData>({
    disabled: disable || isSyncing,
    resolver: zodResolver(sceneCubeMapUploadSchema),
    defaultValues,
  });
  const watchedValues = form.watch();
  const bulkUpload = useBulkUpload();

  const selectedScene = useMemo(() => {
    return selectedSceneId ? getSelectedScene() : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSceneId]);

  useEffect(() => {
    if (selectedScene?.data?.cubeMaps?.length) {
      const cubeMap = selectedScene.data?.cubeMaps[0];
      if (!cubeMap) {
        form.reset(defaultValues);
        return;
      }
      form.reset({
        px: { file: cubeMap.px },
        nx: { file: cubeMap.nx },
        py: { file: cubeMap.py },
        ny: { file: cubeMap.ny },
        pz: { file: cubeMap.pz },
        nz: { file: cubeMap.nz },
      });
    } else {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScene]);

  const handleSubmit = async () => {
    if (!selectedScene) return;
    setDisable(true);
    try {
      if (bulkUpload && bulkUpload?.getPendingFiles()?.length > 0) {
        const isAccept = await bulkUpload?.openConfirmDialog();
        if (isAccept) {
          await bulkUpload?.uploadAll();
        }
      }
      const formData = form.getValues();
      updateScene(selectedSceneId!, {
        data: {
          ...(selectedScene.data || {
            cubeMaps: [],
            hotspots: [],
            polygons: [],
          }),
          cubeMaps: [
            {
              px: typeof formData.px?.file === 'string' ? formData.px?.file : '',
              nx: typeof formData.nx?.file === 'string' ? formData.nx?.file : '',
              py: typeof formData.py?.file === 'string' ? formData.py?.file : '',
              ny: typeof formData.ny?.file === 'string' ? formData.ny?.file : '',
              pz: typeof formData.pz?.file === 'string' ? formData.pz?.file : '',
              nz: typeof formData.nz?.file === 'string' ? formData.nz?.file : '',
            },
          ],
        },
      });
    } catch (error) {
      console.error('Failed to upload cubemap:', error);
    } finally {
      setDisable(false);
    }
  };

  const handleOpenPreview = () => {
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm text-muted-foreground">Cube Map Upload</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Upload 6 images for panorama cube map</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* 2x3 Grid Layout */}
              <div className="grid grid-cols-2 gap-3">
                {FACE_LAYOUT.map(({ face }) => (
                  <div key={face} className="space-y-2">
                    <div className="text-center">
                      <p className="text-xs font-medium text-muted-foreground">{FACE_LABELS[face]}</p>
                      <p className="text-xs text-muted-foreground opacity-75">({face})</p>
                    </div>

                    <FormDropZone name={face} control={form.control} mediaType={MediaType.IMAGE} direction="vertical" />
                  </div>
                ))}
              </div>

              {/* Validation Message */}
              {form.formState.errors.root && (
                <div className="text-sm text-destructive text-center">{form.formState.errors.root.message}</div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleOpenPreview} className="flex-1">
                  Preview virtual scene
                </Button>
                <Button type="submit" disabled={disable} className="flex-1">
                  {isSyncing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {submitLabel}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ScrollArea>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title="Virtual Scene Preview"
        size="xl"
        showBackButton
        closeOnBackdropClick
        closeOnEscape
        lazyChildren
      >
        <div className="flex-1 p-6">
          <PanoramaSphere
            cubeMapLevel={{
              px: watchedValues.px?.file || '',
              nx: watchedValues.nx?.file || '',
              py: watchedValues.py?.file || '',
              ny: watchedValues.ny?.file || '',
              pz: watchedValues.pz?.file || '',
              nz: watchedValues.nz?.file || '',
            }}
          />
        </div>
      </PreviewModal>
    </>
  );
}
