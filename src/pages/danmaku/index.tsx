import { Layout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/pages/danmaku/data-table';
import { getColumns } from '@/pages/danmaku/columns';
import { useRequest } from 'ahooks';
import { DanmakuList } from '@/apis/danmaku';
import { useEffect } from 'react';
import usePagination from '@/hooks/use-pagination';

const Dashboard = () => {
    const { t } = useTranslation();
    const columns = getColumns(t);

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const listRes = useRequest(DanmakuList, {
        manual: true
    });

    useEffect(() => {
        const options = {
            ac: 'list',
            page,
            limit
        };
        if (true) {
            // todo search
        }
        listRes.run(options);
    }, [page, limit]);

    return (
        <Layout>
            <DataTable
                pagination={pagination}
                onPaginationChange={onPaginationChange}
                columns={columns}
                data={[
                    {
                        id: '728ed52f',
                        amount: 100,
                        status: 'pending',
                        email: 'm@example.com'
                    }
                ]}
            />
        </Layout>
    );
};

export default Dashboard;
