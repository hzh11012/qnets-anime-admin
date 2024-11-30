import DataTablePagination from '@/components/custom/data-table/data-table-pagination';
import { Loading } from '@/components/custom/loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    OnChangeFn,
    PaginationState,
    SortingState,
    useReactTable
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import {
    DataTableFacetedFilterProps,
    DataTableToolbar
} from '@/components/custom/data-table//data-table-toolbar';
import { ReactNode } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    filterColumns?: DataTableFacetedFilterProps[];
    data: TData[];
    pageCount?: number;
    total?: number;
    loading: boolean;
    sizes: number[];
    pagination: PaginationState;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    customTools?: ReactNode;
    onPaginationChange: OnChangeFn<PaginationState>;
    onSortingChange?: OnChangeFn<SortingState>;
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
    onSearch: (val: string) => void;
}

export function DataTable<TData, TValue>({
    columns,
    filterColumns,
    data,
    pageCount,
    total,
    loading,
    sizes,
    pagination,
    sorting,
    columnFilters,
    customTools,
    onSearch,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: { pagination, sorting, columnFilters },
        manualPagination: true,
        manualFiltering: true,
        onColumnFiltersChange,
        onPaginationChange,
        onSortingChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    const { t } = useTranslation();

    return (
        <Card className={cn('border-none shadow-none h-full')}>
            <CardHeader className={cn('hidden sm:block')}>
                <DataTableToolbar
                    table={table}
                    customTools={customTools}
                    filterColumns={filterColumns}
                    onSearch={onSearch}
                />
            </CardHeader>
            <CardContent className={cn('pt-6 sm:pt-0')}>
                <div className={cn('rounded-md border overflow-hidden')}>
                    <Table key={'table'}>
                        <TableHeader
                            className={cn('bg-gray-100 dark:bg-neutral-800')}
                        >
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={cn(
                                                    'text-nowrap bg-gray-100 dark:bg-neutral-800'
                                                )}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody key={'table-body'}>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    'text-nowrap bg-white dark:bg-black'
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className={cn('h-96 text-center')}
                                    >
                                        {loading ? (
                                            <Loading
                                                className={cn('flex relative')}
                                            />
                                        ) : (
                                            <>{t('table.empty')}</>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className={cn('pt-6')}>
                    <DataTablePagination
                        {...{
                            table: table,
                            total: total,
                            sizes: sizes
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
