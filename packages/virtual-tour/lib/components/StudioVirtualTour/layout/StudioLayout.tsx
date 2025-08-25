import { BulkUploadProvider } from '@musetrip360/shared';
import { SidebarInset, SidebarProvider } from '@musetrip360/ui-core/sidebar';
import React from 'react';
import { PropertiesPanel } from './PropertiesPanel';
import SceneListSidebar from './SceneListSidebar';
import { VirtualTourStudioHeader } from './VirtualTourStudioHeader';

interface StudioLayoutProps {
  onBackScreen?: () => void;
  museumId: string; // ID of the museum to create the virtual tour for
  children: React.ReactNode;
}

export default function StudioLayout({ children, onBackScreen, museumId }: StudioLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SceneListSidebar onBackScreen={onBackScreen} />

        <SidebarInset className="flex-1 flex flex-col">
          <VirtualTourStudioHeader />
          {/* {children} */}

          <div className="flex flex-1 relative overflow-hidden">
            {children}
            <BulkUploadProvider>
              <PropertiesPanel museumId={museumId} className="border-l flex-shrink-0" />
            </BulkUploadProvider>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
