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
import { cn } from '@/lib/utils';
import { Loading } from '@/components/custom/loading';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount?: number;
    total?: number;
    loading: boolean;
    sizes: number[];
    onPaginationChange: OnChangeFn<PaginationState>;
    onSearch: (val: string) => void;
    onReload: () => void;
    pagination: PaginationState;
}

const getCommonPinningStyles = (column: any) => {
    const isPinned = column.getIsPinned();

    return {
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right:
            isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: isPinned ? 'sticky' : 'relative'
    } as any;
};

const getCommonPinningClassName = (column: any) => {
    const isPinned = column.getIsPinned();
    const isFirstRightPinnedColumn =
        isPinned === 'right' && column.getIsFirstColumn('right');
    return isFirstRightPinnedColumn
        ? 'after:shadow-fixedShadow dark:after:shadow-fixedShadowDark after:absolute after:w-8 after:inset-0 after:-translate-x-full'
        : '';
};

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    total,
    loading,
    sizes,
    pagination,
    onSearch,
    onReload,
    onPaginationChange
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination,
            columnPinning: {
                left: [],
                right: ['actions']
            }
        },
        manualPagination: true,
        onPaginationChange: onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    const { t } = useTranslation();

    return (
        <Card className={cn('border-none shadow-none')}>
            <CardHeader
                className={cn('flex flex-row justify-end items-center')}
            >
                <Input
                    type="text"
                    placeholder={t('table.search.placeholder')}
                    className={cn('max-w-72')}
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            onSearch && onSearch(e.target.value);
                        }
                    }}
                />
                <Button
                    variant="outline"
                    className={cn('px-3')}
                    onClick={onReload}
                >
                    <LoaderCircle className={cn('h-4 w-4')} />
                </Button>
            </CardHeader>
            <CardContent>
                <div className={cn('rounded-md border')}>
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
                                                    'text-nowrap bg-gray-100 dark:bg-neutral-800',
                                                    getCommonPinningClassName(
                                                        header.column
                                                    )
                                                )}
                                                style={{
                                                    ...getCommonPinningStyles(
                                                        header.column
                                                    )
                                                }}
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
                                                    'text-nowrap bg-white dark:bg-black',
                                                    getCommonPinningClassName(
                                                        cell.column
                                                    )
                                                )}
                                                style={{
                                                    ...getCommonPinningStyles(
                                                        cell.column
                                                    )
                                                }}
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
