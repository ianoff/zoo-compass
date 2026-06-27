'use client';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Cell,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronRight, Star } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { InstitutionRowDetail } from '@/components/institutions/institution-row-detail';
import { InstitutionTypeIcon } from '@/components/institutions/institution-type-icon';
import { MemberBenefitBadge } from '@/components/institutions/member-benefit-badge';
import { ReciprocityBadge } from '@/components/institutions/reciprocity-badge';
import { SortableTableHead } from '@/components/institutions/sortable-table-head';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistance } from '@/lib/geo/distance';
import {
  compareNullableNumbers,
  compareNullableStrings,
  getInstitutionDistanceMiles,
  getInstitutionTypeSortLabel,
  getMemberBenefitSortRank,
  getReciprocitySortRank,
} from '@/lib/institutions/table-sort';
import { calculateMemberBenefit } from '@/lib/reciprocity/calculate-benefit';
import type { DistanceOrigin } from '@/lib/storage/user-settings';
import {
  formatAddress,
  formatLocation,
  hasContactInfo,
  INSTITUTION_TYPE_LABELS,
  type Institution,
  type InstitutionReciprocity,
} from '@/lib/types/institution';
import { cn } from '@/lib/utils';

type InstitutionsTableProps = {
  institutions: Institution[];
  totalCount: number;
  homeInstitution: Institution | null;
  distanceOrigin: DistanceOrigin;
  distanceOriginPoint: [number, number] | null;
};

function institutionHasExpandableDetail(): boolean {
  return true;
}

function getTableColumnClassName(
  columnId: string,
  homeInstitutionSet: boolean,
): string {
  return cn(
    columnId === 'institution' &&
      (homeInstitutionSet ? 'w-[46%] sm:w-[32%]' : 'w-[62%] sm:w-[32%]'),
    columnId === 'type' && 'hidden w-[16%] sm:table-cell',
    columnId === 'reciprocity' &&
      (homeInstitutionSet
        ? 'hidden w-[14%] sm:table-cell'
        : 'w-[32%] sm:w-[14%]'),
    columnId === 'your-benefit' &&
      (homeInstitutionSet ? 'w-[32%] sm:w-[14%]' : 'w-[18%] sm:w-[14%]'),
    columnId === 'distance' &&
      (homeInstitutionSet ? 'w-[22%] sm:w-[12%]' : 'w-[14%] sm:w-[12%]'),
    columnId === 'notes' && 'hidden max-w-0 w-[18%] lg:table-cell',
  );
}

function RowExpandChevron({
  isExpanded,
  hasDetail,
  className,
}: {
  isExpanded: boolean;
  hasDetail: boolean;
  className?: string;
}) {
  if (!hasDetail) {
    return (
      <span
        className={cn('inline-block w-4 shrink-0', className)}
        aria-hidden
      />
    );
  }

  return (
    <span
      className={cn(
        'text-muted-foreground inline-flex size-4 shrink-0 items-center justify-center',
        className,
      )}
      aria-hidden
    >
      {isExpanded ? (
        <ChevronDown className="size-4" />
      ) : (
        <ChevronRight className="size-4" />
      )}
    </span>
  );
}

export function InstitutionsTable({
  institutions,
  totalCount,
  homeInstitution,
  distanceOrigin,
  distanceOriginPoint,
}: InstitutionsTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [sorting, setSorting] = useState<SortingState>([]);
  const hasUserSortedRef = useRef(false);

  const showBenefitColumn = Boolean(homeInstitution);
  const showDistanceColumn = Boolean(distanceOriginPoint);

  const distanceSortAvailable = showDistanceColumn;

  useEffect(() => {
    if (hasUserSortedRef.current) {
      return;
    }

    if (distanceSortAvailable) {
      setSorting([{ id: 'distance', desc: false }]);
    } else {
      setSorting([{ id: 'institution', desc: false }]);
    }
  }, [distanceSortAvailable, distanceOrigin]);

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    hasUserSortedRef.current = true;
    setSorting(updater);
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const columns = useMemo<ColumnDef<Institution>[]>(
    () => [
      {
        id: 'institution',
        accessorFn: (row) => row.name,
        header: ({ column }) => (
          <SortableTableHead
            column={column}
            label="Institution"
            className="pl-5 sm:pl-6"
          />
        ),
        cell: ({ row }) => {
          const isHomeRow = homeInstitution?.id === row.original.id;
          const isExpanded = expandedIds.has(row.original.id);
          const hasDetail = institutionHasExpandableDetail();

          return (
            <div className="flex items-start gap-1 py-1 sm:gap-2 sm:py-1.5">
              <RowExpandChevron
                className="mt-0.5"
                isExpanded={isExpanded}
                hasDetail={hasDetail}
              />
              <div className="min-w-0">
                <p className="flex items-start gap-1.5 font-medium wrap-break-word">
                  {isHomeRow ? (
                    <Star
                      className="fill-neon-pink text-neon-pink mt-0.5 size-4 shrink-0"
                      aria-label="Your home facility"
                    />
                  ) : null}
                  <span>{row.original.name}</span>
                </p>
                <p className="text-muted-foreground text-xs wrap-break-word">
                  {formatLocation(row.original)}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        id: 'type',
        accessorFn: (row) => getInstitutionTypeSortLabel(row.type),
        header: ({ column }) => (
          <SortableTableHead column={column} label="Type" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground inline-flex items-start gap-1.5 wrap-break-word">
            <InstitutionTypeIcon
              type={row.original.type}
              className="text-neon-teal mt-0.5"
            />
            {INSTITUTION_TYPE_LABELS[row.original.type]}
          </span>
        ),
      },
      {
        id: 'reciprocity',
        accessorFn: (row) => getReciprocitySortRank(row.reciprocity),
        header: ({ column }) => (
          <SortableTableHead column={column} label="Their tier" />
        ),
        cell: ({ row }) => (
          <ReciprocityBadge reciprocity={row.original.reciprocity} />
        ),
      },
      ...(showBenefitColumn && homeInstitution
        ? [
            {
              id: 'your-benefit',
              accessorFn: (row: Institution) => {
                const benefit = calculateMemberBenefit(homeInstitution, row);

                return benefit
                  ? getMemberBenefitSortRank(benefit.kind)
                  : Number.POSITIVE_INFINITY;
              },
              header: ({ column }) => (
                <SortableTableHead column={column} label="Your benefit" />
              ),
              cell: ({ row }: { row: { original: Institution } }) => {
                const benefit = calculateMemberBenefit(
                  homeInstitution,
                  row.original,
                );

                if (!benefit) {
                  return <span className="text-muted-foreground">—</span>;
                }

                return <MemberBenefitBadge benefit={benefit} />;
              },
            } satisfies ColumnDef<Institution>,
          ]
        : []),
      ...(showDistanceColumn
        ? [
            {
              id: 'distance',
              accessorFn: (row: Institution) =>
                getInstitutionDistanceMiles(
                  row,
                  distanceOrigin,
                  distanceOriginPoint,
                ),
              sortingFn: (rowA, rowB, columnId) =>
                compareNullableNumbers(
                  rowA.getValue(columnId) as number | null,
                  rowB.getValue(columnId) as number | null,
                ),
              header: ({ column }) => (
                <SortableTableHead column={column} label="Distance" />
              ),
              cell: ({ row }: { row: { original: Institution } }) => {
                const miles = getInstitutionDistanceMiles(
                  row.original,
                  distanceOrigin,
                  distanceOriginPoint,
                );

                if (miles === null) {
                  return <span className="text-muted-foreground">—</span>;
                }

                return (
                  <span className="text-foreground tabular-nums">
                    {formatDistance(miles)}
                  </span>
                );
              },
            } satisfies ColumnDef<Institution>,
          ]
        : []),
      {
        id: 'notes',
        accessorFn: (row) => row.reciprocity.notes?.trim() ?? '',
        sortingFn: (rowA, rowB, columnId) =>
          compareNullableStrings(
            rowA.getValue(columnId) as string,
            rowB.getValue(columnId) as string,
          ),
        header: ({ column }) => (
          <SortableTableHead column={column} label="Notes" />
        ),
        cell: ({ row }) => {
          const notes = row.original.reciprocity.notes?.trim();
          return (
            <span
              className={cn(
                'block text-sm wrap-break-word',
                notes ? 'text-foreground' : 'text-muted-foreground',
              )}
              title={notes}
            >
              {notes || '—'}
            </span>
          );
        },
      },
    ],
    [
      distanceOrigin,
      distanceOriginPoint,
      expandedIds,
      homeInstitution,
      showBenefitColumn,
      showDistanceColumn,
    ],
  );

  // TanStack Table returns unstable function references by design.
  // eslint-disable-next-line react-hooks/incompatible-library -- expected for useReactTable
  const table = useReactTable({
    data: institutions,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (institutions.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <p className="text-muted-foreground text-sm tabular-nums">
            0 of {totalCount} institutions
          </p>
        </div>
        <div className="text-muted-foreground px-6 py-12 text-center text-sm">
          No institutions match the current filters.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm **:data-[slot=table-container]:overflow-x-visible">
      <div className="border-b px-4 py-3">
        <p className="text-sm font-medium tabular-nums">
          {institutions.length} of {totalCount} institutions
        </p>
      </div>
      <Table className="table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    'table-head-responsive',
                    getTableColumnClassName(header.id, showBenefitColumn),
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <FragmentRow
              key={row.id}
              isExpanded={expandedIds.has(row.original.id)}
              institution={row.original}
              cells={row.getVisibleCells()}
              homeInstitution={homeInstitution}
              showTheirTierInDetail={showBenefitColumn}
              onToggle={() => toggleExpanded(row.original.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getReciprocityRowBorderClass(
  reciprocity: InstitutionReciprocity,
): string {
  if (!reciprocity.participates) {
    return 'row-border-tier-none';
  }

  if (reciprocity.tier === 'free') {
    return 'row-border-tier-green';
  }

  if (reciprocity.tier === '100-or-50') {
    return 'row-border-tier-lime';
  }

  return 'row-border-tier-teal';
}

function FragmentRow({
  isExpanded,
  institution,
  cells,
  homeInstitution,
  showTheirTierInDetail,
  onToggle,
}: {
  isExpanded: boolean;
  institution: Institution;
  cells: Cell<Institution, unknown>[];
  homeInstitution: Institution | null;
  showTheirTierInDetail: boolean;
  onToggle: () => void;
}) {
  const canExpand = institutionHasExpandableDetail();

  return (
    <>
      <TableRow
        className={cn(
          getReciprocityRowBorderClass(institution.reciprocity),
          canExpand && 'row-expandable',
        )}
        tabIndex={canExpand ? 0 : undefined}
        aria-expanded={canExpand ? isExpanded : undefined}
        aria-label={
          canExpand
            ? `${isExpanded ? 'Hide' : 'Show'} details for ${institution.name}`
            : undefined
        }
        onClick={() => {
          if (canExpand) {
            onToggle();
          }
        }}
        onKeyDown={(event) => {
          if (!canExpand) {
            return;
          }

          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        {cells.map((cell) => (
          <TableCell
            key={cell.id}
            className={cn(
              'table-cell-responsive',
              getTableColumnClassName(cell.column.id, Boolean(homeInstitution)),
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
      {isExpanded ? (
        <TableRow className="hover:bg-transparent">
          <TableCell
            colSpan={cells.length}
            className="w-full max-w-0 p-0 whitespace-normal"
          >
            <InstitutionRowDetail
              institution={institution}
              showTheirTier={showTheirTierInDetail}
            />
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}
