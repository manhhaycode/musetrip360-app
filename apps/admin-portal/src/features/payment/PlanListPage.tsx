import { useCallback, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { DataTable } from '@musetrip360/ui-core/data-table';
import { useDataTable } from '@musetrip360/ui-core/data-table';
import { useDataTableState } from '@musetrip360/ui-core/data-table';
import { useGetAdminPlans, useDeletePlan } from '@musetrip360/payment-management/api';
import { Plan } from '@musetrip360/payment-management';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';
import get from 'lodash/get';
import PlanCreateForm from './components/PlanCreateForm';
import PlanEditForm from './components/PlanEditForm';
import PlanDetailModal from './components/PlanDetailModal';
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
import { formatCurrency } from '@musetrip360/shared';

const PlanListPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const {
    rowSelection,
    columnVisibility,
    columnFilters,
    sorting,
    pagination,
    setRowSelection,
    setColumnVisibility,
    setColumnFilters,
    setSorting,
    setPagination,
  } = useDataTableState({
    defaultPerPage: 10,
  });

  const { data: plansData, isLoading, refetch } = useGetAdminPlans();

  const deletePlan = useDeletePlan({
    onSuccess: () => {
      refetch();
      setDeleteDialogOpen(false);
      setSelectedPlan(null);
    },
    onError: (error) => {
      console.error('Failed to delete plan:', error);
    },
  });

  const handleEdit = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
    setEditModalOpen(true);
  }, []);

  const handleDetail = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
    setDetailModalOpen(true);
  }, []);

  const handleDelete = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = () => {
    if (selectedPlan) {
      deletePlan.mutate(selectedPlan.id);
    }
  };

  const handleSuccess = () => {
    refetch();
  };

  const columns = useMemo<ColumnDef<Plan>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Tên gói',
        cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
        meta: {
          variant: 'text',
          placeholder: 'Search by name',
          label: 'Tên gói',
          unit: '',
        },
      },
      {
        accessorKey: 'price',
        header: 'Giá',
        cell: ({ row }) => <div className="font-mono">{formatCurrency(row.original.price)}</div>,
      },
      {
        accessorKey: 'durationDays',
        header: 'Thời hạn (ngày)',
        cell: ({ row }) => <div className="text-sm">{row.original.durationDays} ngày</div>,
        meta: {
          variant: 'number',
          placeholder: 'Filter by duration',
          label: 'Thời hạn',
          unit: 'ngày',
        },
      },
      {
        accessorKey: 'maxEvents',
        header: 'Số sự kiện tối đa',
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.maxEvents && row.original.maxEvents < 100000
              ? `${row.original.maxEvents} sự kiện`
              : 'Không giới hạn'}
          </div>
        ),
        meta: {
          variant: 'number',
          placeholder: 'Filter by max events',
          label: 'Số sự kiện tối đa',
          unit: 'sự kiện',
        },
      },
      {
        accessorKey: 'discountPercent',
        header: 'Giảm giá (%)',
        cell: ({ row }) => (
          <div className="text-sm">{row.original.discountPercent ? `${row.original.discountPercent}%` : '0%'}</div>
        ),
        meta: {
          variant: 'number',
          placeholder: 'Filter by discount',
          label: 'Giảm giá',
          unit: '%',
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Trạng thái',
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          return (
            <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} variant="secondary">
              {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
            </Badge>
          );
        },
        meta: {
          variant: 'select',
          placeholder: 'Filter by status',
          label: 'Trạng thái',
          unit: '',
          options: [
            { label: 'Hoạt động', value: 'true' },
            { label: 'Ngừng hoạt động', value: 'false' },
          ],
        },
      },
      {
        accessorKey: 'subscriptionCount',
        header: 'Số lượng đăng ký',
        cell: ({ row }) => <div className="text-sm font-medium">{row.original.subscriptionCount.toLocaleString()}</div>,
        meta: {
          variant: 'number',
          placeholder: 'Filter by subscription count',
          label: 'Số lượng đăng ký',
          unit: '',
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Ngày tạo',
        cell: ({ row }) => <div className="text-sm">{new Date(row.original.createdAt).toLocaleDateString()}</div>,
        meta: {
          variant: 'date',
          placeholder: 'Filter by created date',
          label: 'Ngày tạo',
          unit: '',
          isSortable: true,
        },
      },
      {
        id: 'actions',
        header: 'Hành động',
        cell: ({ row }) => {
          const plan = row.original;
          return (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDetail(plan);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(plan);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(plan);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDetail, handleEdit, handleDelete]
  );

  const { table } = useDataTable({
    data: (plansData || []) as Plan[],
    columns,
    rowCount: get(plansData, 'length', 0),
    manualHandle: false,
    rowSelection,
    columnVisibility,
    columnFilters,
    sorting,
    pagination,
    setRowSelection,
    setColumnVisibility,
    setColumnFilters,
    setSorting,
    setPagination,
  });

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gói đăng ký</h1>
          <p className="text-muted-foreground">Quản lý và xem tất cả các gói đăng ký</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo gói mới
        </Button>
      </div>

      <DataTable
        table={table}
        isLoading={isLoading}
        handleClickRow={(plan) => {
          handleDetail(plan);
        }}
      />

      {/* Create Modal */}
      <PlanCreateForm open={createModalOpen} onOpenChange={setCreateModalOpen} onSuccess={handleSuccess} />

      {/* Edit Modal */}
      <PlanEditForm
        plan={selectedPlan}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleSuccess}
      />

      {/* Detail Modal */}
      <PlanDetailModal
        plan={selectedPlan}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa gói đăng ký</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa gói "{selectedPlan?.name}"? Hành động này không thể hoàn tác.
              {selectedPlan?.subscriptionCount && selectedPlan.subscriptionCount > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  Cảnh báo: Gói này hiện có {selectedPlan.subscriptionCount} đăng ký đang hoạt động.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletePlan.isPending}
            >
              {deletePlan.isPending ? 'Đang xóa...' : 'Xóa gói'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlanListPage;
