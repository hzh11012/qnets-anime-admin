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
import { videoCreate } from '@/apis/video';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectEmpty,
    MultiSelectItem,
    MultiSelectList,
    MultiSelectSearch,
    MultiSelectTrigger,
    MultiSelectValue
} from '@/components/ui/multiple-select';

interface CustomToolsProps {
    categories: { label: string; value: number }[];
    onRefresh: () => void;
}

const COVER_REG = /^(https?:)?\/\/.*\.(jpe?g|png|webp)$/;
const YEAR_REG = /^\d{4}$/;

const CustomTools = ({ onRefresh, categories }: CustomToolsProps) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const createFormSchema = z.object({
        name: z
            .string({
                required_error: `${t('video.table.name')} ${t('validator.empty')}`,
                invalid_type_error: `${t('video.table.name')} ${t('validator.type')}`
            })
            .max(50, {
                message: `${t('video.table.name')} ${t('validator.max.length')} 50`
            })
            .min(1, `${t('video.table.name')} ${t('validator.empty')}`),
        description: z
            .string({
                required_error: `${t('video.table.description')} ${t('validator.empty')}`,
                invalid_type_error: `${t('video.table.description')} ${t('validator.type')}`
            })
            .max(255, {
                message: `${t('video.table.description')} ${t('validator.max.length')} 255`
            })
            .min(1, `${t('video.table.description')} ${t('validator.empty')}`),
        cover: z
            .string({
                required_error: `${t('video.table.cover')} ${t('validator.empty')}`,
                invalid_type_error: `${t('video.table.cover')} ${t('validator.type')}`
            })
            .max(255, {
                message: `${t('video.table.cover')} ${t('validator.max.length')} 255`
            })
            .min(1, `${t('video.table.cover')} ${t('validator.empty')}`)
            .regex(COVER_REG, {
                message: `${t('video.table.cover')} ${t('validator.format')}`
            }),
        remark: z
            .string({
                invalid_type_error: `${t('video.table.remark')} ${t('validator.type')}`
            })
            .max(50, {
                message: `${t('video.table.remark')} ${t('validator.max.length')} 50`
            })
            .optional(),
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
            .max(3, `${t('video.table.type')} ${t('validator.max')} 3`),
        director: z
            .string({
                invalid_type_error: `${t('video.table.director')} ${t('validator.type')}`
            })
            .max(25, {
                message: `${t('video.table.director')} ${t('validator.max.length')} 25`
            })
            .optional(),
        cv: z
            .string({
                invalid_type_error: `${t('video.table.cv')} ${t('validator.type')}`
            })
            .max(255, {
                message: `${t('video.table.cv')} ${t('validator.max.length')} 255`
            })
            .optional(),
        year: z
            .string({
                required_error: `${t('video.table.year')} ${t('validator.empty')}`,
                invalid_type_error: `${t('video.table.year')} ${t('validator.type')}`
            })
            .min(1, {
                message: `${t('video.table.year')} ${t('validator.type')}`
            })
            .regex(YEAR_REG, {
                message: `${t('video.table.year')} ${t('validator.format')}`
            }),
        month: z
            .number({
                required_error: `${t('video.table.month')} ${t('validator.empty')}`,
                invalid_type_error: `${t('video.table.month')} ${t('validator.type')}`
            })
            .int(`${t('video.table.month')} ${t('validator.int')}`)
            .min(0, `${t('video.table.month')} ${t('validator.min')} 0`)
            .max(3, `${t('video.table.month')} ${t('validator.max')} 3`),
        category: z.array(z.number(), {
            required_error: `${t('video.table.categories')} ${t('validator.empty')}`,
            invalid_type_error: `${t('video.table.categories')} ${t('validator.type')}`
        })
    });

    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema)
    });

    const { run: runCreate } = useRequest(videoCreate, {
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
                className={cn('px-0')}
                aria-describedby={undefined}
                onOpenAutoFocus={e => {
                    e.preventDefault();
                }}
            >
                <DialogHeader className={cn('px-6')}>
                    <DialogTitle>{t('table.create')}</DialogTitle>
                </DialogHeader>
                <Form {...createForm}>
                    <form
                        onSubmit={createForm.handleSubmit(handleCreate)}
                        className={cn('space-y-6')}
                    >
                        <ScrollArea className={cn('h-96')}>
                            <div className={cn('space-y-6 px-6 pb-1')}>
                                <FormField
                                    control={createForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.name')}
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
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.description')}
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className={cn(
                                                        'resize-none'
                                                    )}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="cover"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.cover')}
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
                                    name="category"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel
                                                    className={cn('required')}
                                                >
                                                    {t(
                                                        'video.table.categories'
                                                    )}
                                                </FormLabel>
                                                <MultiSelect
                                                    onValueChange={val => {
                                                        field.onChange(
                                                            val?.length
                                                                ? val
                                                                : undefined
                                                        );
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <MultiSelectTrigger>
                                                        <MultiSelectValue
                                                            maxDisplay={4}
                                                        />
                                                    </MultiSelectTrigger>
                                                    <MultiSelectContent>
                                                        <MultiSelectSearch />
                                                        <MultiSelectList>
                                                            {categories.map(
                                                                item => {
                                                                    return (
                                                                        <MultiSelectItem
                                                                            key={
                                                                                item.label +
                                                                                item.value
                                                                            }
                                                                            value={
                                                                                item.value
                                                                            }
                                                                        >
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </MultiSelectItem>
                                                                    );
                                                                }
                                                            )}
                                                            <MultiSelectEmpty>
                                                                {t(
                                                                    'table.toolbar.result_empty'
                                                                )}
                                                            </MultiSelectEmpty>
                                                        </MultiSelectList>
                                                    </MultiSelectContent>
                                                </MultiSelect>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.status')}
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
                                                    <SelectItem value="0">
                                                        {t(
                                                            'video.status.coming'
                                                        )}
                                                    </SelectItem>
                                                    <SelectItem value="1">
                                                        {t(
                                                            'video.status.serializing'
                                                        )}
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        {t(
                                                            'video.status.completed'
                                                        )}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.type')}
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
                                                    <SelectItem value="0">
                                                        {t('video.type.ova')}
                                                    </SelectItem>
                                                    <SelectItem value="1">
                                                        {t('video.type.japan')}
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        {t(
                                                            'video.type.american'
                                                        )}
                                                    </SelectItem>
                                                    <SelectItem value="3">
                                                        {t('video.type.china')}
                                                    </SelectItem>
                                                    <SelectItem value="4">
                                                        {t('video.type.hentai')}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.year')}
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
                                    name="month"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.month')}
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
                                                    <SelectItem value="0">
                                                        {t('video.month.jan')}
                                                    </SelectItem>
                                                    <SelectItem value="1">
                                                        {t('video.month.apr')}
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        {t('video.month.jul')}
                                                    </SelectItem>
                                                    <SelectItem value="3">
                                                        {t('video.month.oct')}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="director"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('video.table.director')}
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
                                    name="cv"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('video.table.cv')}
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
                                    name="remark"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('video.table.remark')}
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
                            </div>
                        </ScrollArea>
                        <DialogFooter className={cn('px-6 !mt-5')}>
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