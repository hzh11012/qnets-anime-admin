import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import { DataTableRowActions } from '@/pages/swiper/data-table-row-actions';
import { DataTableColumnSort } from '@/components/custom/data-table/data-table-column-sort';

export const getColumns = (
    t: TFunction<'translation', undefined>,
    onRefresh: () => void
) => {
    const columns = [
        {
            accessorKey: 'aid',
            title: t('video.table.id'),
            header: t('video.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'banner_url',
            title: t('video.table.banner_url'),
            header: t('video.table.banner_url'),
            cell: ({ row }: any) => {
                return (
                    <img
                        src={row.original.banner_url}
                        loading="lazy"
                        className={cn(
                            'block max-w-none w-[12rem] h-[6rem] object-cover rounded-sm'
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
            accessorKey: 'type',
            title: t('video.table.type'),
            header: t('video.table.type'),
            cell: ({ row }: any) => {
                //  0-剧场版 1-日番 2-美番 3-国番 4-里番
                const TypeMap: { [key: number]: string } = {
                    0: t('video.type.ova'),
                    1: t('video.type.japan'),
                    2: t('video.type.american'),
                    3: t('video.type.china'),
                    4: t('video.type.hentai')
                };
                return TypeMap[row.original.type];
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
