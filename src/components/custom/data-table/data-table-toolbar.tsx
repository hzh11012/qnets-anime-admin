import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';
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
    customTools?: ReactNode;
    onSearch: (val: string) => void;
}

export function DataTableToolbar<TData>({
    table,
    customTools,
    onSearch
}: DataTableToolbarProps<TData>) {
    const { t } = useTranslation();

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
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
