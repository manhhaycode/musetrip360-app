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
import { Archive, Edit, Eye, FileCheck, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import {
  Article,
  ArticleStatusEnum,
  useDeleteArticle,
  useGetAdminArticlesByMuseum,
} from '@musetrip360/museum-management';
import get from 'lodash.get';

interface ArticleDataTableProps {
  museumId: string;
  onView?: (article: Article) => void;
  onEdit?: (article: Article) => void;
  onDelete?: (article: Article) => void;
  onAdd?: () => void;
  onPublish?: (article: Article) => void;
  onArchive?: (article: Article) => void;
}

const ArticleDataTable = ({ museumId, onView, onEdit, onAdd, onPublish, onArchive }: ArticleDataTableProps) => {
  const initialData: Article[] = useMemo(() => [], []);

  const tableState = useDataTableState({
    defaultPerPage: 10,
    defaultSort: [{ id: 'createdAt', desc: true }],
  });

  const {
    data: articlesData,
    isLoading: loadingArticles,
    refetch: refetchArticles,
  } = useGetAdminArticlesByMuseum(
    museumId,
    {
      Page: tableState.pagination.pageIndex + 1,
      PageSize: tableState.pagination.pageSize,
    },
    {
      enabled: !!museumId,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: deleteArticle } = useDeleteArticle({
    onSuccess: () => {
      toast.success('Article deleted successfully');
      refetchArticles();
    },
    onError: (error) => {
      toast.error('Failed to delete article');
      console.error('Delete article error:', error);
    },
  });

  const handleAction = useCallback(
    () => ({
      onView: (data: Article) => onView?.(data),
      onEdit: (data: Article) => onEdit?.(data),
      onDelete: (data: Article) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
          deleteArticle(data.id);
        }
      },
      onPublish: (data: Article) => onPublish?.(data),
      onArchive: (data: Article) => onArchive?.(data),
    }),
    [onView, onEdit, onPublish, onArchive, deleteArticle]
  );

  const statusOptions: Option[] = useMemo(
    () => [
      { label: 'Draft', value: ArticleStatusEnum.Draft },
      { label: 'Pending', value: ArticleStatusEnum.Pending },
      { label: 'Published', value: ArticleStatusEnum.Published },
      { label: 'Archived', value: ArticleStatusEnum.Archived },
    ],
    []
  );

  const getStatusVariant = (status: ArticleStatusEnum) => {
    switch (status) {
      case ArticleStatusEnum.Published:
        return 'default';
      case ArticleStatusEnum.Pending:
        return 'secondary';
      case ArticleStatusEnum.Draft:
        return 'outline';
      case ArticleStatusEnum.Archived:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const columns = useMemo<ColumnDef<Article>[]>(
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
        accessorKey: 'publishedAt',
        header: 'Published At',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.original.publishedAt ? new Date(row.original.publishedAt).toLocaleDateString() : '—'}
          </div>
        ),
      },
      {
        accessorKey: 'createdByUser.name',
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

              {row.original.status === ArticleStatusEnum.Draft && onPublish && (
                <DropdownMenuItem onClick={() => handleAction().onPublish(row.original)} className="text-green-600">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Publish
                </DropdownMenuItem>
              )}

              {row.original.status === ArticleStatusEnum.Published && onArchive && (
                <DropdownMenuItem onClick={() => handleAction().onArchive(row.original)} className="text-orange-600">
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction().onDelete(row.original)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleAction, statusOptions, onPublish, onArchive]
  );

  const { table } = useDataTable<Article, string>({
    data: get(articlesData, 'list') || initialData,
    columns,
    rowCount: get(articlesData, 'total', 0),
    manualHandle: true,
    getRowId: (row) => row.id.toString(),
    ...tableState,
  });

  if (loadingArticles) {
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
          Add Article
        </Button>
      </DataTableToolbar>
    </DataTable>
  );
};

export default ArticleDataTable;
