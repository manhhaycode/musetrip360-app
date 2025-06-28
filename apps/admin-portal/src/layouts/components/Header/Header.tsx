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
  Input,
  SidebarTrigger,
} from '@musetrip360/ui-core';
import { Bell, ChevronRight, LogOut, Search, Settings, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getBreadcrumb = (pathname: string) => {
  const paths = {
    '/': 'Tổng quan',
    '/museums': 'Danh sách Bảo tàng',
    '/museums/requests': 'Yêu cầu Đăng ký',
    '/museums/approval': 'Xét duyệt',
    '/analytics/overview': 'Thống kê Tổng quan',
  };
  return paths[pathname as keyof typeof paths] || 'Trang không xác định';
};

export default function Header() {
  const location = useLocation();
  const currentPage = getBreadcrumb(location.pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        {/* Left side - Sidebar trigger và breadcrumb */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <div className="hidden lg:flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Quản trị</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{currentPage}</span>
          </div>
        </div>

        {/* Center - Tìm kiếm */}
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm bảo tàng, yêu cầu đăng ký..."
                className="pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
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
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    QT
                  </AvatarFallback>
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
              <DropdownMenuItem className="text-red-600">
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
