import { Layout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { getAnimeGuideList } from '@/apis/anime-guide';
import { useState } from 'react';
import usePagination from '@/hooks/use-pagination';
import CustomTools from '@/pages/anime-guide/custom-tools';
import { getColumns } from '@/pages/anime-guide/columns';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/data-table/data-table';
import { AnimeGuideItem } from '@/apis/models/anime-guide-model';
import { validFilter, validSort } from '@/lib/utils';
import { getVideoList } from '@/apis/video';

const AnimeGuide = () => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination();

    const [total, setTotal] = useState(0);
    const [data, setData] = useState<AnimeGuideItem[]>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [keyword, setKeyword] = useState('');
    const update_day = validFilter('update_day', columnFilters);
    const [orderBy, order] = validSort(sorting);

    const [animes, setAnimes] = useState<{ label: string; value: number }[]>(
        []
    );

    const { run, loading, refresh } = useRequest(getAnimeGuideList, {
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
                update_day,
                orderBy,
                order
            });
        }
    });

    const { refresh: refreshVideo } = useRequest(getVideoList, {
        defaultParams: [
            {
                page: 1,
                pageSize: 9999
            }
        ],
        onSuccess(data) {
            const { rows } = data.data;
            const res = rows
                .filter(item => !item.is_anime_guide)
                .map(item => {
                    return {
                        label: item.name,
                        value: item.id
                    };
                });
            setAnimes(res);
        }
    });

    const columns = getColumns(t, () => {
        if (data.length === 1 && page > 1) {
            onPaginationChange({
                pageIndex: page - 2,
                pageSize: limit
            });
        } else {
            handleRefresh();
        }
    });

    const handleRefresh = () => {
        refreshVideo();
        refresh();
    };

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
                    <CustomTools onRefresh={handleRefresh} animes={animes} />
                }
            />
        </Layout>
    );
};

export default AnimeGuide;
