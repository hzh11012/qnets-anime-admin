import { DanmakuList } from '@/apis/danmaku';
import Color from '@/components/custom/color';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { useRequest } from 'ahooks';
import { TFunction } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

const Actions = ({ row, onRefresh }: any) => {
    const { toast } = useToast();
    const { _id } = row.original;
    const { t } = useTranslation();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { runAsync, loading } = useRequest(DanmakuList, {
        defaultParams: [
            {
                ac: 'del',
                type: 'list',
                id: _id
            }
        ],
        manual: true,
        loadingDelay: 300
    });

    return (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="destructive">
                    {t('table.delete')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="text-base">
                    {t('dialog.delete')}
                </DialogTitle>
                <DialogDescription>
                    <div>{t('dialog.delete.content')}</div>
                </DialogDescription>
                <DialogFooter>
                    <Button
                        size="sm"
                        variant="outline"
                        className="mr-2"
                        onClick={() => setDeleteOpen(false)}
                    >
                        {t('dialog.cancel')}
                    </Button>
                    <Button
                        disabled={loading}
                        size="sm"
                        type="submit"
                        variant="destructive"
                        onClick={() =>
                            runAsync({
                                ac: 'del',
                                type: 'list',
                                id: _id
                            }).then(() => {
                                onRefresh && onRefresh();
                                toast({
                                    description: '删除成功',
                                    duration: 1500
                                });
                                setDeleteOpen(false);
                            })
                        }
                    >
                        {t('dialog.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const getColumns = (
    t: TFunction<'translation', undefined>,
    refresh: () => void
) => {
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
            accessorKey: 'color',
            header: t('danmaku.table.color'),
            cell: ({ row }: any) => {
                return <Color color={row.original.color} />;
            }
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
            id: 'actions',
            header: t('danmaku.table.actions'),
            cell: ({ row }: any) => <Actions row={row} onRefresh={refresh} />
        }
    ];

    return columns;
};
