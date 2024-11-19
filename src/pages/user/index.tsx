import { Layout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { getUserList } from '@/apis/user';
import { useState } from 'react';
import usePagination from '@/hooks/use-pagination';
import { getColumns, getFilterColumns } from '@/pages/user/columns';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/data-table/data-table';
import { validFilter, validSort } from '@/lib/utils';

const User = () => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [keyword, setKeyword] = useState('');

    const { run, loading } = useRequest(getUserList, {
        defaultParams: [
            {
                page,
                pageSize: limit
            }
        ],
        onSuccess(data: any) {
            const { rows, count } = data.data;
            setTotal(count);
            setData(rows);
        },
        refreshDeps: [page, limit, columnFilters, keyword, sorting],
        refreshDepsAction: () => {
            const scope = validFilter('scope', columnFilters);
            const order = validSort('created_at', sorting);
            run({
                page,
                keyword,
                pageSize: limit,
                scope,
                order
            });
        }
    });

    const columns = getColumns(t);

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

export default User;
