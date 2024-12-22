import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
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
import { useRequest } from 'ahooks';
import { videoDelete } from '@/apis/video';
import { useNavigate } from 'react-router-dom';
import { swiperCreate, swiperDelete } from '@/apis/swiper';

interface DataTableRowActionsProps {
    row: any;
    onRefresh: () => void;
}

export function DataTableRowActions({
    row,
    onRefresh
}: DataTableRowActionsProps) {
    const { id, is_swiper } = row.original;
    const { t } = useTranslation();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const navigate = useNavigate();

    const { run: runDelete } = useRequest(videoDelete, {
        manual: true,
        debounceWait: 300,
        onSuccess({ code, msg }) {
            if (code === 200) {
                onRefresh && onRefresh();
                toast({
                    description: msg,
                    duration: 1500
                });
                setDeleteOpen(false);
            }
        }
    });

    const { run: runSetSwiper } = useRequest(swiperCreate, {
        manual: true,
        debounceWait: 300,
        onSuccess({ code, msg }) {
            if (code === 200) {
                onRefresh && onRefresh();
                toast({
                    description: msg,
                    duration: 1500
                });
            }
        }
    });

    const { run: runCancelSwiper } = useRequest(swiperDelete, {
        manual: true,
        debounceWait: 300,
        onSuccess({ code, msg }) {
            if (code === 200) {
                onRefresh && onRefresh();
                toast({
                    description: msg,
                    duration: 1500
                });
            }
        }
    });

    const handleDelete = () => {
        runDelete({ id });
    };

    const handleDetail = () => {
        navigate(`/video/detail/${id}`);
    };

    const handleSwiper = () => {
        is_swiper ? runCancelSwiper({ id }) : runSetSwiper({ id });
    };

    return (
        <div className={cn('space-x-4')}>
            <Button
                variant="link"
                className={cn('h-8 p-0')}
                onClick={handleSwiper}
            >
                {!is_swiper ? t('table.set_swiper') : t('table.cancel_swiper')}
            </Button>

            <Button
                variant="link"
                className={cn('h-8 p-0')}
                onClick={handleDetail}
            >
                {t('table.detail')}
            </Button>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                    <Button variant="link" className={cn('h-8 p-0')}>
                        {t('table.delete')}
                    </Button>
                </DialogTrigger>
                <DialogContent aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle className={cn('text-base')}>
                            {t('table.delete')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className={cn('text-sm')}>
                        {t('dialog.delete.content')}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                size="sm"
                                variant="outline"
                                aria-label="Close"
                            >
                                {t('dialog.cancel')}
                            </Button>
                        </DialogClose>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDelete}
                        >
                            {t('dialog.confirm')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
