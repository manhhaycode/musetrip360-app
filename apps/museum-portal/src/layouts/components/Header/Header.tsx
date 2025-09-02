import { IUser, useAuthStore } from '@musetrip360/auth-system';
import { useMuseumStore } from '@musetrip360/museum-management';
import { useCurrentProfile, useUserStore } from '@musetrip360/user-management';
import { Button } from '@musetrip360/ui-core/button';
import { Separator } from '@musetrip360/ui-core/separator';
import { SidebarTrigger } from '@musetrip360/ui-core/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@musetrip360/ui-core/avatar';
import { LogOutIcon, UserIcon, LockIcon } from 'lucide-react';
import { Link } from 'react-router';
import { NotificationBellContainer } from './NotificationBellContainer';
import { useRolebaseStore } from '@musetrip360/rolebase-management';
import { getQueryClient } from '@musetrip360/query-foundation';

export default function Header() {
  const { data } = useCurrentProfile();
  const user = data as IUser;

  const handleLogout = () => {
    useAuthStore.getState().resetStore();
    useMuseumStore.getState().resetStore();
    useUserStore.getState().resetStore();
    useRolebaseStore.getState().resetStore();
    getQueryClient().clear();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  return (
    <header className="flex h-(--header-height) py-3 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Museum Portal</h1>

        {user ? (
          <div className="ml-auto flex items-center gap-4">
            {/* Notification Bell */}
            <NotificationBellContainer />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || ''} alt={user?.fullName} />
                    <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.fullName ? user.fullName : user.email}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Thông tin cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings/change-password" className="cursor-pointer">
                    <LockIcon className="mr-2 h-4 w-4" />
                    <span>Đổi mật khẩu</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="ml-auto flex items-center gap-4">
            <Button variant="default" size="sm" className="h-8">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
