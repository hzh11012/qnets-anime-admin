import { seriesCreate } from '@/apis/series';
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
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { useRequest } from 'ahooks';
import { t } from 'i18next';
import FormInput from '@/components/custom/form/form-input';

interface CustomToolsProps {
    onRefresh: () => void;
}

const createFormSchema = z.object({
    name: z
        .string({
            required_error: `${t('series.table.name')} ${t('validator.empty')}`,
            invalid_type_error: `${t('series.table.name')} ${t('validator.type')}`
        })
        .max(50, {
            message: `${t('series.table.name')} ${t('validator.max.length')} 50`
        })
        .min(1, `${t('series.table.name')} ${t('validator.empty')}`)
});

interface AddFormProps extends CustomToolsProps {
    form: any;
}

export const AddForm: React.FC<AddFormProps> = ({ form }) => {
    const { t } = useTranslation();

    return (
        <Form {...form}>
            <form className={cn('space-y-6')}>
                <FormInput
                    control={form.control}
                    name="name"
                    label={t('series.table.name')}
                    required
                />
            </form>
        </Form>
    );
};

interface AddDialogProps extends CustomToolsProps {}

const AddDialog: React.FC<AddDialogProps> = ({ onRefresh }) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            name: ''
        }
    });

    const { run: runCreate } = useRequest(seriesCreate, {
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
                    <AddForm form={createForm} onRefresh={onRefresh} />
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
