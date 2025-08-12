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
import { Edit, Eye, MoreHorizontal, Plus, Send, X } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import {
  Event,
  EventTypeEnum,
  useGetEventsByMuseumId,
  useSubmitEvent,
  useCancelEvent,
  EventStatusEnum,
} from '@musetrip360/event-management';

import get from 'lodash.get';

interface EventDataTableProps {
  museumId: string;
  onView?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onAdd?: () => void;
  onSubmit?: (event: Event) => void;
  onCancel?: (event: Event) => void;
}

const EventDataTable = ({ museumId, onView, onEdit, onAdd, onSubmit, onCancel }: EventDataTableProps) => {
  const initialData: Event[] = useMemo(() => [], []);

  const tableState = useDataTableState({
    defaultPerPage: 10,
    defaultSort: [{ id: 'createdAt', desc: true }],
  });

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
      toast.success('Event submitted successfully');
      refetchEvents();
    },
    onError: (error) => {
      toast.error('Failed to submit event');
      console.error('Submit event error:', error);
    },
  });

  const { mutate: cancelEvent } = useCancelEvent({
    onSuccess: () => {
      toast.success('Event cancelled successfully');
      refetchEvents();
    },
    onError: (error) => {
      toast.error('Failed to cancel event');
      console.error('Cancel event error:', error);
    },
  });

  const handleAction = useCallback(
    () => ({
      onView: (data: Event) => onView?.(data),
      onEdit: (data: Event) => onEdit?.(data),
      onSubmit: (data: Event) => {
        submitEvent(data.id);
        onSubmit?.(data);
      },
      onCancel: (data: Event) => {
        cancelEvent(data.id);
        onCancel?.(data);
      },
    }),
    [onView, onEdit, onSubmit, onCancel, submitEvent, cancelEvent]
  );

  const statusOptions: Option[] = useMemo(
    () => [
      { label: 'Draft', value: EventStatusEnum.Draft },
      { label: 'Pending', value: EventStatusEnum.Pending },
      { label: 'Published', value: EventStatusEnum.Published },
      { label: 'Cancelled', value: EventStatusEnum.Cancelled },
      { label: 'Expired', value: EventStatusEnum.Expired },
    ],
    []
  );

  const eventTypeOptions: Option[] = useMemo(
    () => [
      { label: 'Exhibition', value: EventTypeEnum.Exhibition },
      { label: 'Workshop', value: EventTypeEnum.Workshop },
      { label: 'Lecture', value: EventTypeEnum.Lecture },
      { label: 'Special Event', value: EventTypeEnum.SpecialEvent },
      { label: 'Holiday Event', value: EventTypeEnum.HolidayEvent },
      { label: 'Other', value: EventTypeEnum.Other },
    ],
    []
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
          placeholder: 'Search by title',
          label: 'Title',
          isSortable: true,
          unit: '',
        },
        accessorKey: 'title',
        header: 'Title',
        enableSorting: true,
        cell: ({ row }) => <div className="font-medium max-w-60 truncate">{row.original.title}</div>,
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Filter by event type',
          label: 'Event Type',
          isSortable: true,
          unit: '',
          options: eventTypeOptions,
        },
        accessorKey: 'eventType',
        header: 'Type',
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
          placeholder: 'Filter by status',
          label: 'Status',
          isSortable: true,
          unit: '',
          options: statusOptions,
        },
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'arrIncludesSome',
        cell: ({ row }) => <Badge variant={getStatusVariant(row.original.status)}>{row.original.status}</Badge>,
      },
      {
        accessorKey: 'startTime',
        header: 'Start Time',
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
        header: 'Location',
        enableSorting: false,
        cell: ({ row }) => <div className="text-sm max-w-40 truncate">{row.original.location}</div>,
      },
      {
        accessorKey: 'capacity',
        header: 'Capacity',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.capacity - row.original.availableSlots}/{row.original.capacity}
          </div>
        ),
      },
      {
        accessorKey: 'createdByUser.fullName',
        header: 'Created By',
        enableSorting: false,
        cell: ({ row }) => <div className="text-sm">{row.original.createdByUser?.fullName || 'Unknown'}</div>,
      },
      {
        id: 'actions',
        header: 'Actions',
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleAction().onView(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleAction().onEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              {row.original.status === EventStatusEnum.Draft && (
                <DropdownMenuItem onClick={() => handleAction().onSubmit(row.original)} className="text-blue-600">
                  <Send className="mr-2 h-4 w-4" />
                  Submit for Review
                </DropdownMenuItem>
              )}

              {(row.original.status === EventStatusEnum.Draft || row.original.status === EventStatusEnum.Pending) && (
                <DropdownMenuItem onClick={() => handleAction().onCancel(row.original)} className="text-orange-600">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleAction, statusOptions, eventTypeOptions]
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
          Add Event
        </Button>
      </DataTableToolbar>
    </DataTable>
  );
};

export default EventDataTable;
