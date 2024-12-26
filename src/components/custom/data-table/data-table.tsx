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
    RowSelectionState,
    SortingState,
    useReactTable
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DataTableToolbar } from '@/components/custom/data-table//data-table-toolbar';
import { ReactNode } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount?: number;
    total?: number;
    loading: boolean;
    sizes?: number[];
    pagination: PaginationState;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    customTools?: ReactNode;
    rowSelection?: RowSelectionState;
    enableRowSelection?: boolean | ((row: any) => boolean);
    onPaginationChange: OnChangeFn<PaginationState>;
    onSortingChange?: OnChangeFn<SortingState>;
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    onSearch: (val: string) => void;
    className?: string;
    headerClassName?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    total,
    loading,
    sizes = [],
    pagination,
    sorting,
    columnFilters,
    customTools,
    rowSelection = {},
    enableRowSelection,
    onSearch,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onRowSelectionChange,
    className,
    headerClassName
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        getRowId: (row: any) => row.id,
        data,
        columns,
        pageCount,
        state: { pagination, sorting, rowSelection, columnFilters },
        manualPagination: true,
        manualFiltering: true,
        enableRowSelection,
        onColumnFiltersChange,
        onPaginationChange,
        onSortingChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange
    });

    const { t } = useTranslation();

    return (
        <Card className={cn('border-none shadow-none h-full')}>
            <CardHeader className={cn(headerClassName)}>
                <DataTableToolbar
                    table={table}
                    customTools={customTools}
                    onSearch={onSearch}
                />
            </CardHeader>
            <CardContent className={cn(className)}>
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
                                                colSpan={header.colSpan}
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
                {!!total && (
                    <div className={cn('pt-6')}>
                        <DataTablePagination
                            {...{
                                table: table,
                                total: total,
                                sizes: sizes
                            }}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
