import { newAnimeCreate } from '@/apis/new-anime';
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
import usePagination from '@/hooks/use-pagination';
import { useRequest } from 'ahooks';
import { DataTable } from '@/components/custom/data-table/data-table';
import { VideoItem } from '@/apis/models/video-model';
import {
    OnChangeFn,
    RowSelectionState,
    SortingState
} from '@tanstack/react-table';
import { getVideoList } from '@/apis/video';
import { Clock, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { DateInput, DateSegment, TimeField } from 'react-aria-components';

interface CustomToolsProps {
    onRefresh: () => void;
}

const AnimePickerTable = ({
    rowSelection,
    onRowSelectionChange
}: {
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}) => {
    const { t } = useTranslation();

    const { onPaginationChange, page, limit, pagination } = usePagination(3);

    const [total, setTotal] = useState(0);
    const [data, setData] = useState<VideoItem[]>([]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [keyword, setKeyword] = useState('');

    const { run, loading } = useRequest(getVideoList, {
        defaultParams: [
            {
                page,
                pageSize: limit
            }
        ],
        onSuccess(data) {
            const { rows, count } = data.data;
            setTotal(count);
            setData(rows);
        },
        refreshDeps: [page, limit, keyword, sorting],
        refreshDepsAction: () => {
            run({
                page,
                keyword,
                pageSize: limit
            });
        }
    });

    const columns = [
        {
            id: 'select',
            cell: ({ row }: any) => (
                <Checkbox
                    disabled={!row.getCanSelect()}
                    checked={row.getIsSelected() || !row.getCanSelect()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    aria-label="选择行"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'id',
            title: t('video.table.id'),
            header: t('video.table.id'),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'name',
            title: t('video.table.name'),
            header: () => {
                return (
                    <div className={cn('flex items-center space-x-1')}>
                        <span>{t('video.table.name')}</span>
                        <Search className={cn('w-3.5 h-3.5')} />
                    </div>
                );
            }
        }
    ];

    return (
        <DataTable
            data={data}
            columns={columns}
            loading={loading}
            pagination={pagination}
            pageCount={Math.ceil(total / limit)}
            total={total}
            onPaginationChange={onPaginationChange}
            onSearch={setKeyword}
            sorting={sorting}
            onSortingChange={setSorting}
            className={cn('p-0')}
            headerClassName={cn('px-0')}
            enableRowSelection={(row: any) => !row.original.is_new_anime}
            enableMultiRowSelection={false}
            rowSelection={rowSelection}
            onRowSelectionChange={onRowSelectionChange}
        />
    );
};

const CustomTools = ({ onRefresh }: CustomToolsProps) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const createFormSchema = z.object({
        update_day: z
            .number({
                required_error: `${t('new_anime.table.update_day')} ${t('validator.empty')}`,
                invalid_type_error: `${t('new_anime.table.update_day')} ${t('validator.type')}`
            })
            .int(`${t('new_anime.table.update_day')} ${t('validator.int')}`)
            .min(
                1,
                `${t('new_anime.table.update_day')} ${t('validator.min')} 1`
            )
            .max(
                7,
                `${t('new_anime.table.update_day')} ${t('validator.max')} 7`
            ),
        update_time: z
            .string({
                required_error: `${t('new_anime.table.update_time')} ${t('validator.empty')}`,
                invalid_type_error: `${t('new_anime.table.update_time')} ${t('validator.type')}`
            })
            .time({
                message: `${t('new_anime.table.update_time')} ${t('validator.format')}`
            })
    });

    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            update_time: ''
        }
    });

    const [rowSelection, setRowSelection] = useState({});

    const { run: runCreate } = useRequest(newAnimeCreate, {
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
                // 重置table select
                setRowSelection({});
            }
        }
    });

    const handleCreate = (values: z.infer<typeof createFormSchema>) => {
        const id = parseInt(Object.keys(rowSelection)[0]);
        runCreate({
            ...values,
            id
        });
    };

    return (
        <Dialog
            open={createOpen}
            onOpenChange={() => {
                setCreateOpen(!createOpen);
                setTimeout(() => {
                    // 关闭弹窗 重置table select
                    if (createOpen) {
                        createForm.reset();
                        setRowSelection({});
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
                className="flex flex-col"
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
                        <AnimePickerTable
                            rowSelection={rowSelection}
                            onRowSelectionChange={setRowSelection}
                        />
                        <FormField
                            control={createForm.control}
                            name="update_day"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={cn('required')}>
                                        {t('new_anime.table.update_day')}
                                    </FormLabel>
                                    <Select
                                        onValueChange={val =>
                                            field.onChange(parseInt(val))
                                        }
                                        defaultValue={`${field.value}`}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                {t('new_anime.day.mon')}
                                            </SelectItem>
                                            <SelectItem value="2">
                                                {t('new_anime.day.tues')}
                                            </SelectItem>
                                            <SelectItem value="3">
                                                {t('new_anime.day.wed')}
                                            </SelectItem>
                                            <SelectItem value="4">
                                                {t('new_anime.day.thur')}
                                            </SelectItem>
                                            <SelectItem value="5">
                                                {t('new_anime.day.fri')}
                                            </SelectItem>
                                            <SelectItem value="6">
                                                {t('new_anime.day.sat')}
                                            </SelectItem>
                                            <SelectItem value="7">
                                                {t('new_anime.day.sun')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createForm.control}
                            name="update_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={cn('required')}>
                                        {t('new_anime.table.update_time')}
                                    </FormLabel>
                                    <TimeField
                                        hourCycle={24}
                                        name={field.name}
                                        hideTimeZone
                                        shouldForceLeadingZeros
                                        onChange={val => {
                                            field.onChange(val?.toString());
                                        }}
                                    >
                                        <div className="relative">
                                            <DateInput
                                                ref={field.ref}
                                                className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 pe-9 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20"
                                            >
                                                {segment => (
                                                    <DateSegment
                                                        segment={segment}
                                                        className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
                                                    />
                                                )}
                                            </DateInput>
                                            <div className="pointer-events-none absolute inset-y-0 end-0 z-10 flex items-center justify-center pe-3 text-muted-foreground/80">
                                                <Clock
                                                    size={16}
                                                    strokeWidth={2}
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </div>
                                    </TimeField>
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
