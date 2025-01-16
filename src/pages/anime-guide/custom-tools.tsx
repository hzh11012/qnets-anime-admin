import { animeGuideCreate } from '@/apis/anime-guide';
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
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { z } from 'zod';
import { t } from 'i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import FormVirtualized from '@/components/custom/form/form-virtualized';
import FormSelect from '@/components/custom/form/form-select';
import FormTime from '@/components/custom/form/form-time';

interface CustomToolsProps {
    animes: { label: string; value: number }[];
    onRefresh: () => void;
}

export const days = [
    {
        label: t('anime-guide.day.mon'),
        value: 1
    },
    {
        label: t('anime-guide.day.tues'),
        value: 2
    },
    {
        label: t('anime-guide.day.wed'),
        value: 3
    },
    {
        label: t('anime-guide.day.thur'),
        value: 4
    },
    {
        label: t('anime-guide.day.fri'),
        value: 5
    },
    {
        label: t('anime-guide.day.sat'),
        value: 6
    },
    {
        label: t('anime-guide.day.sun'),
        value: 7
    }
];

const createFormSchema = z.object({
    id: z
        .number({
            required_error: `${t('video.table.id')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.id')} ${t('validator.type')}`
        })
        .int(`${t('video.table.id')} ${t('validator.int')}`)
        .min(1, `${t('video.table.id')} ${t('validator.min')} 1`),
    update_day: z
        .number({
            required_error: `${t('anime-guide.table.update_day')} ${t('validator.empty')}`,
            invalid_type_error: `${t('anime-guide.table.update_day')} ${t('validator.type')}`
        })
        .int(`${t('anime-guide.table.update_day')} ${t('validator.int')}`)
        .min(1, `${t('anime-guide.table.update_day')} ${t('validator.min')} 1`)
        .max(7, `${t('anime-guide.table.update_day')} ${t('validator.max')} 7`),
    update_time: z
        .string({
            required_error: `${t('anime-guide.table.update_time')} ${t('validator.empty')}`,
            invalid_type_error: `${t('anime-guide.table.update_time')} ${t('validator.type')}`
        })
        .time({
            message: `${t('anime-guide.table.update_time')} ${t('validator.format')}`
        })
});

interface AddFormProps extends CustomToolsProps {
    form: any;
}

const AddForm: React.FC<AddFormProps> = ({ form, animes }) => {
    const { t } = useTranslation();

    return (
        <Form {...form}>
            <form className={cn('space-y-6')}>
                <FormVirtualized
                    control={form.control}
                    name="id"
                    label={t('video.table.name')}
                    required
                    options={animes}
                />
                <FormSelect
                    control={form.control}
                    name="update_day"
                    label={t('anime-guide.table.update_day')}
                    required
                    options={days}
                />
                <FormTime
                    control={form.control}
                    name="update_time"
                    label={t('anime-guide.table.update_time')}
                    required
                />
            </form>
        </Form>
    );
};

interface AddDialogProps extends CustomToolsProps {}

const AddDialog: React.FC<AddDialogProps> = ({ onRefresh, animes }) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {}
    });

    const { run: runCreate } = useRequest(animeGuideCreate, {
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
                <div className={cn('px-6 pb-1')}>
                    <AddForm
                        form={createForm}
                        onRefresh={onRefresh}
                        animes={animes}
                    />
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

const CustomTools: React.FC<CustomToolsProps> = props => {
    return <AddDialog {...props} />;
};

export default CustomTools;