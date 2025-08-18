// Mock data for MuseTrip360 Mobile App

export interface Museum {
  id: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  price: string;
  image: string;
  category: string;
  categoryIcon: string;
  openingHours: string;
  phone: string;
  website: string;
  features: string[];
  galleries: string[];
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  image: string;
  period: string;
  category: string;
  museumId: string;
  museumName: string;
  discovered: string;
  rating: number;
}

export interface TourOnline {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  rating: number;
  price: string;
  museumId: string;
  museumName: string;
  viewCount: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  price: string;
  museumId: string;
  museumName: string;
  location: string;
  category: string;
}

// Featured Museums
export const featuredMuseums: Museum[] = [
  {
    id: '1',
    name: 'Bảo tàng Lịch sử Việt Nam',
    description: 'Bảo tàng trưng bày lịch sử dân tộc Việt Nam từ thời tiền sử đến hiện tại',
    location: 'Số 1 Phạm Ngũ Lão, Hoàn Kiếm, Hà Nội',
    latitude: 21.0285,
    longitude: 105.8542,
    rating: 4.5,
    reviewCount: 1250,
    price: '40.000 VNĐ',
    image: 'https://images.unsplash.com/photo-1554757387-ea8f60cde1f0?w=400',
    category: 'Lịch sử',
    categoryIcon: '🏛️',
    openingHours: '8:00 - 17:00 (Thứ 2 - Chủ nhật)',
    phone: '024 3825 2853',
    website: 'www.baotanglichsu.vn',
    features: ['WiFi miễn phí', 'Hướng dẫn viên', 'Cửa hàng lưu niệm'],
    galleries: ['Thời tiền sử', 'Thời phong kiến', 'Thời hiện đại'],
  },
  {
    id: '2',
    name: 'Bảo tàng Mỹ thuật Việt Nam',
    description: 'Trưng bày các tác phẩm mỹ thuật của các họa sĩ nổi tiếng Việt Nam',
    location: 'Số 66 Nguyễn Thái Học, Ba Đình, Hà Nội',
    latitude: 21.0358,
    longitude: 105.8397,
    rating: 4.3,
    reviewCount: 890,
    price: '30.000 VNĐ',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
    category: 'Mỹ thuật',
    categoryIcon: '🎨',
    openingHours: '8:30 - 17:00 (Thứ 3 - Chủ nhật)',
    phone: '024 3733 2131',
    website: 'www.vnfam.vn',
    features: ['Triển lãm tương tác', 'Workshop', 'Không gian sáng tạo'],
    galleries: ['Hội họa truyền thống', 'Điêu khắc', 'Mỹ thuật đương đại'],
  },
  {
    id: '3',
    name: 'Bảo tàng Dân tộc học Việt Nam',
    description: 'Tìm hiểu về 54 dân tộc anh em của Việt Nam',
    location: 'Đường Nguyễn Văn Huyên, Cầu Giấy, Hà Nội',
    latitude: 21.0364,
    longitude: 105.799,
    rating: 4.7,
    reviewCount: 2100,
    price: '25.000 VNĐ',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    category: 'Dân tộc học',
    categoryIcon: '🎭',
    openingHours: '8:30 - 17:30 (Thứ 2 - Chủ nhật)',
    phone: '024 3756 2193',
    website: 'www.vme.org.vn',
    features: ['Nhà sàn truyền thống', 'Biểu diễn văn hóa', 'Làng văn hóa'],
    galleries: ['Trang phục dân tộc', 'Nhạc cụ truyền thống', 'Kiến trúc nhà ở'],
  },
  {
    id: '4',
    name: 'Bảo tàng Hồ Chí Minh',
    description: 'Trưng bày về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh',
    location: 'Số 19 Ngọc Hà, Ba Đình, Hà Nội',
    latitude: 21.0364,
    longitude: 105.834,
    rating: 4.6,
    reviewCount: 3200,
    price: 'Miễn phí',
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400',
    category: 'Lịch sử',
    categoryIcon: '🏛️',
    openingHours: '8:00 - 11:30, 14:00 - 16:30 (Thứ 2 - Chủ nhật)',
    phone: '024 3845 5435',
    website: 'www.baotanghochiminh.vn',
    features: ['Tham quan miễn phí', 'Audio guide', 'Thư viện tư liệu'],
    galleries: ['Thời thơ ấu', 'Hoạt động cách mạng', 'Di sản tư tưởng'],
  },
  {
    id: '5',
    name: 'Bảo tàng Không quân Việt Nam',
    description: 'Trưng bày lịch sử và hiện vật của lực lượng Không quân nhân dân Việt Nam',
    location: 'Đường Trường Chinh, Đống Đa, Hà Nội',
    latitude: 21.0122,
    longitude: 105.8342,
    rating: 4.4,
    reviewCount: 670,
    price: '20.000 VNĐ',
    image: 'https://images.unsplash.com/photo-1574701148062-adf3d51b223f?w=400',
    category: 'Quân sự',
    categoryIcon: '✈️',
    openingHours: '7:30 - 16:30 (Thứ 2 - Thứ 6)',
    phone: '024 3577 4533',
    website: 'www.airforcemuseum.vn',
    features: ['Máy bay thật', 'Mô phỏng buồng lái', 'Trải nghiệm VR'],
    galleries: ['Máy bay chiến đấu', 'Hệ thống phòng không', 'Lịch sử không quân'],
  },
];

// Featured Artifacts
export const featuredArtifacts: Artifact[] = [
  {
    id: '1',
    name: 'Trống đồng Ngọc Lũ',
    description: 'Trống đồng được phát hiện tại Ngọc Lũ, Hà Nội năm 1902',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400',
    period: 'Thời Đông Sơn (VII - I TCN)',
    category: 'Khảo cổ học',
    museumId: '1',
    museumName: 'Bảo tàng Lịch sử Việt Nam',
    discovered: '1902',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Tranh lụa "Thiếu nữ bên hoa huệ"',
    description: 'Tác phẩm nổi tiếng của họa sĩ Tô Ngọc Vân',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    period: 'Thế kỷ XX',
    category: 'Hội họa',
    museumId: '2',
    museumName: 'Bảo tàng Mỹ thuật Việt Nam',
    discovered: '1943',
    rating: 4.6,
  },
];

// Online Tours
export const onlineTours: TourOnline[] = [
  {
    id: '1',
    title: 'Tour ảo Bảo tàng Lịch sử Việt Nam',
    description: 'Khám phá lịch sử dân tộc Việt Nam qua tour ảo 360°',
    thumbnail: 'https://images.unsplash.com/photo-1554757387-ea8f60cde1f0?w=400',
    duration: '45 phút',
    rating: 4.5,
    price: '50.000 VNĐ',
    museumId: '1',
    museumName: 'Bảo tàng Lịch sử Việt Nam',
    viewCount: 15240,
  },
  {
    id: '2',
    title: 'Khám phá nghệ thuật Việt Nam',
    description: 'Tour tương tác khám phá các tác phẩm mỹ thuật tiêu biểu',
    thumbnail: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
    duration: '30 phút',
    rating: 4.3,
    price: '40.000 VNĐ',
    museumId: '2',
    museumName: 'Bảo tàng Mỹ thuật Việt Nam',
    viewCount: 8760,
  },
];

// Upcoming Events
export const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Triển lãm "1000 năm Thăng Long - Hà Nội"',
    description: 'Triển lãm đặc biệt kỷ niệm 1000 năm Thăng Long - Hà Nội',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    date: '2024-01-15',
    time: '9:00',
    price: 'Miễn phí',
    museumId: '1',
    museumName: 'Bảo tàng Lịch sử Việt Nam',
    location: 'Tầng 2, Bảo tàng Lịch sử Việt Nam',
    category: 'Triển lãm',
  },
  {
    id: '2',
    title: 'Workshop "Vẽ tranh dân gian"',
    description: 'Học cách vẽ tranh dân gian Việt Nam cùng nghệ nhân',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
    date: '2024-01-20',
    time: '14:00',
    price: '100.000 VNĐ',
    museumId: '2',
    museumName: 'Bảo tàng Mỹ thuật Việt Nam',
    location: 'Phòng workshop, Tầng 3',
    category: 'Workshop',
  },
  {
    id: '3',
    title: 'Biểu diễn múa dân tộc',
    description: 'Chương trình biểu diễn múa của các dân tộc vùng núi phía Bắc',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400',
    date: '2024-01-25',
    time: '15:30',
    price: '30.000 VNĐ',
    museumId: '3',
    museumName: 'Bảo tàng Dân tộc học Việt Nam',
    location: 'Sân khấu ngoài trời',
    category: 'Biểu diễn',
  },
];

// Search utilities
export const searchCategories = [
  { id: 'all', label: 'Tất cả', icon: '🔍' },
  { id: 'museums', label: 'Bảo tàng', icon: '🏛️' },
  { id: 'artifacts', label: 'Hiện vật', icon: '🏺' },
  { id: 'tours', label: 'Tour online', icon: '🎧' },
  { id: 'events', label: 'Sự kiện', icon: '📅' },
];

export const museumCategories = [
  { id: 'history', label: 'Lịch sử', icon: '🏛️', color: '#3B82F6' },
  { id: 'art', label: 'Mỹ thuật', icon: '🎨', color: '#EF4444' },
  { id: 'ethnology', label: 'Dân tộc học', icon: '🎭', color: '#10B981' },
  { id: 'military', label: 'Quân sự', icon: '✈️', color: '#8B5CF6' },
  { id: 'nature', label: 'Tự nhiên', icon: '🌿', color: '#059669' },
  { id: 'science', label: 'Khoa học', icon: '🔬', color: '#DC2626' },
];

// All search results combined
export const allSearchResults = [
  ...featuredMuseums.map((m) => ({ ...m, type: 'museum' as const })),
  ...featuredArtifacts.map((a) => ({ ...a, type: 'artifact' as const })),
  ...onlineTours.map((t) => ({ ...t, type: 'tour' as const })),
  ...upcomingEvents.map((e) => ({ ...e, type: 'event' as const })),
];

// Search function
export const searchData = (query: string, type: string = 'all') => {
  let results = allSearchResults;

  if (type !== 'all') {
    results = results.filter((item) => {
      switch (type) {
        case 'museums':
          return item.type === 'museum';
        case 'artifacts':
          return item.type === 'artifact';
        case 'tours':
          return item.type === 'tour';
        case 'events':
          return item.type === 'event';
        default:
          return true;
      }
    });
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter((item) => {
      const searchString = `${item.name || item.title} ${item.description}`.toLowerCase();
      return searchString.includes(lowerQuery);
    });
  }

  return results;
};
