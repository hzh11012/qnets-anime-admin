import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

export default function usePagination(initialSize = 10) {
    const [pagination, setPagination] = useState({
        pageSize: initialSize,
        pageIndex: 0
    } as PaginationState);

    const { pageSize, pageIndex } = pagination;
    return {
        onPaginationChange: setPagination,
        pagination,
        limit: pageSize,
        page: pageIndex + 1
    };
}
