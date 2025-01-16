import { messageDelete, messageEdit } from '@/apis/message';
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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { useRequest } from 'ahooks';
import FormSelect from '@/components/custom/form/form-select';
import FormTextarea from '@/components/custom/form/form-textarea';

interface DataTableRowActionsProps {
    row: any;
    onRefresh: () => void;
}

export const status = [
    {
        label: t('message.status.pending'),
        value: 0
    },
    {
        label: t('message.status.processing'),
        value: 1
    },
    {
        label: t('message.status.completed'),
        value: 2
    },
    {
        label: t('message.status.closed'),
        value: 3
    }
];

const editFormSchema = z.object({
    status: z
        .number({
            required_error: `${t('message.table.status')} ${t('validator.empty')}`,
            invalid_type_error: `${t('message.table.status')} ${t('validator.type')}`
        })
        .int(`${t('message.table.status')} ${t('validator.int')}`)
        .min(0, `${t('message.table.status')} ${t('validator.min')} 0`)
        .max(3, `${t('message.table.status')} ${t('validator.max')} 3`),
    reply_content: z
        .string({
            required_error: `${t('message.table.reply_content')} ${t('validator.empty')}`,
            invalid_type_error: `${t('message.table.reply_content')} ${t('validator.type')}`
        })
        .max(1000, {
            message: `${t('message.table.reply_content')} ${t('validator.max.length')} 1000`
        })
        .min(1, `${t('message.table.reply_content')} ${t('validator.empty')}`)
});

interface EditFormProps {
    form: any;
}

const EditForm: React.FC<EditFormProps> = ({ form }) => {
    const { t } = useTranslation();

    return (
        <Form {...form}>
            <form className={cn('space-y-6')}>
                <FormSelect
                    control={form.control}
                    name="status"
                    label={t('message.table.status')}
                    required
                    options={status}
                />
                <FormTextarea
                    control={form.control}
                    name="reply_content"
                    label={t('message.table.reply_content')}
                    required
                />
            </form>
        </Form>
    );
};

interface EditDialogPops extends DeleteDialogProps {
    reply_content: string;
    status: number;
}

const EditDialog: React.FC<EditDialogPops> = ({ id, onRefresh, ...rest }) => {
    const { t } = useTranslation();
    const [editOpen, setEditOpen] = useState(false);

    const editForm = useForm<z.infer<typeof editFormSchema>>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            ...rest
        }
    });

    const { run: runEdit } = useRequest(messageEdit, {
        manual: true,
        debounceWait: 300,
        onSuccess({ code, msg }) {
            if (code === 200) {
                onRefresh && onRefresh();
                setEditOpen(false);
                toast({
                    description: msg,
                    duration: 1500
                });
                editForm.reset();
            }
        }
    });

    const handleEdit = (values: z.infer<typeof editFormSchema>) => {
        runEdit({
            ...values,
            id
        });
    };

    return (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className={cn('h-8 p-0')}>
                    {t('table.edit')}
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
                        {t('table.edit')}
                    </DialogTitle>
                </DialogHeader>
                <div className={cn('px-6 pb-1')}>
                    <EditForm form={editForm} />
                </div>
                <DialogFooter className={cn('p-6 pt-5')}>
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={editForm.handleSubmit(handleEdit)}
                    >
                        {t('dialog.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

interface DeleteDialogProps {
    id: number;
    onRefresh: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ id, onRefresh }) => {
    const { t } = useTranslation();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { run: runDelete } = useRequest(messageDelete, {
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
    const { id, reply_content, status } = row.original;

    return (
        <div className={cn('space-x-4')}>
            <EditDialog
                id={id}
                onRefresh={onRefresh}
                reply_content={reply_content}
                status={status}
            />

            <DeleteDialog id={id} onRefresh={onRefresh} />
        </div>
    );
};

export default DataTableRowActions;