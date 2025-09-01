'use client';

import React, { useState } from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Input } from '@musetrip360/ui-core/input';
import { Label } from '@musetrip360/ui-core/label';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Badge } from '@musetrip360/ui-core/badge';
import { toast } from '@musetrip360/ui-core';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: 'Hồ Chí Minh, Việt Nam',
      color: 'text-blue-600',
    },
    {
      icon: Phone,
      title: 'Điện thoại',
      content: '+84 123 456 789',
      color: 'text-green-600',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@musetrip360.vn',
      color: 'text-purple-600',
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 6: 8:00 - 17:30',
      color: 'text-orange-600',
    },
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', href: '#', color: 'text-blue-600' },
    { icon: Instagram, name: 'Instagram', href: '#', color: 'text-pink-600' },
    { icon: Youtube, name: 'Youtube', href: '#', color: 'text-red-600' },
    { icon: Linkedin, name: 'LinkedIn', href: '#', color: 'text-blue-700' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('Tin nhắn của bạn đã được gửi thành công!');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container mx-auto max-w-screen-xl px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Phone className="w-4 h-4 mr-2" />
              Liên hệ với chúng tôi
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Chúng tôi luôn sẵn sàng
              <br />
              lắng nghe bạn
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Có câu hỏi về dịch vụ? Muốn hợp tác? Hoặc chỉ đơn giản là muốn chia sẻ ý kiến? Hãy liên hệ với chúng tôi
              bằng cách nào bạn thấy thuận tiện nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 text-center">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-background border border-border group-hover:scale-110 transition-transform duration-300">
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">{info.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-primary" />
                  Gửi tin nhắn cho chúng tôi
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Điền thông tin vào form bên dưới và chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.
                </p>
              </div>

              <Card className="border-0 shadow-lg bg-background/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập họ và tên của bạn"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0123 456 789"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Chủ đề *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          placeholder="Chủ đề tin nhắn"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Nội dung *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Nhập nội dung tin nhắn của bạn..."
                        className="resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full py-3 text-lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Gửi tin nhắn
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Company Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <Building className="w-8 h-8 text-primary" />
                  Về MuseTrip360
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    MuseTrip360 là nền tảng công nghệ hàng đầu Việt Nam trong lĩnh vực số hóa bảo tàng và di sản văn
                    hóa. Chúng tôi cam kết mang đến những trải nghiệm tuyệt vời nhất cho người dùng thông qua công nghệ
                    thực tế ảo và trí tuệ nhân tạo.
                  </p>
                  <p>
                    Với đội ngũ chuyên gia giàu kinh nghiệm và đam mê, chúng tôi không ngừng đổi mới để bảo tồn và phát
                    huy giá trị di sản văn hóa dân tộc trong thời đại số.
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Kết nối với chúng tôi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="p-3 rounded-full border border-border hover:border-primary transition-colors duration-300 group"
                        aria-label={social.name}
                      >
                        <social.icon
                          className={`w-5 h-5 ${social.color} group-hover:scale-110 transition-transform duration-300`}
                        />
                      </a>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Theo dõi chúng tôi để cập nhật những tin tức mới nhất về các triển lãm và tính năng mới của
                    MuseTrip360.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Câu hỏi thường gặp</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Một số câu hỏi phổ biến mà chúng tôi thường nhận được
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">MuseTrip360 có miễn phí không?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Có, tính năng cơ bản của MuseTrip360 hoàn toàn miễn phí. Chúng tôi cũng có các gói premium với nhiều
                  tính năng nâng cao.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Làm thế nào để trở thành đối tác?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vui lòng gửi email cho chúng tôi tại contact@musetrip360.vn với thông tin về bảo tàng và mong muốn hợp
                  tác của bạn.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Có hỗ trợ thiết bị di động không?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Có, MuseTrip360 có ứng dụng di động cho cả iOS và Android, cũng như website responsive trên mọi thiết
                  bị.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Dữ liệu của tôi có an toàn không?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chúng tôi áp dụng các tiêu chuẩn bảo mật cao nhất để bảo vệ thông tin cá nhân và dữ liệu của người
                  dùng.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
