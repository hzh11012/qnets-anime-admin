import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';
import { Check, Filter, FilterX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DataTableColumnFilterProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    options: {
        label: string;
        value: number | string;
    }[];
}

export function DataTableColumnFilter<TData, TValue>({
    column,
    options
}: DataTableColumnFilterProps<TData, TValue>) {
    const { t } = useTranslation();

    const facets = column?.getFacetedUniqueValues();
    const selectedValues = new Set(
        column?.getFilterValue() as (string | number)[]
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={cn('cursor-pointer')}>
                    {selectedValues?.size > 0 ? (
                        <FilterX
                            color="#1677ff"
                            className={cn('h-3.5 w-3.5')}
                        />
                    ) : (
                        <Filter className={cn('h-3.5 w-3.5')} />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <ScrollArea className={cn('max-h-56')}>
                    <>
                        {options.map((option, index) => {
                            const isSelected = selectedValues.has(option.value);
                            return (
                                <DropdownMenuItem
                                    key={`${option.value}-${index}`}
                                    onClick={() => {
                                        if (isSelected) {
                                            selectedValues.delete(option.value);
                                        } else {
                                            selectedValues.add(option.value);
                                        }
                                        const filterValues =
                                            Array.from(selectedValues);
                                        column?.setFilterValue(
                                            filterValues.length
                                                ? filterValues
                                                : undefined
                                        );
                                    }}
                                >
                                    <div
                                        className={cn(
                                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                            isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'opacity-50 [&_svg]:invisible'
                                        )}
                                    >
                                        <Check />
                                    </div>
                                    <span>{option.label}</span>
                                    {facets?.get(option.value) && (
                                        <span
                                            className={cn(
                                                'ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs'
                                            )}
                                        >
                                            {facets.get(option.value)}
                                        </span>
                                    )}
                                </DropdownMenuItem>
                            );
                        })}
                    </>
                </ScrollArea>
                {selectedValues.size > 0 && (
                    <DropdownMenuItem
                        className={cn('justify-center')}
                        onClick={() => column?.setFilterValue(undefined)}
                    >
                        {t('table.toolbar.clear_filters')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
