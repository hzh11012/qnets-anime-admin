import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import { DataTableRowActions } from '@/pages/rating/data-table-row-actions';
import { DataTableColumnSort } from '@/components/custom/data-table/data-table-column-sort';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { RatingGroup } from '@/components/ui/rating';

export const getColumns = (
    t: TFunction<'translation', undefined>,
    onRefresh: () => void
) => {
    const columns = [
        {
            accessorKey: 'id',
            title: t('rating.table.id'),
            header: t('rating.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'uid',
            title: t('rating.table.uid'),
            header: t('rating.table.uid'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'nickname',
            title: t('rating.table.nickname'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('rating.table.nickname')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            }
        },
        {
            accessorKey: 'anime.name',
            title: t('rating.table.anime.name'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('rating.table.anime.name')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            }
        },
        {
            accessorKey: 'score',
            title: t('rating.table.score'),
            header: t('rating.table.score'),
            cell: ({ row }: any) => {
                return (
                    <RatingGroup defaultValue={row.original.score} disabled />
                );
            }
        },
        {
            accessorKey: 'content',
            title: t('rating.table.content'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('rating.table.content')}</span>
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
            accessorKey: 'created_at',
            title: t('collection.table.created_at'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('collection.table.created_at')}</span>
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
