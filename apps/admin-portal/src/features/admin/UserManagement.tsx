import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Building2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Mail,
  Phone,
  Plus,
  Shield,
  Trash2,
  User,
  UserCheck,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DeleteConfirmModal, UserForm, UserFormData, UserViewModal } from '../TableForm';
import { USER_ROLES, UserRole, UserStatus, User as UserType } from '../types';

// ======================== Mock Data ========================
const mockUsers: UserType[] = [
  {
    id: 1,
    name: 'Nguyễn Văn Admin',
    email: 'admin@musetrip360.vn',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-25 14:30',
    phoneNumber: '0901234567',
    phone: '0901234567',
    address: 'Hà Nội, Việt Nam',
    permissions: ['*'],
    bio: 'Quản trị viên hệ thống với kinh nghiệm quản lý bảo tàng',
    lastActive: '2024-01-25 14:30',
  },
  {
    id: 2,
    name: 'Trần Thị Manager',
    email: 'manager@musetrip360.vn',
    role: 'manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    joinDate: '2023-02-20',
    lastLogin: '2024-01-25 10:15',
    phoneNumber: '0912345678',
    phone: '0912345678',
    address: 'TP. Hồ Chí Minh, Việt Nam',
    permissions: ['manage_museums', 'manage_staff', 'view_analytics'],
    bio: 'Quản lý cấp cao chuyên về vận hành bảo tàng',
    lastActive: '2024-01-25 10:15',
  },
  {
    id: 3,
    name: 'Lê Văn Staff',
    email: 'staff@musetrip360.vn',
    role: 'staff',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    joinDate: '2023-03-10',
    lastLogin: '2024-01-24 16:45',
    phoneNumber: '0923456789',
    phone: '0923456789',
    address: 'Đà Nẵng, Việt Nam',
    permissions: ['manage_content', 'view_reports'],
    bio: 'Nhân viên nội dung có kinh nghiệm làm việc tại bảo tàng',
    lastActive: '2024-01-24 16:45',
  },
  {
    id: 4,
    name: 'Phạm Thị Museum Owner',
    email: 'owner@heritage-museum.vn',
    role: 'museum_owner',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    joinDate: '2023-04-05',
    lastLogin: '2024-01-23 09:20',
    phoneNumber: '0934567890',
    phone: '0934567890',
    address: 'Huế, Việt Nam',
    museumId: 1,
    permissions: ['manage_own_museum', 'view_own_analytics'],
    bio: 'Chủ sở hữu Bảo tàng Di sản Văn hóa tại Huế',
    lastActive: '2024-01-23 09:20',
    museumCount: 2,
  },
  {
    id: 5,
    name: 'Hoàng Văn Visitor',
    email: 'visitor@gmail.com',
    role: 'visitor',
    status: 'pending_verification',
    avatar: '',
    joinDate: '2024-01-20',
    lastLogin: '2024-01-22 18:30',
    phoneNumber: '0945678901',
    phone: '0945678901',
    address: 'Cần Thơ, Việt Nam',
    permissions: ['view_content'],
    bio: 'Du khách yêu thích tham quan các bảo tàng',
    lastActive: '2024-01-22 18:30',
  },
  {
    id: 6,
    name: 'Vũ Thị Suspended',
    email: 'suspended@example.com',
    role: 'visitor',
    status: 'suspended',
    avatar: '',
    joinDate: '2023-12-01',
    lastLogin: '2024-01-10 08:15',
    phoneNumber: '0956789012',
    phone: '0956789012',
    address: 'Nha Trang, Việt Nam',
    permissions: [],
    bio: 'Tài khoản bị tạm khóa do vi phạm quy định',
    lastActive: '2024-01-10 08:15',
  },
];

// ======================== Configurations ========================
const STATUS_CONFIG: Record<UserStatus, { label: string; className: string }> = {
  active: { label: 'Hoạt động', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Không hoạt động', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  suspended: { label: 'Tạm khóa', className: 'bg-red-100 text-red-700 border-red-200' },
  pending_verification: { label: 'Chờ xác thực', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

const ROLE_ICONS: Record<UserRole, any> = {
  admin: Shield,
  manager: UserCheck,
  staff: Users,
  museum_owner: Building2,
  visitor: User,
};

// ======================== Functional Components ========================
function UserStats({ data }: { data: UserType[] }) {
  const stats = useMemo(
    () => ({
      total: data.length,
      active: data.filter((u) => u.status === 'active').length,
      admins: data.filter((u) => u.role === 'admin').length,
      museums: data.filter((u) => u.role === 'museum_owner').length,
    }),
    [data]
  );

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tổng người dùng</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Đang hoạt động</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Quản trị viên</p>
              <p className="text-3xl font-bold text-slate-900">{stats.admins}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Chủ bảo tàng</p>
              <p className="text-3xl font-bold text-slate-900">{stats.museums}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserFilters({
  roleFilter,
  statusFilter,
  onRoleChange,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
}: {
  roleFilter: UserRole | 'all';
  statusFilter: UserStatus | 'all';
  onRoleChange: (value: UserRole | 'all') => void;
  onStatusChange: (value: UserStatus | 'all') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Select value={roleFilter} onValueChange={(value: string) => onRoleChange(value as any)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Vai trò" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Vai trò</SelectItem>
          {Object.values(USER_ROLES).map((role) => (
            <SelectItem key={role.key} value={role.key}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={(value: string) => onStatusChange(value as any)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Trạng thái</SelectItem>
          <SelectItem value="active">Hoạt động</SelectItem>
          <SelectItem value="inactive">Không hoạt động</SelectItem>
          <SelectItem value="suspended">Tạm khóa</SelectItem>
          <SelectItem value="pending_verification">Chờ xác thực</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters} className="text-slate-600 hover:text-slate-900">
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}

function DataTablePagination({ table }: { table: any }) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ======================== Main Component ========================
export default function UserManagement() {
  // ======================== States ========================
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');

  // Modal states
  const [viewModal, setViewModal] = useState<{ open: boolean; user: UserType | null }>({
    open: false,
    user: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; user: UserType | null }>({
    open: false,
    user: null,
  });
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: UserType | null }>({
    open: false,
    user: null,
  });

  // Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // ======================== Computed Values ========================
  // Filter data
  const filteredData = useMemo(() => {
    return mockUsers.filter((user) => {
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      const statusMatch = statusFilter === 'all' || user.status === statusFilter;
      return roleMatch && statusMatch;
    });
  }, [roleFilter, statusFilter]);

  const hasActiveFilters = roleFilter !== 'all' || statusFilter !== 'all';

  // ======================== Table Columns ========================
  const columns = useMemo<ColumnDef<UserType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
          >
            Người dùng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback className="bg-slate-100 text-slate-600">
                {row.original.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-slate-900">{row.original.name}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Vai trò',
        cell: ({ row }) => {
          const role = USER_ROLES[row.original.role];
          const IconComponent = ROLE_ICONS[row.original.role];
          return (
            <Badge variant="outline" className={`${role.color.bg} ${role.color.text} ${role.color.border}`}>
              <IconComponent className="h-3 w-3 mr-1" />
              {role.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          const config = STATUS_CONFIG[row.original.status];
          return (
            <Badge variant="outline" className={config.className}>
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'joinDate',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
          >
            Ngày tham gia
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-sm">
            <p className="font-medium">{new Date(row.original.joinDate).toLocaleDateString('vi-VN')}</p>
            <p className="text-slate-500">Lần cuối: {new Date(row.original.lastLogin).toLocaleDateString('vi-VN')}</p>
          </div>
        ),
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Liên hệ',
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.phoneNumber && (
              <p className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-400" />
                {row.original.phoneNumber}
              </p>
            )}
            {row.original.address && <p className="text-slate-500 mt-1">{row.original.address}</p>}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-slate-100"
              onClick={() => handleView(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-slate-100"
              onClick={() => handleEdit(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              onClick={() => handleDelete(row.original)}
              disabled={row.original.role === 'admin'}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // ======================== Table Setup ========================
  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
  });

  // ======================== Handlers ========================
  const clearFilters = () => {
    setRoleFilter('all');
    setStatusFilter('all');
  };

  const handleAdd = () => {
    setAddModal(true);
  };

  const handleEdit = (user: UserType) => {
    setEditModal({ open: true, user });
  };

  const handleView = (user: UserType) => {
    setViewModal({ open: true, user });
  };

  const handleDelete = (user: UserType) => {
    setDeleteModal({ open: true, user });
  };

  const handleSubmit = (data: UserFormData) => {
    console.log('Form submitted:', data);
    // TODO: API call to save data
    setAddModal(false);
    setEditModal({ open: false, user: null });
  };

  const handleConfirmDelete = () => {
    console.log('Deleting user:', deleteModal.user?.id);
    // TODO: API call to delete
    setDeleteModal({ open: false, user: null });
  };

  // ======================== Render ========================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Người dùng</h1>
        </div>
      </div>

      {/* Stats */}
      <UserStats data={filteredData} />

      {/* Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Danh sách Người dùng ({filteredData.length})</h2>
        <div className="flex items-center gap-4">
          <UserFilters
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onRoleChange={setRoleFilter}
            onStatusChange={setStatusFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-slate-200 hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-slate-700 font-medium">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-slate-200 hover:bg-slate-50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>

      {/* View Modal */}
      <UserViewModal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, user: null })}
        data={viewModal.user}
        title="Chi tiết Người dùng"
      />

      {/* Add/Edit Modal */}
      <UserForm
        open={addModal || editModal.open}
        onClose={() => {
          setAddModal(false);
          setEditModal({ open: false, user: null });
        }}
        title={editModal.user ? 'Cập nhật Người dùng' : 'Thêm Người dùng Mới'}
        mode={editModal.user ? 'edit' : 'add'}
        defaultValues={
          editModal.user
            ? {
                name: editModal.user.name || '',
                email: editModal.user.email || '',
                role: editModal.user.role,
                status: editModal.user.status,
                phoneNumber: editModal.user.phoneNumber || '',
                phone: editModal.user.phone || '',
                address: editModal.user.address || '',
                avatar: editModal.user.avatar || '',
                bio: editModal.user.bio || '',
              }
            : undefined
        }
        onSubmit={handleSubmit}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        data={deleteModal.user}
        title="Xóa Người dùng"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
