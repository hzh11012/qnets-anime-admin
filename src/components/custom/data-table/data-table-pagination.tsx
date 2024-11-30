import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import PaginationPage from './data-table-pagination-page';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    sizes: number[];
    total?: number;
}

function DataTablePagination<TData>({
    table,
    sizes,
    total
}: DataTablePaginationProps<TData>) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <div className="items-center space-x-2 hidden sm:flex">
                    {!!total && (
                        <>
                            <div className="text-sm font-medium">
                                {t('pagination.total')}
                            </div>
                            <div className="text-sm font-medium">{total}</div>
                        </>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-between space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="hidden text-sm items-center font-medium sm:block">
                        {t('pagination.pageSize')}
                    </p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={value => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="w-auto">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {sizes.map(pageSize => {
                                    return (
                                        <SelectItem
                                            key={pageSize}
                                            value={`${pageSize}`}
                                        >
                                            {pageSize}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <PaginationPage table={table} />
                </div>
            </div>
        </div>
    );
}

export default DataTablePagination;
