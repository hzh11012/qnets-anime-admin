import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';
import { Check, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>;
    title?: string;
    options: {
        label: string;
        value: string | number;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
}

export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options
}: DataTableFacetedFilterProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues();
    const selectedValues = new Set(
        column?.getFilterValue() as (string | number)[]
    );

    const { t } = useTranslation();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn('h-9 border-dashed')}
                >
                    <PlusCircle width={18} height={18} className={cn('mr-2')} />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className={cn('mx-2 h-4')}
                            />
                            <Badge
                                variant="secondary"
                                className={cn(
                                    'rounded-sm px-1 font-normal lg:hidden'
                                )}
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className={cn('hidden space-x-1 lg:flex')}>
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            'rounded-sm px-1 font-normal'
                                        )}
                                    >
                                        {selectedValues.size +
                                            ' ' +
                                            t('table.toolbar.selected')}
                                    </Badge>
                                ) : (
                                    options
                                        .filter(option =>
                                            selectedValues.has(option.value)
                                        )
                                        .map(option => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className={cn(
                                                    'rounded-sm px-1 font-normal'
                                                )}
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn('w-[200px] p-0')} align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>
                            {t('table.toolbar.result_empty')}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map(option => {
                                const isSelected = selectedValues.has(
                                    option.value
                                );
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                selectedValues.delete(
                                                    option.value
                                                );
                                            } else {
                                                selectedValues.add(
                                                    option.value
                                                );
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
                                        {option.icon && (
                                            <option.icon
                                                className={cn(
                                                    'mr-2 h-4 w-4 text-muted-foreground'
                                                )}
                                            />
                                        )}
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
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() =>
                                            column?.setFilterValue(undefined)
                                        }
                                        className={cn(
                                            'justify-center text-center'
                                        )}
                                    >
                                        {t('table.toolbar.clear_filters')}
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
