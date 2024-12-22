import { Loading } from '@/components/custom/loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { OnChangeFn, PaginationState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import SwiperPagination from '@/pages/swiper/swiper-pagination';
import { SwiperItem } from '@/apis/models/swiper-model';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRequest } from 'ahooks';
import { swiperDelete } from '@/apis/swiper';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DataTableProps {
    data: SwiperItem[];
    pageCount: number;
    total?: number;
    loading: boolean;
    sizes: number[];
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    onSearch: (val: string) => void;
    onRefresh: () => void;
}

export function SwiperTable({
    data,
    pageCount,
    total,
    loading,
    sizes,
    pagination,
    onSearch,
    onPaginationChange,
    onRefresh
}: DataTableProps) {
    const { t } = useTranslation();
    const navigator = useNavigate();

    const { run: runCancelSwiper } = useRequest(swiperDelete, {
        manual: true,
        debounceWait: 300,
        onSuccess({ code, msg }) {
            if (code === 200) {
                onRefresh && onRefresh();
                toast({
                    description: msg,
                    duration: 1500
                });
            }
        }
    });

    const handleJump = (id: number) => {
        navigator(`/video/detail/${id}`);
    };

    const handleDelete = (id: number) => {
        runCancelSwiper({ id });
    };

    return (
        <Card className={cn('border-none shadow-none h-full')}>
            <CardHeader>
                <Input
                    type="text"
                    placeholder={t('table.search.placeholder')}
                    className={cn('max-w-72 h-9')}
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            onSearch && onSearch(e.target.value);
                        }
                    }}
                />
            </CardHeader>
            <CardContent>
                <div className={cn('overflow-hidden')}>
                    {data.length ? (
                        <ScrollArea
                            className={cn(
                                'md:h-[calc(100vh-15rem)] h-[calc(100vh-19rem)] rounded-md'
                            )}
                        >
                            <div className={cn('flex flex-wrap gap-6')}>
                                {data.map(item => {
                                    const {
                                        aid,
                                        title,
                                        description,
                                        banner_url
                                    } = item;
                                    return (
                                        <div
                                            key={aid}
                                            className={cn(
                                                'min-[1080px]:w-[calc(50%-0.75rem)] min-[1960px]:w-[calc(33.3%-1rem)] w-full cursor-pointer'
                                            )}
                                            onClick={() => handleJump(aid)}
                                        >
                                            <AspectRatio
                                                ratio={2 / 1}
                                                className={cn(
                                                    'rounded-md overflow-hidden'
                                                )}
                                            >
                                                <img
                                                    src={banner_url}
                                                    className={cn(
                                                        'block object-cover size-full brightness-90'
                                                    )}
                                                />
                                                <div
                                                    className={cn(
                                                        'absolute bottom-0 w-full after:absolute after:bottom-0 after:bg-bottom-shadow after:w-full after:h-52'
                                                    )}
                                                ></div>
                                                <div
                                                    className={cn(
                                                        'absolute bottom-0 w-full p-6 text-white space-y-2'
                                                    )}
                                                >
                                                    <h3
                                                        className={cn(
                                                            'line-clamp-1 text-xl font-bold hover:text-[#1677ff]'
                                                        )}
                                                    >
                                                        {title}
                                                    </h3>
                                                    <div
                                                        className={cn(
                                                            'flex items-center justify-between'
                                                        )}
                                                    >
                                                        <p
                                                            className={cn(
                                                                'line-clamp-2 w-3/4 text-sm'
                                                            )}
                                                        >
                                                            {description}
                                                        </p>
                                                        <Button
                                                            className={cn(
                                                                'size-5'
                                                            )}
                                                            variant={'link'}
                                                            size="icon"
                                                            aria-label="Delete"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    aid
                                                                )
                                                            }
                                                        >
                                                            <Trash2
                                                                className={cn(
                                                                    'text-destructive'
                                                                )}
                                                                size={18}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </AspectRatio>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div
                            className={cn(
                                'flex items-center justify-center md:h-[calc(100vh-15rem)] h-[calc(100vh-19rem)]'
                            )}
                        >
                            {loading ? (
                                <Loading className={cn('flex relative')} />
                            ) : (
                                <>{t('table.empty')}</>
                            )}
                        </div>
                    )}
                </div>
                {!!total && (
                    <div className={cn('pt-6')}>
                        <SwiperPagination
                            sizes={sizes}
                            total={total}
                            pagination={pagination}
                            pageCount={pageCount}
                            onPaginationChange={onPaginationChange}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
