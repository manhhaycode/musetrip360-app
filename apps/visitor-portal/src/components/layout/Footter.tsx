import { Separator } from '@musetrip360/ui-core/separator';
import { Globe, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 animate-slide-up">
      <div className="container mx-auto max-w-screen-2xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">MuseTrip360</span>
            </div>
            <p className="text-slate-300">Nền tảng bảo tàng số hàng đầu thế giới với công nghệ thực tế ảo tiên tiến.</p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Khám phá</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="/museums" className="hover:text-white transition-colors">
                  Bảo tàng
                </a>
              </li>
              <li>
                <a href="/events" className="hover:text-white transition-colors">
                  Sự kiện
                </a>
              </li>
              <li>
                <a href="/tours" className="hover:text-white transition-colors">
                  Tour ảo
                </a>
              </li>
              <li>
                <a href="/collections" className="hover:text-white transition-colors">
                  Bộ sưu tập
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="/help" className="hover:text-white transition-colors">
                  Trợ giúp
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Chính sách riêng tư
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +84 (0) 123 456 789
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@musetrip360.com
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Hồ Chí Minh, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-700 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-slate-300">
          <p>&copy; 2024 MuseTrip360. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/terms" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">
              Bảo mật
            </a>
            <a href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
