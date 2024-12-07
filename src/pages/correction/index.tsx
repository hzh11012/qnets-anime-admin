import { Layout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { getCorrectionList } from '@/apis/correction';
import { useState } from 'react';
import usePagination from '@/hooks/use-pagination';
import { getColumns, getFilterColumns } from '@/pages/correction/columns';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/data-table/data-table';
import { validFilter, validSort } from '@/lib/utils';
import { CorrectionItem } from '@/apis/models/correction-model';

const Correction = () => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState<CorrectionItem[]>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [keyword, setKeyword] = useState('');
    const status = validFilter('status', columnFilters);
    const order = validSort('created_at', sorting);

    const { run, loading, refresh } = useRequest(getCorrectionList, {
        defaultParams: [
            {
                page,
                pageSize: limit
            }
        ],
        onSuccess(data) {
            const { rows, count } = data.data;
            setTotal(count);
            setData(rows);
        },
        refreshDeps: [page, limit, columnFilters, keyword, sorting],
        refreshDepsAction: () => {
            run({
                page,
                keyword,
                pageSize: limit,
                status,
                order
            });
        }
    });

    const columns = getColumns(t, () => {
        if (data.length === 1) {
            const pageIndex = (page > 1 ? page - 1 : 1) - 1;
            onPaginationChange({
                pageIndex,
                pageSize: limit
            });
        } else {
            refresh();
        }
    });

    const filterColumns = getFilterColumns(t);

    return (
        <Layout>
            <DataTable
                data={data}
                columns={columns}
                filterColumns={filterColumns}
                loading={loading}
                pagination={pagination}
                pageCount={Math.ceil(total / limit)}
                total={total}
                onPaginationChange={onPaginationChange}
                sizes={[10, 20, 50, 100]}
                onSearch={setKeyword}
                sorting={sorting}
                onSortingChange={setSorting}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
            />
        </Layout>
    );
};

export default Correction;
