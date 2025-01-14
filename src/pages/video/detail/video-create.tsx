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
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { t } from 'i18next';
import { useRequest } from 'ahooks';
import { episodeCreate } from '@/apis/video';
import FormInput from '@/components/custom/form/form-input';
import FormNumber from '@/components/custom/form/form-number';
import FormTextarea from '@/components/custom/form/form-textarea';

interface VideoCreateProps {
    anime_id: number;
    onRefresh: () => void;
}

const VIDEO_REG = /^(https?:)?\/\/.*\.(m3u8)$/;

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

interface AddFormProps {
    form: any;
}

const AddForm: React.FC<AddFormProps> = ({ form }) => {
    const { t } = useTranslation();

    return (
        <Form {...form}>
            <form className={cn('space-y-6')}>
                <div className={cn('flex gap-6')}>
                    <div className={cn('flex-1')}>
                        <FormInput
                            control={form.control}
                            name="title"
                            label={t('video.detail.title')}
                            required
                        />
                    </div>
                    <div className={cn('flex-1')}>
                        <FormNumber
                            control={form.control}
                            name="episode"
                            label={t('video.detail.episode')}
                            required
                            minValue={1}
                            maxValue={9999}
                        />
                    </div>
                </div>
                <FormTextarea
                    control={form.control}
                    name="url"
                    label={t('video.detail.url')}
                    required
                />
            </form>
        </Form>
    );
};

interface AddDialogProps extends VideoCreateProps {}

const AddDialog: React.FC<AddDialogProps> = ({ onRefresh, anime_id }) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            title: '',
            episode: 1,
            url: ''
        }
    });

    const { run: runCreate } = useRequest(episodeCreate, {
        manual: true,
        debounceWait: 300,
        onSuccess({ code, msg }) {
            if (code === 200) {
                onRefresh && onRefresh();
                setCreateOpen(false);
                toast({
                    description: msg,
                    duration: 1500
                });
                createForm.reset();
            }
        }
    });

    const handleCreate = (values: z.infer<typeof createFormSchema>) => {
        runCreate({
            ...values,
            id: anime_id
        });
    };

    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className={cn('h-5 p-0 text-[#1677ff]')}>
                    {t('table.create')}
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
                        {t('table.create')}
                    </DialogTitle>
                </DialogHeader>

                <div className={cn('px-6 pb-1')}>
                    <AddForm form={createForm} />
                </div>
                <DialogFooter className={cn('p-6 pt-5')}>
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={createForm.handleSubmit(handleCreate)}
                    >
                        {t('dialog.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const VideoCreate = (props: VideoCreateProps) => {
    return <AddDialog {...props} />;
};

export default VideoCreate;
