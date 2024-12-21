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
import { cn, formateNumber } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { episodeDelete } from '@/apis/video';
import { Trash2 } from 'lucide-react';
import { PLAYER_BASE_URL } from '@/lib/config';

interface EpisodeButtonProps {
    id: number;
    title: string;
    episode: number;
    url: string;
    next_url?: string;
    play_count: number;
    onRefresh?: () => void;
}

const EpisodeButton = ({
    id,
    title,
    episode,
    url,
    play_count,
    onRefresh
}: EpisodeButtonProps) => {
    const { t } = useTranslation();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { run: runDelete } = useRequest(episodeDelete, {
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

    const handleDelete = () => {
        runDelete({ id });
    };

    const handlePlay = () => {
        window.open(`${PLAYER_BASE_URL}?url=${url}`);
    };

    return (
        <div
            className={cn(
                'inline-flex -space-x-px rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse'
            )}
        >
            <Button
                className={cn(
                    'h-7 md:h-9 px-2 md:px-3 rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 text-xs md:text-sm space-x-1.5 md:space-x-3'
                )}
                variant="outline"
                onClick={handlePlay}
            >
                <span>{episode}</span>
                <span>{title}</span>
                <span
                    className={cn(
                        'hidden md:inline-flex h-5 items-center rounded border border-border px-1 font-[inherit] text-[0.6rem] font-medium text-muted-foreground'
                    )}
                >
                    {formateNumber(play_count)}
                </span>
            </Button>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="md:size-9 size-7  rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                        variant="outline"
                        size="icon"
                        aria-label="Menu"
                    >
                        <Trash2 className={cn('text-[#1677ff]')} size={14} />
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
};

export default EpisodeButton;
