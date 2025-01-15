import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import DataTableRowActions from '@/pages/anime-guide/data-table-row-actions';
import { DataTableColumnSort } from '@/components/custom/data-table/data-table-column-sort';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';
import { days } from '@/pages/anime-guide/custom-tools';

export const getColumns = (
    t: TFunction<'translation', undefined>,
    onRefresh: () => void
) => {
    const columns = [
        {
            accessorKey: 'anime_id',
            title: t('video.table.'),
            header: t('video.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'cover_url',
            title: t('video.table.cover_url'),
            header: t('video.table.cover_url'),
            cell: ({ row }: any) => {
                return (
                    <img
                        src={row.original.cover_url}
                        loading="lazy"
                        className={cn(
                            'block max-w-none w-[9rem] h-[12rem] object-cover rounded-sm'
                        )}
                    />
                );
            }
        },
        {
            accessorKey: 'title',
            title: t('video.table.name'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('video.table.name')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            }
        },
        {
            accessorKey: 'description',
            title: t('video.table.description'),
            header: t('video.table.description'),
            cell: ({ row }: any) => {
                return (
                    <p
                        title={row.original.description}
                        className={cn(
                            'block max-w-96 text-ellipsis overflow-hidden whitespace-nowrap'
                        )}
                    >
                        {row.original.description}
                    </p>
                );
            }
        },
        {
            accessorKey: 'update_day',
            title: t('anime-guide.table.update_day'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('anime-guide.table.update_day')}</span>
                    <DataTableColumnFilter column={column} options={days} />
                </div>
            ),
            cell: ({ row }: any) => {
                const DayMap: { [key: number]: string } = {
                    1: t('anime-guide.day.mon'),
                    2: t('anime-guide.day.tues'),
                    3: t('anime-guide.day.wed'),
                    4: t('anime-guide.day.thur'),
                    5: t('anime-guide.day.fri'),
                    6: t('anime-guide.day.sat'),
                    7: t('anime-guide.day.sun')
                };
                return DayMap[row.original.update_day];
            }
        },
        {
            accessorKey: 'update_time',
            title: t('anime-guide.table.update_time'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('anime-guide.table.update_time')}</span>
                    <DataTableColumnSort column={column} />
                </div>
            )
        },
        {
            accessorKey: 'status',
            title: t('video.table.status'),
            header: t('video.table.status'),
            cell: ({ row }: any) => {
                //  0-即将上线 1-连载中 2-已完结
                const StatusMap: { [key: number]: string } = {
                    0: t('video.status.coming'),
                    1: t('video.status.serializing'),
                    2: t('video.status.completed')
                };
                return StatusMap[row.original.status];
            }
        },
        {
            accessorKey: 'update_tip',
            title: t('anime-guide.table.update_tip'),
            header: t('anime-guide.table.update_tip'),
            cell: ({ row }: any) => {
                const { status, latest_video } = row.original;
                if (status === 0 || !latest_video) {
                    return '即将上映';
                }
                return status === 1
                    ? `更新至${latest_video?.episode}话`
                    : `全${latest_video?.episode}话`;
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
