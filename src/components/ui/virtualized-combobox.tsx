import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Check } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

type Option = {
    value: string;
    label: string;
};

interface VirtualizedCommandProps {
    height: string;
    options: Option[];
    placeholder: string;
    selectedOption: string;
    onSelectOption?: (option: string) => void;
}

export const VirtualizedCommand = ({
    height,
    options,
    placeholder,
    selectedOption,
    onSelectOption
}: VirtualizedCommandProps) => {
    const [filteredOptions, setFilteredOptions] =
        React.useState<Option[]>(options);
    const [focusedIndex, setFocusedIndex] = React.useState(0);
    const [isKeyboardNavActive, setIsKeyboardNavActive] = React.useState(false);

    const parentRef = React.useRef(null);

    const virtualizer = useVirtualizer({
        count: filteredOptions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35
    });

    const virtualOptions = virtualizer.getVirtualItems();

    const scrollToIndex = (index: number) => {
        virtualizer.scrollToIndex(index, {
            align: 'center'
        });
    };

    const handleSearch = (search: string) => {
        setIsKeyboardNavActive(false);
        setFilteredOptions(
            options.filter(option =>
                option.label.toLowerCase().includes(search.toLowerCase() ?? [])
            )
        );
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                setIsKeyboardNavActive(true);
                setFocusedIndex(prev => {
                    const newIndex =
                        prev === -1
                            ? 0
                            : Math.min(prev + 1, filteredOptions.length - 1);
                    scrollToIndex(newIndex);
                    return newIndex;
                });
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                setIsKeyboardNavActive(true);
                setFocusedIndex(prev => {
                    const newIndex =
                        prev === -1
                            ? filteredOptions.length - 1
                            : Math.max(prev - 1, 0);
                    scrollToIndex(newIndex);
                    return newIndex;
                });
                break;
            }
            case 'Enter': {
                event.preventDefault();
                if (filteredOptions[focusedIndex]) {
                    onSelectOption?.(`${filteredOptions[focusedIndex].value}`);
                }
                break;
            }
            default:
                break;
        }
    };

    React.useEffect(() => {
        if (selectedOption) {
            const option = filteredOptions.find(
                option => option.value === selectedOption
            );
            if (option) {
                const index = filteredOptions.indexOf(option);
                setFocusedIndex(index);
                virtualizer.scrollToIndex(index, {
                    align: 'center'
                });
            }
        }
    }, [selectedOption, filteredOptions, virtualizer]);

    const { t } = useTranslation();

    return (
        <Command shouldFilter={false} onKeyDown={handleKeyDown}>
            <CommandInput
                onValueChange={handleSearch}
                placeholder={placeholder}
            />
            <CommandList
                ref={parentRef}
                style={{
                    maxHeight: height,
                    width: '100%',
                    overflow: 'auto'
                }}
                onMouseDown={() => setIsKeyboardNavActive(false)}
                onMouseMove={() => setIsKeyboardNavActive(false)}
            >
                <CommandEmpty className={cn('pt-8 pb-6 text-center text-sm')}>
                    {t('table.toolbar.result_empty')}
                </CommandEmpty>
                <CommandGroup>
                    <div
                        style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative'
                        }}
                    >
                        {virtualOptions.map(virtualOption => (
                            <CommandItem
                                key={filteredOptions[virtualOption.index].value}
                                disabled={isKeyboardNavActive}
                                className={cn(
                                    'absolute left-0 top-0 w-full bg-transparent',
                                    focusedIndex === virtualOption.index &&
                                        'bg-accent text-accent-foreground',
                                    isKeyboardNavActive &&
                                        focusedIndex !== virtualOption.index &&
                                        'aria-selected:bg-transparent aria-selected:text-primary'
                                )}
                                style={{
                                    height: `${virtualOption.size}px`,
                                    transform: `translateY(${virtualOption.start}px)`
                                }}
                                value={`${filteredOptions[virtualOption.index].value}`}
                                onMouseEnter={() =>
                                    !isKeyboardNavActive &&
                                    setFocusedIndex(virtualOption.index)
                                }
                                onMouseLeave={() =>
                                    !isKeyboardNavActive && setFocusedIndex(-1)
                                }
                                onSelect={onSelectOption}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedOption ===
                                            filteredOptions[virtualOption.index]
                                                .value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                                {filteredOptions[virtualOption.index].label}
                            </CommandItem>
                        ))}
                    </div>
                </CommandGroup>
            </CommandList>
        </Command>
    );
};
