import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2, Inbox } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    pageSize?: number;
  };
  className?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No records found',
  emptyAction,
  pagination,
  className,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn('flex flex-col rounded-[7.5px] border border-[#efe9e0] bg-white shadow-ambrook-card overflow-hidden font-sans', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#211b15]">
          <thead className="border-b border-[#efe9e0] bg-[#efe9e0]/60 text-xs font-bold uppercase tracking-wider text-[#50463c]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    'px-4 py-3.5',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#efe9e0]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#50463c]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-[#e8b672]" />
                    <span className="text-sm font-medium text-[#211b15]">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#50463c]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[3.75px] bg-[#efe9e0] text-[#50463c]">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-[#211b15]">{emptyMessage}</p>
                    {emptyAction && <div className="mt-2">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    'transition-colors hover:bg-[#fcfaf1]',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      className={cn(
                        'px-4 py-3 text-sm text-[#211b15] whitespace-nowrap',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        col.className
                      )}
                    >
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#efe9e0] px-4 py-3 text-xs text-[#50463c] bg-[#fcfaf1]">
          <div>
            {pagination.totalItems !== undefined ? (
              <span>
                Page <strong className="font-bold text-[#211b15]">{pagination.currentPage}</strong> of{' '}
                <strong className="font-bold text-[#211b15]">{pagination.totalPages}</strong> ({pagination.totalItems} records)
              </span>
            ) : (
              <span>
                Page <strong className="font-bold text-[#211b15]">{pagination.currentPage}</strong> of{' '}
                <strong className="font-bold text-[#211b15]">{pagination.totalPages}</strong>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1 || isLoading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[3.75px] border border-[#c7bcaf] bg-white text-[#211b15] hover:bg-[#efe9e0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages || isLoading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[3.75px] border border-[#c7bcaf] bg-white text-[#211b15] hover:bg-[#efe9e0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
