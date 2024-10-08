import { Layout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/pages/danmaku/data-table';
import { getColumns } from '@/pages/danmaku/columns';
import { useRequest } from 'ahooks';
import { DanmakuList } from '@/apis/danmaku';
import { useState } from 'react';
import usePagination from '@/hooks/use-pagination';

const Dashboard = () => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);

    const { run, loading, refresh } = useRequest(DanmakuList, {
        defaultParams: [
            {
                ac: 'list',
                page,
                limit
            }
        ],
        onSuccess(data: any) {
            const { count, data: _data } = data;
            const res = _data.map((item: any) => {
                return {
                    _id: item[4],
                    id: item[0],
                    content: item[5],
                    color: item[3],
                    videoTime: item[1],
                    ip: item[6],
                    createTime: item[7],
                    source: item[9]
                };
            });
            setTotal(count);
            setData(res);
        },
        refreshDeps: [page, limit],
        refreshDepsAction: () => {
            run({
                ac: 'list',
                page,
                limit
            });
        }
    });

    const columns = getColumns(t, () => {
        if (data.length === 1) {
            run({
                ac: 'list',
                page: page > 1 ? page - 1 : 1,
                limit
            });
        } else {
            refresh();
        }
    });

    const onSearch = (val: string) => {
        if (val) {
            run({
                ac: 'so',
                key: val,
                page,
                limit
            });
        } else {
            run({
                ac: 'list',
                page,
                limit
            });
        }
    };

    const onReload = () => {
        run({
            ac: 'list',
            page,
            limit
        });
    };

    return (
        <Layout>
            <DataTable
                onReload={onReload}
                onSearch={onSearch}
                pagination={pagination}
                pageCount={Math.ceil(total / limit)}
                onPaginationChange={onPaginationChange}
                columns={columns}
                loading={loading}
                total={total}
                data={data}
                sizes={[10, 20, 50, 100]}
            />
        </Layout>
    );
};

export default Dashboard;
