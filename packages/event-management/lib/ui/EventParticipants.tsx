'use client';

import { useMemo, useCallback, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { DataTable, DataTableToolbar, useDataTable, useDataTableState, Option } from '@musetrip360/ui-core/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@musetrip360/ui-core/avatar';
import { toast } from '@musetrip360/ui-core/sonner';
import { Progress } from '@musetrip360/ui-core/progress';
import {
  Crown,
  User,
  GraduationCap,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  UserCheck,
  Clock,
  UserX,
  Users,
  UserPlus,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  useGetEventParticipantsByEvent,
  useDeleteEventParticipant,
  useUpdateEventParticipant,
} from '../api/hooks/useEventParticipant';
import type { Event, EventParticipant } from '../types';
import { ParticipantRoleEnum } from '../types';
import { AddParticipantDialog } from './AddParticipantDialog';

interface EventParticipantProps {
  event: Event;
  onUpdated?: () => void;
}

// Role icons and variants
const getRoleIcon = (role: ParticipantRoleEnum) => {
  switch (role) {
    case ParticipantRoleEnum.Organizer:
      return <Crown className="h-4 w-4" />;
    case ParticipantRoleEnum.TourGuide:
      return <GraduationCap className="h-4 w-4" />;
    case ParticipantRoleEnum.Guest:
      return <Star className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const getRoleVariant = (role: ParticipantRoleEnum): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (role) {
    case ParticipantRoleEnum.Organizer:
      return 'default';
    case ParticipantRoleEnum.TourGuide:
      return 'secondary';
    case ParticipantRoleEnum.Guest:
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status) {
    case 'Confirmed':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Cancelled':
      return 'destructive';
    case 'Attended':
      return 'default';
    default:
      return 'outline';
  }
};

export function EventParticipants({ event, onUpdated }: EventParticipantProps) {
  const initialData: EventParticipant[] = useMemo(() => [], []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Role and status filter options
  const roleOptions: Option[] = useMemo(
    () => [
      { label: 'Organizer', value: ParticipantRoleEnum.Organizer },
      { label: 'Attendee', value: ParticipantRoleEnum.Attendee },
      { label: 'TourGuide', value: ParticipantRoleEnum.TourGuide },
      { label: 'Guest', value: ParticipantRoleEnum.Guest },
    ],
    []
  );

  const statusOptions: Option[] = useMemo(
    () => [
      { label: 'Confirmed', value: 'Confirmed' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'Attended', value: 'Attended' },
    ],
    []
  );

  // Table state management
  const tableState = useDataTableState({
    defaultPerPage: 10,
    defaultSort: [{ id: 'joinedAt', desc: true }],
  });

  // API integration (client-side filtering only)
  const { data: participants = [], isLoading, refetch } = useGetEventParticipantsByEvent(event.id);

  // Mutations
  const { mutate: deleteParticipant } = useDeleteEventParticipant({
    onSuccess: () => {
      toast.success('Xóa người tham gia thành công');
      refetch();
      onUpdated?.();
    },
    onError: (error: any) => {
      toast.error('Xóa thất bại: ' + error.message);
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate: updateParticipant } = useUpdateEventParticipant({
    onSuccess: () => {
      toast.success('Cập nhật thành công');
      refetch();
      onUpdated?.();
    },
    onError: (error: any) => {
      toast.error('Cập nhật thất bại: ' + error.message);
    },
  });

  // Action handlers
  const handleAction = useCallback(
    () => ({
      onEdit: (data: EventParticipant) => {
        // Edit participant role/status logic
        console.log('Edit participant:', data);
      },
      onDelete: (data: EventParticipant) => {
        deleteParticipant(data.id);
      },
      onSendMessage: (data: EventParticipant) => {
        // Send message logic
        console.log('Send message to:', data);
      },
    }),
    [deleteParticipant]
  );

  // Table columns
  const columns = useMemo<ColumnDef<EventParticipant>[]>(
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
          placeholder: 'Tìm kiếm theo tên',
          label: 'Người tham gia',
          isSortable: false,
          unit: '',
        },
        accessorKey: 'name',
        header: 'Người tham gia',
        enableSorting: false,
        cell: ({ row }) => {
          const participant = row.original;
          return (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={participant.user?.avatarUrl || undefined} />
                <AvatarFallback>{participant.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{participant.user?.fullName || 'Unknown User'}</div>
                <div className="text-sm text-muted-foreground">{participant.user?.email}</div>
              </div>
            </div>
          );
        },
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Lọc vai trò',
          label: 'Vai trò',
          isSortable: true,
          unit: '',
          options: roleOptions,
        },
        filterFn: 'arrIncludesSome',
        accessorKey: 'role',
        header: 'Vai trò',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const role = row.original.role;
          return (
            <Badge variant={getRoleVariant(role)} className="flex items-center gap-1 w-fit">
              {getRoleIcon(role)}
              {role}
            </Badge>
          );
        },
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Lọc trạng thái',
          label: 'Trạng thái',
          isSortable: true,
          unit: '',
          options: statusOptions,
        },
        filterFn: 'arrIncludesSome',
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge variant={getStatusVariant(status)}>
              {status === 'Confirmed' && <UserCheck className="mr-1 h-3 w-3" />}
              {status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
              {status === 'Cancelled' && <UserX className="mr-1 h-3 w-3" />}
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'joinedAt',
        header: 'Ngày tham gia',
        enableSorting: true,
        cell: ({ row }) => {
          const joinedAt = row.original.joinedAt;
          return <div className="text-sm">{format(new Date(joinedAt), 'dd/MM/yyyy', { locale: vi })}</div>;
        },
      },
      {
        id: 'actions',
        header: 'Thao tác',
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
              <DropdownMenuItem onClick={() => handleAction().onEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Sửa vai trò
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction().onSendMessage(row.original)}>
                <Mail className="mr-2 h-4 w-4" />
                Gửi tin nhắn
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction().onDelete(row.original)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleAction, roleOptions, statusOptions]
  );

  // Setup data table
  const { table } = useDataTable<EventParticipant, string>({
    data: participants || initialData,
    columns,
    getRowId: (row) => row.id.toString(),
    ...tableState,
  });

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = participants.length;
    const confirmed = participants.filter((p: EventParticipant) => p.status === 'Confirmed').length;
    const pending = participants.filter((p: EventParticipant) => p.status === 'Pending').length;
    const cancelled = participants.filter((p: EventParticipant) => p.status === 'Cancelled').length;
    const capacity = event.capacity || 100;
    const availableSlots = capacity - confirmed;
    const capacityPercentage = (confirmed / capacity) * 100;

    return {
      total,
      confirmed,
      pending,
      cancelled,
      capacity,
      availableSlots,
      capacityPercentage,
    };
  }, [participants, event.capacity]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{metrics.total}</div>
            </div>
            <div className="text-sm text-muted-foreground">Tổng người tham gia</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{metrics.confirmed}</div>
            </div>
            <div className="text-sm text-muted-foreground">Đã xác nhận</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-600">{metrics.pending}</div>
            </div>
            <div className="text-sm text-muted-foreground">Chờ xử lý</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Sức chứa</div>
              <Progress value={metrics.capacityPercentage} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {metrics.confirmed}/{metrics.capacity}
                </span>
                <span>{metrics.availableSlots} còn lại</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <Button variant="outline" size="sm" className="ml-2">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="default" size="sm" className="ml-2" onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Thêm người tham gia
          </Button>
        </DataTableToolbar>
      </DataTable>

      {/* Add Participant Dialog */}
      <AddParticipantDialog
        eventId={event.id}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          refetch();
          onUpdated?.();
        }}
      />
    </div>
  );
}
