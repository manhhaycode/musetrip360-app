import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@musetrip360/ui-core';
import {
  BarChart3,
  Building2,
  CheckSquare,
  ChevronDown,
  Clock,
  FileText,
  Home,
  List,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Menu items cho admin portal
const menuItems = [
  {
    title: 'Tổng quan',
    url: '/',
    icon: Home,
  },
  {
    title: 'Quản lý Bảo tàng',
    icon: Building2,
    items: [
      { title: 'Danh sách Bảo tàng', url: '/museums', icon: List },
      { title: 'Yêu cầu Đăng ký', url: '/museums/requests', icon: Clock, badge: '23' },
      { title: 'Xét duyệt', url: '/museums/approval', icon: CheckSquare },
    ],
  },
  {
    title: 'Báo cáo & Thống kê',
    icon: BarChart3,
    items: [
      { title: 'Thống kê Tổng quan', url: '/analytics/overview' },
      { title: 'Báo cáo Bảo tàng', url: '/analytics/museums' },
      { title: 'Hiệu suất Hệ thống', url: '/analytics/performance' },
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar variant="inset" className="h-screen border-r">
      <SidebarHeader className="border-b p-0">
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">MuseTrip360</span>
            <span className="truncate text-xs text-blue-100">Quản trị viên</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Tổng quan */}
        <SidebarGroup>
          <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                  <Link to="/">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quản lý Bảo tàng */}
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý Bảo tàng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/museums'}>
                  <Link to="/museums">
                    <List />
                    <span>Danh sách</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/museums/requests'}>
                  <Link to="/museums/requests" className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock />
                      <span>Yêu cầu Đăng ký</span>
                    </div>
                    <Badge
                      variant="destructive"
                      className="ml-auto h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      23
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/museums/approval'}>
                  <Link to="/museums/approval">
                    <CheckSquare />
                    <span>Xét duyệt</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Báo cáo & Thống kê */}
        <SidebarGroup>
          <SidebarGroupLabel>Báo cáo & Thống kê</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/analytics/overview'}>
                  <Link to="/analytics/overview">
                    <BarChart3 />
                    <span>Thống kê Tổng quan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/admin.png" alt="Admin" />
                    <AvatarFallback className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      QT
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Quản trị viên</span>
                    <span className="truncate text-xs text-muted-foreground">admin@musetrip360.com</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Shield />
                  Bảo mật
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText />
                  Nhật ký Hoạt động
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
