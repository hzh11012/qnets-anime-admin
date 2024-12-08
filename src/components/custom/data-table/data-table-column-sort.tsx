import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DataTableColumnSortProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
}

export function DataTableColumnSort<TData, TValue>({
    column
}: DataTableColumnSortProps<TData, TValue>) {
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={cn('cursor-pointer')}>
                    {column.getIsSorted() === 'desc' ? (
                        <ChevronDown
                            color="#1677ff"
                            className={cn('h-4 w-4')}
                        />
                    ) : column.getIsSorted() === 'asc' ? (
                        <ChevronUp color="#1677ff" className={cn('h-4 w-4')} />
                    ) : (
                        <ChevronsUpDown className={cn('h-4 w-4')} />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                    <ChevronUp
                        className={cn('h-4 w-4 text-muted-foreground/70 mr-1')}
                    />
                    {t('table.toolbar.asc')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                    <ChevronDown
                        className={cn('h-4 w-4 text-muted-foreground/70 mr-1')}
                    />
                    {t('table.toolbar.desc')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                    <ChevronsUpDown
                        className={cn('h-4 w-4 text-muted-foreground/70 mr-1')}
                    />
                    {t('table.toolbar.reset')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
