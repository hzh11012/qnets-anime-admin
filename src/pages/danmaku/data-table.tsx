import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    OnChangeFn,
    PaginationState,
    useReactTable
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import DataTablePagination from '@/components/custom/data-table/data-table-pagination';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/custom/loading';
import { useTranslation } from 'react-i18next';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount?: number;
    total?: number;
    loading: boolean;
    sizes: number[];
    onPaginationChange: OnChangeFn<PaginationState>;
    pagination: PaginationState;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    total,
    loading,
    sizes,
    pagination,
    onPaginationChange
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination
        },
        manualPagination: true,
        onPaginationChange: onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    const { t } = useTranslation();

    return (
        <Card className="border-none shadow-none">
            <CardHeader>TODO</CardHeader>
            <CardContent>
                <ScrollArea className={cn('rounded-md border')}>
                    <Table key={'table'}>
                        <TableHeader className="bg-gray-100 dark:bg-neutral-800">
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="text-nowrap"
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
                                                className="text-nowrap"
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
                                        className="h-96 text-center"
                                    >
                                        {loading ? (
                                            <Loading className="flex relative" />
                                        ) : (
                                            <>{t('table.empty')}</>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="vertical" />
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="pt-6">
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
