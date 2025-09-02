'use client';

import type { Polygon } from '@/canvas/types';
import { useStudioStore } from '@/store';
import { useArtifactsByMuseum } from '@musetrip360/artifact-management/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Pentagon as PolygonIcon, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/shallow';
import { PERMISSION_TOUR_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';

const polygonFormSchema = z.object({
  artifactIdLink: z.string().min(1, 'Artifact ID is required'),
  description: z.string().optional(),
});

type PolygonFormData = z.infer<typeof polygonFormSchema>;

export interface PolygonPropertyFormProps {
  polygon: Polygon;
  onDelete?: () => void;
  museumId: string;
}

export function PolygonPropertyForm({ museumId }: { museumId: string }) {
  const { updatePolygon, deletePolygon, selectPolygon, getSelectedPolygon, selectedPolygonId, isDirty } =
    useStudioStore(
      useShallow((state) => ({
        updatePolygon: state.updatePolygon,
        deletePolygon: state.deletePolygon,
        selectPolygon: state.selectPolygon,
        selectedPolygonId: state.selectedPolygonId,
        getSelectedPolygon: state.getSelectedPolygon,
        isDirty: state.isDirty,
      }))
    );
  const { hasPermission } = useRolebaseStore();

  const polygon = useMemo(() => {
    return getSelectedPolygon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, selectedPolygonId]);

  // Get artifacts for this museum
  const { data: artifactsResponse, isLoading: artifactsLoading } = useArtifactsByMuseum({
    museumId,
    Page: 1,
    PageSize: 100, // Get enough artifacts for selection
  });

  const artifacts = useMemo(() => {
    return artifactsResponse?.list || [];
  }, [artifactsResponse]);

  // Get selected artifact info
  const selectedArtifact = useMemo(() => {
    if (!polygon?.artifactIdLink) return null;
    return artifacts.find((artifact) => artifact.id === polygon.artifactIdLink);
  }, [artifacts, polygon?.artifactIdLink]);

  const form = useForm<PolygonFormData>({
    disabled: !hasPermission(museumId, PERMISSION_TOUR_MANAGEMENT),
    resolver: zodResolver(polygonFormSchema),
    defaultValues: {
      artifactIdLink: polygon?.artifactIdLink || '',
      description: '',
    },
  });

  const onSubmit = (data: PolygonFormData) => {
    if (!polygon) return;
    updatePolygon(polygon.id, {
      artifactIdLink: data.artifactIdLink,
      // Note: description is not part of Polygon type yet, but we can extend it later
    });
  };

  useEffect(() => {
    if (polygon) {
      form.reset({
        artifactIdLink: polygon.artifactIdLink || '',
        description: '',
      });
    } else {
      form.reset({
        artifactIdLink: '',
        description: '',
      });
    }
    // Reset form when polygon changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygon]);

  const handleDelete = () => {
    if (!polygon) return;
    deletePolygon(polygon.id);
    selectPolygon(null);
  };

  if (!polygon) return null;

  return (
    <div className="space-y-6 p-4">
      {/* Header with polygon info */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <PolygonIcon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">Polygon Configuration</h3>
          <p className="text-xs text-muted-foreground">Points: {polygon.points.length} vertices</p>
          {selectedArtifact && <p className="text-xs text-primary font-medium">Linked to: {selectedArtifact.name}</p>}
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="artifactIdLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">
                  Linked Artifact <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={artifactsLoading || field.disabled}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder={artifactsLoading ? 'Loading artifacts...' : 'Select an artifact'} />
                    </SelectTrigger>
                    <SelectContent>
                      {artifacts.length > 0 ? (
                        artifacts.map((artifact) => (
                          <SelectItem key={artifact.id} value={artifact.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{artifact.name}</span>
                              <span className="text-xs text-muted-foreground">{artifact.historicalPeriod}</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : !artifactsLoading ? (
                        <SelectItem value="no-artifacts" disabled>
                          No artifacts found
                        </SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                </FormControl>
                <p className="text-xs text-muted-foreground">This polygon will be linked to the selected artifact</p>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Optional description for this polygon selection..."
                    className="text-sm min-h-[60px]"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Polygon Points Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-xs font-medium mb-2">Polygon Bounds</h4>
            <div className="space-y-1">
              {polygon.points.slice(0, 3).map((point, index) => (
                <p key={index} className="text-xs text-muted-foreground font-mono">
                  Point {index + 1}: ({point.x.toFixed(2)}, {point.y.toFixed(2)}, {point.z.toFixed(2)})
                </p>
              ))}
              {polygon.points.length > 3 && (
                <p className="text-xs text-muted-foreground">... and {polygon.points.length - 3} more points</p>
              )}
            </div>
          </div>

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
