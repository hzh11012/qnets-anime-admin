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
import { UserItem } from '@/apis/models/user-model';

const User = () => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState<UserItem[]>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [keyword, setKeyword] = useState('');

    const { run, loading, refresh } = useRequest(getUserList, {
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

export default User;
