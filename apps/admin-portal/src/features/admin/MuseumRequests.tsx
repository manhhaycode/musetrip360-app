import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@musetrip360/ui-core/table';
import {
  ColumnDef,
  ColumnFiltersState,
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
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  FileText,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DeleteConfirmModal, MuseumRequestFormData, RequestForm, RequestViewModal } from '../TableForm';
import { MUSEUM_CATEGORIES, MuseumCategory, MuseumRequest, MuseumRequestStatus } from '../types';

// ======================== Mock Data ========================
const mockRequests: MuseumRequest[] = [
  {
    id: 1,
    name: 'Bảo tàng Lịch sử Việt Nam',
    category: 'history',
    description: 'Bảo tàng trưng bày các hiện vật lịch sử quan trọng của dân tộc Việt Nam',
    location: 'Hà Nội',
    address: '216 Trần Quang Khải, Hoàn Kiếm, Hà Nội',
    contact: 'Nguyễn Văn A',
    phone: '024-3825-2853',
    email: 'info@vnhistorymuseum.vn',
    website: 'https://vnhistorymuseum.vn',
    status: 'pending',
    submittedDate: '2024-01-20',
    reviewedDate: undefined,
    rejectionReason: undefined,
    documents: ['license.pdf', 'proposal.pdf'],
  },
  {
    id: 2,
    name: 'Bảo tàng Mỹ thuật Đại Nam',
    category: 'art',
    description: 'Không gian trưng bày nghệ thuật cổ truyền và hiện đại',
    location: 'TP. Hồ Chí Minh',
    address: '97A Phó Đức Chính, Quận 1, TP. HCM',
    contact: 'Trần Thị B',
    phone: '028-3829-4441',
    email: 'contact@dainamart.vn',
    website: 'https://dainamart.vn',
    status: 'under_review',
    submittedDate: '2024-01-18',
    reviewedDate: undefined,
    rejectionReason: undefined,
    documents: ['certificate.pdf'],
  },
  {
    id: 3,
    name: 'Bảo tàng Khoa học và Công nghệ',
    category: 'science',
    description: 'Trưng bày các phát minh khoa học và công nghệ tiên tiến',
    location: 'Đà Nẵng',
    address: '03 Nguyễn Tất Thành, Hải Châu, Đà Nẵng',
    contact: 'Lê Văn C',
    phone: '0236-3925-111',
    email: 'admin@sciencemuseum.vn',
    website: '',
    status: 'approved',
    submittedDate: '2024-01-15',
    reviewedDate: '2024-01-22',
    rejectionReason: undefined,
    documents: ['license.pdf', 'plan.pdf', 'budget.pdf'],
  },
  {
    id: 4,
    name: 'Bảo tàng Dân tộc học',
    category: 'ethnology',
    description: 'Giới thiệu văn hóa các dân tộc thiểu số Việt Nam',
    location: 'Sapa, Lào Cai',
    address: 'Thị trấn Sapa, Lào Cai',
    contact: 'Vàng Seo Su',
    phone: '0214-3871-975',
    email: 'info@ethnologymuseum.vn',
    website: 'https://ethnologymuseum.vn',
    status: 'rejected',
    submittedDate: '2024-01-10',
    reviewedDate: '2024-01-20',
    rejectionReason: 'Tài liệu không đầy đủ, cần bổ sung giấy phép xây dựng',
    documents: ['proposal.pdf'],
  },
];

// ======================== Configurations ========================
const STATUS_CONFIG: Record<MuseumRequestStatus, { label: string; className: string; icon: any }> = {
  pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  under_review: { label: 'Đang xem xét', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: Eye },
  approved: { label: 'Đã duyệt', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  rejected: { label: 'Từ chối', className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

// ======================== Functional Components ========================
function RequestStats({ data }: { data: MuseumRequest[] }) {
  const stats = useMemo(
    () => ({
      total: data.length,
      pending: data.filter((r) => r.status === 'pending').length,
      under_review: data.filter((r) => r.status === 'under_review').length,
      approved: data.filter((r) => r.status === 'approved').length,
      rejected: data.filter((r) => r.status === 'rejected').length,
    }),
    [data]
  );

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tổng yêu cầu</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Chờ duyệt</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Đang xem xét</p>
              <p className="text-3xl font-bold text-blue-600">{stats.under_review}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Đã duyệt</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.approved}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Từ chối</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RequestFilters({
  categoryFilter,
  statusFilter,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
}: {
  categoryFilter: MuseumCategory | 'all';
  statusFilter: MuseumRequestStatus | 'all';
  onCategoryChange: (value: MuseumCategory | 'all') => void;
  onStatusChange: (value: MuseumRequestStatus | 'all') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Danh mục</SelectItem>
          {Object.entries(MUSEUM_CATEGORIES).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              {config.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
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
        <Button variant="outline" onClick={onClearFilters} size="sm">
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}

function DataTablePagination({ table }: { table: any }) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-slate-600">
        Hiển thị {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} đến{' '}
        {Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )}{' '}
        trong tổng số {table.getFilteredRowModel().rows.length} kết quả
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Số dòng mỗi trang</p>
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
          Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Trang trước</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Trang sau</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ======================== Main Component ========================
export default function MuseumRequests() {
  const [data] = useState<MuseumRequest[]>(mockRequests);
  const [categoryFilter, setCategoryFilter] = useState<MuseumCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MuseumRequestStatus | 'all'>('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MuseumRequest | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'review'>('add');

  const columns: ColumnDef<MuseumRequest>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Tên bảo tàng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'category',
        header: 'Danh mục',
        cell: ({ row }) => {
          const category = row.getValue('category') as MuseumCategory;
          const config = MUSEUM_CATEGORIES[category];
          return (
            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
              {config?.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'location',
        header: 'Địa điểm',
        cell: ({ row }) => row.getValue('location'),
      },
      {
        accessorKey: 'contact',
        header: 'Người liên hệ',
        cell: ({ row }) => row.getValue('contact'),
      },
      {
        accessorKey: 'submittedDate',
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Ngày nộp
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.getValue('submittedDate') as string;
          return new Date(date).toLocaleDateString('vi-VN');
        },
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          const status = row.getValue('status') as MuseumRequestStatus;
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          return (
            <Badge variant="outline" className={config.className}>
              <Icon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => {
          const request = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleView(request)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(request)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(request)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return data.filter((request) => {
      const categoryMatch = categoryFilter === 'all' || request.category === categoryFilter;
      const statusMatch = statusFilter === 'all' || request.status === statusFilter;
      return categoryMatch && statusMatch;
    });
  }, [data, categoryFilter, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const hasActiveFilters = categoryFilter !== 'all' || statusFilter !== 'all';

  const clearFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const handleAdd = () => {
    setSelectedRequest(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEdit = (request: MuseumRequest) => {
    setSelectedRequest(request);
    setFormMode('review');
    setIsFormOpen(true);
  };

  const handleView = (request: MuseumRequest) => {
    setSelectedRequest(request);
    setIsViewOpen(true);
  };

  const handleDelete = (request: MuseumRequest) => {
    setSelectedRequest(request);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (data: MuseumRequestFormData) => {
    console.log('Form submitted:', data);
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log('Delete confirmed:', selectedRequest);
    setIsDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <RequestStats data={data} />

      {/* Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Danh sách Yêu cầu ({filteredData.length})</h2>
        <div className="flex items-center gap-4">
          <RequestFilters
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <Button onClick={handleAdd} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Thêm yêu cầu
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

      {/* Modals */}
      <RequestForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={
          formMode === 'add' ? 'Thêm yêu cầu đăng ký' : formMode === 'edit' ? 'Cập nhật yêu cầu' : 'Xét duyệt yêu cầu'
        }
        onSubmit={handleSubmit}
        defaultValues={selectedRequest || undefined}
        mode={formMode}
      />

      <RequestViewModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Chi tiết yêu cầu đăng ký"
        data={selectedRequest}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        data={selectedRequest}
        title="Xóa yêu cầu đăng ký"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
