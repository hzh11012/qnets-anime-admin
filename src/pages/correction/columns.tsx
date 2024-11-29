import { DataTableColumnHeader } from '@/components/custom/data-table/data-table-column-header';
import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import { DataTableRowActions } from '@/pages/correction/data-table-row-actions';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';

export const getColumns = (
    t: TFunction<'translation', undefined>,
    onRefresh: () => void
) => {
    const columns = [
        {
            accessorKey: 'id',
            title: t('correct.table.id'),
            header: t('correct.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'uid',
            title: t('correct.table.uid'),
            header: t('correct.table.uid'),
            enableSorting: false,
            enableHiding: false
        },

        {
            accessorKey: 'nickname',
            title: t('correct.table.nickname'),
            header: t('correct.table.nickname')
        },
        {
            accessorKey: 'message',
            title: t('correct.table.message'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('correct.table.message')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            },
            cell: ({ row }: any) => {
                return (
                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger className={cn('block')}>
                                <p
                                    className={cn(
                                        'max-w-48 text-ellipsis overflow-hidden whitespace-nowrap'
                                    )}
                                >
                                    {row.original.message}
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p
                                    className={cn(
                                        'max-w-64 break-all text-wrap'
                                    )}
                                >
                                    {row.original.message}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            }
        },
        {
            accessorKey: 'status',
            title: t('correct.table.status'),
            header: t('correct.table.status'),
            cell: ({ row }: any) => {
                // 0-待处理 1-已完成
                const StatusMap: { [key: number]: string } = {
                    0: t('correct.status.pending'),
                    1: t('correct.status.done')
                };
                return StatusMap[row.original?.status || 0];
            }
        },
        {
            accessorKey: 'created_at',
            title: t('correct.table.created_at'),
            header: ({ column }: any) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('correct.table.created_at')}
                />
            )
        },
        {
            id: 'actions',
            header: t('table.actions'),
            cell: ({ row }: any) => (
                <DataTableRowActions row={row} onRefresh={onRefresh} />
            )
        }
    ];

    return columns;
};

export const getFilterColumns = (t: TFunction<'translation', undefined>) => {
    const filterColumns = [
        {
            column: 'status',
            title: t('correct.table.status'),
            options: [
                {
                    label: t('correct.status.pending'),
                    value: 0
                },
                {
                    label: t('correct.status.done'),
                    value: 1
                }
            ]
        }
    ];

    return filterColumns;
};
