import { ratingDelete } from '@/apis/rating';
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

interface DataTableRowActionsProps {
    row: any;
    onRefresh: () => void;
}

interface DeleteDialogProps {
    id: number;
    onRefresh: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ id, onRefresh }) => {
    const { t } = useTranslation();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { run: runDelete } = useRequest(ratingDelete, {
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

    return (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className={cn('h-8 p-0')}>
                    {t('table.delete')}
                </Button>
            </DialogTrigger>
            <DialogContent
                aria-describedby={undefined}
                className={cn(
                    'flex flex-col gap-0 p-0 max-h-full sm:max-h-[36rem] sm:max-w-lg max-w-full [&>button:last-child]:top-[1.36rem] [&>button:last-child]:right-5'
                )}
            >
                <DialogHeader>
                    <DialogTitle className={cn('p-6 text-base')}>
                        {t('table.delete')}
                    </DialogTitle>
                </DialogHeader>
                <div className={cn('px-6 text-sm')}>
                    {t('dialog.delete.content')}
                </div>
                <DialogFooter className={cn('p-6 pt-5 space-x-3')}>
                    <DialogClose asChild>
                        <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            aria-label="Close"
                        >
                            {t('dialog.cancel')}
                        </Button>
                    </DialogClose>
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={handleDelete}
                    >
                        {t('dialog.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DataTableRowActions: React.FC<DataTableRowActionsProps> = ({
    row,
    onRefresh
}) => {
    const { id } = row.original;

    return <DeleteDialog id={id} onRefresh={onRefresh} />;
};

export default DataTableRowActions;
