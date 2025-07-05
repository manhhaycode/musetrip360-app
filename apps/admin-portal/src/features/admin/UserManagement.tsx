import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
import { Edit, Eye, Filter, Plus, Shield, Trash2, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';

export default function UserManagement() {
  const [roleFilter, setRoleFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Nguyễn Văn Admin',
      email: 'admin@musetrip360.com',
      role: 'admin',
      status: 'active',
      avatar: '/avatars/admin.jpg',
      joinDate: '2023-01-15',
      lastLogin: '2024-01-25',
    },
    {
      id: 2,
      name: 'Trần Thị Manager',
      email: 'manager@musetrip360.com',
      role: 'manager',
      status: 'active',
      avatar: '/avatars/manager.jpg',
      joinDate: '2023-02-20',
      lastLogin: '2024-01-24',
    },
    {
      id: 3,
      name: 'Lê Văn Staff',
      email: 'staff@musetrip360.com',
      role: 'staff',
      status: 'active',
      avatar: '/avatars/staff.jpg',
      joinDate: '2023-03-10',
      lastLogin: '2024-01-23',
    },
    {
      id: 4,
      name: 'Phạm Thị Visitor',
      email: 'visitor@example.com',
      role: 'visitor',
      status: 'active',
      avatar: '/avatars/visitor.jpg',
      joinDate: '2023-12-01',
      lastLogin: '2024-01-22',
    },
    {
      id: 5,
      name: 'Võ Văn Inactive',
      email: 'inactive@example.com',
      role: 'visitor',
      status: 'inactive',
      avatar: '/avatars/inactive.jpg',
      joinDate: '2023-06-15',
      lastLogin: '2023-12-01',
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesRole;
  });

  const clearFilters = () => {
    setRoleFilter('all');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case 'manager':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <UserCheck className="h-3 w-3 mr-1" />
            Manager
          </Badge>
        );
      case 'staff':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <Users className="h-3 w-3 mr-1" />
            Staff
          </Badge>
        );
      case 'visitor':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            Visitor
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        Hoạt động
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
        Không hoạt động
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Người dùng</h1>
          <p className="text-muted-foreground">Quản lý tài khoản và quyền hạn người dùng</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng người dùng</p>
                <p className="text-3xl font-bold">{users.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Admin</p>
                <p className="text-3xl font-bold text-red-600">{users.filter((u) => u.role === 'admin').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Staff</p>
                <p className="text-3xl font-bold text-green-600">
                  {users.filter((u) => u.role === 'staff' || u.role === 'manager').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hoạt động</p>
                <p className="text-3xl font-bold text-blue-600">{users.filter((u) => u.status === 'active').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-blue-600" />
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
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48 bg-background border-border">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="visitor">Visitor</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="bg-muted/30">
                {filteredUsers.length} kết quả
              </Badge>
            </div>
            {roleFilter !== 'all' && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <CardHeader>
          <CardTitle>Danh sách Người dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-muted/50">
                <TableHead className="text-muted-foreground">Người dùng</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Vai trò</TableHead>
                <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                <TableHead className="text-muted-foreground">Ngày tham gia</TableHead>
                <TableHead className="text-muted-foreground">Đăng nhập cuối</TableHead>
                <TableHead className="text-muted-foreground">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-muted/50 hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.email}</span>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(user.joinDate).toLocaleDateString('vi-VN')}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(user.lastLogin).toLocaleDateString('vi-VN')}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
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
