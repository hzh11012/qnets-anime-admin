import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AvatarImage } from '@radix-ui/react-avatar';
import { TFunction } from 'i18next';
import { Search } from 'lucide-react';
import DataTableRowActions, {
    scope
} from '@/pages/user/data-table-row-actions';
import { DataTableColumnSort } from '@/components/custom/data-table/data-table-column-sort';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';

export const getColumns = (
    t: TFunction<'translation', undefined>,
    onRefresh: () => void
) => {
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
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('user.table.nickname')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
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
            header: ({ column }: any) => (
                <div className={cn('flex items-center space-x-1')}>
                    <span>{t('user.table.scope')}</span>
                    <DataTableColumnFilter column={column} options={scope} />
                </div>
            ),
            cell: ({ row }: any) => {
                // -1-封禁 0-游客 1-普通用户 2-正式会员 3-管理员
                const RoleMap: { [key: number]: string } = {
                    '-1': t('user.role.ban'),
                    0: t('user.role.visitor'),
                    1: t('user.role.general'),
                    2: t('user.role.member'),
                    3: t('user.role.admin')
                };
                return RoleMap[row.original?.scope || 0];
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
