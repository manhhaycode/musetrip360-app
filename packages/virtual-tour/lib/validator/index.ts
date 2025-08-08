import { z } from 'zod';

export const VirtualTourSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  metadata: z
    .object({
      scenes: z.array(
        z.object({
          sceneId: z.string().uuid('Invalid scene ID'),
          sceneName: z.string().min(1, 'Scene name is required'),
          sceneDescription: z.string().optional(),
          thumbnail: z
            .string()
            .url('Invalid thumbnail URL')
            .optional()
            .or(z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, 'Thumbnail must be less than 5MB')),
          data: z.any(), // Replace with actual CubeMapData schema
        })
      ),
    })
    .optional(),
});
