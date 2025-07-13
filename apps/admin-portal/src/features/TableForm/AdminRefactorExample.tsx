/**
 * EXAMPLE: Cách refactor admin components để sử dụng TableForm
 *
 * TRƯỚC khi refactor: admin/MuseumList.tsx có cả table logic và form logic
 * SAU khi refactor:
 * - admin/MuseumList.tsx chỉ có table logic (@tanstack/react-table)
 * - TableForm/MuseumForm.tsx handle tất cả form logic
 */

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

// Import các TableForm components
import { DeleteConfirmModal, MuseumForm, MuseumFormData, MuseumViewModal } from '../TableForm';

import { Museum } from '../types';

// Component này CHỈ focus vào table logic
export default function RefactoredMuseumList() {
  // ============ TABLE STATE (chỉ liên quan @tanstack/react-table) ============
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState('');

  // ============ MODAL STATE (liên quan TableForm) ============
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; museum: Museum | null }>({
    open: false,
    museum: null,
  });
  const [viewModal, setViewModal] = useState<{ open: boolean; museum: Museum | null }>({
    open: false,
    museum: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; museum: Museum | null }>({
    open: false,
    museum: null,
  });

  // ============ TABLE COLUMNS (chỉ liên quan display) ============
  const columns = useMemo<ColumnDef<Museum>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Tên bảo tàng',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'category',
        header: 'Danh mục',
      },
      {
        accessorKey: 'location',
        header: 'Địa điểm',
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
      },
      {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => {
          const museum = row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewModal({ open: true, museum })}
                className="text-blue-600 hover:text-blue-800"
              >
                Xem
              </button>
              <button
                onClick={() => setEditModal({ open: true, museum })}
                className="text-green-600 hover:text-green-800"
              >
                Sửa
              </button>
              <button
                onClick={() => setDeleteModal({ open: true, museum })}
                className="text-red-600 hover:text-red-800"
              >
                Xóa
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  // ============ MOCK DATA ============
  const mockMuseums: Museum[] = [
    {
      id: 1,
      name: 'Bảo tàng Lịch sử Việt Nam',
      category: 'history',
      location: 'Hà Nội',
      status: 'active',
      description: 'Bảo tàng lịch sử quốc gia',
      address: '1 Phạm Ngũ Lão, Hoàn Kiếm, Hà Nội',
      phone: '024-3825-2853',
      email: 'info@vnmh.gov.vn',
      website: 'https://baotanglichsu.vn',
      openingHours: '8:00 - 17:00 (Thứ 3 - Chủ nhật)',
      ticketPrice: '40,000 VND',
      createdAt: '2023-01-15',
      rating: 4.5,
      visitorsCount: 120000,
    },
  ];

  // ============ TABLE INSTANCE ============
  const table = useReactTable({
    data: mockMuseums,
    columns,
    state: {
      sorting,
      columnVisibility,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // ============ FORM HANDLERS (delegate to TableForm) ============
  const handleAddMuseum = (data: MuseumFormData) => {
    console.log('Add museum:', data);
    // API call để thêm museum
    setAddModal(false);
  };

  const handleEditMuseum = (data: MuseumFormData) => {
    console.log('Edit museum:', data);
    // API call để update museum
    setEditModal({ open: false, museum: null });
  };

  const handleDeleteMuseum = () => {
    console.log('Delete museum:', deleteModal.museum?.id);
    // API call để xóa museum
    setDeleteModal({ open: false, museum: null });
  };

  return (
    <div className="space-y-4">
      {/* ============ TABLE UI (@tanstack/react-table) ============ */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý Bảo tàng</h1>
        <button
          onClick={() => setAddModal(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Thêm Bảo tàng
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Tìm kiếm bảo tàng..."
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm px-3 py-2 border rounded-lg"
      />

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 text-left">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button onClick={header.column.getToggleSortingHandler()} className="font-medium">
                        {typeof header.column.columnDef.header === 'string' ? header.column.columnDef.header : ''}
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    ) : (
                      <span className="font-medium">
                        {typeof header.column.columnDef.header === 'string' ? header.column.columnDef.header : ''}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {typeof cell.getValue() === 'string' ? (cell.getValue() as string) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ============ TABLEFORM MODALS (form logic) ============ */}

      {/* Add Museum Modal */}
      <MuseumForm
        open={addModal}
        onClose={() => setAddModal(false)}
        title="Thêm Bảo tàng Mới"
        mode="add"
        onSubmit={handleAddMuseum}
      />

      {/* Edit Museum Modal */}
      <MuseumForm
        open={editModal.open}
        onClose={() => setEditModal({ open: false, museum: null })}
        title="Cập nhật Bảo tàng"
        mode="edit"
        defaultValues={
          editModal.museum
            ? {
                name: editModal.museum.name,
                description: editModal.museum.description || '',
                category: editModal.museum.category,
                location: editModal.museum.location,
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
        onSubmit={handleEditMuseum}
      />

      {/* View Museum Modal */}
      <MuseumViewModal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, museum: null })}
        data={viewModal.museum}
        title="Chi tiết Bảo tàng"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, museum: null })}
        data={deleteModal.museum}
        title="Xóa Bảo tàng"
        onConfirm={handleDeleteMuseum}
      />
    </div>
  );
}

/**
 * ============ SEPARATION OF CONCERNS ============
 *
 * 🔵 ADMIN COMPONENTS (admin/) - CHỈ LIÊN QUAN @tanstack/react-table:
 * - Table state management (sorting, pagination, filtering)
 * - Column definitions
 * - Table rendering với shadcn Table components
 * - Data fetching và cache management
 * - Table actions (view, edit, delete button clicks)
 *
 * 🟢 TABLEFORM COMPONENTS (TableForm/) - CHỈ LIÊN QUAN FORMS:
 * - Form validation với Zod schemas
 * - Form state management với react-hook-form
 * - Modal management
 * - Form submission handling
 * - View modal formatting
 * - Delete confirmation logic
 *
 * ============ BENEFITS ============
 *
 * ✅ Modular: Mỗi module có responsibility riêng biệt
 * ✅ Reusable: TableForm components có thể dùng cho nhiều entities
 * ✅ Maintainable: Dễ maintain và debug từng phần
 * ✅ Testable: Có thể test table logic và form logic riêng biệt
 * ✅ Scalable: Dễ dàng thêm entities mới
 * ✅ Type-safe: Full TypeScript support
 * ✅ Consistent: Shadcn UI đảm bảo consistent styling
 */
