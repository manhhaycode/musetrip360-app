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
import { ColumnDef } from '@tanstack/react-table';
import { BadgeCheckIcon, Edit, Eye, MoreHorizontal, Plus, Send, X } from 'lucide-react';
import { useCallback, useMemo } from 'react';
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

  const tableState = useDataTableState({
    defaultPerPage: 10,
    defaultSort: [{ id: 'createdAt', desc: true }],
  });

  const { mutate: createEventRoom } = useCreateEventRoom();

  const {
    data: eventsData,
    isLoading: loadingEvents,
    refetch: refetchEvents,
  } = useGetEventsByMuseumId(
    museumId,
    {
      Page: tableState.pagination.pageIndex + 1,
      PageSize: tableState.pagination.pageSize,
    },
    {
      enabled: !!museumId,
    }
  );

  const { mutate: submitEvent } = useSubmitEvent({
    onSuccess: () => {
      toast.success('Gửi sự kiện thành công');
      refetchEvents();
    },
    onError: (error) => {
      toast.error('Gửi sự kiện thất bại');
      console.error('Submit event error:', error);
    },
  });

  const { mutate: cancelEvent } = useCancelEvent({
    onSuccess: () => {
      toast.success('Hủy sự kiện thành công');
      refetchEvents();
    },
    onError: (error) => {
      toast.error('Hủy sự kiện thất bại');
      console.error('Cancel event error:', error);
    },
  });

  const { mutate: evaluateEvent } = useEvaluateEvent({
    onSuccess: () => {
      toast.success('Cập nhật sự kiện thành công');
      refetchEvents();
    },
    onError: (error) => {
      toast.error('Cập nhật sự kiện thất bại');
      console.error('Evaluate event error:', error);
    },
  });

  const handleAction = useCallback(
    () => ({
      onView: (data: Event) => onView?.(data),
      onEdit: (data: Event) => onEdit?.(data),
      onSubmit: (data: Event) => {
        submitEvent(data.id);
        createEventRoom({
          eventId: data.id,
          name: `Phòng sự kiện ${data.title}`,
          description: `Phòng dành cho sự kiện ${data.title}`,
          status: 'Active',
        });
        onSubmit?.(data);
      },
      onCancel: (data: Event) => {
        cancelEvent(data.id);
        onCancel?.(data);
      },
    }),
    [onView, onEdit, submitEvent, createEventRoom, onSubmit, cancelEvent, onCancel]
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
        cell: ({ row }) => <div className="font-medium max-w-60 truncate">{row.original.title}</div>,
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
        accessorKey: 'location',
        header: 'Địa điểm',
        enableSorting: false,
        cell: ({ row }) => <div className="text-sm max-w-40 truncate">{row.original.location}</div>,
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

              {row.original.status === EventStatusEnum.Pending && (
                <DropdownMenuItem
                  onClick={() => evaluateEvent({ eventId: row.original.id, isApproved: true })}
                  className="text-green-600"
                >
                  <BadgeCheckIcon className="mr-2 h-4 w-4" />
                  Phê duyệt
                </DropdownMenuItem>
              )}

              {(row.original.status === EventStatusEnum.Draft ||
                row.original.status === EventStatusEnum.Pending ||
                (row.original.status === EventStatusEnum.Published &&
                  new Date(row.original.startTime) > new Date())) && (
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
    [handleAction, evaluateEvent]
  );

  const { table } = useDataTable<Event, string>({
    data: get(eventsData, 'list') || initialData,
    columns,
    rowCount: get(eventsData, 'total', 0),
    manualHandle: true,
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

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Button variant="default" size="sm" className="ml-2" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sự kiện
        </Button>
      </DataTableToolbar>
    </DataTable>
  );
};

export default EventDataTable;
