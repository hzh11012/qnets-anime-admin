import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import DataTableRowActions from '@/pages/announcement/data-table-row-actions';
import { DataTableColumnSort } from '@/components/custom/data-table/data-table-column-sort';
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
            title: t('announcement.table.id'),
            header: t('announcement.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'title',
            title: t('announcement.table.title'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('announcement.table.title')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            }
        },
        {
            accessorKey: 'content',
            title: t('announcement.table.content'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('announcement.table.content')}</span>
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
                                        'max-w-96 text-ellipsis overflow-hidden whitespace-nowrap'
                                    )}
                                >
                                    {row.original.content}
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p
                                    className={cn(
                                        'max-w-72 break-all text-wrap'
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
            accessorKey: 'count',
            title: t('announcement.table.count'),
            header: t('announcement.table.count')
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
