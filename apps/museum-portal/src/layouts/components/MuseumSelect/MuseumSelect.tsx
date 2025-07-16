'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@musetrip360/ui-core/dropdown-menu';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@musetrip360/ui-core/sidebar';
import { MuseTrip360Logo } from '@/assets/svg';
import { useMuseumStore } from '@musetrip360/museum-management';

const MuseumSelect = () => {
  const { selectedMuseum, userMuseums, setSelectedMuseum } = useMuseumStore();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <MuseTrip360Logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{selectedMuseum?.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-lg"
            align="start"
            side="right"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Bảo tàng</DropdownMenuLabel>
            {userMuseums.map((museum) => (
              <DropdownMenuItem key={museum.id} onClick={() => setSelectedMuseum(museum)} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md w-full gap-2">
                  <MuseTrip360Logo className="size-3.5 shrink-0" />
                  <span className="text-xs font-normal">{museum.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Thêm bảo tàng</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default MuseumSelect;
