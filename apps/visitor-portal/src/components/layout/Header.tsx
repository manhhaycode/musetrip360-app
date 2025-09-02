'use client';

import { Button, buttonVariants } from '@musetrip360/ui-core/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@musetrip360/ui-core/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@musetrip360/ui-core/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@musetrip360/ui-core/avatar';
import {
  Calendar,
  Globe,
  GraduationCap,
  Home,
  Info,
  LogOut,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  User,
  UserIcon,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { useUserStore } from '@musetrip360/user-management/state';
import { useAuthActionContext, useAuthStore, useIsAuthenticated } from '@musetrip360/auth-system/state';
import { cn } from '@musetrip360/ui-core/utils';
import { NotificationBellContainer } from './NotificationBellContainer';
import { getQueryClient } from '@musetrip360/query-foundation';
import { GlobalSearchAutocomplete } from '../search/GlobalSearchAutocomplete';

export function Header() {
  const isAuthenticated = useIsAuthenticated();
  const { user, resetStore: resetUserStore } = useUserStore();
  const { modalControl: authController } = useAuthActionContext();

  const handleLogout = () => {
    useAuthStore.getState().resetStore();
    resetUserStore();
    getQueryClient().clear();
  };

  const handleLogin = () => {
    authController?.open('login');
  };

  const handleRegister = () => {
    authController?.open('register');
  };

  const getInitials = (fullName?: string) => {
    return (
      fullName
        ?.split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .toUpperCase() || 'U'
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">MuseTrip360</h1>
            <p className="text-xs text-muted-foreground">Digital Museum Platform</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden justify-start lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={twMerge(buttonVariants({ variant: 'ghost' }), '!flex-row')}>
                <Link href="/">
                  <Home className="mr-2 h-6 w-6 hover:text-primary" />
                  Trang chủ
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* <NavigationMenuItem>
              <NavigationMenuTrigger
                className={twMerge(
                  buttonVariants({ variant: 'ghost' }),
                  '!flex-row bg-transparent data-[state=open]:bg-accent data-[state=open]:text-primary-foreground'
                )}
              >
                <MapPin className="mr-2 h-6 w-6 hover:text-primary" />
                Bảo tàng
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <div className="rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                      <Globe className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">Khám phá bảo tàng</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Tìm hiểu các bảo tàng nổi tiếng trên thế giới
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Danh mục</div>
                    <div className="grid gap-1">
                      <NavigationMenuLink asChild>
                        <Link href="/museum/art">
                          <div className="text-sm font-medium leading-none">Nghệ thuật</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Bảo tàng nghệ thuật và triển lãm
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/museum/history">
                          <div className="text-sm font-medium leading-none">Lịch sử</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Di tích lịch sử và văn hóa
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/museum/science">
                          <div className="text-sm font-medium leading-none">Khoa học</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Khoa học và công nghệ
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem> */}

            {/* <NavigationMenuItem>
              <NavigationMenuLink asChild className={twMerge(buttonVariants({ variant: 'ghost' }), '!flex-row')}>
                <Link href="/event">
                  <Calendar className="mr-2 h-6 w-6 hover:text-primary" />
                  Sự kiện
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem> */}

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={twMerge(buttonVariants({ variant: 'ghost' }), '!flex-row')}>
                <Link href="/chatbot">
                  <GraduationCap className="mr-2 h-6 w-6 hover:text-primary" />
                  Chatbot
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* <NavigationMenuItem>
              <NavigationMenuLink asChild className={twMerge(buttonVariants({ variant: 'ghost' }), '!flex-row')}>
                <Link href="/stream">
                  <Video className="mr-2 h-6 w-6 hover:text-primary" />
                  Streaming
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem> */}

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={twMerge(buttonVariants({ variant: 'ghost' }), '!flex-row')}>
                <Link href="/contact">
                  <Phone className="mr-2 h-6 w-6 hover:text-primary" />
                  Liên hệ
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search and Auth */}
        <div className="flex items-center gap-2">
          {/* Global Search Autocomplete */}
          <GlobalSearchAutocomplete className="hidden md:block" placeholder="Tìm bảo tàng, sự kiện..." />

          {/* Search Button for Mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* Auth Buttons */}
          {isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-2">
              <NotificationBellContainer />
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
                    <Link href="/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Thông tin cá nhân</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Đơn hàng của tôi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/event/user" className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Sự kiện của tôi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button onClick={handleLogin} leftIcon={<User className="h-4 w-4" />}>
                Đăng nhập
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Điều hướng MuseTrip360</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <nav className="grid gap-2">
                  <Button variant="link" className="justify-start">
                    Trang chủ
                  </Button>
                  <Link href="/stream" className={twMerge(buttonVariants({ variant: 'link' }), 'justify-start')}>
                    <Video className="mr-2 h-4 w-4" />
                    Streaming
                  </Link>
                  <Button variant="link" className="justify-start">
                    <Info className="mr-2 h-4 w-4" />
                    Giới thiệu
                  </Button>
                  <Button variant="link" className="justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    Liên hệ
                  </Button>
                </nav>
                <div className="border-t pt-4 space-y-2">
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || ''} alt={user?.fullName} />
                          <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm">{user.fullName ? user.fullName : user.email}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <Link href="/profile" className={cn(buttonVariants({ variant: 'outline' }), 'justify-start')}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        Thông tin cá nhân
                      </Link>
                      <Link href="/orders" className={cn(buttonVariants({ variant: 'outline' }), 'justify-start')}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Đơn hàng của tôi
                      </Link>
                      <Button
                        variant="outline"
                        className="justify-start text-red-600 hover:text-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" onClick={handleLogin}>
                        <User className="mr-2 h-4 w-4" />
                        Đăng nhập
                      </Button>
                      <Button className="w-full" onClick={handleRegister}>
                        Đăng ký
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
