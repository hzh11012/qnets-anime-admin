import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    sizes: number[];
}

function DataTablePagination<TData>({
    table,
    sizes
}: DataTablePaginationProps<TData>) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center"></div>
            <div className="flex items-center"></div>
        </div>
    );
}

export default DataTablePagination;
