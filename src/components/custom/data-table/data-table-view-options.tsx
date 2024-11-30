import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}

export function DataTableViewOptions<TData>({
    table
}: DataTableViewOptionsProps<TData>) {
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn('ml-auto hidden h-9 w-9 px-0 lg:flex')}
                >
                    <Settings2 width={18} height={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn('w-[150px]')}>
                <DropdownMenuLabel>
                    {t('table.toolbar.toggle_columns')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter(
                        column =>
                            typeof column.accessorFn !== 'undefined' &&
                            column.getCanHide()
                    )
                    .map((column: any) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className={cn('capitalize')}
                                checked={column.getIsVisible()}
                                onCheckedChange={value =>
                                    column.toggleVisibility(!!value)
                                }
                            >
                                {column.columnDef.title}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    key={'clear_all'}
                    className={cn('capitalize px-2 justify-center')}
                    onCheckedChange={() => table.resetColumnVisibility()}
                >
                    {t('table.toolbar.reset')}
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
