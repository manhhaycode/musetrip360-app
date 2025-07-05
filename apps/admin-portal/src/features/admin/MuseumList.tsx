import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@musetrip360/ui-core';
import { Building2, Eye, Filter, MapPin, Plus, Star, Users } from 'lucide-react';
import { useState } from 'react';

export default function MuseumList() {
  const [statusFilter, setStatusFilter] = useState('all');

  const museums = [
    {
      id: 1,
      name: 'Bảo tàng Lịch sử Việt Nam',
      location: 'Hà Nội',
      status: 'active',
      visitors: '120K',
      rating: 4.8,
      category: 'Lịch sử',
      established: '1958',
    },
    {
      id: 2,
      name: 'Bảo tàng Mỹ thuật TP.HCM',
      location: 'TP. Hồ Chí Minh',
      status: 'active',
      visitors: '95K',
      rating: 4.6,
      category: 'Mỹ thuật',
      established: '1987',
    },
    {
      id: 3,
      name: 'Bảo tàng Dân tộc học Đà Nẵng',
      location: 'Đà Nẵng',
      status: 'maintenance',
      visitors: '78K',
      rating: 4.5,
      category: 'Dân tộc học',
      established: '1995',
    },
    {
      id: 4,
      name: 'Bảo tàng Cách mạng Huế',
      location: 'Thừa Thiên Huế',
      status: 'active',
      visitors: '65K',
      rating: 4.4,
      category: 'Lịch sử',
      established: '1975',
    },
    {
      id: 5,
      name: 'Bảo tàng Hồ Chí Minh',
      location: 'TP. Hồ Chí Minh',
      status: 'active',
      visitors: '89K',
      rating: 4.7,
      category: 'Lịch sử',
      established: '1990',
    },
  ];

  const filteredMuseums = museums.filter((museum) => {
    const matchesStatus = statusFilter === 'all' || museum.status === statusFilter;
    return matchesStatus;
  });

  const clearFilters = () => {
    setStatusFilter('all');
  };

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
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng bảo tàng</p>
                <p className="text-3xl font-bold">142</p>
              </div>
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#feb47b' }}
              >
                <Building2 className="h-6 w-6" style={{ color: '#ff7e5f' }} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
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
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
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
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
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

      {/* Enhanced Filter Section */}
      <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Lọc theo:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-background border-border">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="maintenance">Bảo trì</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="bg-muted/30">
                {filteredMuseums.length} kết quả
              </Badge>
            </div>
            {statusFilter !== 'all' && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Museum Table */}
      <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <CardHeader>
          <CardTitle>Danh sách Bảo tàng ({filteredMuseums.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-muted/50">
                <TableHead className="text-muted-foreground">Bảo tàng</TableHead>
                <TableHead className="text-muted-foreground">Vị trí</TableHead>
                <TableHead className="text-muted-foreground">Danh mục</TableHead>
                <TableHead className="text-muted-foreground">Lượt thăm</TableHead>
                <TableHead className="text-muted-foreground">Đánh giá</TableHead>
                <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                <TableHead className="text-muted-foreground">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMuseums.map((museum) => (
                <TableRow key={museum.id} className="border-muted/50 hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{museum.name}</p>
                        <p className="text-sm text-muted-foreground">Thành lập: {museum.established}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{museum.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/30">
                      {museum.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{museum.visitors}</span>
                    <span className="text-sm text-muted-foreground ml-1">lượt thăm</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{museum.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={museum.status === 'active' ? 'default' : 'secondary'}
                      className={
                        museum.status === 'active'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }
                    >
                      {museum.status === 'active' ? 'Hoạt động' : 'Bảo trì'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Building2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
