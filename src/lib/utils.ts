import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

const validFilter = (filterName: string, filters: any[]) => {
    return (
        filters.find((item: any) => item.id === filterName)?.value || undefined
    );
};

const validSort = (sortName: string, sorts: any[]) => {
    if (sorts.length === 0) {
        return undefined;
    }
    const isDesc = sorts.find((item: any) => item.id === sortName)?.desc;
    return isDesc ? 'DESC' : 'ASC';
};

const formateNumber = (x: number) => {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

export { cn, validFilter, validSort, formateNumber };
