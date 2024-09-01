import { TFunction } from 'i18next';

export const getColumns = (t: TFunction<'translation', undefined>) => {
    const columns = [
        {
            accessorKey: 'id',
            header: t('danmaku.table.id')
        },
        {
            accessorKey: 'content',
            header: t('danmaku.table.content')
        },
        {
            accessorKey: 'type',
            header: t('danmaku.table.type')
        },
        {
            accessorKey: 'color',
            header: t('danmaku.table.color')
        },
        {
            accessorKey: 'videoTime',
            header: t('danmaku.table.videoTime')
        },
        {
            accessorKey: 'ip',
            header: t('danmaku.table.ip')
        },
        {
            accessorKey: 'createTime',
            header: t('danmaku.table.createTime')
        },
        {
            accessorKey: 'source',
            header: t('danmaku.table.source')
        },
        {
            id: 'actions',
            header: t('danmaku.table.actions'),
            cell: () => {
                return <>222</>;
            }
        }
    ];

    return columns;
};
