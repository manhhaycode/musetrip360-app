import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@musetrip360/ui-core';
import { Building2, Check, Clock, Filter, MapPin, Search, X } from 'lucide-react';

export default function MuseumApproval() {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Tìm kiếm yêu cầu..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="approved">Đã duyệt</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
                <p className="text-3xl font-bold text-yellow-600">23</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã duyệt</p>
                <p className="text-3xl font-bold text-green-600">17</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Từ chối</p>
                <p className="text-3xl font-bold text-red-600">7</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <X className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Hàng đợi Xét duyệt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Bảo tàng Lịch sử Cần Thơ',
                location: 'Cần Thơ',
                submittedDate: '2 ngày trước',
                status: 'pending',
                priority: 'high',
              },
              {
                name: 'Bảo tàng Hùng Vương Phú Thọ',
                location: 'Phú Thọ',
                submittedDate: '5 ngày trước',
                status: 'pending',
                priority: 'medium',
              },
              {
                name: 'Bảo tàng Quang Trung Bình Định',
                location: 'Bình Định',
                submittedDate: '1 tuần trước',
                status: 'pending',
                priority: 'low',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.location}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{item.submittedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'secondary' : 'outline'
                    }
                  >
                    {item.priority === 'high'
                      ? 'Ưu tiên cao'
                      : item.priority === 'medium'
                        ? 'Ưu tiên vừa'
                        : 'Ưu tiên thấp'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <X className="h-4 w-4 mr-1" />
                    Từ chối
                  </Button>
                  <Button size="sm">
                    <Check className="h-4 w-4 mr-1" />
                    Duyệt
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
