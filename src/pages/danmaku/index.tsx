import { Layout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { getDanmakuList } from '@/apis/danmaku';
import { useState } from 'react';
import usePagination from '@/hooks/use-pagination';
import { getColumns } from '@/pages/danmaku/columns';
import { DataTable } from '@/components/custom/data-table/data-table';
import { DanmakuItem } from '@/apis/models/danmaku-model';

const Correction = () => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState<DanmakuItem[]>([]);

    const [keyword, setKeyword] = useState('');

    const { run, loading, refresh } = useRequest(getDanmakuList, {
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
            />
        </Layout>
    );
};

export default Correction;
