import { videoCategoryCreate } from '@/apis/category';
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

interface CustomToolsProps {
    onRefresh: () => void;
}

const CustomTools = ({ onRefresh }: CustomToolsProps) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const createFormSchema = z.object({
        category: z
            .string({
                required_error: `${t('category.table.category')} ${t('validator.empty')}`,
                invalid_type_error: `${t('category.table.category')} ${t('validator.type')}`
            })
            .max(25, {
                message: `${t('category.table.category')} ${t('validator.max.length')} 25`
            })
            .min(1, `${t('category.table.category')} ${t('validator.empty')}`)
    });

    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            category: ''
        }
    });

    const { run: runCreate } = useRequest(videoCategoryCreate, {
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
                onOpenAutoFocus={e => {
                    e.preventDefault();
                }}
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
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={cn('required')}>
                                        {t('category.table.category')}
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
