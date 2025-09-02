'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useStudioStore } from '@/store';
import { useAudioAIGenerate } from '@musetrip360/ai-bot/api';
import { PERMISSION_TOUR_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';
import { FormDropZone, useBulkUpload, ZodFileData } from '@musetrip360/shared';
import { MediaType } from '@musetrip360/shared/types';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@musetrip360/ui-core/sheet';
import { toast } from '@musetrip360/ui-core/sonner';
import { Switch } from '@musetrip360/ui-core/switch';
import { FileText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

const RichEditor = React.lazy(() =>
  import('@musetrip360/rich-editor').then((module) => ({
    default: module.RichEditor,
  }))
);

// Form schema for scene properties
export const scenePropertyFormSchema = z.object({
  sceneName: z.string().nonempty('Scene name is required').max(100, 'Scene name must be less than 100 characters'),
  sceneDescription: z.string().optional(),
  thumbnail: z.any().optional(),
  // Rich content and media fields
  richDescription: z.string().optional(),
  audio: ZodFileData.nullable().optional(),
  isUseVoiceAI: z.boolean().optional(),
  voiceAI: ZodFileData.nullable().optional(),
});

export type ScenePropertyFormData = z.infer<typeof scenePropertyFormSchema>;

export function ScenePropertyForm({ museumId }: { museumId: string }) {
  const { hasPermission } = useRolebaseStore();
  const bulkUpload = useBulkUpload();
  const { isSyncing, updateScene, selectedSceneId, getSelectedScene, isDirty } = useStudioStore(
    useShallow((state) => ({
      isSyncing: state.isSyncing,
      updateScene: state.updateScene,
      selectedSceneId: state.selectedSceneId,
      getSelectedScene: state.getSelectedScene,
      isDirty: state.isDirty,
    }))
  );

  const { mutateAsync: generateAIVoice } = useAudioAIGenerate();

  const scene = useMemo(() => {
    return getSelectedScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSceneId, isDirty]);

  const [disabled, setDisabled] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  const form = useForm<ScenePropertyFormData>({
    disabled: disabled || !hasPermission(museumId, PERMISSION_TOUR_MANAGEMENT) || isSyncing,
    resolver: zodResolver(scenePropertyFormSchema),
    defaultValues: {
      sceneName: scene?.sceneName || '',
      sceneDescription: scene?.sceneDescription || '',
      thumbnail: typeof scene?.thumbnail === 'string' ? { file: scene.thumbnail } : null,
      richDescription: scene?.richDescription || '',
      audio: scene?.audio,
      isUseVoiceAI: scene?.isUseVoiceAI || false,
      voiceAI: scene?.voiceAI,
    },
  });

  const handleSubmit = async () => {
    if (!scene) return;
    setDisabled(true);
    try {
      if (bulkUpload && bulkUpload?.getPendingFiles()?.length > 0) {
        const isAccept = await bulkUpload?.openConfirmDialog();
        if (isAccept) {
          await bulkUpload?.uploadAll();
        }
      }

      const formData = form.getValues();
      if (
        formData.isUseVoiceAI &&
        (scene?.sceneDescription !== formData.sceneDescription ||
          (scene?.isUseVoiceAI !== formData?.isUseVoiceAI && !scene?.voiceAI))
      ) {
        toast.loading('Tạo file voice AI...', { id: 'generate-voice' });
        formData['voiceAI'] = {
          file: (await generateAIVoice(formData.sceneDescription || '')).audioUrl,
          fileName: `voice-ai-${formData.sceneName}.mp3`,
          mediaType: MediaType.AUDIO,
        };
        toast.success('Tạo file voice AI thành công!', { id: 'generate-voice' });
      }
      updateScene(scene.sceneId, {
        sceneName: formData.sceneName,
        sceneDescription: formData.sceneDescription,
        thumbnail: formData.thumbnail?.file,
        richDescription: formData.richDescription,
        audio: formData.audio,
        isUseVoiceAI: formData.isUseVoiceAI,
        voiceAI: formData.voiceAI,
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
        richDescription: scene.richDescription || '',
        audio: scene.audio || null,
        isUseVoiceAI: scene.isUseVoiceAI || false,
        voiceAI: scene.voiceAI || null,
      });
    } else {
      form.reset({
        sceneName: '',
        sceneDescription: '',
        thumbnail: null,
        richDescription: '',
        audio: null,
        isUseVoiceAI: false,
        voiceAI: null,
      });
    }
    // Reset form when scene changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  if (!scene) return null;

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
                  <Input placeholder="Enter scene name..." {...field} className="h-8 text-sm" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Description Card - Similar to sceneForm */}
          <Sheet
            open={openSheet}
            onOpenChange={(open) => {
              if (!open && form.formState.disabled) {
                setOpenSheet(false);
              }
            }}
          >
            <SheetTrigger onClick={() => setOpenSheet(true)} asChild>
              <Card className="bg-secondary/40 hover:bg-secondary/80 hover:cursor-pointer">
                <CardContent className="flex gap-2 relative p-3">
                  <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                  {form.watch('sceneDescription') ? (
                    <div className="flex justify-start flex-col gap-1">
                      <p className="font-semibold text-xs text-primary/80 text-start">Scene Description</p>
                      <p className="text-xs text-gray-500 text-start line-clamp-2">{form.watch('sceneDescription')}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-xs text-primary/80">Add Description</span>
                      {form.formState.errors.sceneDescription && (
                        <p className="text-red-500 text-xs">{form.formState.errors.sceneDescription.message}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl" dir="right">
              <SheetHeader>
                <SheetTitle className="text-sm">Add Scene Description</SheetTitle>
                <SheetDescription className="text-xs">
                  Detailed description about the scene, including important information and context.
                </SheetDescription>
              </SheetHeader>
              <React.Suspense fallback={<div className="w-full justify-center text-xs">Loading editor...</div>}>
                <RichEditor
                  readOnly={form.formState.disabled}
                  value={form.watch('richDescription')}
                  onChange={(editorStateTextString) => {
                    form.setValue('sceneDescription', editorStateTextString, {
                      shouldTouch: true,
                    });
                  }}
                  onSave={(content) => {
                    setOpenSheet(false);
                    setTimeout(() => form.setValue('richDescription', content), 100);
                  }}
                  toolbarConfig={{ showFontFamily: false }}
                  showToolbar
                  placeholder="Enter scene description..."
                />
              </React.Suspense>
            </SheetContent>
          </Sheet>

          <div className="space-y-3">
            <FormDropZone
              name="thumbnail"
              control={form.control}
              mediaType={MediaType.IMAGE}
              label="Thumbnail"
              direction="vertical"
            />
          </div>

          {/* Voice AI and Audio Commentary */}
          <div className="grid grid-cols-1 gap-3">
            <FormField
              control={form.control}
              name="isUseVoiceAI"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 rounded-lg border p-3 shadow-sm">
                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-xs">Voice AI</FormLabel>
                      <p className="text-xs text-gray-500">Use AI-generated voice for this scene?</p>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={form.formState.disabled} />
                  </div>
                  {form.watch('isUseVoiceAI') && form.watch('voiceAI')?.file && (
                    <FormDropZone
                      noAction
                      name="voiceAI"
                      control={form.control}
                      mediaType={MediaType.AUDIO}
                      className="gap-4"
                    />
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Audio Commentary */}
          <div className="space-y-2">
            <FormDropZone
              name="audio"
              control={form.control}
              mediaType={MediaType.AUDIO}
              label="Audio Commentary"
              description="Upload audio commentary for this scene"
              direction="vertical"
              className="min-h-[80px] gap-4"
            />
          </div>
          {hasPermission(museumId, PERMISSION_TOUR_MANAGEMENT) && (
            <Button type="submit" variant="outline" className="w-full">
              Save Changes
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
