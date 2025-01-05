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
import { videoEdit } from '@/apis/video';
import { VideoEditReq } from '@/apis/models/video-model';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import { Textarea } from '@/components/ui/textarea';
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

interface VideoEditProps extends VideoEditReq {
    aid: number;
    categories: { label: string; value: number }[];
    series: { label: string; value: number }[];
    onRefresh?: () => void;
}

const COVER_REG = /^(https?:)?\/\/.*\.(jpe?g|png|webp)$/;
const YEAR_REG = /^\d{4}$/;

const AnimeEdit = ({
    onRefresh,
    categories,
    series,
    aid,
    ...rest
}: VideoEditProps) => {
    const { t } = useTranslation();
    const [editOpen, setEditOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const editFormSchema = z.object({
        sid: z
            .number({
                required_error: `${t('video.table.sid')} ${t('validator.empty')}`,
                invalid_type_error: `${t('video.table.sid')} ${t('validator.type')}`
            })
            .int(`${t('video.table.sid')} ${t('validator.int')}`)
            .min(1, `${t('video.table.sid')} ${t('validator.min')} 1`),
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
        cover_url: z
            .string({
                required_error: `${t('video.table.cover_url')} ${t('validator.empty')}`,
                invalid_type_error: `${t('video.table.cover_url')} ${t('validator.type')}`
            })
            .max(255, {
                message: `${t('video.table.cover_url')} ${t('validator.max.length')} 255`
            })
            .min(1, `${t('video.table.cover_url')} ${t('validator.empty')}`)
            .regex(COVER_REG, {
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
            .regex(COVER_REG, {
                message: `${t('video.table.banner_url')} ${t('validator.format')}`
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
        }),
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
            .optional()
    });

    const editForm = useForm<z.infer<typeof editFormSchema>>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            ...rest
        }
    });

    const {
        sid,
        name,
        description,
        cover_url,
        banner_url,
        remark,
        status,
        season,
        season_name,
        type,
        director,
        cv,
        year,
        month,
        category
    } = rest;

    useEffect(() => {
        if (editOpen) {
            editForm.reset({
                ...rest
            });
        }
    }, [
        sid,
        name,
        description,
        cover_url,
        banner_url,
        remark,
        status,
        season,
        season_name,
        type,
        director,
        cv,
        year,
        month,
        category
    ]);

    const { run: runEdit } = useRequest(videoEdit, {
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

    const handleCreate = (values: z.infer<typeof editFormSchema>) => {
        runEdit({
            ...values,
            id: aid
        });
    };

    return (
        <Dialog
            open={editOpen}
            onOpenChange={() => {
                setEditOpen(!editOpen);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="link" className={cn('h-5 p-0 text-[#1677ff]')}>
                    {t('table.edit')}
                </Button>
            </DialogTrigger>
            <DialogContent className={cn('px-0')} aria-describedby={undefined}>
                <DialogHeader className={cn('px-6')}>
                    <DialogTitle>{t('table.edit')}</DialogTitle>
                </DialogHeader>
                <Form {...editForm}>
                    <form
                        onSubmit={editForm.handleSubmit(handleCreate)}
                        className={cn('space-y-6')}
                    >
                        <ScrollArea className={cn('h-96')}>
                            <div className={cn('space-y-6 px-6 pb-1')}>
                                <FormField
                                    control={editForm.control}
                                    name="sid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.sid')}
                                            </FormLabel>
                                            <Popover
                                                open={searchOpen}
                                                onOpenChange={setSearchOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={
                                                                searchOpen
                                                            }
                                                            className={cn(
                                                                'w-full justify-between bg-background px-3 outline-offset-0 hover:bg-background h-9'
                                                            )}
                                                        >
                                                            <span>
                                                                {field.value
                                                                    ? series.find(
                                                                          item =>
                                                                              item.value ===
                                                                              field.value
                                                                      )?.label
                                                                    : ''}
                                                            </span>
                                                            <ChevronDown
                                                                size={16}
                                                                strokeWidth={2}
                                                                className={cn(
                                                                    'shrink-0 text-muted-foreground/80'
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className={cn(
                                                        'w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0'
                                                    )}
                                                    align="start"
                                                >
                                                    <Command>
                                                        <CommandInput />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                {t(
                                                                    'table.toolbar.result_empty'
                                                                )}
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {series.map(
                                                                    item => (
                                                                        <CommandItem
                                                                            key={
                                                                                item.value
                                                                            }
                                                                            value={
                                                                                item.label
                                                                            }
                                                                            onSelect={() => {
                                                                                field.onChange(
                                                                                    item.value
                                                                                );
                                                                                setSearchOpen(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            {
                                                                                item.label
                                                                            }
                                                                            <Check
                                                                                className={cn(
                                                                                    'ml-auto',
                                                                                    item.value ===
                                                                                        field.value
                                                                                        ? 'opacity-100'
                                                                                        : 'opacity-0'
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
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
                                    control={editForm.control}
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
                                    control={editForm.control}
                                    name="cover_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.cover_url')}
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
                                    name="banner_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.banner_url')}
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
                                    name="season"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn('required')}
                                            >
                                                {t('video.table.season')}
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
                                                    {[...Array(10).keys()]
                                                        .map(x => x + 1)
                                                        .map(item => {
                                                            return (
                                                                <SelectItem
                                                                    key={item}
                                                                    value={`${item}`}
                                                                >
                                                                    {item}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="season_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('video.table.season_name')}
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
                                    control={editForm.control}
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
                                    control={editForm.control}
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
                                    control={editForm.control}
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
                                    control={editForm.control}
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
                                    control={editForm.control}
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
                                    control={editForm.control}
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
                                    control={editForm.control}
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

export default AnimeEdit;
