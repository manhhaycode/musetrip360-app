import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@musetrip360/ui-core/table';
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
import { ArrowUpDown, Building2, ChevronLeft, ChevronRight, Edit, Eye, Plus, Star, Trash2, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DeleteConfirmModal, MuseumForm, MuseumFormData, MuseumViewModal } from '../TableForm';
import { Museum, MUSEUM_CATEGORIES, MuseumCategory, MuseumStatus } from '../types';

// ======================== Mock Data ========================
const mockMuseums: Museum[] = [
  {
    id: 1,
    name: 'Bảo tàng Lịch sử Việt Nam',
    description: 'Bảo tàng trưng bày các hiện vật lịch sử của dân tộc Việt Nam qua các thời kỳ',
    category: 'history',
    location: 'Hà Nội',
    address: '1 Tràng Tiền, Hoàn Kiếm, Hà Nội',
    phone: '024-3825-2853',
    email: 'info@vnhistorymuseum.vn',
    website: 'https://baotanglichsu.vn',
    openingHours: '8:00 - 17:00 (Thứ 3 - Chủ nhật)',
    ticketPrice: '40,000 VND',
    status: 'active',
    rating: 4.5,
    visitorsCount: 25420,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-25',
  },
  {
    id: 2,
    name: 'Bảo tàng Nghệ thuật Đương đại',
    description: 'Không gian trưng bày các tác phẩm nghệ thuật đương đại của các nghệ sĩ trong nước và quốc tế',
    category: 'art',
    location: 'TP. Hồ Chí Minh',
    address: '97 Đường Mac Thị Bưởi, Quận 1, TP. Hồ Chí Minh',
    phone: '028-3829-8741',
    email: 'contact@contemporaryart.vn',
    website: 'https://nghethuat.vn',
    openingHours: '9:00 - 18:00 (Thứ 2 - Chủ nhật)',
    ticketPrice: '60,000 VND',
    status: 'active',
    rating: 4.2,
    visitorsCount: 18750,
    createdAt: '2023-02-20',
    updatedAt: '2024-01-24',
  },
  {
    id: 3,
    name: 'Bảo tàng Khoa học Tự nhiên',
    description: 'Khám phá thế giới tự nhiên với các mô hình sinh vật, khoáng vật và hiện tượng tự nhiên',
    category: 'science',
    location: 'Đà Nẵng',
    address: '03 Trần Nhân Tông, Sơn Trà, Đà Nẵng',
    phone: '0236-3647-589',
    email: 'info@sciencemuseum.vn',
    website: 'https://khoahoc.vn',
    openingHours: '8:30 - 17:30 (Thứ 3 - Chủ nhật)',
    ticketPrice: '50,000 VND',
    status: 'pending',
    rating: 4.8,
    visitorsCount: 12340,
    createdAt: '2023-03-10',
    updatedAt: '2024-01-23',
  },
  {
    id: 4,
    name: 'Bảo tàng Văn hóa Dân gian',
    description: 'Lưu giữ và trưng bày những nét văn hóa truyền thống đặc sắc của các dân tộc Việt Nam',
    category: 'culture',
    location: 'Huế',
    address: '15 Lê Lợi, TP. Huế, Thừa Thiên Huế',
    phone: '0234-3845-678',
    email: 'museum@culture-hue.vn',
    website: '',
    openingHours: '7:30 - 16:30 (Thứ 2 - Thứ 7)',
    ticketPrice: '30,000 VND',
    status: 'inactive',
    rating: 4.1,
    visitorsCount: 8960,
    createdAt: '2023-04-05',
    updatedAt: '2024-01-22',
  },
];

// ======================== Configurations ========================
const STATUS_CONFIG: Record<MuseumStatus, { label: string; className: string }> = {
  active: { label: 'Hoạt động', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Không hoạt động', className: 'bg-red-100 text-red-700 border-red-200' },
  pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  suspended: { label: 'Tạm khóa', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  maintenance: { label: 'Bảo trì', className: 'bg-blue-100 text-blue-700 border-blue-200' },
};

// ======================== Functional Components ========================
function MuseumStats({ data }: { data: Museum[] }) {
  const stats = useMemo(
    () => ({
      total: data.length,
      active: data.filter((m) => m.status === 'active').length,
      highRated: data.filter((m) => (m.rating || 0) >= 4.5).length,
      totalVisitors: data.reduce((sum, m) => sum + (m.visitorsCount || 0), 0),
    }),
    [data]
  );

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tổng bảo tàng</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-orange-600" />
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
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Đánh giá cao</p>
              <p className="text-3xl font-bold text-slate-900">{stats.highRated}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tổng khách thăm</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalVisitors.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MuseumFilters({
  categoryFilter,
  statusFilter,
  locationFilter,
  locations,
  onCategoryChange,
  onStatusChange,
  onLocationChange,
  onClearFilters,
  hasActiveFilters,
}: {
  categoryFilter: MuseumCategory | 'all';
  statusFilter: MuseumStatus | 'all';
  locationFilter: string;
  locations: string[];
  onCategoryChange: (value: MuseumCategory | 'all') => void;
  onStatusChange: (value: MuseumStatus | 'all') => void;
  onLocationChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Select value={categoryFilter} onValueChange={(value: string) => onCategoryChange(value as any)}>
        <SelectTrigger className="w-40">
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

      <Select value={statusFilter} onValueChange={(value: string) => onStatusChange(value as any)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Trạng thái</SelectItem>
          <SelectItem value="active">Hoạt động</SelectItem>
          <SelectItem value="inactive">Không hoạt động</SelectItem>
          <SelectItem value="pending">Chờ duyệt</SelectItem>
          <SelectItem value="suspended">Tạm khóa</SelectItem>
        </SelectContent>
      </Select>

      <Select value={locationFilter} onValueChange={onLocationChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Địa điểm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Địa điểm</SelectItem>
          {locations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
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
export default function MuseumList() {
  // ======================== States ========================
  const [categoryFilter, setCategoryFilter] = useState<MuseumCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MuseumStatus | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  // Modal states
  const [viewModal, setViewModal] = useState<{ open: boolean; museum: Museum | null }>({
    open: false,
    museum: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; museum: Museum | null }>({
    open: false,
    museum: null,
  });
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; museum: Museum | null }>({
    open: false,
    museum: null,
  });

  // Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // ======================== Computed Values ========================
  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(mockMuseums.map((m) => m.location))];
    return uniqueLocations.sort();
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    return mockMuseums.filter((museum) => {
      const categoryMatch = categoryFilter === 'all' || museum.category === categoryFilter;
      const statusMatch = statusFilter === 'all' || museum.status === statusFilter;
      const locationMatch = locationFilter === 'all' || museum.location === locationFilter;
      return categoryMatch && statusMatch && locationMatch;
    });
  }, [categoryFilter, statusFilter, locationFilter]);

  const hasActiveFilters = categoryFilter !== 'all' || statusFilter !== 'all' || locationFilter !== 'all';

  // ======================== Table Columns ========================
  const columns = useMemo<ColumnDef<Museum>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
          >
            Bảo tàng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">{row.original.name}</p>
              <p className="text-sm text-slate-500">{row.original.location}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Danh mục',
        cell: ({ row }) => {
          const config = MUSEUM_CATEGORIES[row.original.category];
          return (
            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
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
        accessorKey: 'rating',
        header: 'Đánh giá',
        cell: ({ row }) => (
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{row.original.rating}</span>
          </div>
        ),
      },
      {
        accessorKey: 'visitorsCount',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
          >
            Khách thăm
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-slate-400" />
            <span>{row.original.visitorsCount?.toLocaleString()}</span>
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
    setCategoryFilter('all');
    setStatusFilter('all');
    setLocationFilter('all');
  };

  const handleAdd = () => {
    setAddModal(true);
  };

  const handleEdit = (museum: Museum) => {
    setEditModal({ open: true, museum });
  };

  const handleView = (museum: Museum) => {
    setViewModal({ open: true, museum });
  };

  const handleDelete = (museum: Museum) => {
    setDeleteModal({ open: true, museum });
  };

  const handleSubmit = (data: MuseumFormData) => {
    console.log('Form submitted:', data);
    // TODO: API call to save data
    setAddModal(false);
    setEditModal({ open: false, museum: null });
  };

  const handleConfirmDelete = () => {
    console.log('Deleting museum:', deleteModal.museum?.id);
    // TODO: API call to delete
    setDeleteModal({ open: false, museum: null });
  };

  // ======================== Render ========================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Bảo tàng</h1>
        </div>
      </div>

      {/* Stats */}
      <MuseumStats data={filteredData} />

      {/* Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Danh sách Bảo tàng ({filteredData.length})</h2>
        <div className="flex items-center gap-4">
          <MuseumFilters
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            locationFilter={locationFilter}
            locations={locations}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
            onLocationChange={setLocationFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm bảo tàng
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
      <MuseumViewModal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, museum: null })}
        data={viewModal.museum}
        title="Chi tiết Bảo tàng"
      />

      {/* Add/Edit Modal */}
      <MuseumForm
        open={addModal || editModal.open}
        onClose={() => {
          setAddModal(false);
          setEditModal({ open: false, museum: null });
        }}
        title={editModal.museum ? 'Cập nhật Bảo tàng' : 'Thêm Bảo tàng Mới'}
        mode={editModal.museum ? 'edit' : 'add'}
        defaultValues={
          editModal.museum
            ? {
                name: editModal.museum.name || '',
                description: editModal.museum.description || '',
                category: editModal.museum.category,
                location: editModal.museum.location || '',
                address: editModal.museum.address || '',
                phone: editModal.museum.phone || '',
                email: editModal.museum.email || '',
                website: editModal.museum.website || '',
                openingHours: editModal.museum.openingHours || '',
                ticketPrice: editModal.museum.ticketPrice || '',
                status: editModal.museum.status,
              }
            : undefined
        }
        onSubmit={handleSubmit}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, museum: null })}
        data={deleteModal.museum}
        title="Xóa Bảo tàng"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
