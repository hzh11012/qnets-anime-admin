import { Layout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { getSwiperList } from '@/apis/swiper';
import { useState } from 'react';
import usePagination from '@/hooks/use-pagination';
import CustomTools from '@/pages/swiper/custom-tools';
import { getColumns } from '@/pages/swiper/columns';
import { SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/data-table/data-table';
import { SwiperItem } from '@/apis/models/swiper-model';

const Swiper = () => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState<SwiperItem[]>([]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [keyword, setKeyword] = useState('');

    const { run, loading, refresh } = useRequest(getSwiperList, {
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
        refreshDeps: [page, limit, keyword],
        refreshDepsAction: () => {
            run({
                page,
                keyword,
                pageSize: limit
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
                customTools={<CustomTools onRefresh={refresh} />}
            />
        </Layout>
    );
};

export default Swiper;
