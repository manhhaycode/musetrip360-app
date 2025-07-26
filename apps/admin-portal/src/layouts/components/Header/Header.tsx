import { useAuthStore } from '@musetrip360/auth-system';
import { Avatar, AvatarFallback, AvatarImage } from '@musetrip360/ui-core/avatar';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { SidebarTrigger } from '@musetrip360/ui-core/sidebar';
import { Bell, ChevronRight, LogOut, Settings, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const getBreadcrumb = (pathname: string) => {
  const paths = {
    '/': 'Dashboard',
    '/museums': 'Danh sách Bảo tàng',
    '/museums/requests': 'Xét duyệt Bảo tàng',
    '/users': 'Quản lý Người dùng',
    '/settings': 'Cài đặt Hệ thống',
    '/policies': 'Chính sách & Quy định',
  };
  return paths[pathname as keyof typeof paths] || 'Trang';
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = getBreadcrumb(location.pathname);

  const handleLogout = () => {
    useAuthStore.getState().resetStore();
    navigate('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b bg-secondary/20">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Trang chủ</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{currentPage}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <Badge
            variant="secondary"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-muted text-muted-foreground"
          >
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                <AvatarFallback className="bg-muted text-muted-foreground">QT</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">admin@musetrip360.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
