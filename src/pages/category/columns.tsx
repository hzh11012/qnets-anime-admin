import { DataTableColumnHeader } from '@/components/custom/data-table/data-table-column-header';
import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import { DataTableRowActions } from '@/pages/category/data-table-row-actions';

export const getColumns = (
    t: TFunction<'translation', undefined>,
    onRefresh: () => void
) => {
    const columns = [
        {
            accessorKey: 'id',
            title: t('category.table.id'),
            header: t('category.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'category',
            title: t('category.table.category'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('category.table.category')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            }
        },
        {
            accessorKey: 'created_at',
            title: t('category.table.created_at'),
            header: ({ column }: any) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('category.table.created_at')}
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
