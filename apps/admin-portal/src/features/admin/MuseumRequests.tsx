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
import { Building2, Check, Clock, Eye, Filter, X } from 'lucide-react';
import { useState } from 'react';

export default function MuseumRequests() {
  const [statusFilter, setStatusFilter] = useState('all');

  const requests = [
    {
      id: 1,
      name: 'Bảo tàng Văn hóa Dân gian',
      location: 'Hà Nội',
      status: 'pending',
      submittedDate: '2024-01-15',
      contact: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      category: 'Văn hóa dân gian',
    },
    {
      id: 2,
      name: 'Bảo tàng Khoa học Tự nhiên',
      location: 'TP. Hồ Chí Minh',
      status: 'approved',
      submittedDate: '2024-01-10',
      contact: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0987654321',
      category: 'Khoa học',
    },
    {
      id: 3,
      name: 'Bảo tàng Nghệ thuật Đương đại',
      location: 'Đà Nẵng',
      status: 'rejected',
      submittedDate: '2024-01-08',
      contact: 'Lê Văn C',
      email: 'levanc@example.com',
      phone: '0369852147',
      category: 'Nghệ thuật',
    },
    {
      id: 4,
      name: 'Bảo tàng Hàng không',
      location: 'Hà Nội',
      status: 'pending',
      submittedDate: '2024-01-20',
      contact: 'Phạm Thị D',
      email: 'phamthid@example.com',
      phone: '0147258369',
      category: 'Hàng không',
    },
    {
      id: 5,
      name: 'Bảo tàng Âm nhạc Truyền thống',
      location: 'Huế',
      status: 'pending',
      submittedDate: '2024-01-18',
      contact: 'Võ Văn E',
      email: 'vovane@example.com',
      phone: '0258147369',
      category: 'Âm nhạc',
    },
  ];

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesStatus;
  });

  const clearFilters = () => {
    setStatusFilter('all');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Chờ duyệt
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Đã duyệt
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Xét duyệt Bảo tàng</h1>
          <p className="text-muted-foreground">Quản lý các yêu cầu đăng ký bảo tàng mới</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng yêu cầu</p>
                <p className="text-3xl font-bold">{requests.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {requests.filter((r) => r.status === 'pending').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã duyệt</p>
                <p className="text-3xl font-bold text-green-600">
                  {requests.filter((r) => r.status === 'approved').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Từ chối</p>
                <p className="text-3xl font-bold text-red-600">
                  {requests.filter((r) => r.status === 'rejected').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <X className="h-6 w-6 text-red-600" />
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
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="bg-muted/30">
                {filteredRequests.length} kết quả
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

      {/* Requests Table */}
      <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <CardHeader>
          <CardTitle>Danh sách Yêu cầu ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-muted/50">
                <TableHead className="text-muted-foreground">Bảo tàng</TableHead>
                <TableHead className="text-muted-foreground">Liên hệ</TableHead>
                <TableHead className="text-muted-foreground">Danh mục</TableHead>
                <TableHead className="text-muted-foreground">Ngày gửi</TableHead>
                <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                <TableHead className="text-muted-foreground">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="border-muted/50 hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{request.name}</p>
                        <p className="text-sm text-muted-foreground">{request.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.contact}</p>
                      <p className="text-sm text-muted-foreground">{request.email}</p>
                      <p className="text-sm text-muted-foreground">{request.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/30">
                      {request.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(request.submittedDate).toLocaleDateString('vi-VN')}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
