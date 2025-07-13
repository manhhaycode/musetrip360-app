import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
import { Building2, ChevronDown, FileText, Gavel, Home, Settings, Shield, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar variant="inset" className="h-screen bg-rose-50">
      <SidebarHeader className="p-0">
        <div className="flex items-center gap-3 px-6 py-4 bg-rose-50">
          <div className="flex h-8 w-8 items-center justify-center">
            <Building2 className="h-4 w-4 text-foreground" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-foreground">MuseTrip360</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 bg-rose-50">
        {/* Tổng quan */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Tổng quan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/'}
                  className={
                    location.pathname === '/'
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md [&>*]:!text-white [&_*]:!text-white hover:from-orange-500 hover:to-orange-600'
                      : 'hover:bg-orange-200/50 hover:text-orange-900 transition-all duration-200'
                  }
                >
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
          <SidebarGroupLabel className="text-muted-foreground">Quản lý Bảo tàng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/museums'}
                  className={
                    location.pathname === '/museums'
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md [&>*]:!text-white [&_*]:!text-white hover:from-orange-500 hover:to-orange-600'
                      : 'hover:bg-orange-200/50 hover:text-orange-900 transition-all duration-200'
                  }
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
                  className={
                    location.pathname === '/museums/requests' || location.pathname === '/museums/approval'
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md [&>*]:!text-white [&_*]:!text-white hover:from-orange-500 hover:to-orange-600'
                      : 'hover:bg-orange-200/50 hover:text-orange-900 transition-all duration-200'
                  }
                >
                  <Link to="/museums/requests">
                    <FileText className="h-4 w-4" />
                    <span>Xét duyệt</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Hệ thống */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/users'}
                  className={
                    location.pathname === '/users'
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md [&>*]:!text-white [&_*]:!text-white hover:from-orange-500 hover:to-orange-600'
                      : 'hover:bg-orange-200/50 hover:text-orange-900 transition-all duration-200'
                  }
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
                  className={
                    location.pathname === '/policies'
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md [&>*]:!text-white [&_*]:!text-white hover:from-orange-500 hover:to-orange-600'
                      : 'hover:bg-orange-200/50 hover:text-orange-900 transition-all duration-200'
                  }
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
                  className={
                    location.pathname === '/settings'
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md [&>*]:!text-white [&_*]:!text-white hover:from-orange-500 hover:to-orange-600'
                      : 'hover:bg-orange-200/50 hover:text-orange-900 transition-all duration-200'
                  }
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

      <SidebarFooter className="bg-rose-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-orange-200 data-[state=open]:text-orange-900 hover:bg-orange-200/50 hover:text-orange-900 transition-all duration-200"
                >
                  <Avatar className="h-8 w-8 rounded-lg border border-border">
                    <AvatarImage src="/avatars/admin.png" alt="Admin" />
                    <AvatarFallback className="rounded-lg border bg-muted text-muted-foreground">QT</AvatarFallback>
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
