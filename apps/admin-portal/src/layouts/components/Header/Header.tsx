import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarTrigger,
} from '@musetrip360/ui-core';
import { Bell, ChevronRight, LogOut, Settings, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getBreadcrumb = (pathname: string) => {
  const paths = {
    '/': 'Dashboard',
    '/museums': 'Danh sách Bảo tàng',
    '/museums/requests': 'Xét duyệt Bảo tàng',
    '/museums/approval': 'Xét duyệt Bảo tàng',
    '/analytics/overview': 'Thống kê Tổng quan',
    '/users': 'Quản lý Người dùng',
    '/settings': 'Cài đặt Hệ thống',
    '/policies': 'Chính sách & Quy định',
  };
  return paths[pathname as keyof typeof paths] || 'Trang chính';
};

export default function Header() {
  const location = useLocation();
  const currentPage = getBreadcrumb(location.pathname);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="flex h-14 w-full items-center justify-between px-4">
        {/* Left side - Sidebar trigger và breadcrumb */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Quản trị</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{currentPage}</span>
          </div>
        </div>

        {/* Right side - Thông báo và menu người dùng */}
        <div className="flex items-center gap-3">
          {/* Thông báo */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              5
            </Badge>
            <span className="sr-only">Thông báo</span>
          </Button>

          {/* Cài đặt */}
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Cài đặt</span>
          </Button>

          {/* Menu người dùng */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.png" alt="Admin" />
                  <AvatarFallback className="bg-muted text-muted-foreground">QT</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Quản trị viên</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@musetrip360.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
