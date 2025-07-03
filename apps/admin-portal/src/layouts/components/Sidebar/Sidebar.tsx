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
import { BarChart3, Building2, ChevronDown, FileText, Gavel, Home, Settings, Shield, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar variant="inset" className="h-screen">
      <SidebarHeader className="p-0">
        <div className="flex items-center gap-3 px-6 py-4" style={{ backgroundColor: '#fff0eb' }}>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: '#feb47b', border: '1px solid #ffe0d6' }}
          >
            <Building2 className="h-4 w-4" style={{ color: '#ff7e5f' }} />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold" style={{ color: '#3d3436' }}>
              MuseTrip360
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        {/* Tổng quan */}
        <SidebarGroup>
          <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'} data-active={location.pathname === '/'}>
                  <Link to="/">
                    <Home className="h-4 w-4" />
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
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/museums'}
                  data-active={location.pathname === '/museums'}
                >
                  <Link to="/museums">
                    <Building2 className="h-4 w-4" />
                    <span>Danh sách</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/museums/requests' || location.pathname === '/museums/approval'}
                  data-active={location.pathname === '/museums/requests' || location.pathname === '/museums/approval'}
                >
                  <Link to="/museums/requests" className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Xét duyệt</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="ml-auto h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center font-medium"
                      style={{ backgroundColor: '#feb47b', color: '#3d3436', border: '1px solid #ffe0d6' }}
                    >
                      23
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Phân tích */}
        <SidebarGroup>
          <SidebarGroupLabel>Phân tích</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/analytics/overview'}
                  data-active={location.pathname === '/analytics/overview'}
                >
                  <Link to="/analytics/overview">
                    <BarChart3 className="h-4 w-4" />
                    <span>Thống kê</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Hệ thống */}
        <SidebarGroup>
          <SidebarGroupLabel>Hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/users'}
                  data-active={location.pathname === '/users'}
                >
                  <Link to="/users">
                    <Users className="h-4 w-4" />
                    <span>Người dùng</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/policies'}
                  data-active={location.pathname === '/policies'}
                >
                  <Link to="/policies">
                    <Gavel className="h-4 w-4" />
                    <span>Chính sách</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/settings'}
                  data-active={location.pathname === '/settings'}
                >
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Cài đặt</span>
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
                  className="data-[state=open]:bg-muted data-[state=open]:text-foreground hover:bg-muted/50"
                >
                  <Avatar className="h-8 w-8 rounded-lg border">
                    <AvatarImage src="/avatars/admin.png" alt="Admin" />
                    <AvatarFallback
                      className="rounded-lg border"
                      style={{ backgroundColor: '#feb47b', color: '#3d3436' }}
                    >
                      QT
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin</span>
                    <span className="truncate text-xs text-muted-foreground">admin@musetrip360.com</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Bảo mật
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Nhật ký
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
