import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { OnChangeFn, PaginationState } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SwiperPaginationProps {
    total: number;
    sizes: number[];
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
}

const SwiperPagination = ({
    total,
    pageCount,
    pagination,
    sizes,
    onPaginationChange
}: SwiperPaginationProps) => {
    const { t } = useTranslation();
    const pageList: (string | number)[] = [];
    const currentPage = pagination.pageIndex + 1;
    if (pageCount <= 6) {
        for (let i = 1; i <= pageCount; i++) {
            pageList.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pageList.push(...[1, 2, 3, 4, 5, '...', pageCount]);
        } else if (currentPage >= pageCount - 3) {
            pageList.push(
                ...[
                    1,
                    '...',
                    pageCount - 4,
                    pageCount - 3,
                    pageCount - 2,
                    pageCount - 1,
                    pageCount
                ]
            );
        } else {
            pageList.push(
                ...[
                    1,
                    '...',
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    '...',
                    pageCount
                ]
            );
        }
    }

    return (
        <div className={cn('flex items-center justify-between')}>
            <div className={cn('flex items-center')}>
                <div className={cn('items-center space-x-2 hidden sm:flex')}>
                    <div className={cn('text-sm font-medium')}>
                        {t('pagination.total')}
                    </div>
                    <div className={cn('text-sm font-medium')}>{total}</div>
                </div>
            </div>
            <div className={cn('flex items-center justify-between space-x-6')}>
                <div className={cn('flex items-center space-x-2')}>
                    <p
                        className={cn(
                            'hidden text-sm items-center font-medium sm:block'
                        )}
                    >
                        {t('pagination.pageSize')}
                    </p>
                    <Select
                        value={`${pagination.pageSize}`}
                        onValueChange={value => {
                            onPaginationChange(old => {
                                const pageSize = Math.max(1, Number(value));
                                const topRowIndex =
                                    old.pageSize * old.pageIndex;
                                const pageIndex = Math.floor(
                                    topRowIndex / pageSize
                                );
                                return {
                                    ...old,
                                    pageSize,
                                    pageIndex
                                };
                            });
                        }}
                    >
                        <SelectTrigger className={cn('w-auto')}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {sizes.map(pageSize => {
                                    return (
                                        <SelectItem
                                            key={pageSize}
                                            value={`${pageSize}`}
                                        >
                                            {pageSize}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className={cn('flex items-center space-x-2')}>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={cn('w-9 h-9')}
                                    onClick={e => {
                                        e.preventDefault();
                                        onPaginationChange({
                                            pageIndex: pagination.pageIndex - 1,
                                            pageSize: pagination.pageSize
                                        });
                                    }}
                                    disabled={!pagination.pageIndex}
                                >
                                    <ChevronLeft className={cn('h-4 w-4')} />
                                </Button>
                            </PaginationItem>
                            {pageList.map(page => {
                                return (
                                    <PaginationItem
                                        key={'page-' + page.toString()}
                                    >
                                        {page === '...' ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                className={cn(
                                                    'cursor-pointer w-9 h-9'
                                                )}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    onPaginationChange({
                                                        pageIndex:
                                                            Number(page) - 1,
                                                        pageSize:
                                                            pagination.pageSize
                                                    });
                                                }}
                                                isActive={
                                                    pagination.pageIndex ===
                                                    Number(page) - 1
                                                }
                                            >
                                                {page}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                );
                            })}
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={cn('w-9 h-9')}
                                    onClick={e => {
                                        e.preventDefault();
                                        onPaginationChange({
                                            pageIndex: pagination.pageIndex + 1,
                                            pageSize: pagination.pageSize
                                        });
                                    }}
                                    disabled={
                                        pagination.pageIndex + 1 >= pageCount
                                    }
                                >
                                    <ChevronRight className={cn('h-4 w-4')} />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
};
SwiperPagination.displayName = 'SwiperPagination';

export default SwiperPagination;
