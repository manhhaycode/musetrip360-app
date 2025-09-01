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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@musetrip360/ui-core/collapsible';
import {
  ArchiveIcon,
  BookUserIcon,
  CalendarRangeIcon,
  ChartBar,
  ChevronRight,
  FileTextIcon,
  GlobeIcon,
  HomeIcon,
  InfoIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  LogOutIcon,
  LucideIcon,
  PlusIcon,
  ScaleIcon,
  UsersIcon,
  TicketsPlaneIcon,
  NewspaperIcon,
  WalletIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { twMerge } from 'tailwind-merge';
import MuseumSelect from '../MuseumSelect';
import {
  PERMISSION_ARTIFACT_MANAGEMENT,
  PERMISSION_ARTIFACT_VIEW,
  PERMISSION_CONTENT_MANAGEMENT,
  PERMISSION_EVENT_CREATE,
  PERMISSION_EVENT_MANAGEMENT,
  PERMISSION_EVENT_VIEW,
  PERMISSION_MUSEUM_DETAIL_MANAGEMENT,
  PERMISSION_TOUR_CREATE,
  PERMISSION_TOUR_MANAGEMENT,
  PERMISSION_USER_MANAGEMENT,
  PERMISSION_USER_VIEW,
  PERMISSION_PAYMENT_MANAGEMENT,
  useRolebaseStore,
} from '@musetrip360/rolebase-management';
import { useMuseumStore } from '@musetrip360/museum-management';

const sidebarButtonClasses =
  'hover:text-primary-foreground data-[active=true]:text-primary-foreground data-[active=true]:bg-primary/70 active:text-primary-foreground data-[state=close]:hover:text-primary-foreground data-[state=open]:hover:text-primary-foreground';

export default function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { selectedMuseum } = useMuseumStore();
  const { hasAnyPermission, userPrivileges } = useRolebaseStore();

  console.log(
    'userPrivileges',
    userPrivileges,
    selectedMuseum?.id,
    hasAnyPermission(selectedMuseum?.id || '', [PERMISSION_MUSEUM_DETAIL_MANAGEMENT])
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <MuseumSelect />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupItem
          groupLabel="Quản lý bảo tàng"
          items={[
            {
              title: 'Thống kê & Báo cáo',
              url: '/statistics',
              icon: ChartBar,
              items: [
                {
                  title: 'Báo cáo tổng quan',
                  url: '/statistics/overview',
                  icon: LayoutDashboardIcon,
                },
              ],
            },
            {
              title: 'Thông tin bảo tàng',
              url: '/museum',
              icon: LandmarkIcon,
              items: [
                {
                  title: 'Thông tin cơ bản',
                  url: '/museum',
                  icon: InfoIcon,
                },
                {
                  title: 'Trang chủ bảo tàng',
                  url: '/museum/home-page',
                  icon: HomeIcon,
                  isHide: !hasAnyPermission(selectedMuseum?.id || '', [PERMISSION_MUSEUM_DETAIL_MANAGEMENT]),
                },
                {
                  title: 'Danh sách hiện vật',
                  url: '/museum/artifacts',
                  icon: ArchiveIcon,
                  isHide: !hasAnyPermission(selectedMuseum?.id || '', [
                    PERMISSION_ARTIFACT_VIEW,
                    PERMISSION_ARTIFACT_MANAGEMENT,
                  ]),
                },
                {
                  title: 'Hợp đồng',
                  url: '/museum/contract',
                  icon: FileTextIcon,
                  isHide: !hasAnyPermission(selectedMuseum?.id || '', [PERMISSION_MUSEUM_DETAIL_MANAGEMENT]),
                },
                {
                  title: 'Chính sách bảo tàng',
                  url: '/museum/policy',
                  icon: ScaleIcon,
                  isHide: !hasAnyPermission(selectedMuseum?.id || '', [PERMISSION_CONTENT_MANAGEMENT]),
                },
                {
                  title: 'Danh sách bài viết',
                  url: '/museum/articles',
                  icon: NewspaperIcon,
                  isHide: !hasAnyPermission(selectedMuseum?.id || '', [PERMISSION_CONTENT_MANAGEMENT]),
                },
              ],
            },
            {
              title: 'Quản lý nhân sự',
              url: '/staff',
              icon: UsersIcon,
              items: [
                {
                  title: 'Danh sách nhân viên',
                  url: '/staff',
                  icon: BookUserIcon,
                  isHide: !hasAnyPermission(selectedMuseum?.id || '', [
                    PERMISSION_USER_VIEW,
                    PERMISSION_USER_MANAGEMENT,
                  ]),
                },
                {
                  title: 'Danh sách hướng dẫn viên',
                  url: '/tour-guides',
                  icon: TicketsPlaneIcon,
                  isHide: !hasAnyPermission(selectedMuseum?.id || '', [
                    PERMISSION_USER_VIEW,
                    PERMISSION_USER_MANAGEMENT,
                  ]),
                },
              ],
            },
          ]}
        />

        <SidebarGroupItem
          groupLabel="Quản lý lịch trình & sự kiện"
          items={[
            {
              title: 'Quản lý sự kiện',
              url: '/event',
              icon: CalendarRangeIcon,
              items: [
                {
                  title: 'Danh sách sự kiện',
                  url: '/event',
                  icon: ListChecksIcon,
                  isHide: !hasAnyPermission(selectedMuseum?.id || '', [
                    PERMISSION_EVENT_VIEW,
                    PERMISSION_EVENT_MANAGEMENT,
                  ]),
                },
                {
                  title: 'Tạo sự kiện mới',
                  url: '/event/create',
                  icon: PlusIcon,
                  isHide: !hasAnyPermission(selectedMuseum?.id || '', [
                    PERMISSION_EVENT_CREATE,
                    PERMISSION_EVENT_MANAGEMENT,
                  ]),
                },
              ],
            },
          ]}
        />

        <SidebarGroupItem
          groupLabel="Quản lý tài chính"
          items={[
            {
              title: 'Quản lý thanh toán',
              url: '/payment',
              icon: WalletIcon,
              isHide: !hasAnyPermission(selectedMuseum?.id || '', [PERMISSION_PAYMENT_MANAGEMENT]),
              items: [
                {
                  title: 'Ví bảo tàng',
                  url: '/payment',
                  icon: WalletIcon,
                },
              ],
            },
          ]}
        />

        <SidebarGroupItem
          groupLabel="Quản lý nội dung tour ảo"
          items={[
            {
              title: 'Quản lý tour ảo',
              url: '/virtual-tour',
              icon: GlobeIcon,
              // isHide: !hasAnyPermission(selectedMuseum?.id || '', [PERMISSION_TOUR_VIEW, PERMISSION_TOUR_MANAGEMENT]),
              items: [
                {
                  title: 'Danh sách tour ảo',
                  url: '/virtual-tour',
                  icon: ListChecksIcon,
                  // isHide: !hasAnyPermission(selectedMuseum?.id || '', [
                  //   PERMISSION_TOUR_VIEW,
                  //   PERMISSION_TOUR_MANAGEMENT,
                  // ]),
                },
                {
                  title: 'Tạo tour ảo mới',
                  url: '/virtual-tour/studio/create',
                  icon: PlusIcon,
                  isHide: !hasAnyPermission(selectedMuseum?.id || '', [
                    PERMISSION_TOUR_CREATE,
                    PERMISSION_TOUR_MANAGEMENT,
                  ]),
                },
              ],
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter className="border-t-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className={twMerge(sidebarButtonClasses, 'font-medium')}>
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
    isHide?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isHide?: boolean;
    }[];
  }[];
}) => {
  return (
    <SidebarGroup className="font-medium">
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
      <SidebarMenu>
        {items
          .filter((item) => {
            console.log(item.title, item.isHide);
            return item.isHide !== true;
          })
          .map((item) => (
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
    isHide?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isHide?: boolean;
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
            {item.items
              ?.filter((item) => item.isHide !== true)
              .map((subItem) => (
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
