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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@musetrip360/ui-core';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@musetrip360/ui-core/collapsible';
import { Building2, ChevronDown, ChevronRight, FileText, Gavel, Home, Settings, Shield, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const sidebarButtonClasses =
  'hover:text-primary-foreground data-[active=true]:text-primary-foreground data-[active=true]:bg-primary/70 active:text-primary-foreground data-[state=close]:hover:text-primary-foreground data-[state=open]:hover:text-primary-foreground';

export default function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MuseTrip360</span>
                  <span className="truncate text-xs">Admin Portal</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroupItem
          groupLabel="📊 Tổng quan"
          items={[
            {
              title: 'Dashboard',
              url: '/',
              icon: Home,
            },
          ]}
        />

        <SidebarGroupItem
          groupLabel="🏛️ Quản lý Bảo tàng"
          items={[
            {
              title: 'Bảo tàng',
              url: '/museums',
              icon: Building2,
              items: [
                {
                  title: 'Danh sách bảo tàng',
                  url: '/museums',
                  icon: Building2,
                },
                {
                  title: 'Xét duyệt đăng ký',
                  url: '/museums/requests',
                  icon: FileText,
                },
              ],
            },
          ]}
        />

        <SidebarGroupItem
          groupLabel="⚙️ Quản lý Hệ thống"
          items={[
            {
              title: 'Hệ thống',
              url: '/system',
              icon: Settings,
              items: [
                {
                  title: 'Người dùng',
                  url: '/users',
                  icon: Users,
                },
                {
                  title: 'Chính sách',
                  url: '/policies',
                  icon: Gavel,
                },
                {
                  title: 'Cài đặt',
                  url: '/settings',
                  icon: Settings,
                },
              ],
            },
          ]}
        />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/admin.png" alt="Admin" />
                    <AvatarFallback className="rounded-lg">QT</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin</span>
                    <span className="truncate text-xs">admin@musetrip360.com</span>
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

export const SidebarGroupItem = ({
  groupLabel,
  items,
}: {
  groupLabel: string;
  items: {
    title: string;
    url: string;
    icon?: any;
    items?: {
      title: string;
      url: string;
      icon?: any;
    }[];
  }[];
}) => {
  return (
    <SidebarGroup className="font-medium">
      <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground">{groupLabel}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuGroupItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export const SidebarMenuGroupItem = ({
  item,
}: {
  item: {
    title: string;
    url: string;
    icon?: any;
    items?: {
      title: string;
      url: string;
      icon?: any;
    }[];
  };
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (location.pathname === '/') {
      setIsOpen(true);
      return;
    }
    if (item.items?.some((subItem) => location.pathname.includes(subItem.url))) {
      setIsOpen(true);
    }
  }, [location, item]);

  // Nếu không có sub-items, render như menu item thông thường
  if (!item.items || item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" isActive={location.pathname === item.url} className={sidebarButtonClasses} asChild>
          <Link to={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible
      onOpenChange={(open) => {
        if (open) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      }}
      open={isOpen}
      key={item.title}
      asChild
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            size="lg"
            tooltip={item.title}
            className="hover:text-primary-foreground active:text-primary-foreground data-[state=close]:hover:text-primary-foreground data-[state=open]:hover:text-primary-foreground"
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="p-2">
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  isActive={location.pathname === subItem.url}
                  className={sidebarButtonClasses}
                  asChild
                >
                  <Link to={subItem.url}>
                    {subItem.icon && <subItem.icon className="!text-inherit" />}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
