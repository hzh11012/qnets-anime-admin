import { Layout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { getVideoCategoryList } from '@/apis/category';
import { useState } from 'react';
import usePagination from '@/hooks/use-pagination';
import CustomTools from '@/pages/category/custom-tools';
import { getColumns } from '@/pages/category/columns';
import { SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/data-table/data-table';
import { validSort } from '@/lib/utils';

const Category = () => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [keyword, setKeyword] = useState('');

    const { run, loading, refresh } = useRequest(getVideoCategoryList, {
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
        refreshDeps: [page, limit, keyword, sorting],
        refreshDepsAction: () => {
            const order = validSort('created_at', sorting);
            run({
                page,
                keyword,
                pageSize: limit,
                order
            });
        }
    });

    const columns = getColumns(t, refresh);

    return (
        <Layout>
            <DataTable
                data={data}
                columns={columns}
                loading={loading}
                pagination={pagination}
                pageCount={Math.ceil(total / limit)}
                total={total}
                onPaginationChange={onPaginationChange}
                sizes={[10, 20, 50, 100]}
                onSearch={setKeyword}
                sorting={sorting}
                onSortingChange={setSorting}
                customTools={<CustomTools onRefresh={refresh} />}
            />
        </Layout>
    );
};

export default Category;
