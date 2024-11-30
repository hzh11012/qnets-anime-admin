import { DataTableFacetedFilter } from '@/components/custom/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface DataTableFacetedFilterProps {
    column: string;
    title?: string;
    options: {
        label: string;
        value: string | number;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterColumns?: DataTableFacetedFilterProps[];
    customTools?: ReactNode;
    onSearch: (val: string) => void;
}

export function DataTableToolbar<TData>({
    table,
    filterColumns = [],
    customTools,
    onSearch
}: DataTableToolbarProps<TData>) {
    const { t } = useTranslation();
    const isFiltered = table.getState().columnFilters?.length > 0;

    return (
        <div className={cn('flex items-center justify-between')}>
            <div className={cn('flex flex-1 items-center space-x-6')}>
                {customTools}
                <Input
                    type="text"
                    placeholder={t('table.search.placeholder')}
                    className={cn('max-w-72 h-9')}
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            onSearch && onSearch(e.target.value);
                        }
                    }}
                />
                {filterColumns.length > 0 &&
                    filterColumns.map((item, index) => {
                        return (
                            <DataTableFacetedFilter
                                key={index}
                                {...item}
                                column={table.getColumn(item.column)}
                            />
                        );
                    })}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className={cn('h-9 px-2 pr-1 lg:px-3 lg:pr-2')}
                    >
                        {t('table.toolbar.reset')}
                        <X width={18} height={18} className={cn('ml-1')} />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
