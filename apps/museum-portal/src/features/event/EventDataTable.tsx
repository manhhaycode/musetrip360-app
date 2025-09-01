import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { DataTable, DataTableToolbar, useDataTable, useDataTableState, Option } from '@musetrip360/ui-core/data-table';
import { toast } from '@musetrip360/ui-core/sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@musetrip360/ui-core/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { BadgeCheckIcon, Edit, Eye, MoreHorizontal, Plus, Send, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import {
  Event,
  EventTypeEnum,
  useGetEventsByMuseumId,
  useSubmitEvent,
  useCancelEvent,
  EventStatusEnum,
  useEvaluateEvent,
  useCreateEventRoom,
} from '@musetrip360/event-management';

import get from 'lodash.get';
import { EventStatusName, EventTypeName } from '@/config/constants/event';
import { PERMISSION_EVENT_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';

interface EventDataTableProps {
  museumId: string;
  onView?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onAdd?: () => void;
  onSubmit?: (event: Event) => void;
  onCancel?: (event: Event) => void;
}

const statusOptions: Option[] = Object.entries(EventStatusName).map(([value, label]) => ({
  label,
  value: value as EventStatusEnum,
}));

const eventTypeOptions: Option[] = Object.entries(EventTypeName).map(([value, label]) => ({
  label,
  value: value as EventTypeEnum,
}));

const EventDataTable = ({ museumId, onView, onEdit, onAdd, onSubmit, onCancel }: EventDataTableProps) => {
  const initialData: Event[] = useMemo(() => [], []);
  const { hasPermission } = useRolebaseStore();

  // State for operations and confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type:
      | 'single-submit'
      | 'single-cancel'
      | 'single-approve'
      | 'single-reject'
      | 'bulk-submit'
      | 'bulk-cancel'
      | 'bulk-approve'
      | 'bulk-reject';
    events: Event[];
  }>({
    isOpen: false,
    type: 'bulk-submit',
    events: [],
  });

  // State for bulk operation progress
  const [bulkProgress, setBulkProgress] = useState<{
    isProcessing: boolean;
    current: number;
    total: number;
  }>({
    isProcessing: false,
    current: 0,
    total: 0,
  });

  const tableState = useDataTableState({
    defaultPerPage: 10,
    defaultSort: [{ id: 'title', desc: true }],
  });

  const { mutate: createEventRoom } = useCreateEventRoom();

  const {
    data: eventsData,
    isLoading: loadingEvents,
    refetch: refetchEvents,
  } = useGetEventsByMuseumId(
    museumId,
    {
      // Page: tableState.pagination.pageIndex + 1,
      // PageSize: tableState.pagination.pageSize,
      Page: 1,
      PageSize: 10000,
    },
    {
      enabled: !!museumId,
    }
  );

  const { mutate: submitEvent } = useSubmitEvent({
    onSuccess: () => {
      if (!bulkProgress.isProcessing) {
        toast.success('Gửi sự kiện thành công');
        refetchEvents();
      }
    },
    onError: (error) => {
      if (!bulkProgress.isProcessing) {
        toast.error('Gửi sự kiện thất bại');
      }
      console.error('Submit event error:', error);
    },
  });

  const { mutate: cancelEvent } = useCancelEvent({
    onSuccess: () => {
      if (!bulkProgress.isProcessing) {
        toast.success('Hủy sự kiện thành công');
        refetchEvents();
      }
    },
    onError: (error) => {
      if (!bulkProgress.isProcessing) {
        toast.error('Hủy sự kiện thất bại');
      }
      console.error('Cancel event error:', error);
    },
  });

  const { mutate: evaluateEvent } = useEvaluateEvent({
    onSuccess: () => {
      if (!bulkProgress.isProcessing) {
        toast.success('Cập nhật sự kiện thành công');
        refetchEvents();
      }
    },
    onError: (error) => {
      if (!bulkProgress.isProcessing) {
        toast.error('Cập nhật sự kiện thất bại');
      }
      console.error('Evaluate event error:', error);
    },
  });

  // Sequential API operation handler for bulk operations
  const handleSequentialOperations = useCallback(
    async (events: Event[], operation: 'submit' | 'cancel' | 'approve' | 'reject') => {
      setBulkProgress({ isProcessing: true, current: 0, total: events.length });

      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < events.length; i++) {
        const event = events[i]!;
        setBulkProgress((prev) => ({ ...prev, current: i + 1 }));

        try {
          if (operation === 'submit') {
            submitEvent(event.id);
            createEventRoom({
              eventId: event.id,
              name: `Phòng sự kiện ${event.title}`,
              description: `Phòng dành cho sự kiện ${event.title}`,
              status: 'Active',
            });
          } else if (operation === 'cancel') {
            cancelEvent(event.id);
          } else if (operation === 'approve') {
            evaluateEvent({ eventId: event.id, isApproved: true });
          } else if (operation === 'reject') {
            evaluateEvent({ eventId: event.id, isApproved: false });
          }
          successCount++;

          // Add small delay between operations to prevent API overload
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Failed to ${operation} event ${event.title}:`, error);
          failureCount++;
        }
      }

      setBulkProgress({ isProcessing: false, current: 0, total: 0 });
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));

      // Show summary notification only after all operations complete
      if (successCount > 0 && failureCount === 0) {
        const successMessage = getSuccessMessage(operation, successCount);
        toast.success(successMessage);
      } else if (successCount > 0 && failureCount > 0) {
        toast.success(`${successCount} sự kiện ${getOperationText(operation)} thành công, ${failureCount} thất bại`);
      } else if (failureCount > 0) {
        toast.error(`Thất bại khi ${getOperationText(operation)} ${failureCount} sự kiện`);
      }

      // Refetch data only once after all operations complete
      refetchEvents();
    },
    [submitEvent, createEventRoom, cancelEvent, evaluateEvent, refetchEvents]
  );

  // Helper functions for messages
  const getSuccessMessage = (operation: string, count: number) => {
    switch (operation) {
      case 'submit':
        return `Đã gửi ${count} sự kiện để duyệt thành công`;
      case 'cancel':
        return `Đã hủy ${count} sự kiện thành công`;
      case 'approve':
        return `Đã phê duyệt ${count} sự kiện thành công`;
      case 'reject':
        return `Đã từ chối ${count} sự kiện thành công`;
      default:
        return `Đã xử lý ${count} sự kiện thành công`;
    }
  };

  const getOperationText = (operation: string) => {
    switch (operation) {
      case 'submit':
        return 'gửi duyệt';
      case 'cancel':
        return 'hủy';
      case 'approve':
        return 'phê duyệt';
      case 'reject':
        return 'từ chối';
      default:
        return 'xử lý';
    }
  };

  // Single action handlers
  const handleSingleSubmit = useCallback((event: Event) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single-submit',
      events: [event],
    });
  }, []);

  const handleSingleCancel = useCallback((event: Event) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single-cancel',
      events: [event],
    });
  }, []);

  const handleSingleApprove = useCallback((event: Event) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single-approve',
      events: [event],
    });
  }, []);

  const handleSingleReject = useCallback((event: Event) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single-reject',
      events: [event],
    });
  }, []);

  // Bulk action handlers
  const handleBulkSubmit = useCallback((selectedEvents: Event[]) => {
    setConfirmDialog({
      isOpen: true,
      type: 'bulk-submit',
      events: selectedEvents.filter((event) => event.status === EventStatusEnum.Draft),
    });
  }, []);

  const handleBulkCancel = useCallback((selectedEvents: Event[]) => {
    setConfirmDialog({
      isOpen: true,
      type: 'bulk-cancel',
      events: selectedEvents.filter(
        (event) =>
          event.status === EventStatusEnum.Draft ||
          event.status === EventStatusEnum.Pending ||
          (event.status === EventStatusEnum.Published && new Date(event.startTime) > new Date())
      ),
    });
  }, []);

  const handleBulkApprove = useCallback((selectedEvents: Event[]) => {
    setConfirmDialog({
      isOpen: true,
      type: 'bulk-approve',
      events: selectedEvents.filter((event) => event.status === EventStatusEnum.Pending),
    });
  }, []);

  const handleBulkReject = useCallback((selectedEvents: Event[]) => {
    setConfirmDialog({
      isOpen: true,
      type: 'bulk-reject',
      events: selectedEvents.filter((event) => event.status === EventStatusEnum.Pending),
    });
  }, []);

  const handleConfirmOperation = useCallback(() => {
    const { type, events } = confirmDialog;

    if (type === 'single-submit' || type === 'bulk-submit') {
      handleSequentialOperations(events, 'submit');
    } else if (type === 'single-cancel' || type === 'bulk-cancel') {
      handleSequentialOperations(events, 'cancel');
    } else if (type === 'single-approve' || type === 'bulk-approve') {
      handleSequentialOperations(events, 'approve');
    } else if (type === 'single-reject' || type === 'bulk-reject') {
      handleSequentialOperations(events, 'reject');
    }
  }, [confirmDialog, handleSequentialOperations]);

  const handleCancelOperation = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleAction = useCallback(
    () => ({
      onView: (data: Event) => onView?.(data),
      onEdit: (data: Event) => onEdit?.(data),
      onSubmit: (data: Event) => {
        handleSingleSubmit(data);
        onSubmit?.(data);
      },
      onCancel: (data: Event) => {
        handleSingleCancel(data);
        onCancel?.(data);
      },
      onApprove: (data: Event) => {
        handleSingleApprove(data);
      },
      onReject: (data: Event) => {
        handleSingleReject(data);
      },
    }),
    [
      onView,
      onEdit,
      onSubmit,
      onCancel,
      handleSingleSubmit,
      handleSingleCancel,
      handleSingleApprove,
      handleSingleReject,
    ]
  );

  const getStatusVariant = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.Published:
        return 'default';
      case EventStatusEnum.Pending:
        return 'secondary';
      case EventStatusEnum.Draft:
        return 'outline';
      case EventStatusEnum.Cancelled:
        return 'destructive';
      case EventStatusEnum.Expired:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getEventTypeVariant = (eventType: EventTypeEnum) => {
    switch (eventType) {
      case EventTypeEnum.Exhibition:
        return 'default';
      case EventTypeEnum.Workshop:
        return 'secondary';
      case EventTypeEnum.Lecture:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const columns = useMemo<ColumnDef<Event>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            className="size-5"
            checked={table.getIsAllRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(checked) => table.toggleAllRowsSelected(!!checked)}
          />
        ),
        enableSorting: false,
        cell: ({ row }) => (
          <Checkbox
            className="size-5"
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
          />
        ),
      },
      {
        meta: {
          variant: 'text',
          placeholder: 'Tìm kiếm theo tiêu đề',
          label: 'Tiêu đề',
          isSortable: true,
          unit: '',
        },
        accessorKey: 'title',
        header: 'Tiêu đề',
        enableSorting: true,
        cell: ({ row }) => {
          const thumbnailFile = row.original.metadata?.thumbnail;
          const thumbnailUrl = typeof thumbnailFile === 'string' ? thumbnailFile : null;
          return (
            <div className="flex items-center gap-3">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={row.original.title}
                  className="w-16 h-12 object-cover rounded flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-12 bg-gray-200 flex min-w-fit items-center justify-center rounded shrink-0">
                  <span className="text-xs text-muted-foreground">No Image</span>
                </div>
              )}
              <div className="font-medium max-w-48 truncate" title={row.original.title}>
                {row.original.title}
              </div>
            </div>
          );
        },
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Lọc theo loại sự kiện',
          label: 'Loại sự kiện',
          isSortable: true,
          unit: '',
          options: eventTypeOptions,
        },
        accessorKey: 'eventType',
        header: 'Loại',
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'arrIncludesSome',
        cell: ({ row }) => (
          <Badge variant={getEventTypeVariant(row.original.eventType)}>{row.original.eventType}</Badge>
        ),
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Lọc theo trạng thái',
          label: 'Trạng thái',
          isSortable: true,
          unit: '',
          options: statusOptions,
        },
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'arrIncludesSome',
        cell: ({ row }) => (
          <Badge variant={getStatusVariant(row.original.status)}>{EventStatusName[row.original.status] ?? 'N/A'}</Badge>
        ),
      },
      {
        accessorKey: 'startTime',
        header: 'Thời gian bắt đầu',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm">
            {new Date(row.original.startTime).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        ),
      },
      {
        accessorKey: 'capacity',
        header: 'Quy mô',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.capacity - row.original.availableSlots}/{row.original.capacity}
          </div>
        ),
      },
      {
        accessorKey: 'createdByUser.fullName',
        header: 'Người tạo',
        enableSorting: false,
        cell: ({ row }) => <div className="text-sm">{row.original.createdByUser?.fullName || 'Unknown'}</div>,
      },
      {
        id: 'actions',
        header: 'Hành động',
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleAction().onView(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleAction().onEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>

              {row.original.status === EventStatusEnum.Draft && (
                <DropdownMenuItem onClick={() => handleAction().onSubmit(row.original)} className="text-blue-600">
                  <Send className="mr-2 h-4 w-4" />
                  Gửi để duyệt
                </DropdownMenuItem>
              )}

              {row.original.status === EventStatusEnum.Pending &&
                hasPermission(museumId, PERMISSION_EVENT_MANAGEMENT) && (
                  <>
                    <DropdownMenuItem onClick={() => handleAction().onApprove(row.original)} className="text-green-600">
                      <BadgeCheckIcon className="mr-2 h-4 w-4" />
                      Phê duyệt
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction().onReject(row.original)} className="text-red-600">
                      <X className="mr-2 h-4 w-4" />
                      Từ chối
                    </DropdownMenuItem>
                  </>
                )}

              {(row.original.status === EventStatusEnum.Draft ||
                row.original.status === EventStatusEnum.Pending ||
                (row.original.status === EventStatusEnum.Published && new Date(row.original.startTime) > new Date()) ||
                hasPermission(museumId, PERMISSION_EVENT_MANAGEMENT)) && (
                <DropdownMenuItem onClick={() => handleAction().onCancel(row.original)} className="text-orange-600">
                  <X className="mr-2 h-4 w-4" />
                  Hủy
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [hasPermission, museumId, handleAction]
  );

  const { table } = useDataTable<Event, string>({
    data: get(eventsData, 'list') || initialData,
    columns,
    getRowId: (row) => row.id.toString(),
    ...tableState,
  });

  if (loadingEvents) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedEvents = selectedRows.map((row) => row.original);
  const hasSelection = selectedEvents.length > 0;

  // Check permissions for bulk operations
  const canBulkSubmit = hasSelection && selectedEvents.some((event) => event.status === EventStatusEnum.Draft);
  const canBulkCancel =
    hasSelection &&
    selectedEvents.some(
      (event) =>
        event.status === EventStatusEnum.Draft ||
        event.status === EventStatusEnum.Pending ||
        (event.status === EventStatusEnum.Published && new Date(event.startTime) > new Date()) ||
        hasPermission(museumId, PERMISSION_EVENT_MANAGEMENT)
    );
  const canBulkApprove =
    hasSelection &&
    selectedEvents.some((event) => event.status === EventStatusEnum.Pending) &&
    hasPermission(museumId, PERMISSION_EVENT_MANAGEMENT);
  const canBulkReject =
    hasSelection &&
    selectedEvents.some((event) => event.status === EventStatusEnum.Pending) &&
    hasPermission(museumId, PERMISSION_EVENT_MANAGEMENT);

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          {hasSelection && (canBulkSubmit || canBulkCancel || canBulkApprove || canBulkReject) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Bulk Actions ({selectedEvents.length})
                  <MoreHorizontal className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {canBulkSubmit && (
                  <DropdownMenuItem
                    onClick={() => handleBulkSubmit(selectedEvents)}
                    className="text-blue-600"
                    disabled={bulkProgress.isProcessing}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Gửi để duyệt
                  </DropdownMenuItem>
                )}

                {canBulkApprove && (
                  <DropdownMenuItem
                    onClick={() => handleBulkApprove(selectedEvents)}
                    className="text-green-600"
                    disabled={bulkProgress.isProcessing}
                  >
                    <BadgeCheckIcon className="mr-2 h-4 w-4" />
                    Phê duyệt
                  </DropdownMenuItem>
                )}

                {canBulkReject && (
                  <DropdownMenuItem
                    onClick={() => handleBulkReject(selectedEvents)}
                    className="text-red-600"
                    disabled={bulkProgress.isProcessing}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Từ chối
                  </DropdownMenuItem>
                )}

                {(canBulkSubmit || canBulkApprove || canBulkReject) && canBulkCancel && <DropdownMenuSeparator />}

                {canBulkCancel && (
                  <DropdownMenuItem
                    onClick={() => handleBulkCancel(selectedEvents)}
                    className="text-orange-600"
                    disabled={bulkProgress.isProcessing}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Hủy sự kiện
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="default" size="sm" className="ml-2" onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sự kiện
          </Button>
        </DataTableToolbar>
      </DataTable>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={handleCancelOperation}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {(confirmDialog.type === 'single-submit' || confirmDialog.type === 'bulk-submit') &&
                'Gửi Sự Kiện Để Duyệt'}
              {(confirmDialog.type === 'single-cancel' || confirmDialog.type === 'bulk-cancel') && 'Hủy Sự Kiện'}
              {(confirmDialog.type === 'single-approve' || confirmDialog.type === 'bulk-approve') &&
                'Phê Duyệt Sự Kiện'}
              {(confirmDialog.type === 'single-reject' || confirmDialog.type === 'bulk-reject') && 'Từ Chối Sự Kiện'}
            </DialogTitle>
            <DialogDescription>
              {(confirmDialog.type === 'single-submit' || confirmDialog.type === 'bulk-submit') &&
                `Bạn có chắc chắn muốn gửi ${confirmDialog.events.length === 1 ? 'sự kiện này' : `${confirmDialog.events.length} sự kiện`} để duyệt? ${confirmDialog.events.length === 1 ? 'Sự kiện' : 'Các sự kiện'} sẽ được chuyển sang trạng thái chờ duyệt.`}
              {(confirmDialog.type === 'single-cancel' || confirmDialog.type === 'bulk-cancel') &&
                `Bạn có chắc chắn muốn hủy ${confirmDialog.events.length === 1 ? 'sự kiện này' : `${confirmDialog.events.length} sự kiện`}? Hành động này không thể hoàn tác.`}
              {(confirmDialog.type === 'single-approve' || confirmDialog.type === 'bulk-approve') &&
                `Bạn có chắc chắn muốn phê duyệt ${confirmDialog.events.length === 1 ? 'sự kiện này' : `${confirmDialog.events.length} sự kiện`}? ${confirmDialog.events.length === 1 ? 'Sự kiện' : 'Các sự kiện'} sẽ được công khai cho người dùng.`}
              {(confirmDialog.type === 'single-reject' || confirmDialog.type === 'bulk-reject') &&
                `Bạn có chắc chắn muốn từ chối ${confirmDialog.events.length === 1 ? 'sự kiện này' : `${confirmDialog.events.length} sự kiện`}? ${confirmDialog.events.length === 1 ? 'Sự kiện' : 'Các sự kiện'} sẽ được chuyển về trạng thái nháp.`}
            </DialogDescription>
          </DialogHeader>

          {/* Show events being affected */}
          {confirmDialog.events.length > 0 && (
            <div className="max-h-80 overflow-y-auto space-y-2 pr-4 -mr-4 my-4">
              {confirmDialog.events.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2 border rounded-lg">
                  {event.metadata?.thumbnail ? (
                    <img
                      src={event.metadata.thumbnail}
                      alt={event.title}
                      className="w-16 h-12 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-gray-200 flex min-w-fit items-center justify-center rounded shrink-0">
                      <span className="text-xs text-muted-foreground">No Image</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {EventTypeName[event.eventType]} • {event.location}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(event.status)} className="text-xs">
                    {EventStatusName[event.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Bulk operation progress */}
          {bulkProgress.isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>
                  {bulkProgress.current} of {bulkProgress.total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelOperation} disabled={bulkProgress.isProcessing}>
              Hủy
            </Button>
            <Button
              variant={
                confirmDialog.type.includes('reject') || confirmDialog.type.includes('cancel')
                  ? 'destructive'
                  : 'default'
              }
              onClick={handleConfirmOperation}
              disabled={bulkProgress.isProcessing}
            >
              {bulkProgress.isProcessing
                ? 'Đang xử lý...'
                : confirmDialog.type === 'single-submit' || confirmDialog.type === 'bulk-submit'
                  ? 'Gửi để duyệt'
                  : confirmDialog.type === 'single-cancel' || confirmDialog.type === 'bulk-cancel'
                    ? 'Hủy sự kiện'
                    : confirmDialog.type === 'single-approve' || confirmDialog.type === 'bulk-approve'
                      ? 'Phê duyệt'
                      : 'Từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventDataTable;
