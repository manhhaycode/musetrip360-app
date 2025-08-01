import { useAuthStore } from '@musetrip360/auth-system';
import { useMuseumStore } from '@musetrip360/museum-management';
import { useUserStore } from '@musetrip360/user-management';
import { Button } from '@musetrip360/ui-core/button';
import { Separator } from '@musetrip360/ui-core/separator';
import { SidebarTrigger } from '@musetrip360/ui-core/sidebar';
import { LogOutIcon } from 'lucide-react';
import { Link } from 'react-router';

export default function Header() {
  return (
    <header className="flex h-(--header-height) py-3 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Museum Portal</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/">
            <Button
              onClick={() => {
                useAuthStore.getState().resetStore();
                useMuseumStore.getState().resetStore();
                useUserStore.getState().resetStore();
              }}
              leftIcon={<LogOutIcon />}
              size="sm"
              className="hidden sm:flex"
            >
              Đăng xuất
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
