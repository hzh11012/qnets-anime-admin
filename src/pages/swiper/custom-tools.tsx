import { swiperCreate } from '@/apis/swiper';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import usePagination from '@/hooks/use-pagination';
import { useRequest } from 'ahooks';
import { DataTable } from '@/components/custom/data-table/data-table';
import { VideoItem } from '@/apis/models/video-model';
import {
    OnChangeFn,
    RowSelectionState,
    SortingState
} from '@tanstack/react-table';
import { getVideoList } from '@/apis/video';
import { Search } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Checkbox } from '@/components/ui/checkbox';

interface CustomToolsProps {
    onRefresh: () => void;
}

const AnimePickerTable = ({
    rowSelection,
    onRowSelectionChange
}: {
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}) => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination(3);

    const [total, setTotal] = useState(0);
    const [data, setData] = useState<VideoItem[]>([]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [keyword, setKeyword] = useState('');

    const { run, loading } = useRequest(getVideoList, {
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
                pageSize: limit
            });
        }
    });

    const columns = [
        {
            id: 'select',
            header: ({ table }: any) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={value =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="全选"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }: any) => (
                <Checkbox
                    disabled={!row.getCanSelect()}
                    checked={row.getIsSelected() || !row.getCanSelect()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    aria-label="选择行"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'id',
            title: t('video.table.id'),
            header: t('video.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'banner_url',
            title: t('video.table.banner_url'),
            header: t('video.table.banner_url'),
            cell: ({ row }: any) => {
                return (
                    <img
                        src={row.original.banner_url}
                        loading="lazy"
                        className={cn(
                            'block max-w-none w-[8rem] h-[4rem] object-cover rounded-sm'
                        )}
                    />
                );
            }
        },
        {
            accessorKey: 'name',
            title: t('video.table.name'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('video.table.name')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            }
        }
    ];

    return (
        <DataTable
            data={data}
            columns={columns}
            loading={loading}
            pagination={pagination}
            pageCount={Math.ceil(total / limit)}
            total={total}
            onPaginationChange={onPaginationChange}
            onSearch={setKeyword}
            sorting={sorting}
            onSortingChange={setSorting}
            className={cn('p-0')}
            headerClassName={cn('px-0')}
            enableRowSelection={(row: any) => !row.original.is_swiper}
            rowSelection={rowSelection}
            onRowSelectionChange={onRowSelectionChange}
        />
    );
};

const CustomTools = ({ onRefresh }: CustomToolsProps) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const [rowSelection, setRowSelection] = useState({});

    const { run: runCreate } = useRequest(swiperCreate, {
        manual: true,
        debounceWait: 300,
        onSuccess({ code, msg }) {
            if (code === 200) {
                onRefresh && onRefresh();
                toast({
                    description: msg,
                    duration: 1500
                });
                setCreateOpen(false);
                // 重置table select
                setRowSelection({});
            }
        }
    });

    const handleClick = () => {
        runCreate({
            ids: Object.keys(rowSelection).map(i => parseInt(i))
        });
    };

    return (
        <Dialog
            open={createOpen}
            onOpenChange={() => {
                setCreateOpen(!createOpen);
                setTimeout(() => {
                    // 关闭弹窗 重置table select
                    if (createOpen) {
                        setRowSelection({});
                    }
                }, 200);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className={cn('h-9 px-3')}>
                    {t('table.create')}
                </Button>
            </DialogTrigger>

            <DialogContent
                className="flex flex-col"
                aria-describedby={undefined}
            >
                <DialogHeader>
                    <DialogTitle>{t('table.create')}</DialogTitle>
                </DialogHeader>
                <Layout>
                    <AnimePickerTable
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                    />
                    <DialogFooter
                        className={cn('pt-6 flex items-center justify-between')}
                    >
                        {!!Object.keys(rowSelection).length && (
                            <span className={cn('text-sm')}>
                                {`${t('table.selected')} ${Object.keys(rowSelection).length}`}
                            </span>
                        )}
                        <Button
                            size="sm"
                            type="submit"
                            variant="outline"
                            className={cn('ml-auto')}
                            onClick={handleClick}
                        >
                            {t('dialog.confirm')}
                        </Button>
                    </DialogFooter>
                </Layout>
            </DialogContent>
        </Dialog>
    );
};

export default CustomTools;
