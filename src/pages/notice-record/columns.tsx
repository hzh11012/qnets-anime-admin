import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import { DataTableRowActions } from '@/pages/notice-record/data-table-row-actions';
import { DataTableColumnSort } from '@/components/custom/data-table/data-table-column-sort';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';
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
            title: t('notice-record.table.id'),
            header: t('notice-record.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'uid',
            title: t('notice-record.table.uid'),
            header: t('notice-record.table.uid'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'nickname',
            title: t('notice-record.table.nickname'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('notice-record.table.nickname')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            }
        },
        {
            accessorKey: 'title',
            title: t('notice-record.table.title'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('notice-record.table.title')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            }
        },
        {
            accessorKey: 'content',
            title: t('notice-record.table.content'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('notice-record.table.content')}</span>
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
                                        'max-w-64 text-ellipsis overflow-hidden whitespace-nowrap'
                                    )}
                                >
                                    {row.original.content}
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p
                                    className={cn(
                                        'max-w-64 break-all text-wrap'
                                    )}
                                >
                                    {row.original.content}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            }
        },

        {
            accessorKey: 'status',
            title: t('notice-record.table.status'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('notice-record.table.status')}</span>
                    <DataTableColumnFilter
                        column={column}
                        options={[
                            {
                                label: t('notice-record.status.unread'),
                                value: 0
                            },
                            {
                                label: t('notice-record.status.read'),
                                value: 1
                            }
                        ]}
                    />
                </div>
            ),
            cell: ({ row }: any) => {
                // 0-未读 1-已读
                const StatusMap: { [key: number]: string } = {
                    0: t('notice-record.status.unread'),
                    1: t('notice-record.status.read')
                };
                return StatusMap[row.original?.status || 0];
            }
        },
        {
            accessorKey: 'created_at',
            title: t('notice-record.table.created_at'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('notice-record.table.created_at')}</span>
                    <DataTableColumnSort column={column} />
                </div>
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
