import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
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
  Textarea,
} from '@musetrip360/ui-core';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, Building2, Edit, Eye, FileText, Plus, Shield, Trash2, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Policy, PolicyStatus, PolicyType } from '../types';

// Form validation schema
const policySchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  type: z.enum(['privacy', 'terms', 'content', 'refund', 'security', 'billing', 'operational']),
  content: z.string().min(50, 'Nội dung phải có ít nhất 50 ký tự'),
  summary: z.string().min(10, 'Tóm tắt phải có ít nhất 10 ký tự'),
  appliesTo: z.array(z.string()).min(1, 'Phải chọn ít nhất một đối tượng áp dụng'),
  status: z.enum(['active', 'draft', 'review', 'archived']),
  version: z.string().min(1, 'Phiên bản là bắt buộc'),
  effectiveDate: z.string().min(1, 'Ngày hiệu lực là bắt buộc'),
  expiryDate: z.string().optional(),
});

type PolicyFormData = z.infer<typeof policySchema>;

// Mock data with enhanced policy information
const mockPolicies: Policy[] = [
  {
    id: 1,
    title: 'Chính sách Bảo mật Thông tin',
    type: 'privacy',
    content:
      'Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi sử dụng nền tảng MuseTrip360...',
    summary: 'Quy định về thu thập, xử lý và bảo vệ dữ liệu cá nhân người dùng',
    appliesTo: ['visitors', 'museum_owners', 'staff'],
    status: 'active',
    version: '2.1',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-15',
    createdAt: '2023-01-15',
    updatedAt: '2024-01-15',
    description: 'Chính sách bảo mật thông tin cá nhân',
  },
  {
    id: 2,
    title: 'Điều khoản Dịch vụ',
    type: 'terms',
    content:
      'Các điều khoản và điều kiện này quy định việc sử dụng dịch vụ MuseTrip360. Bằng cách truy cập và sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản này...',
    summary: 'Điều khoản và điều kiện sử dụng dịch vụ cho tất cả người dùng',
    appliesTo: ['visitors', 'museum_owners'],
    status: 'active',
    version: '1.8',
    effectiveDate: '2024-02-01',
    expiryDate: '2025-02-01',
    lastUpdated: '2024-01-20',
    createdAt: '2023-02-15',
    updatedAt: '2024-01-20',
    description: 'Điều khoản sử dụng dịch vụ',
  },
  {
    id: 3,
    title: 'Quy định Nội dung',
    type: 'content',
    content:
      'Quy định này áp dụng cho tất cả nội dung được đăng tải lên nền tảng MuseTrip360, bao gồm mô tả bảo tàng, thông tin sự kiện và hình ảnh...',
    summary: 'Tiêu chuẩn và quy định về nội dung được phép đăng tải',
    appliesTo: ['museum_owners'],
    status: 'active',
    version: '1.5',
    effectiveDate: '2024-01-15',
    lastUpdated: '2024-01-10',
    createdAt: '2023-03-01',
    updatedAt: '2024-01-10',
    description: 'Quy định về nội dung đăng tải',
  },
  {
    id: 4,
    title: 'Chính sách Hoàn tiền',
    type: 'refund',
    content: 'Chính sách hoàn tiền cho vé sự kiện và các dịch vụ trả phí trên nền tảng MuseTrip360...',
    summary: 'Quy định về hoàn tiền vé sự kiện và dịch vụ',
    appliesTo: ['visitors'],
    status: 'review',
    version: '2.0',
    effectiveDate: '2024-03-01',
    lastUpdated: '2024-01-25',
    createdAt: '2023-04-10',
    updatedAt: '2024-01-25',
    description: 'Chính sách hoàn tiền và hủy vé',
  },
  {
    id: 5,
    title: 'Quy trình Bảo mật Hệ thống',
    type: 'security',
    content: 'Quy trình và biện pháp bảo mật được áp dụng để bảo vệ hệ thống và dữ liệu người dùng...',
    summary: 'Quy trình bảo mật cho nhân viên và quản trị viên',
    appliesTo: ['staff'],
    status: 'active',
    version: '3.2',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-05',
    createdAt: '2023-05-20',
    updatedAt: '2024-01-05',
    description: 'Quy trình bảo mật hệ thống',
  },
  {
    id: 6,
    title: 'Chính sách Thanh toán (Cũ)',
    type: 'billing',
    content: 'Chính sách thanh toán phiên bản cũ, không còn áp dụng...',
    summary: 'Chính sách thanh toán phiên bản cũ',
    appliesTo: ['museum_owners'],
    status: 'archived',
    version: '1.0',
    effectiveDate: '2023-01-01',
    expiryDate: '2023-12-31',
    lastUpdated: '2023-12-31',
    createdAt: '2023-01-01',
    updatedAt: '2023-12-31',
    description: 'Chính sách thanh toán cũ',
  },
];

// Dynamic configurations
const TYPE_CONFIG: Record<PolicyType, { label: string; className: string; icon: string }> = {
  privacy: { label: 'Bảo mật', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'Shield' },
  terms: { label: 'Điều khoản', className: 'bg-green-100 text-green-700 border-green-200', icon: 'FileText' },
  content: { label: 'Nội dung', className: 'bg-purple-100 text-purple-700 border-purple-200', icon: 'FileText' },
  refund: { label: 'Hoàn tiền', className: 'bg-orange-100 text-orange-700 border-orange-200', icon: 'FileText' },
  security: { label: 'Bảo mật HT', className: 'bg-red-100 text-red-700 border-red-200', icon: 'Shield' },
  billing: { label: 'Thanh toán', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: 'FileText' },
  operational: { label: 'Vận hành', className: 'bg-slate-100 text-slate-700 border-slate-200', icon: 'FileText' },
};

const STATUS_CONFIG: Record<PolicyStatus, { label: string; className: string }> = {
  active: { label: 'Hiệu lực', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  draft: { label: 'Bản nháp', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  review: { label: 'Đang xem xét', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  archived: { label: 'Lưu trữ', className: 'bg-red-100 text-red-700 border-red-200' },
};

const APPLIES_TO_CONFIG: Record<string, { label: string; icon: string; className: string }> = {
  visitors: { label: 'Khách tham quan', icon: 'Users', className: 'bg-blue-50 text-blue-700' },
  museum_owners: { label: 'Chủ bảo tàng', icon: 'Building2', className: 'bg-orange-50 text-orange-700' },
  staff: { label: 'Nhân viên', icon: 'Shield', className: 'bg-green-50 text-green-700' },
};

const ICON_MAP = { Shield, Users, Building2, FileText };

export default function Policies() {
  const [typeFilter, setTypeFilter] = useState<PolicyType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | 'all'>('all');

  // Modal states
  const [viewModal, setViewModal] = useState<{ open: boolean; policy: Policy | null }>({
    open: false,
    policy: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; policy: Policy | null }>({
    open: false,
    policy: null,
  });
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; policy: Policy | null }>({
    open: false,
    policy: null,
  });

  // Form for add/edit
  const form = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      title: '',
      type: 'privacy',
      content: '',
      summary: '',
      appliesTo: [],
      status: 'draft',
      version: '1.0',
      effectiveDate: '',
      expiryDate: '',
    },
  });

  // Handle actions
  const handleEdit = (policy: Policy) => {
    form.reset({
      title: policy.title,
      type: policy.type,
      content: policy.content || '',
      summary: policy.summary || '',
      appliesTo: policy.appliesTo || [],
      status: policy.status,
      version: policy.version,
      effectiveDate: policy.effectiveDate,
      expiryDate: policy.expiryDate || '',
    });
    setEditModal({ open: true, policy });
  };

  // Define columns
  const columns = useMemo<ColumnDef<Policy>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
          >
            Tiêu đề chính sách
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-900">{row.original.title}</p>
            <p className="text-sm text-slate-500">v{row.original.version}</p>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Loại',
        cell: ({ row }) => {
          const config = TYPE_CONFIG[row.original.type];
          const IconComponent = ICON_MAP[config.icon as keyof typeof ICON_MAP];
          return (
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-md ${config.className}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{config.label}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'appliesTo',
        header: 'Áp dụng cho',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.appliesTo?.map((audience) => {
              const config = APPLIES_TO_CONFIG[audience];
              const IconComponent = ICON_MAP[config?.icon as keyof typeof ICON_MAP] || Users;
              return (
                <div
                  key={audience}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${config?.className || 'bg-slate-50 text-slate-700'}`}
                >
                  <IconComponent className="h-3 w-3" />
                  <span>{config?.label || audience}</span>
                </div>
              );
            })}
          </div>
        ),
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
        accessorKey: 'effectiveDate',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
          >
            Ngày hiệu lực
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-sm">
            <p className="font-medium">{new Date(row.original.effectiveDate).toLocaleDateString('vi-VN')}</p>
            {row.original.expiryDate && (
              <p className="text-slate-500">Hết hạn: {new Date(row.original.expiryDate).toLocaleDateString('vi-VN')}</p>
            )}
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
              onClick={() => setViewModal({ open: true, policy: row.original })}
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
              onClick={() => setDeleteModal({ open: true, policy: row.original })}
              disabled={row.original.status === 'active'}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [handleEdit]
  );

  // Filter data
  const filteredData = useMemo(() => {
    return mockPolicies.filter((policy) => {
      const typeMatch = typeFilter === 'all' || policy.type === typeFilter;
      const statusMatch = statusFilter === 'all' || policy.status === statusFilter;
      return typeMatch && statusMatch;
    });
  }, [typeFilter, statusFilter]);

  // Initialize table
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Clear filters
  const clearFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
  };

  // Handle actions
  const handleAdd = () => {
    form.reset();
    setAddModal(true);
  };

  const handleSubmit = (data: PolicyFormData) => {
    console.log('Form submitted:', data);
    // TODO: API call to save data
    setAddModal(false);
    setEditModal({ open: false, policy: null });
  };

  const handleDelete = () => {
    console.log('Deleting policy:', deleteModal.policy?.id);
    // TODO: API call to delete
    setDeleteModal({ open: false, policy: null });
  };

  const hasActiveFilters = typeFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Chính sách</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tổng chính sách</p>
                <p className="text-3xl font-bold text-slate-900">{filteredData.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Đang hiệu lực</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {filteredData.filter((p) => p.status === 'active').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Đang xem xét</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {filteredData.filter((p) => p.status === 'review').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Lưu trữ</p>
                <p className="text-3xl font-bold text-red-600">
                  {filteredData.filter((p) => p.status === 'archived').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters with Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Danh sách Chính sách ({filteredData.length})</h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Select value={typeFilter} onValueChange={(value: string) => setTypeFilter(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Loại</SelectItem>
                {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Trạng thái</SelectItem>
                <SelectItem value="active">Hiệu lực</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="review">Đang xem xét</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-slate-600 hover:text-slate-900"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm chính sách
          </Button>
        </div>
      </div>

      {/* Table */}
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

      {/* View Modal */}
      <Dialog open={viewModal.open} onOpenChange={(open) => setViewModal({ ...viewModal, open })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Chi tiết Chính sách
            </DialogTitle>
          </DialogHeader>
          {viewModal.policy && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Tiêu đề</label>
                  <p className="font-medium text-lg">{viewModal.policy.title}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Phiên bản</label>
                    <p className="font-medium">v{viewModal.policy.version}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Trạng thái</label>
                    <Badge variant="outline" className={STATUS_CONFIG[viewModal.policy.status].className}>
                      {STATUS_CONFIG[viewModal.policy.status].label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Tóm tắt</label>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-md">{viewModal.policy.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Loại chính sách</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={TYPE_CONFIG[viewModal.policy.type].className}>
                      {TYPE_CONFIG[viewModal.policy.type].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Áp dụng cho</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {viewModal.policy.appliesTo?.map((audience) => {
                      const config = APPLIES_TO_CONFIG[audience];
                      const IconComponent = ICON_MAP[config?.icon as keyof typeof ICON_MAP] || Users;
                      return (
                        <div
                          key={audience}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${config?.className || 'bg-slate-50 text-slate-700'}`}
                        >
                          <IconComponent className="h-3 w-3" />
                          <span>{config?.label || audience}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Ngày hiệu lực</label>
                  <p>{new Date(viewModal.policy.effectiveDate).toLocaleDateString('vi-VN')}</p>
                </div>
                {viewModal.policy.expiryDate && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">Ngày hết hạn</label>
                    <p>{new Date(viewModal.policy.expiryDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Nội dung chính sách</label>
                <div className="mt-2 p-4 border rounded-lg bg-white max-h-96 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    {viewModal.policy.content?.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 text-slate-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Cập nhật gần nhất</label>
                <p>{new Date(viewModal.policy.lastUpdated || '').toLocaleString('vi-VN')} bởi Admin</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Modal */}
      <Dialog
        open={addModal || editModal.open}
        onOpenChange={(open) => {
          if (!open) {
            setAddModal(false);
            setEditModal({ open: false, policy: null });
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {editModal.policy ? 'Chỉnh sửa Chính sách' : 'Thêm Chính sách mới'}
            </DialogTitle>
            <DialogDescription>
              {editModal.policy ? 'Cập nhật thông tin chính sách' : 'Tạo chính sách mới cho hệ thống'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề chính sách *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề chính sách" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phiên bản *</FormLabel>
                      <FormControl>
                        <Input placeholder="1.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại chính sách *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Bản nháp</SelectItem>
                          <SelectItem value="review">Đang xem xét</SelectItem>
                          <SelectItem value="active">Hiệu lực</SelectItem>
                          <SelectItem value="archived">Lưu trữ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tóm tắt *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tóm tắt ngắn gọn về chính sách này" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appliesTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Áp dụng cho *</FormLabel>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(APPLIES_TO_CONFIG).map(([key, config]) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.value.includes(key)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, key]);
                              } else {
                                field.onChange(field.value.filter((v) => v !== key));
                              }
                            }}
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm font-medium">{config.label}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="effectiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày hiệu lực *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày hết hạn</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung chính sách *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung đầy đủ của chính sách..."
                        rows={12}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAddModal(false);
                    setEditModal({ open: false, policy: null });
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                  {editModal.policy ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chính sách "{deleteModal.policy?.title}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
