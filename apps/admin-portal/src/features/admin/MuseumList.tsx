import { Button, Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core';
import { Building2, Eye, MapPin, Plus, Star, Users } from 'lucide-react';

export default function MuseumList() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Danh sách Bảo tàng</h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng bảo tàng</p>
                <p className="text-3xl font-bold">142</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hoạt động</p>
                <p className="text-3xl font-bold text-green-600">128</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lượt thăm/tháng</p>
                <p className="text-3xl font-bold">2.4M</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đánh giá TB</p>
                <p className="text-3xl font-bold">4.7</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Museum List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Bảo tàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Bảo tàng Lịch sử Việt Nam',
                location: 'Hà Nội',
                status: 'active',
                visitors: '120K',
                rating: 4.8,
              },
              {
                name: 'Bảo tàng Mỹ thuật TP.HCM',
                location: 'TP. Hồ Chí Minh',
                status: 'active',
                visitors: '95K',
                rating: 4.6,
              },
              {
                name: 'Bảo tàng Dân tộc học Đà Nẵng',
                location: 'Đà Nẵng',
                status: 'maintenance',
                visitors: '78K',
                rating: 4.5,
              },
              {
                name: 'Bảo tàng Cách mạng Huế',
                location: 'Thừa Thiên Huế',
                status: 'active',
                visitors: '65K',
                rating: 4.4,
              },
              {
                name: 'Bảo tàng Hồ Chí Minh',
                location: 'TP. Hồ Chí Minh',
                status: 'active',
                visitors: '89K',
                rating: 4.7,
              },
            ].map((museum, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{museum.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{museum.location}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{museum.visitors} lượt thăm</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{museum.rating}</span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      museum.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {museum.status === 'active' ? 'Hoạt động' : 'Bảo trì'}
                  </div>
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
