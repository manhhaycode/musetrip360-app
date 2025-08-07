import { useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';

import { IVirtualTour } from '@/api';
import { VirtualTourForm } from '../forms/VirtualTourForm';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';

interface CreateVirtualTourDialogProps {
  onSuccess?: (virtualTour: IVirtualTour) => void;
  onCancel?: () => void;
  isOpen?: boolean;
  museumId: string; // ID of the museum to create the virtual tour for
}

export function CreateVirtualTourDialog({ onSuccess, onCancel, museumId, isOpen }: CreateVirtualTourDialogProps) {
  const [open, setOpen] = useState(isOpen || false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        showCloseButton={false}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Create New Virtual Tour</DialogTitle>
          <DialogDescription>
            Create a new virtual tour with basic settings. You'll be able to add scenes and configure details after
            creation.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(95vh-10rem)]">
          <VirtualTourForm
            showCancelButton
            onSuccess={onSuccess}
            onCancel={() => {
              handleOpenChange(false);
              onCancel?.();
            }}
            submitLabel="Create Tour"
            museumId={museumId}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
