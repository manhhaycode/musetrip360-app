'use client';

import { Button, buttonVariants } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@musetrip360/ui-core/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@musetrip360/ui-core/sheet';
import { Globe, Search, Menu, User, MapPin, Calendar, GraduationCap, Info, Phone, Home } from 'lucide-react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

export function Header() {
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
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={twMerge(buttonVariants({ variant: 'ghost' }), '!flex-row')}>
                <Link href="/">
                  <Home className="mr-2 h-6 w-6 hover:text-primary" />
                  Trang chủ
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
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
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={twMerge(buttonVariants({ variant: 'ghost' }), '!flex-row')}>
                <Link href="/event">
                  <Calendar className="mr-2 h-6 w-6 hover:text-primary" />
                  Sự kiện
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={twMerge(buttonVariants({ variant: 'ghost' }), '!flex-row')}>
                <Link href="/education">
                  <GraduationCap className="mr-2 h-6 w-6 hover:text-primary" />
                  Giáo dục
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={twMerge(buttonVariants({ variant: 'ghost' }), '!flex-row')}>
                <Link href="/about">
                  <Info className="mr-2 h-6 w-6 hover:text-primary" />
                  Giới thiệu
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

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
          {/* Search Input */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm bảo tàng, sự kiện..." className="pl-8 w-64" />
          </div>

          {/* Search Button for Mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button leftIcon={<User className="h-4 w-4" />}>Đăng nhập</Button>
          </div>

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
                  <Button variant="link" className="justify-start">
                    <MapPin className="mr-2 h-4 w-4" />
                    Bảo tàng
                  </Button>
                  <Button variant="link" className="justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Sự kiện
                  </Button>
                  <Button variant="link" className="justify-start">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Giáo dục
                  </Button>
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
                  <Button variant="outline" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Đăng nhập
                  </Button>
                  <Button className="w-full">Đăng ký</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
