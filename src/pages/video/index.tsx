import { Layout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { getVideoList } from '@/apis/video';
import { useState } from 'react';
import usePagination from '@/hooks/use-pagination';
import CustomTools from '@/pages/video/custom-tools';
import { getColumns } from '@/pages/video/columns';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/data-table/data-table';
import { validFilter, validSort } from '@/lib/utils';
import { VideoItem } from '@/apis/models/video-model';
import { getVideoCategoryList } from '@/apis/category';

const Video = () => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState<VideoItem[]>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [keyword, setKeyword] = useState('');
    const status = validFilter('status', columnFilters);
    const type = validFilter('type', columnFilters);
    const year = validFilter('year', columnFilters);
    const month = validFilter('month', columnFilters);
    const order = validSort('created_at', sorting);
    const category = validFilter('categories', columnFilters);

    const [categories, setCategories] = useState<
        { label: string; value: number }[]
    >([]);

    const { run, loading, refresh } = useRequest(getVideoList, {
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
                type,
                year,
                month,
                category,
                order
            });
        }
    });

    useRequest(getVideoCategoryList, {
        defaultParams: [
            {
                page: 1,
                pageSize: 999
            }
        ],
        onSuccess(data) {
            const { rows } = data.data;
            const res = rows.map(item => {
                return {
                    label: item.category,
                    value: item.id
                };
            });
            setCategories(res);
        }
    });

    const columns = getColumns(
        t,
        () => {
            if (data.length === 1) {
                const pageIndex = (page > 1 ? page - 1 : 1) - 1;
                onPaginationChange({
                    pageIndex,
                    pageSize: limit
                });
            } else {
                refresh();
            }
        },
        {
            categories
        }
    );

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
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
                customTools={
                    <CustomTools categories={categories} onRefresh={refresh} />
                }
            />
        </Layout>
    );
};

export default Video;
