import { Separator } from '@musetrip360/ui-core/separator';
import { Globe, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

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
                <Link href="/search?type=Museum" className="hover:text-white transition-colors">
                  Bảo tàng
                </Link>
              </li>
              <li>
                <Link href="/search?type=Event" className="hover:text-white transition-colors">
                  Sự kiện
                </Link>
              </li>
              <li>
                <Link href="/search?type=VirtualTour" className="hover:text-white transition-colors">
                  Tour ảo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Chính sách riêng tư
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +84 123 456 789
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@musetrip360.vn
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
            <Link href="/" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Bảo mật
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
