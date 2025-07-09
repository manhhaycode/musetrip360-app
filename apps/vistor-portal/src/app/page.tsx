'use client';

import { FeaturedMuseums } from '@/components/sections/FeaturedMuseums';
import { HeroSection } from '@/components/sections/HeroSection';
import { UpcomingEvents } from '@/components/sections/UpcomingEvents';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { ArrowRight, Building2, Camera, Globe, Headset, Heart, Play, Quote, Star, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Bảo tàng</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Tour ảo</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Người dùng</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedMuseums />
      <UpcomingEvents />

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              ✨ Tính năng nổi bật
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4 lg:text-4xl">
              Trải nghiệm{' '}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
                tương lai
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Khám phá bảo tàng với công nghệ tiên tiến nhất thế giới
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Camera,
                title: '360° Virtual Tours',
                description: 'Khám phá mọi góc độ với công nghệ 360° chất lượng cao',
                gradient: 'from-blue-500 to-purple-600',
              },
              {
                icon: Headset,
                title: 'VR Experience',
                description: 'Trải nghiệm thực tế ảo hoàn toàn nhập vai',
                gradient: 'from-purple-500 to-pink-600',
              },
              {
                icon: Zap,
                title: 'AI Guide',
                description: 'Hướng dẫn viên AI thông minh và tương tác',
                gradient: 'from-orange-500 to-red-600',
              },
              {
                icon: Globe,
                title: 'Global Access',
                description: 'Truy cập bảo tàng từ khắp nơi trên thế giới',
                gradient: 'from-green-500 to-teal-600',
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;

              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-500">
                  <CardContent className="p-6 text-center space-y-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              🚀 Cách thức hoạt động
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4 lg:text-4xl">
              Chỉ{' '}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
                3 bước đơn giản
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Chọn bảo tàng',
                description: 'Duyệt qua hàng trăm bảo tàng từ khắp nơi trên thế giới',
                icon: Building2,
              },
              {
                step: '02',
                title: 'Bắt đầu tour ảo',
                description: 'Khám phá với công nghệ 360° và VR tiên tiến',
                icon: Play,
              },
              {
                step: '03',
                title: 'Tận hưởng trải nghiệm',
                description: 'Học hỏi và khám phá với AI guide thông minh',
                icon: Heart,
              },
            ].map((step, index) => {
              const IconComponent = step.icon;

              return (
                <div key={index} className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-purple-600 mx-auto flex items-center justify-center text-white font-bold text-2xl">
                      {step.step}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-12 h-12 rounded-full bg-background border-4 border-primary flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mt-8">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              💬 Người dùng nói gì
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4 lg:text-4xl">
              Trải nghiệm{' '}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
                tuyệt vời
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Mai Linh',
                role: 'Giáo viên',
                avatar: '👩‍🏫',
                content: 'MuseTrip360 đã giúp tôi mang thế giới bảo tàng vào lớp học. Học sinh rất thích!',
                rating: 5,
              },
              {
                name: 'David Johnson',
                role: 'Du khách',
                avatar: '👨‍💼',
                content: 'Amazing experience! I visited the Louvre from my home in New York. Incredible technology!',
                rating: 5,
              },
              {
                name: 'Thanh Hương',
                role: 'Sinh viên',
                avatar: '👩‍🎓',
                content: 'Nghiên cứu lịch sử trở nên thú vị hơn bao giờ hết với tour ảo 360°.',
                rating: 5,
              },
            ].map((testimonial, index) => {
              return (
                <Card key={index} className="p-6">
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section for Museums */}
      <section className="py-20 bg-gradient-to-r from-primary via-purple-600 to-secondary">
        <div className="container mx-auto max-w-screen-2xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 lg:text-4xl">Bạn là quản lý bảo tàng?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Tham gia nền tảng MuseTrip360 để đưa bảo tàng của bạn đến với hàng triệu người trên thế giới
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary">
              Đăng ký ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
