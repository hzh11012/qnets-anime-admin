import { userDelete, userEdit } from '@/apis/user';
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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRequest } from 'ahooks';

interface DataTableRowActionsProps {
    row: any;
    onRefresh: () => void;
}

export function DataTableRowActions({
    row,
    onRefresh
}: DataTableRowActionsProps) {
    const { id, avatar, nickname, scope } = row.original;
    const { t } = useTranslation();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const editFormSchema = z.object({
        id: z.number({
            required_error: `${t('user.table.id')} ${t('validator.empty')}`,
            invalid_type_error: `${t('user.table.id')} ${t('validator.type')}`
        }),
        nickname: z
            .string({
                required_error: `${t('user.table.nickname')} ${t('validator.empty')}`,
                invalid_type_error: `${t('user.table.nickname')} ${t('validator.type')}`
            })
            .min(1, `${t('user.table.nickname')} ${t('validator.empty')}`),
        avatar: z
            .string({
                invalid_type_error: `${t('user.table.avatar')} ${t('validator.type')}`
            })
            .optional(),
        scope: z
            .number({
                required_error: `${t('user.table.scope')} ${t('validator.empty')}`,
                invalid_type_error: `${t('user.table.scope')} ${t('validator.type')}`
            })
            .int(`${t('user.table.scope')} ${t('validator.int')}`)
            .min(-1, `${t('user.table.scope')} ${t('validator.min')} -1`)
            .max(3, `${t('user.table.scope')} ${t('validator.max')} 3`)
    });

    const editForm = useForm<z.infer<typeof editFormSchema>>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            id,
            avatar,
            nickname,
            scope
        }
    });

    const { run: runEdit } = useRequest(userEdit, {
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

    const { run: runDelete } = useRequest(userDelete, {
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
                    <div>
                        <Form {...editForm}>
                            <form
                                onSubmit={editForm.handleSubmit(handleEdit)}
                                className={cn('space-y-6')}
                            >
                                <FormField
                                    control={editForm.control}
                                    name="avatar"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('user.table.avatar')}
                                            </FormLabel>
                                            <FormControl>
                                                <Avatar
                                                    className={cn(
                                                        'w-16 h-16 rounded-lg'
                                                    )}
                                                >
                                                    <AvatarImage
                                                        src={avatar}
                                                        className={cn(
                                                            'rounded-lg'
                                                        )}
                                                    />
                                                    <AvatarFallback
                                                        className={cn(
                                                            'rounded-lg'
                                                        )}
                                                    >
                                                        {nickname?.slice(0, 1)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="nickname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('user.table.nickname')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    autoComplete="off"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="scope"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('user.table.scope')}
                                            </FormLabel>
                                            <Select
                                                onValueChange={val =>
                                                    field.onChange(
                                                        parseInt(val)
                                                    )
                                                }
                                                defaultValue={`${field.value}`}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="-1">
                                                        {t('user.role.ban')}
                                                    </SelectItem>
                                                    <SelectItem value="0">
                                                        {t('user.role.visitor')}
                                                    </SelectItem>
                                                    <SelectItem value="1">
                                                        {t('user.role.general')}
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        {t('user.role.member')}
                                                    </SelectItem>
                                                    <SelectItem value="3">
                                                        {t('user.role.admin')}
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
                    </div>
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
