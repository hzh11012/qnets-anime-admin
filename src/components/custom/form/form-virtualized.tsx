import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { VirtualizedCommand } from '@/components/ui/virtualized-combobox';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Control, FieldValues } from 'react-hook-form';

interface FormVirtualizedProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: string;
    label: string;
    required?: boolean;
    options: {
        label: string;
        value: number;
    }[];
}

const FormVirtualized: React.FC<FormVirtualizedProps> = ({
    control,
    name,
    label,
    required,
    options
}) => {
    const [open, setOpen] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className={cn({
                            required: required
                        })}
                    >
                        {label}
                    </FormLabel>

                    <Popover open={open} onOpenChange={setOpen}>
                        <FormControl>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn(
                                        'w-full justify-between bg-background px-3 outline-offset-0 hover:bg-background h-9'
                                    )}
                                >
                                    <span>
                                        {!!field.value &&
                                            options.find(
                                                item =>
                                                    item.value === field.value
                                            )?.label}
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
                            </PopoverTrigger>
                        </FormControl>
                        <PopoverContent
                            className={cn(
                                'w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0'
                            )}
                            align="start"
                        >
                            <VirtualizedCommand
                                options={options.map(item => ({
                                    label: item.label,
                                    value: `${item.value}`
                                }))}
                                height="16rem"
                                placeholder=""
                                selectedOption={`${field.value}`}
                                onSelectOption={currentValue => {
                                    field.onChange(parseInt(currentValue));
                                    setOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormVirtualized;
