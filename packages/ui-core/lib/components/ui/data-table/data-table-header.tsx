import { flexRender, Header } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from 'lucide-react';
import { TableHead } from '../table';

interface ThProps<T extends object> {
  header: Header<T, unknown>;
}

export default function DataTableHeader<T extends object>({ header }: ThProps<T>) {
  const Icon =
    header.column.getIsSorted() !== false
      ? header.column.getIsSorted() === 'asc'
        ? ChevronUpIcon
        : ChevronDownIcon
      : ChevronsUpDownIcon;
  return (
    <TableHead
      key={header.id}
      {...{
        colSpan: header.colSpan,
        onClick: () => header.column.toggleSorting(undefined, true),
      }}
    >
      <div className="flex flex-row justify-between items-center cursor-pointer">
        <p className="font-semibold text-sm">{flexRender(header.column.columnDef.header, header.getContext())}</p>
        <Icon size={18} />
      </div>
    </TableHead>
  );
}
