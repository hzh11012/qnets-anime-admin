import { correctionDelete, correctionEdit } from '@/apis/correction';
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
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { z } from 'zod';
import { useRequest } from 'ahooks';

interface DataTableRowActionsProps {
    row: any;
    onRefresh: () => void;
}

export function DataTableRowActions({
    row,
    onRefresh
}: DataTableRowActionsProps) {
    const { id, nickname, message, status } = row.original;
    const { t } = useTranslation();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const editFormSchema = z.object({
        id: z.number({
            required_error: `${t('correct.table.id')} ${t('validator.empty')}`,
            invalid_type_error: `${t('correct.table.id')} ${t('validator.type')}`
        }),
        nickname: z
            .string({
                required_error: `${t('correct.table.nickname')} ${t('validator.empty')}`,
                invalid_type_error: `${t('correct.table.nickname')} ${t('validator.type')}`
            })
            .max(25, {
                message: `${t('correct.table.nickname')} ${t('validator.max.length')} 25`
            })
            .min(1, `${t('correct.table.nickname')} ${t('validator.empty')}`),
        message: z
            .string({
                required_error: `${t('correct.table.message')} ${t('validator.empty')}`,
                invalid_type_error: `${t('correct.table.message')} ${t('validator.type')}`
            })
            .max(255, {
                message: `${t('correct.table.message')} ${t('validator.max.length')} 255`
            })
            .min(1, `${t('correct.table.message')} ${t('validator.empty')}`),
        status: z
            .number({
                required_error: `${t('correct.table.status')} ${t('validator.empty')}`,
                invalid_type_error: `${t('correct.table.status')} ${t('validator.type')}`
            })
            .int(`${t('correct.table.status')} ${t('validator.int')}`)
            .min(0, `${t('correct.table.status')} ${t('validator.min')} 0`)
            .max(1, `${t('correct.table.status')} ${t('validator.max')} 1`)
    });

    const editForm = useForm<z.infer<typeof editFormSchema>>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            id,
            nickname,
            message,
            status
        }
    });

    const { run: runEdit } = useRequest(correctionEdit, {
        manual: true,
        debounceWait: 300,
        onSuccess({ code, msg }) {
            if (code === 200) {
                onRefresh && onRefresh();
                toast({
                    description: msg,
                    duration: 1500
                });
                setEditOpen(false);
            }
        }
    });

    const { run: runDelete } = useRequest(correctionDelete, {
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

    const handleEdit = (values: z.infer<typeof editFormSchema>) => {
        runEdit(values);
    };

    const handleDelete = () => {
        runDelete({ id });
    };

    return (
        <div className={cn('space-x-4')}>
            <Dialog
                open={editOpen}
                onOpenChange={() => {
                    setEditOpen(!editOpen);
                    setTimeout(() => {
                        // 关闭弹窗 reset 表单
                        if (editOpen) {
                            editForm.reset();
                        }
                    }, 200);
                }}
            >
                <DialogTrigger asChild>
                    <Button variant="link" className={cn('h-8 p-0')}>
                        {t('table.edit')}
                    </Button>
                </DialogTrigger>
                <DialogContent
                    aria-describedby={undefined}
                    onOpenAutoFocus={e => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>{t('table.edit')}</DialogTitle>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form
                            onSubmit={editForm.handleSubmit(handleEdit)}
                            className={cn('space-y-6')}
                        >
                            <FormField
                                control={editForm.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={cn('required')}>
                                            {t('correct.table.message')}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className={cn('resize-none')}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={cn('required')}>
                                            {t('correct.table.status')}
                                        </FormLabel>
                                        <Select
                                            onValueChange={val =>
                                                field.onChange(parseInt(val))
                                            }
                                            defaultValue={`${field.value}`}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="0">
                                                    {t(
                                                        'correct.status.pending'
                                                    )}
                                                </SelectItem>
                                                <SelectItem value="1">
                                                    {t('correct.status.done')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    size="sm"
                                    type="submit"
                                    variant="outline"
                                >
                                    {t('dialog.confirm')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

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
