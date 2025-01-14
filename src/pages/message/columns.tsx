import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import DataTableRowActions, {
    status
} from '@/pages/message/data-table-row-actions';
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
            title: t('message.table.id'),
            header: t('message.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'user_id',
            title: t('message.table.user_id'),
            header: t('message.table.user_id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'nickname',
            title: t('message.table.nickname'),
            header: t('message.table.nickname')
        },
        {
            accessorKey: 'content',
            title: t('message.table.content'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('message.table.content')}</span>
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
            accessorKey: 'type',
            title: t('message.table.type'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('message.table.type')}</span>
                    <DataTableColumnFilter
                        column={column}
                        options={[
                            {
                                label: t('message.type.consult'),
                                value: 0
                            },
                            {
                                label: t('message.type.suggestion'),
                                value: 1
                            },
                            {
                                label: t('message.type.complaint'),
                                value: 2
                            },
                            {
                                label: t('message.type.others'),
                                value: 3
                            }
                        ]}
                    />
                </div>
            ),
            cell: ({ row }: any) => {
                // 0-咨询 1-建议 2-投诉 3-其他
                const StatusMap: { [key: number]: string } = {
                    0: t('message.type.consult'),
                    1: t('message.type.suggestion'),
                    2: t('message.type.complaint'),
                    3: t('message.type.others')
                };
                return StatusMap[row.original.type];
            }
        },
        {
            accessorKey: 'status',
            title: t('message.table.status'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('message.table.status')}</span>
                    <DataTableColumnFilter column={column} options={status} />
                </div>
            ),
            cell: ({ row }: any) => {
                // 0-待处理 1-处理中 2-已完成 3-已关闭
                const StatusMap: { [key: number]: string } = {
                    0: t('message.status.pending'),
                    1: t('message.status.processing'),
                    2: t('message.status.completed'),
                    3: t('message.status.closed')
                };
                return StatusMap[row.original.status];
            }
        },
        {
            accessorKey: 'created_at',
            title: t('table.created_at'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('table.created_at')}</span>
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
