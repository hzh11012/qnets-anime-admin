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
import { episodeCreate } from '@/apis/video';

interface VideoCreateProps {
    aid: number;
    onRefresh?: () => void;
}

const VIDEO_REG = /^(https?:)?\/\/.*\.(m3u8)$/;

const VideoCreate = ({ onRefresh, aid }: VideoCreateProps) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const createFormSchema = z.object({
        title: z
            .string({
                required_error: `${t('video.detail.title')} ${t('validator.empty')}`,
                invalid_type_error: `${t('video.detail.title')} ${t('validator.type')}`
            })
            .max(50, {
                message: `${t('video.detail.title')} ${t('validator.max.length')} 50`
            })
            .min(1, `${t('video.detail.title')} ${t('validator.empty')}`),
        episode: z
            .number({
                required_error: `${t('video.detail.episode_id')} ${t('validator.empty')}`,
                invalid_type_error: `${t('video.detail.episode_id')} ${t('validator.type')}`
            })
            .int(`${t('video.detail.episode_id')} ${t('validator.int')}`)
            .min(1, `${t('video.detail.episode_id')} ${t('validator.min')} 1`),
        url: z
            .string({
                required_error: `${t('video.detail.url')} ${t('validator.empty')}`,
                invalid_type_error: `${t('video.detail.url')} ${t('validator.type')}`
            })
            .max(255, {
                message: `${t('video.detail.url')} ${t('validator.max.length')} 255`
            })
            .min(1, `${t('video.detail.url')} ${t('validator.empty')}`)
            .regex(VIDEO_REG, {
                message: `${t('video.detail.url')} ${t('validator.format')}`
            })
    });

    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            title: '',
            url: ''
        }
    });

    const { run: runCreate } = useRequest(episodeCreate, {
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
                setTimeout(() => {
                    createForm.reset();
                }, 200);
            }
        }
    });

    const handleCreate = (values: z.infer<typeof createFormSchema>) => {
        runCreate({
            ...values,
            id: aid
        });
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
                <Button variant="link" className={cn('h-5 p-0 text-[#1677ff]')}>
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={cn('required')}>
                                        {t('video.detail.title')}
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
                            name="episode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={cn('required')}>
                                        {t('video.detail.episode_id')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            autoComplete="off"
                                            defaultValue={''}
                                            onChange={e => {
                                                field.onChange(
                                                    e.target.value
                                                        ? parseInt(
                                                              e.target.value
                                                          )
                                                        : undefined
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createForm.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={cn('required')}>
                                        {t('video.detail.url')}
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

export default VideoCreate;
