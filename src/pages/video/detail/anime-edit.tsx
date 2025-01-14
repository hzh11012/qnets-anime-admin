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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRequest } from 'ahooks';
import { videoEdit } from '@/apis/video';
import { VideoEditReq } from '@/apis/models/video-model';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createFormSchema, AddForm } from '@/pages/video/custom-tools';
interface AnimeEditProps extends VideoEditReq {
    categories: { label: string; value: number }[];
    series: { label: string; value: number }[];
    onRefresh: () => void;
}

const editFormSchema = createFormSchema;

const EditForm = AddForm;

interface EditDialogProps extends AnimeEditProps {}

const EditDialog: React.FC<EditDialogProps> = ({
    onRefresh,
    categories,
    series,
    id,
    ...rest
}) => {
    const { t } = useTranslation();
    const [editOpen, setEditOpen] = useState(false);

    const editForm = useForm<z.infer<typeof editFormSchema>>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            ...rest,
            season_name: rest.season_name || '',
            director: rest.director || '',
            cv: rest.cv || '',
            remark: rest.remark || ''
        }
    });

    useEffect(() => {
        editForm.reset({
            ...rest,
            season_name: rest.season_name || '',
            director: rest.director || '',
            cv: rest.cv || '',
            remark: rest.remark || ''
        });
    }, [id]);

    const { run: runEdit } = useRequest(videoEdit, {
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
                <Button variant="link" className={cn('h-5 p-0 text-[#1677ff]')}>
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
                <ScrollArea
                    className={cn(
                        'max-h-[calc(100vh-10rem)] sm:max-h-[calc(26rem)]'
                    )}
                >
                    <div className={cn('px-6 pb-1')}>
                        <EditForm
                            form={editForm}
                            onRefresh={onRefresh}
                            categories={categories}
                            series={series}
                            {...rest}
                            anime_id={id}
                        />
                    </div>
                </ScrollArea>
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

const AnimeEdit: React.FC<AnimeEditProps> = props => {
    return <EditDialog {...props} />;
};

export default AnimeEdit;
