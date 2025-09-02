'use client';

import type { Hotspot } from '@/canvas/types';
import { useScenes, useStudioStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { PERMISSION_TOUR_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Info, Navigation, Trash2, Zap } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/shallow';

const hotspotFormSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['info', 'navigation', 'action'] as const),
    sceneIdLink: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'navigation') {
        return data.sceneIdLink && data.sceneIdLink.length > 0;
      }
      return true;
    },
    {
      message: 'Scene selection is required for navigation type',
      path: ['sceneIdLink'],
    }
  );

type HotspotFormData = z.infer<typeof hotspotFormSchema>;

export interface HotspotPropertyFormProps {
  hotspot: Hotspot;
  onDelete?: () => void;
}

export function HotspotPropertyForm({ museumId }: { museumId: string }) {
  const { updateHotspot, deleteHotspot, selectHotspot, getSelectedHotspot, selectedHotspotId, isDirty } =
    useStudioStore(
      useShallow((state) => ({
        updateHotspot: state.updateHotspot,
        deleteHotspot: state.deleteHotspot,
        selectHotspot: state.selectHotspot,
        selectedHotspotId: state.selectedHotspotId,
        getSelectedHotspot: state.getSelectedHotspot,
        isDirty: state.isDirty,
      }))
    );
  const { hasPermission } = useRolebaseStore();

  const hotspot = useMemo(() => {
    return getSelectedHotspot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, selectedHotspotId]);

  const allScenes = useScenes();

  const form = useForm<HotspotFormData>({
    disabled: !hasPermission(museumId, PERMISSION_TOUR_MANAGEMENT),
    resolver: zodResolver(hotspotFormSchema),
    defaultValues: {
      title: hotspot?.title,
      type: hotspot?.type,
      sceneIdLink: hotspot?.sceneIdLink || '',
    },
  });

  const watchedType = form.watch('type');

  const onSubmit = (data: HotspotFormData) => {
    updateHotspot(hotspot!.id, {
      title: data.title,
      type: data.type,
      sceneIdLink: data.type === 'navigation' ? data.sceneIdLink : undefined,
    });
  };

  useEffect(() => {
    if (hotspot) {
      form.reset({
        title: hotspot.title || '',
        type: hotspot.type || 'info',
        sceneIdLink: hotspot.sceneIdLink || '',
      });
    } else {
      form.reset({
        title: '',
        type: 'info',
        sceneIdLink: '',
      });
    }
    // Reset form when scene changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotspot]);

  const handleDelete = () => {
    if (!hotspot) return;
    deleteHotspot(hotspot.id);
    selectHotspot(null);
  };

  const getTypeIcon = (hotspotType: string) => {
    switch (hotspotType) {
      case 'info':
        return <Info className="w-4 h-4" />;
      case 'navigation':
        return <Navigation className="w-4 h-4" />;
      case 'action':
        return <Zap className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  if (!hotspot) return null;

  return (
    <div className="space-y-6 p-4">
      {/* Header with hotspot info */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {getTypeIcon(watchedType)}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">Hotspot Configuration</h3>
          <p className="text-xs text-muted-foreground">
            Position: ({hotspot.position[0].toFixed(2)}, {hotspot.position[1].toFixed(2)},{' '}
            {hotspot.position[2].toFixed(2)})
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">
                  Title <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter hotspot title" className="text-sm" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Type</FormLabel>
                <FormControl>
                  <Select disabled={field.disabled} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          <span>Information</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="navigation">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4" />
                          <span>Navigation</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="action">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          <span>Action</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Navigation scene selector for navigation type */}
          {watchedType === 'navigation' && (
            <FormField
              control={form.control}
              name="sceneIdLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Link to Scene <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select disabled={field.disabled} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select target scene" />
                      </SelectTrigger>
                      <SelectContent>
                        {allScenes.map((scene) => (
                          <SelectItem key={scene.sceneId} value={scene.sceneId}>
                            {scene.sceneName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          )}

          {/* Actions */}
          {hasPermission(museumId, PERMISSION_TOUR_MANAGEMENT) && (
            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" size="sm" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" onClick={handleDelete} variant="destructive" size="sm" className="px-3">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
