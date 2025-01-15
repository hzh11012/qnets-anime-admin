import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import DataTableRowActions from '@/pages/danmaku/data-table-row-actions';
import Color from '@/components/custom/color';

export const getColumns = (
    t: TFunction<'translation', undefined>,
    onRefresh: () => void
) => {
    const columns = [
        {
            accessorKey: 'id',
            title: t('danmaku.table.id'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('danmaku.table.id')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'content',
            title: t('danmaku.table.content'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('danmaku.table.content')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            }
        },
        {
            accessorKey: 'color',
            title: t('danmaku.table.color'),
            header: t('danmaku.table.color'),
            cell: ({ row }: any) => {
                return <Color color={row.original.color} />;
            }
        },
        {
            accessorKey: 'time_dot',
            title: t('danmaku.table.time_dot'),
            header: t('danmaku.table.time_dot')
        },
        {
            accessorKey: 'ip',
            title: t('danmaku.table.ip'),
            header: t('danmaku.table.ip')
        },
        {
            accessorKey: 'created_at',
            title: t('table.created_at'),
            header: t('table.created_at')
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
