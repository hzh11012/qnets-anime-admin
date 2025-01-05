import { noticeCreate } from '@/apis/notice';
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
import { z } from 'zod';
import { useRequest } from 'ahooks';
import { Textarea } from '@/components/ui/textarea';

interface CustomToolsProps {
    onRefresh: () => void;
}

const CustomTools = ({ onRefresh }: CustomToolsProps) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const createFormSchema = z.object({
        title: z
            .string({
                required_error: `${t('notice.table.title')} ${t('validator.empty')}`,
                invalid_type_error: `${t('notice.table.title')} ${t('validator.type')}`
            })
            .max(25, {
                message: `${t('notice.table.title')} ${t('validator.max.length')} 25`
            })
            .min(1, `${t('notice.table.title')} ${t('validator.empty')}`),
        content: z
            .string({
                required_error: `${t('notice.table.content')} ${t('validator.empty')}`,
                invalid_type_error: `${t('notice.table.content')} ${t('validator.type')}`
            })
            .max(255, {
                message: `${t('notice.table.content')} ${t('validator.max.length')} 255`
            })
            .min(1, `${t('notice.table.content')} ${t('validator.empty')}`)
    });

    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            title: '',
            content: ''
        }
    });

    const { run: runCreate } = useRequest(noticeCreate, {
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
                createForm.reset();
            }
        }
    });

    const handleCreate = (values: z.infer<typeof createFormSchema>) => {
        runCreate(values);
    };

    return (
        <Dialog
            open={createOpen}
            onOpenChange={() => {
                setCreateOpen(!createOpen);
                setTimeout(() => {
                    // 关闭弹窗 reset 表单
                    if (createOpen) {
                        createForm.reset();
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
                aria-describedby={undefined}
            >
                <DialogHeader>
                    <DialogTitle>{t('table.create')}</DialogTitle>
                </DialogHeader>
                <Form {...createForm}>
                    <form
                        onSubmit={createForm.handleSubmit(handleCreate)}
                        className={cn('space-y-6')}
                    >
                        <FormField
                            control={createForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={cn('required')}>
                                        {t('notice.table.title')}
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
                            control={createForm.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={cn('required')}>
                                        {t('notice.table.content')}
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
                        <DialogFooter>
                            <Button size="sm" type="submit" variant="outline">
                                {t('dialog.confirm')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CustomTools;
