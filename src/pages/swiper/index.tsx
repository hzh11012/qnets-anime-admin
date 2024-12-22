import { SwiperItem } from '@/apis/models/swiper-model';
import { getSwiperList } from '@/apis/swiper';
import { Layout } from '@/components/layout';
import { cn } from '@/lib/utils';
import { useRequest } from 'ahooks';
import usePagination from '@/hooks/use-pagination';
import { useState } from 'react';
import { SwiperTable } from '@/pages/swiper/swiper-table';

const Swiper = () => {
    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState<SwiperItem[]>([]);

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

    return (
        <Layout className={cn('h-full')}>
            <SwiperTable
                data={data}
                loading={loading}
                pagination={pagination}
                pageCount={Math.ceil(total / limit)}
                total={total}
                onPaginationChange={onPaginationChange}
                sizes={[10, 20, 50, 100]}
                onSearch={setKeyword}
                onRefresh={refresh}
            />
        </Layout>
    );
};

export default Swiper;
