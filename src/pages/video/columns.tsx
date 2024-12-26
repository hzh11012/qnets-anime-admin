import { DataTableColumnSort } from '@/components/custom/data-table/data-table-column-sort';
import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import { DataTableRowActions } from '@/pages/video/data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';

export const getColumns = (
    t: TFunction<'translation', undefined>,
    onRefresh: () => void,
    options: any
) => {
    const columns = [
        {
            accessorKey: 'id',
            title: t('video.table.id'),
            header: t('video.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'name',
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
            accessorKey: 'categories',
            title: t('video.table.categories'),
            header: ({ column }: any) => {
                const { categories = [] } = options;
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('video.table.categories')}</span>
                        {categories.length && (
                            <DataTableColumnFilter
                                column={column}
                                options={categories}
                            />
                        )}
                    </div>
                );
            },
            cell: ({ row }: any) => {
                const arr = row.original.categories;
                return (
                    <div className={cn('space-x-2')}>
                        {arr.map((item: any) => (
                            <Badge key={item.id} variant="secondary">
                                {item.category}
                            </Badge>
                        ))}
                    </div>
                );
            }
        },
        {
            accessorKey: 'type',
            title: t('video.table.type'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('video.table.type')}</span>
                    <DataTableColumnFilter
                        column={column}
                        options={[
                            {
                                label: t('video.type.ova'),
                                value: 0
                            },
                            {
                                label: t('video.type.japan'),
                                value: 1
                            },
                            {
                                label: t('video.type.american'),
                                value: 2
                            },
                            {
                                label: t('video.type.china'),
                                value: 3
                            },
                            {
                                label: t('video.type.hentai'),
                                value: 4
                            }
                        ]}
                    />
                </div>
            ),
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
            accessorKey: 'status',
            title: t('video.table.status'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('video.table.status')}</span>
                    <DataTableColumnFilter
                        column={column}
                        options={[
                            {
                                label: t('video.status.coming'),
                                value: 0
                            },
                            {
                                label: t('video.status.serializing'),
                                value: 1
                            },
                            {
                                label: t('video.status.completed'),
                                value: 2
                            }
                        ]}
                    />
                </div>
            ),
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
            accessorKey: 'year',
            title: t('video.table.year'),
            header: ({ column }: any) => {
                const currentYear = new Date().getFullYear();
                const options = Array.from(
                    { length: currentYear - 1990 + 1 },
                    (_, i) => {
                        return {
                            label: `${1990 + i}`,
                            value: `${1990 + i}`
                        };
                    }
                ).reverse();
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('video.table.year')}</span>
                        <DataTableColumnFilter
                            column={column}
                            options={options}
                        />
                    </div>
                );
            }
        },
        {
            accessorKey: 'month',
            title: t('video.table.month'),
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('video.table.month')}</span>
                    <DataTableColumnFilter
                        column={column}
                        options={[
                            {
                                label: t('video.month.jan'),
                                value: 0
                            },
                            {
                                label: t('video.month.apr'),
                                value: 1
                            },
                            {
                                label: t('video.month.jul'),
                                value: 1
                            },
                            {
                                label: t('video.month.oct'),
                                value: 1
                            }
                        ]}
                    />
                </div>
            ),
            cell: ({ row }: any) => {
                //  0-一月番 1-四月番 2-七月番 3-十月番
                const MonthMap: { [key: number]: string } = {
                    0: t('video.month.jan'),
                    1: t('video.month.apr'),
                    2: t('video.month.jul'),
                    3: t('video.month.oct')
                };
                return MonthMap[row.original.month];
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
