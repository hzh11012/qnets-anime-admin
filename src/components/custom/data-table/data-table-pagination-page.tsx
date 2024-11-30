import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

function PaginationPage<TData>({ table }: DataTablePaginationProps<TData>) {
    const pageList: (string | number)[] = [];
    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;
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
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn('w-9 h-9')}
                        onClick={e => {
                            e.preventDefault();
                            table.previousPage();
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className={cn('h-4 w-4')} />
                    </Button>
                </PaginationItem>
                {pageList.map(page => {
                    return (
                        <PaginationItem key={'page-' + page.toString()}>
                            {page === '...' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    className={cn('cursor-pointer w-9 h-9')}
                                    onClick={e => {
                                        e.preventDefault();
                                        table.setPageIndex(Number(page) - 1);
                                    }}
                                    isActive={
                                        table.getState().pagination
                                            .pageIndex ===
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
                            table.nextPage();
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className={cn('h-4 w-4')} />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

PaginationPage.displayName = 'pagination';

export default PaginationPage;
