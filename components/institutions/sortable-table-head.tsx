'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';

type SortableTableHeadProps<TData> = {
  column: Column<TData, unknown>;
  label: string;
  className?: string;
};

export function SortableTableHead<TData>({
  column,
  label,
  className,
}: SortableTableHeadProps<TData>) {
  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      className={cn(
        'hover:text-foreground focus-visible:ring-ring -mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 text-left font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      onClick={column.getToggleSortingHandler()}
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      {sorted === 'asc' ? (
        <ArrowUp className="size-3.5 shrink-0" aria-hidden />
      ) : sorted === 'desc' ? (
        <ArrowDown className="size-3.5 shrink-0" aria-hidden />
      ) : (
        <ArrowUpDown
          className="text-muted-foreground size-3.5 shrink-0 opacity-60"
          aria-hidden
        />
      )}
    </button>
  );
}
