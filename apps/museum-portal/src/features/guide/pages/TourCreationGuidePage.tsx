import Divider from '@/components/Divider';
import { Card, Button, Badge } from '@musetrip360/ui-core';
import { BookOpenIcon, CameraIcon, UploadIcon, ApertureIcon } from 'lucide-react';
import { Link } from 'react-router';

const TourCreationGuidePage = () => {
  const equipmentList = [
    {
      name: 'Camera 360°',
      examples: 'Insta360, GoPro Max, Ricoh Theta',
      icon: <CameraIcon className="w-5 h-5" />,
      required: true,
    },
    {
      name: 'Gậy Camera 360°',
      examples: 'Gậy gắn ổn định để giảm thiểu rung lắc',
      icon: <ApertureIcon className="w-5 h-5" />,
      required: true,
    },
    {
      name: 'Thiết Bị Dự Phòng',
      examples: 'Thẻ nhớ phụ, pin dự phòng',
      icon: <ApertureIcon className="w-5 h-5" />,
      required: false,
    },
  ];

  const implementationSteps = [
    {
      title: 'Lắp Đặt Thiết Bị',
      description: 'Thiết lập camera 360° và thiết bị gắn kết của bạn',
      steps: [
        'Gắn camera 360° lên đầu gậy camera 360°',
        'Đảm bảo camera cân bằng và ổn định, không bị nghiêng',
        'Điều chỉnh chiều cao gậy theo không gian cần quay',
      ],
    },
    {
      title: 'Chụp Toàn Cảnh',
      description: 'Ghi lại toàn bộ môi trường 360°',
      steps: [
        'Bật camera 360° và chọn chế độ chụp ảnh hoặc quay video toàn cảnh',
        'Đặt gậy ở trung tâm của không gian',
        'Chụp/quay trong vài giây để ghi lại toàn bộ góc nhìn 360°',
      ],
    },
    {
      title: 'Xuất Dữ Liệu Camera',
      description: 'Xử lý và chuẩn bị nội dung 360° của bạn',
      steps: [
        'Kết nối camera với điện thoại hoặc máy tính',
        'Tải xuống dữ liệu (ảnh hoặc video 360°)',
        'Hệ thống sẽ tạo ra sáu tệp hình ảnh tương ứng: Trước, Sau, Trái, Phải, Trên, Dưới',
      ],
    },
    {
      title: 'Tải Lên Nền Tảng',
      description: 'Sử dụng nền tảng MuseTrip360 để tạo tour ảo của bạn',
      steps: [
        'Truy cập trang chủ MuseTrip360',
        'Đăng nhập bằng tài khoản có quyền truy cập',
        'Vào "Quản lý tour ảo"',
        'Chọn "Tạo tour ảo mới"',
        'Khởi tạo thông tin tour ảo',
        'Tạo cảnh 360° trong tour ảo',
        'Tải lên tất cả sáu mặt tương ứng của cảnh',
        'Nhấp "Upload Cubemap" để tải lên và xem cảnh 360°',
        'Kết nối với các cảnh khác để tạo thành một tour ảo hoàn chỉnh',
      ],
    },
  ];

  const cubemapFaces = [
    { name: 'Trước', english: 'Front', color: 'bg-blue-100 text-blue-800' },
    { name: 'Sau', english: 'Back', color: 'bg-green-100 text-green-800' },
    { name: 'Trái', english: 'Left', color: 'bg-purple-100 text-purple-800' },
    { name: 'Phải', english: 'Right', color: 'bg-orange-100 text-orange-800' },
    { name: 'Trên', english: 'Top', color: 'bg-red-100 text-red-800' },
    { name: 'Dưới', english: 'Bottom', color: 'bg-yellow-100 text-yellow-800' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpenIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hướng Dẫn Tạo Tour Ảo 360°</h1>
            <p className="text-gray-600 mt-1">Hướng dẫn tạo Tour Ảo trên MuseTrip360</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <UploadIcon className="w-4 h-4" />
          Tạo Tour Mới
        </Button>
      </div>

      <Divider />

      {/* Introduction Section */}
      <div className="my-8">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">📘 Giới thiệu</h2>
          <p className="text-blue-800 leading-relaxed">
            Tính năng này cho phép người dùng <strong>tải lên sáu hình ảnh tương ứng với sáu mặt</strong>: Trước, Sau,
            Trái, Phải, Trên và Dưới, được sử dụng để tạo cảnh 3D, tour ảo hoặc lưu trữ dữ liệu không gian.
          </p>
        </Card>
      </div>

      {/* Equipment Preparation */}
      <div className="my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🛠️ Chuẩn bị thiết bị (Equipment Preparation)</h2>
        <p className="text-gray-600 mb-6">Bảo tàng có thể tự chuẩn bị hoặc sử dụng dịch vụ bên ngoài</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {equipmentList.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.required && (
                      <Badge variant="destructive" className="text-xs">
                        Bắt buộc
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.examples}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-4 bg-amber-50 border-amber-200">
          <p className="text-amber-800">
            <strong>💡 Mẹo:</strong> Gậy Camera 360°, khi kết hợp với camera/thiết bị 360°, cho phép người dùng{' '}
            <strong>ghi lại toàn bộ góc nhìn toàn cảnh trong một lần chụp</strong>. Sau khi ghi, hình ảnh có thể được
            chia thành sáu mặt để đáp ứng yêu cầu sử dụng.
          </p>
        </Card>
      </div>

      {/* Cubemap Faces Info */}
      <div className="my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Sáu Mặt Cubemap</h2>
        <p className="text-gray-600 mb-4">Hệ thống sẽ tạo ra sáu tệp hình ảnh tương ứng này:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {cubemapFaces.map((face, index) => (
            <div key={index} className="text-center">
              <Badge className={`w-full py-2 ${face.color}`}>{face.name}</Badge>
              <p className="text-xs text-gray-500 mt-1">({face.english})</p>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Steps */}
      <div className="my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Các bước thực hiện (Implementation Steps)</h2>

        <div className="space-y-6">
          {implementationSteps.map((section, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h3>
                  <p className="text-gray-600 mb-4">{section.description}</p>

                  <div className="space-y-2">
                    {section.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="my-8 text-center">
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sẵn sàng tạo Tour Ảo của bạn?</h2>
          <p className="text-gray-600 mb-6">Làm theo các bước trên để tạo tour ảo 360° hấp dẫn cho bảo tàng của bạn</p>
          <div className="flex gap-4 justify-center">
            <Link to="/virtual-tour/studio/create">
              <Button className="flex items-center gap-2">
                <UploadIcon className="w-4 h-4" />
                Bắt đầu tạo tour
              </Button>
            </Link>
            <a
              href="https://res.cloudinary.com/dbmjyj2oy/raw/upload/v1756735761/crvuqo3x8nuuvmfq7ves.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4" />
                Xem thêm hướng dẫn
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TourCreationGuidePage;
