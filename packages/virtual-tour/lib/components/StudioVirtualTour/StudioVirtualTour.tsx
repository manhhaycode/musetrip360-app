import { IVirtualTour, useUpdateVirtualTour, useVirtualTourById } from '@/api';
import { CreateVirtualTourDialog } from './CreateVirtualTourDialog';
import StudioLayout from './layout/StudioLayout';
import { useEffect } from 'react';
import { useStudioStore } from '@/index';
import SceneEditor from './ScenceEditor';
import { isDirty } from 'zod';
import { useShallow } from 'zustand/shallow';

interface StudioVirtualTourProps {
  onCreateVirtualTour?: (virtualTour: IVirtualTour) => void; // Callback when a new virtual tour is created
  onBackScreen?: () => void;
  museumId: string; // ID of the museum to create the virtual tour for
  virtualTourId?: string; // Optional ID of the virtual tour to edit
}

export default function StudioVirtualTour({
  virtualTourId,
  museumId,
  onBackScreen,
  onCreateVirtualTour,
}: StudioVirtualTourProps) {
  const { data: virtualTour, isLoading, isError } = useVirtualTourById(virtualTourId);

  const { isDirty, setVirtualTour, setIsDirty, setIsSyncing, virtualTourData } = useStudioStore(
    useShallow((state) => ({
      virtualTourData: state.virtualTour,
      setVirtualTour: state.setVirtualTour,
      isDirty: state.isDirty,
      setIsDirty: state.setIsDirty,
      setIsSyncing: state.setIsSyncing,
    }))
  );

  const updateVirtualTour = useUpdateVirtualTour({
    onMutate: () => {
      setIsSyncing(true);
    },
    onSuccess: () => {
      setIsDirty(false);
    },
    onSettled: () => {
      setIsSyncing(false);
    },
  });

  useEffect(() => {
    if (virtualTour) {
      // Initialize the studio store with the fetched virtual tour data
      setVirtualTour(virtualTour);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtualTour]);

  useEffect(() => {
    if (isDirty) {
      updateVirtualTour.mutate(virtualTourData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  if (isLoading) {
    return <div className="flex items-center justify-center flex-1">Loading...</div>;
  }

  if (isError) {
    return (
      <StudioLayout museumId={museumId} onBackScreen={onBackScreen}>
        <div className="flex items-center justify-center flex-1">Failed to load virtual tour</div>
      </StudioLayout>
    );
  }

  return (
    <StudioLayout museumId={museumId} onBackScreen={onBackScreen}>
      {/* <StudioVirtualTourEditor /> */}
      <SceneEditor />
      <CreateVirtualTourDialog
        onSuccess={onCreateVirtualTour}
        onCancel={onBackScreen}
        isOpen={!virtualTour}
        museumId={museumId}
      />
    </StudioLayout>
  );
}
