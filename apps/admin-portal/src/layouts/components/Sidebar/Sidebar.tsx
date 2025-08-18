import routes from '@/config/routes';
import { useAuthStore } from '@musetrip360/auth-system';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@musetrip360/ui-core/collapsible';
import {
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
} from '@musetrip360/ui-core/sidebar';
import { Building2, ChevronRight, FileText, Gavel, Home, LogOutIcon, LucideIcon, Settings, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const sidebarButtonClasses =
  'hover:text-primary-foreground data-[active=true]:text-primary-foreground data-[active=true]:bg-primary/70 active:text-primary-foreground data-[state=close]:hover:text-primary-foreground data-[state=open]:hover:text-primary-foreground';

export default function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={routes.dashboard}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MuseTrip360</span>
                  <span className="truncate text-xs">Admin Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupItem
          groupLabel="Quản lý chính"
          items={[
            {
              title: 'Dashboard',
              url: routes.dashboard,
              icon: Home,
              items: [],
            },
            {
              title: 'Quản lý bảo tàng',
              url: routes.museums.list,
              icon: Building2,
              items: [
                {
                  title: 'Danh sách bảo tàng',
                  url: routes.museums.list,
                  icon: Building2,
                },
                {
                  title: 'Phê duyệt bảo tàng',
                  url: routes.museums.requests,
                  icon: Gavel,
                },
              ],
            },
            {
              title: 'Quản lý người dùng',
              url: routes.users,
              icon: Users,
              items: [],
            },
            {
              title: 'Chính sách',
              url: routes.policies,
              icon: FileText,
              items: [],
            },
            {
              title: 'Quản lý quyền',
              url: routes.rolebase.roles,
              icon: Gavel,
              items: [
                {
                  title: 'Vai trò',
                  url: routes.rolebase.roles,
                  icon: Gavel,
                },
                {
                  title: 'Quyền',
                  url: routes.rolebase.permissions,
                  icon: Gavel,
                },
              ],
            },
            {
              title: 'Quản lý thanh toán',
              url: routes.payments.orders,
              icon: Gavel,
              items: [
                {
                  title: 'Danh sách đơn hàng',
                  url: routes.payments.orders,
                  icon: Gavel,
                },
              ],
            },
            {
              title: 'Cài đặt',
              url: routes.settings,
              icon: Settings,
              items: [],
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter className="border-t-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className={twMerge(sidebarButtonClasses, 'font-medium')}>
              <Settings />
              <span>Cài đặt</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={twMerge(sidebarButtonClasses, 'font-medium')}
              onClick={() => useAuthStore.getState().resetStore()}
            >
              <LogOutIcon />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
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
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) => {
  return (
    <SidebarGroup className="font-medium">
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
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
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
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
    if (item.items?.some((item) => location.pathname.includes(item.url))) {
      setIsOpen(true);
    }
  }, [location, item]);

  // Nếu không có sub-items, chỉ render một link đơn giản
  if (!item.items || item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={location.pathname === item.url}
          className={twMerge(sidebarButtonClasses, 'font-medium')}
          asChild
        >
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
