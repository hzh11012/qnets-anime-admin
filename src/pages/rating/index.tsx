import { Layout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { getRatingList } from '@/apis/rating';
import { useState } from 'react';
import usePagination from '@/hooks/use-pagination';
import { getColumns } from '@/pages/rating/columns';
import { SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/data-table/data-table';
import { validSort } from '@/lib/utils';
import { RatingItem } from '@/apis/models/rating-model';

const Rating = () => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState<RatingItem[]>([]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [keyword, setKeyword] = useState('');
    const [orderBy, order] = validSort(sorting);

    const { run, loading, refresh } = useRequest(getRatingList, {
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
        refreshDeps: [page, limit, keyword, sorting],
        refreshDepsAction: () => {
            run({
                page,
                keyword,
                pageSize: limit,
                orderBy,
                order
            });
        }
    });

    const columns = getColumns(t, () => {
        if (data.length === 1 && page > 1) {
            onPaginationChange({
                pageIndex: page - 2,
                pageSize: limit
            });
        } else {
            refresh();
        }
    });

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
            />
        </Layout>
    );
};

export default Rating;
