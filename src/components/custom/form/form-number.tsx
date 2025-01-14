import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import { Button, Input, Group, NumberField } from 'react-aria-components';
import type { Control, FieldValues } from 'react-hook-form';

interface FormNumberProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: string;
    label: string;
    required?: boolean;
    minValue?: number;
    maxValue?: number;
    step?: number;
}

const FormNumber: React.FC<FormNumberProps> = ({
    control,
    name,
    label,
    required,
    step = 1,
    minValue = 0,
    maxValue
}) => {
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
                    <FormControl>
                        <NumberField
                            aria-label={label}
                            minValue={minValue}
                            maxValue={maxValue}
                            step={step}
                            value={field.value}
                            onChange={field.onChange}
                        >
                            <Group
                                className={cn(
                                    'relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20'
                                )}
                            >
                                <Button
                                    slot="decrement"
                                    className={cn(
                                        '-ms-px flex aspect-square h-[inherit] items-center justify-center border border-input bg-background text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                                    )}
                                >
                                    <Minus
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </Button>
                                <Input
                                    className={cn(
                                        'w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none'
                                    )}
                                    autoComplete="off"
                                />
                                <Button
                                    slot="increment"
                                    className={cn(
                                        '-me-px flex aspect-square h-[inherit] items-center justify-center border border-input bg-background text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                                    )}
                                >
                                    <Plus
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </Button>
                            </Group>
                        </NumberField>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormNumber;
