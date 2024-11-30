import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className
}: DataTableColumnHeaderProps<TData, TValue>) {
    const { t } = useTranslation();

    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn('-ml-3 h-8 data-[state=open]:bg-accent')}
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === 'desc' ? (
                            <ArrowDown className={cn('h-4 w-4')} />
                        ) : column.getIsSorted() === 'asc' ? (
                            <ArrowUp className={cn('h-4 w-4')} />
                        ) : (
                            <ChevronsUpDown className={cn('h-4 w-4')} />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(false)}
                    >
                        <ArrowUp
                            className={cn(
                                'h-4 w-4 text-muted-foreground/70 mr-1'
                            )}
                        />
                        {t('table.toolbar.asc')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(true)}
                    >
                        <ArrowDown
                            className={cn(
                                'h-4 w-4 text-muted-foreground/70 mr-1'
                            )}
                        />
                        {t('table.toolbar.desc')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.clearSorting()}>
                        <ChevronsUpDown
                            className={cn(
                                'h-4 w-4 text-muted-foreground/70 mr-1'
                            )}
                        />
                        {t('table.toolbar.reset')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
