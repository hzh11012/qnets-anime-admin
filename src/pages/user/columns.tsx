import { DataTableColumnHeader } from '@/components/custom/data-table/data-table-column-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AvatarImage } from '@radix-ui/react-avatar';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';

export const getColumns = (t: TFunction<'translation', undefined>) => {
    const columns = [
        {
            accessorKey: 'id',
            title: t('user.table.id'),
            header: t('user.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'avatar',
            title: t('user.table.avatar'),
            header: t('user.table.avatar'),
            cell: ({ row }: any) => {
                return (
                    <Avatar className={cn('w-8 h-8')}>
                        <AvatarImage src={row.original.avatar} />
                        <AvatarFallback>
                            {row.original.nickname?.slice(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                );
            }
        },
        {
            accessorKey: 'nickname',
            title: t('user.table.nickname'),
            header: () => {
                return (
                    <div className="flex items-center space-x-1">
                        <span>{t('user.table.nickname')}</span>
                        <Search className="w-3.5 h-3.5" />
                    </div>
                );
            }
        },
        {
            accessorKey: 'phone',
            title: t('user.table.phone'),
            header: t('user.table.phone')
        },
        {
            accessorKey: 'scope',
            title: t('user.table.scope'),
            header: t('user.table.scope'),
            cell: ({ row }: any) => {
                // 0-游客 1-正式会员 2-管理员
                const RoleMap: { [key: number]: string } = {
                    0: t('user.role.visitor'),
                    1: t('user.role.member'),
                    2: t('user.role.admin')
                };
                return RoleMap[row.original?.scope || 0];
            }
        },
        {
            accessorKey: 'created_at',
            title: t('user.table.created_at'),
            header: ({ column }: any) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('user.table.created_at')}
                />
            )
        },
        {
            id: 'actions',
            header: t('table.actions'),
            cell: ({ row }: any) => <>actions todo</>
        }
    ];

    return columns;
};

export const getFilterColumns = (t: TFunction<'translation', undefined>) => {
    const filterColumns = [
        {
            column: 'scope',
            title: t('user.table.scope'),
            options: [
                {
                    label: t('user.role.visitor'),
                    value: 0
                },
                {
                    label: t('user.role.member'),
                    value: 1
                },
                {
                    label: t('user.role.admin'),
                    value: 2
                }
            ]
        }
    ];

    return filterColumns;
};
