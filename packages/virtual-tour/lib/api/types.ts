import { CubeMapData } from '@/types';

export interface IVirtualTour {
  id: string;
  name: string;
  description: string;
  rating: number;
  isActive: boolean;
  metadata: {
    scenes: IVirtualTourScene[];
  };
  tourContent: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IVirtualTourScene {
  sceneId: string;
  sceneName: string;
  parentId?: string;
  sceneDescription?: string;
  thumbnail?: string | File;
  data?: CubeMapData;
  subScenes?: Omit<IVirtualTourScene, 'subScenes'>[];
}
