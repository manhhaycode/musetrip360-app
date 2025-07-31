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
} from '@musetrip360/ui-core/alert-dialog';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@musetrip360/ui-core/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Switch } from '@musetrip360/ui-core/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@musetrip360/ui-core/table';
import { Textarea } from '@musetrip360/ui-core/textarea';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, Plus, Settings, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { SettingCategory, SettingStatus, SettingType, SystemSetting } from '../types';

// Form validation schema
const settingSchema = z.object({
  key: z.string().min(1, 'Key là bắt buộc'),
  name: z.string().min(1, 'Tên cài đặt là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  value: z.string().min(1, 'Giá trị là bắt buộc'),
  defaultValue: z.string().optional(),
  type: z.enum(['string', 'number', 'boolean', 'email', 'url', 'json']),
  unit: z.string().optional(),
  category: z.enum(['billing', 'limits', 'notification', 'approval', 'security', 'general']),
  status: z.enum(['active', 'inactive', 'deprecated']),
  isRequired: z.boolean().optional(),
  isEditable: z.boolean().optional(),
});

type SettingFormData = z.infer<typeof settingSchema>;

// Mock data
const mockSettings: SystemSetting[] = [
  {
    id: 1,
    key: 'max_museums_per_user',
    name: 'Số lượng bảo tàng tối đa mỗi user',
    description: 'Giới hạn số lượng bảo tàng mà một user có thể sở hữu',
    value: '5',
    defaultValue: '3',
    type: 'number',
    unit: 'bảo tàng',
    category: 'limits',
    status: 'active',
    lastModified: '2024-01-25',
    modifiedBy: 1,
    isRequired: true,
    isEditable: true,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-25',
  },
  {
    id: 2,
    key: 'auto_approve_events',
    name: 'Tự động duyệt sự kiện',
    description: 'Cho phép tự động duyệt các sự kiện từ bảo tàng đáng tin cậy',
    value: 'false',
    defaultValue: 'false',
    type: 'boolean',
    category: 'approval',
    status: 'active',
    lastModified: '2024-01-24',
    modifiedBy: 1,
    isRequired: false,
    isEditable: true,
    createdAt: '2023-02-20',
    updatedAt: '2024-01-24',
  },
  {
    id: 3,
    key: 'notification_email',
    name: 'Email thông báo hệ thống',
    description: 'Địa chỉ email nhận thông báo quan trọng từ hệ thống',
    value: 'admin@musetrip360.vn',
    defaultValue: 'noreply@musetrip360.vn',
    type: 'email',
    category: 'notification',
    status: 'active',
    lastModified: '2024-01-23',
    modifiedBy: 1,
    isRequired: true,
    isEditable: true,
    createdAt: '2023-03-10',
    updatedAt: '2024-01-23',
  },
  {
    id: 4,
    key: 'maintenance_mode',
    name: 'Chế độ bảo trì',
    description: 'Kích hoạt chế độ bảo trì toàn hệ thống',
    value: 'false',
    defaultValue: 'false',
    type: 'boolean',
    category: 'general',
    status: 'active',
    lastModified: '2024-01-22',
    modifiedBy: 1,
    isRequired: false,
    isEditable: true,
    createdAt: '2023-04-05',
    updatedAt: '2024-01-22',
  },
  {
    id: 5,
    key: 'session_timeout',
    name: 'Thời gian hết phiên đăng nhập',
    description: 'Thời gian tự động đăng xuất người dùng khi không hoạt động',
    value: '3600',
    defaultValue: '1800',
    type: 'number',
    unit: 'giây',
    category: 'security',
    status: 'active',
    lastModified: '2024-01-21',
    modifiedBy: 1,
    isRequired: true,
    isEditable: true,
    createdAt: '2023-05-12',
    updatedAt: '2024-01-21',
  },
  {
    id: 6,
    key: 'old_api_endpoint',
    name: 'API endpoint cũ',
    description: 'Endpoint API phiên bản cũ, không còn sử dụng',
    value: 'https://old-api.musetrip360.vn',
    defaultValue: '',
    type: 'url',
    category: 'general',
    status: 'deprecated',
    lastModified: '2024-01-20',
    modifiedBy: 1,
    isRequired: false,
    isEditable: false,
    createdAt: '2023-06-15',
    updatedAt: '2024-01-20',
  },
];

// Dynamic configurations
const CATEGORY_CONFIG: Record<SettingCategory, { label: string; className: string }> = {
  billing: { label: 'Thanh toán', className: 'bg-green-100 text-green-700 border-green-200' },
  limits: { label: 'Giới hạn', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  notification: { label: 'Thông báo', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  approval: { label: 'Phê duyệt', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  security: { label: 'Bảo mật', className: 'bg-red-100 text-red-700 border-red-200' },
  general: { label: 'Chung', className: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const STATUS_CONFIG: Record<SettingStatus, { label: string; className: string }> = {
  active: { label: 'Hoạt động', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Tạm khóa', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  deprecated: { label: 'Lỗi thời', className: 'bg-red-100 text-red-700 border-red-200' },
};

const TYPE_CONFIG: Record<SettingType, { label: string }> = {
  string: { label: 'Chuỗi' },
  number: { label: 'Số' },
  boolean: { label: 'Boolean' },
  email: { label: 'Email' },
  url: { label: 'URL' },
  json: { label: 'JSON' },
};

export default function SystemSettings() {
  const [categoryFilter, setCategoryFilter] = useState<SettingCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<SettingStatus | 'all'>('all');

  // Modal states
  const [viewModal, setViewModal] = useState<{ open: boolean; setting: SystemSetting | null }>({
    open: false,
    setting: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; setting: SystemSetting | null }>({
    open: false,
    setting: null,
  });
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; setting: SystemSetting | null }>({
    open: false,
    setting: null,
  });

  // Form for add/edit
  const form = useForm<SettingFormData>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      key: '',
      name: '',
      description: '',
      value: '',
      defaultValue: '',
      type: 'string',
      unit: '',
      category: 'general',
      status: 'active',
      isRequired: false,
      isEditable: true,
    },
  });

  // Handle actions
  const handleEdit = useCallback(
    (setting: SystemSetting) => {
      form.reset({
        key: setting.key,
        name: setting.name,
        description: setting.description,
        value: setting.value,
        defaultValue: setting.defaultValue || '',
        type: setting.type,
        unit: setting.unit || '',
        category: setting.category,
        status: setting.status,
        isRequired: setting.isRequired || false,
        isEditable: setting.isEditable || true,
      });
      setEditModal({ open: true, setting });
    },
    [form]
  );

  // Define columns
  const columns = useMemo<ColumnDef<SystemSetting>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
          >
            Tên cài đặt
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-900">{row.original.name}</p>
            <p className="text-sm text-slate-500 font-mono">{row.original.key}</p>
          </div>
        ),
      },
      {
        accessorKey: 'value',
        header: 'Giá trị',
        cell: ({ row }) => {
          const setting = row.original;
          const isBoolean = setting.type === 'boolean';

          if (isBoolean) {
            return (
              <Switch
                checked={setting.value === 'true'}
                disabled={!setting.isEditable}
                onCheckedChange={(checked) => {
                  console.log(`Toggle ${setting.key}:`, checked);
                  // TODO: API call to update value
                }}
              />
            );
          }

          return (
            <div>
              <p className="font-medium text-slate-900">{setting.value}</p>
              {setting.unit && <p className="text-sm text-slate-500">{setting.unit}</p>}
            </div>
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Danh mục',
        cell: ({ row }) => {
          const config = CATEGORY_CONFIG[row.original.category];
          return (
            <Badge variant="outline" className={config.className}>
              {config.label}
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
        accessorKey: 'lastModified',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
          >
            Cập nhật cuối
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-sm">
            <p className="font-medium">{new Date(row.original.lastModified).toLocaleDateString('vi-VN')}</p>
            <p className="text-slate-500">Bởi Admin</p>
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
              onClick={() => setViewModal({ open: true, setting: row.original })}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-slate-100"
              onClick={() => handleEdit(row.original)}
              disabled={!row.original.isEditable}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              onClick={() => setDeleteModal({ open: true, setting: row.original })}
              disabled={row.original.isRequired}
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
    return mockSettings.filter((setting) => {
      const categoryMatch = categoryFilter === 'all' || setting.category === categoryFilter;
      const statusMatch = statusFilter === 'all' || setting.status === statusFilter;
      return categoryMatch && statusMatch;
    });
  }, [categoryFilter, statusFilter]);

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
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  // Handle actions
  const handleAdd = () => {
    form.reset();
    setAddModal(true);
  };

  const handleSubmit = (data: SettingFormData) => {
    console.log('Form submitted:', data);
    // TODO: API call to save data
    setAddModal(false);
    setEditModal({ open: false, setting: null });
  };

  const handleDelete = () => {
    console.log('Deleting setting:', deleteModal.setting?.id);
    // TODO: API call to delete
    setDeleteModal({ open: false, setting: null });
  };

  const hasActiveFilters = categoryFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Cài đặt Hệ thống</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tổng cài đặt</p>
                <p className="text-3xl font-bold text-slate-900">{filteredData.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Đang hoạt động</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {filteredData.filter((s) => s.status === 'active').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Settings className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Bắt buộc</p>
                <p className="text-3xl font-bold text-slate-900">{filteredData.filter((s) => s.isRequired).length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Lỗi thời</p>
                <p className="text-3xl font-bold text-red-600">
                  {filteredData.filter((s) => s.status === 'deprecated').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <Settings className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Danh sách Cài đặt ({filteredData.length})</h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Select value={categoryFilter} onValueChange={(value: string) => setCategoryFilter(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Danh mục</SelectItem>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
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
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
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
            Thêm cài đặt
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Chi tiết Cài đặt
            </DialogTitle>
          </DialogHeader>
          {viewModal.setting && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Tên cài đặt</label>
                  <p className="font-medium">{viewModal.setting.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Key</label>
                  <p className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{viewModal.setting.key}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Mô tả</label>
                <p className="text-slate-700">{viewModal.setting.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Giá trị hiện tại</label>
                  <p className="font-medium">
                    {viewModal.setting.value} {viewModal.setting.unit}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Giá trị mặc định</label>
                  <p>{viewModal.setting.defaultValue || 'Không có'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Loại</label>
                  <Badge variant="outline" className="bg-slate-100 text-slate-700">
                    {TYPE_CONFIG[viewModal.setting.type].label}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Danh mục</label>
                  <Badge variant="outline" className={CATEGORY_CONFIG[viewModal.setting.category].className}>
                    {CATEGORY_CONFIG[viewModal.setting.category].label}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Trạng thái</label>
                  <Badge variant="outline" className={STATUS_CONFIG[viewModal.setting.status].className}>
                    {STATUS_CONFIG[viewModal.setting.status].label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Bắt buộc</label>
                  <p>{viewModal.setting.isRequired ? 'Có' : 'Không'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Có thể chỉnh sửa</label>
                  <p>{viewModal.setting.isEditable ? 'Có' : 'Không'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Cập nhật gần nhất</label>
                <p>{new Date(viewModal.setting.lastModified).toLocaleString('vi-VN')} bởi Admin</p>
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
            setEditModal({ open: false, setting: null });
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              {editModal.setting ? 'Chỉnh sửa Cài đặt' : 'Thêm Cài đặt mới'}
            </DialogTitle>
            <DialogDescription>
              {editModal.setting ? 'Cập nhật thông tin cài đặt hệ thống' : 'Tạo cài đặt hệ thống mới'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key *</FormLabel>
                      <FormControl>
                        <Input placeholder="setting_key" className="font-mono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên cài đặt *</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên hiển thị" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Mô tả chi tiết về cài đặt này" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại *</FormLabel>
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
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
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="inactive">Tạm khóa</SelectItem>
                          <SelectItem value="deprecated">Lỗi thời</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá trị *</FormLabel>
                      <FormControl>
                        <Input placeholder="Giá trị hiện tại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá trị mặc định</FormLabel>
                      <FormControl>
                        <Input placeholder="Giá trị mặc định" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn vị</FormLabel>
                    <FormControl>
                      <Input placeholder="giây, MB, %, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bắt buộc</FormLabel>
                        <p className="text-sm text-slate-600">Cài đặt này là bắt buộc cho hệ thống</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isEditable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Có thể chỉnh sửa</FormLabel>
                        <p className="text-sm text-slate-600">Cho phép chỉnh sửa giá trị</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAddModal(false);
                    setEditModal({ open: false, setting: null });
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                  {editModal.setting ? 'Cập nhật' : 'Thêm mới'}
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
              Bạn có chắc chắn muốn xóa cài đặt "{deleteModal.setting?.name}"? Hành động này có thể ảnh hưởng đến hoạt
              động của hệ thống.
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
