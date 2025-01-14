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
import { t } from 'i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { useRequest } from 'ahooks';
import { videoCreate } from '@/apis/video';
import { ScrollArea } from '@/components/ui/scroll-area';
import FormVirtualized from '@/components/custom/form/form-virtualized';
import FormInput from '@/components/custom/form/form-input';
import FormNumber from '@/components/custom/form/form-number';
import FormTextarea from '@/components/custom/form/form-textarea';
import FormSelect from '@/components/custom/form/form-select';
import { FlowerIcon, SnowflakeIcon, SunIcon, LeafIcon } from 'lucide-react';
import FormMultiSelect from '@/components/custom/form/form-multi-select';

interface CustomToolsProps {
    categories: { label: string; value: number }[];
    series: { label: string; value: number }[];
    onRefresh: () => void;
}

const IMG_REG = /^(https?:)?\/\/.*\.(jpe?g|png|webp)$/;

const status = [
    {
        label: t('video.status.coming'),
        value: 0,
        icon: (
            <svg
                width="8"
                height="8"
                fill="currentColor"
                viewBox="0 0 8 8"
                xmlns="http://www.w3.org/2000/svg"
                className={cn('text-amber-500')}
                aria-hidden="true"
            >
                <circle cx="4" cy="4" r="4" />
            </svg>
        )
    },
    {
        label: t('video.status.serializing'),
        value: 1,
        icon: (
            <svg
                width="8"
                height="8"
                fill="currentColor"
                viewBox="0 0 8 8"
                xmlns="http://www.w3.org/2000/svg"
                className={cn('text-blue-500')}
                aria-hidden="true"
            >
                <circle cx="4" cy="4" r="4" />
            </svg>
        )
    },
    {
        label: t('video.status.completed'),
        value: 2,
        icon: (
            <svg
                width="8"
                height="8"
                fill="currentColor"
                viewBox="0 0 8 8"
                xmlns="http://www.w3.org/2000/svg"
                className={cn('text-emerald-600')}
                aria-hidden="true"
            >
                <circle cx="4" cy="4" r="4" />
            </svg>
        )
    }
];

const type = [
    {
        label: t('video.type.ova'),
        value: 0
    },
    {
        label: t('video.type.japan'),
        value: 1
    },
    {
        label: t('video.type.american'),
        value: 2
    },
    {
        label: t('video.type.china'),
        value: 3
    },
    {
        label: t('video.type.hentai'),
        value: 4
    }
];

const month = [
    {
        label: t('video.month.jan'),
        value: 0,
        icon: <FlowerIcon size={16} color="#059669" />
    },
    {
        label: t('video.month.apr'),
        value: 1,
        icon: <SunIcon size={16} color="#ef4444" />
    },
    {
        label: t('video.month.jul'),
        value: 2,
        icon: <LeafIcon size={16} color="#f59e0b" />
    },
    {
        label: t('video.month.oct'),
        value: 3,
        icon: <SnowflakeIcon size={16} color="#3b82f6" />
    }
];

export const createFormSchema = z.object({
    series_id: z
        .number({
            required_error: `${t('video.table.series_id')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.series_id')} ${t('validator.type')}`
        })
        .int(`${t('video.table.series_id')} ${t('validator.int')}`)
        .min(1, `${t('video.table.series_id')} ${t('validator.min')} 1`),
    name: z
        .string({
            required_error: `${t('video.table.name')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.name')} ${t('validator.type')}`
        })
        .max(50, {
            message: `${t('video.table.name')} ${t('validator.max.length')} 50`
        })
        .min(1, `${t('video.table.name')} ${t('validator.empty')}`),
    season: z
        .number({
            required_error: `${t('video.table.season')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.season')} ${t('validator.type')}`
        })
        .int(`${t('video.table.season')} ${t('validator.int')}`)
        .min(1, `${t('video.table.season')} ${t('validator.min')} 1`),
    season_name: z
        .string({
            invalid_type_error: `${t('video.table.season_name')} ${t('validator.type')}`
        })
        .max(10, `${t('video.table.season_name')} ${t('validator.max')} 10`)
        .optional(),
    description: z
        .string({
            required_error: `${t('video.table.description')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.description')} ${t('validator.type')}`
        })
        .max(1000, {
            message: `${t('video.table.description')} ${t('validator.max.length')} 1000`
        })
        .min(1, `${t('video.table.description')} ${t('validator.empty')}`),
    cover_url: z
        .string({
            required_error: `${t('video.table.cover_url')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.cover_url')} ${t('validator.type')}`
        })
        .max(255, {
            message: `${t('video.table.cover_url')} ${t('validator.max.length')} 255`
        })
        .min(1, `${t('video.table.cover_url')} ${t('validator.empty')}`)
        .regex(IMG_REG, {
            message: `${t('video.table.cover_url')} ${t('validator.format')}`
        }),
    banner_url: z
        .string({
            required_error: `${t('video.table.banner_url')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.banner_url')} ${t('validator.type')}`
        })
        .max(255, {
            message: `${t('video.table.banner_url')} ${t('validator.max.length')} 255`
        })
        .min(1, `${t('video.table.banner_url')} ${t('validator.empty')}`)
        .regex(IMG_REG, {
            message: `${t('video.table.banner_url')} ${t('validator.format')}`
        }),
    status: z
        .number({
            required_error: `${t('video.table.status')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.status')} ${t('validator.type')}`
        })
        .int(`${t('video.table.status')} ${t('validator.int')}`)
        .min(0, `${t('video.table.status')} ${t('validator.min')} 0`)
        .max(2, `${t('video.table.status')} ${t('validator.max')} 2`),
    type: z
        .number({
            required_error: `${t('video.table.type')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.type')} ${t('validator.type')}`
        })
        .int(`${t('video.table.type')} ${t('validator.int')}`)
        .min(0, `${t('video.table.type')} ${t('validator.min')} 0`)
        .max(4, `${t('video.table.type')} ${t('validator.max')} 4`),
    year: z
        .number({
            required_error: `${t('video.table.year')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.year')} ${t('validator.type')}`
        })
        .int(`${t('video.table.year')} ${t('validator.int')}`)
        .min(1970, `${t('video.table.status')} ${t('validator.min')} 1970`)
        .max(2099, `${t('video.table.status')} ${t('validator.max')} 2099`),
    month: z
        .number({
            required_error: `${t('video.table.month')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.month')} ${t('validator.type')}`
        })
        .int(`${t('video.table.month')} ${t('validator.int')}`)
        .min(0, `${t('video.table.month')} ${t('validator.min')} 0`)
        .max(3, `${t('video.table.month')} ${t('validator.max')} 3`),
    category: z
        .number({
            required_error: `${t('video.table.categories')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.categories')} ${t('validator.type')}`
        })
        .array()
        .nonempty({
            message: `${t('video.table.categories')} ${t('validator.empty')}`
        }),
    cv: z
        .string({
            invalid_type_error: `${t('video.table.cv')} ${t('validator.type')}`
        })
        .max(255, {
            message: `${t('video.table.cv')} ${t('validator.max.length')} 255`
        })
        .optional(),
    remark: z
        .string({
            invalid_type_error: `${t('video.table.remark')} ${t('validator.type')}`
        })
        .max(50, {
            message: `${t('video.table.remark')} ${t('validator.max.length')} 50`
        })
        .optional(),
    director: z
        .string({
            invalid_type_error: `${t('video.table.director')} ${t('validator.type')}`
        })
        .max(25, {
            message: `${t('video.table.director')} ${t('validator.max.length')} 25`
        })
        .optional()
});

interface AddFormProps extends CustomToolsProps {
    form: any;
    anime_id?: number;
}

export const AddForm: React.FC<AddFormProps> = ({
    form,
    categories,
    series
}) => {
    const { t } = useTranslation();

    return (
        <Form {...form}>
            <form className={cn('space-y-6')}>
                <FormVirtualized
                    control={form.control}
                    name="series_id"
                    label={t('video.table.series_id')}
                    required
                    options={series}
                />
                <FormInput
                    control={form.control}
                    name="name"
                    label={t('video.table.name')}
                    required
                />
                <div className={cn('flex gap-6')}>
                    <div className={cn('flex-1')}>
                        <FormNumber
                            control={form.control}
                            name="season"
                            label={t('video.table.season')}
                            required
                            minValue={1}
                            maxValue={100}
                        />
                    </div>
                    <div className={cn('flex-1')}>
                        <FormInput
                            control={form.control}
                            name="season_name"
                            label={t('video.table.season_name')}
                        />
                    </div>
                </div>
                <FormTextarea
                    control={form.control}
                    name="description"
                    label={t('video.table.description')}
                    required
                />
                <FormInput
                    control={form.control}
                    name="cover_url"
                    label={t('video.table.cover_url')}
                    required
                />
                <FormInput
                    control={form.control}
                    name="banner_url"
                    label={t('video.table.banner_url')}
                    required
                />
                <div className={cn('flex gap-6')}>
                    <div className={cn('flex-1')}>
                        <FormSelect
                            control={form.control}
                            name="status"
                            label={t('video.table.status')}
                            required
                            options={status}
                        />
                    </div>
                    <div className={cn('flex-1')}>
                        <FormSelect
                            control={form.control}
                            name="type"
                            label={t('video.table.type')}
                            required
                            options={type}
                        />
                    </div>
                </div>
                <div className={cn('flex gap-6')}>
                    <div className={cn('flex-1')}>
                        <FormNumber
                            control={form.control}
                            name="year"
                            label={t('video.table.year')}
                            required
                            minValue={1970}
                            maxValue={2099}
                        />
                    </div>
                    <div className={cn('flex-1')}>
                        <FormSelect
                            control={form.control}
                            name="month"
                            label={t('video.table.month')}
                            required
                            options={month}
                        />
                    </div>
                </div>
                <FormMultiSelect
                    control={form.control}
                    name="category"
                    label={t('video.table.categories')}
                    required
                    options={categories}
                />
                <div className={cn('flex gap-6')}>
                    <div className={cn('flex-1')}>
                        <FormInput
                            control={form.control}
                            name="director"
                            label={t('video.table.director')}
                        />
                    </div>
                    <div className={cn('flex-1')}>
                        <FormInput
                            control={form.control}
                            name="remark"
                            label={t('video.table.remark')}
                        />
                    </div>
                </div>
                <FormTextarea
                    control={form.control}
                    name="cv"
                    label={t('video.table.cv')}
                />
            </form>
        </Form>
    );
};

interface AddDialogProps extends CustomToolsProps {}

const AddDialog: React.FC<AddDialogProps> = ({
    onRefresh,
    categories,
    series
}) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            name: '',
            season: 1,
            season_name: '',
            banner_url: '',
            cover_url: '',
            year: new Date().getFullYear(),
            director: '',
            remark: '',
            category: []
        }
    });

    const { run: runCreate } = useRequest(videoCreate, {
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
        runCreate(values);
    };

    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className={cn('h-9 px-3')}>
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
                <ScrollArea
                    className={cn(
                        'max-h-[calc(100vh-10rem)] sm:max-h-[calc(26rem)]'
                    )}
                >
                    <div className={cn('px-6 pb-1')}>
                        <AddForm
                            form={createForm}
                            onRefresh={onRefresh}
                            categories={categories}
                            series={series}
                        />
                    </div>
                </ScrollArea>
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

const CustomTools: React.FC<CustomToolsProps> = props => {
    return <AddDialog {...props} />;
};

export default CustomTools;
