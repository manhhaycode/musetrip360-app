'use client';

import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Globe, Play, Headset, Camera, Users, Star, MapPin, Clock, Eye } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.3 });
  const route = useRouter();
  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen px-20 overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-yellow-400/20 to-amber-400/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-orange-300/10 to-yellow-300/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-screen-2xl px-4">
          <div className="flex min-h-screen items-center">
            <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Content */}
              <div
                className={`flex flex-col justify-center space-y-8 ${
                  heroVisible ? 'animate-slide-left' : 'scroll-hidden-left'
                }`}
              >
                <Badge
                  variant="secondary"
                  className="w-fit bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                >
                  🌟 Nền tảng bảo tàng số #1 Việt Nam
                </Badge>

                <div className="space-y-6">
                  <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-6xl xl:text-7xl">
                    Khám phá{' '}
                    <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      Bảo tàng
                    </span>
                    <br />
                    thế giới từ nhà
                  </h1>

                  <p className="text-lg text-muted-foreground lg:text-xl">
                    Tham gia tour ảo 360°, khám phá hàng ngàn hiện vật quý hiếm và trải nghiệm văn hóa thế giới qua công
                    nghệ tiên tiến nhất.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    onClick={() => route.push('/search')}
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Bắt đầu tour ảo
                  </Button>
                  <Button variant="ghost" size="lg">
                    <Globe className="mr-2 h-5 w-5" />
                    Khám phá bảo tàng
                  </Button>
                </div>

                {/* Statistics */}
                <div
                  ref={statsRef}
                  className={`grid grid-cols-3 gap-6 pt-8 ${statsVisible ? 'animate-fade-in' : 'scroll-hidden'}`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600 lg:text-3xl">200+</div>
                    <div className="text-sm text-muted-foreground">Bảo tàng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 lg:text-3xl">50K+</div>
                    <div className="text-sm text-muted-foreground">Tour ảo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 lg:text-3xl">1M+</div>
                    <div className="text-sm text-muted-foreground">Người dùng</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Interactive Preview */}
              <div
                className={`flex items-center justify-center ${
                  heroVisible ? 'animate-slide-right' : 'scroll-hidden-right'
                }`}
              >
                <div className="relative w-full max-w-md">
                  {/* Main Preview Card */}
                  <Card className="relative overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-2xl dark:border-amber-800 dark:from-gray-900 dark:to-amber-950">
                    <CardContent className="p-0">
                      {/* Preview Image/Video Area */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900">
                        {/* Simulated 360° Viewer */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Globe className="h-16 w-16 text-amber-600 animate-spin [animation-duration:8s]" />
                            </div>
                          </div>
                        </div>

                        {/* Simulated Hotspots */}
                        <div className="absolute left-1/4 top-1/3 h-3 w-3 rounded-full bg-red-500 animate-pulse">
                          <div className="absolute -inset-1 rounded-full bg-red-500/30 animate-ping" />
                        </div>
                        <div className="absolute right-1/3 top-1/2 h-3 w-3 rounded-full bg-blue-500 animate-pulse">
                          <div className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping" />
                        </div>
                        <div className="absolute left-1/2 bottom-1/3 h-3 w-3 rounded-full bg-green-500 animate-pulse">
                          <div className="absolute -inset-1 rounded-full bg-green-500/30 animate-ping" />
                        </div>

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            onClick={() => route.push('/search')}
                            size="lg"
                            className="rounded-full bg-white/90 text-amber-600 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                          >
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>

                        {/* Quality Indicators */}
                        <div className="absolute right-4 top-4 flex flex-col gap-2">
                          <Badge className="bg-white/90 text-amber-700 shadow-sm">
                            <Eye className="mr-1 h-3 w-3" />
                            HD 360°
                          </Badge>
                          <Badge className="bg-white/90 text-purple-700 shadow-sm">
                            <Headset className="mr-1 h-3 w-3" />
                            VR Ready
                          </Badge>
                        </div>
                      </div>

                      {/* Preview Info */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">Bảo tàng Louvre</h3>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="mr-1 h-3 w-3" />
                              Paris, Pháp
                            </p>
                          </div>
                          <div className="flex items-center text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm font-medium">4.9</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            45 phút
                          </span>
                          <span className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            12.5K đã xem
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Floating Feature Cards */}
                  <div
                    className={`absolute -right-8 -top-4 transform transition-all duration-500 ${
                      heroVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                    }`}
                  >
                    <Card className="bg-white/95 shadow-lg backdrop-blur-sm dark:bg-gray-900/95">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                            <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">HD 360°</div>
                            <div className="text-xs text-muted-foreground">Ultra Clear</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div
                    className={`absolute -left-8 -bottom-4 transform transition-all duration-700 ${
                      heroVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                    }`}
                  >
                    <Card className="bg-white/95 shadow-lg backdrop-blur-sm dark:bg-gray-900/95">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                            <Headset className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">VR Ready</div>
                            <div className="text-xs text-muted-foreground">Immersive</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
