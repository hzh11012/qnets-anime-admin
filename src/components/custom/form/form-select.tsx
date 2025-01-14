import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Control, FieldValues } from 'react-hook-form';

interface FormSelectProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: string;
    label: string;
    required?: boolean;
    options: {
        label: string;
        value: number;
        icon?: React.ReactElement;
    }[];
}

const FormSelect: React.FC<FormSelectProps> = ({
    control,
    name,
    label,
    required,
    options
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
                    <Select
                        onValueChange={val => field.onChange(parseInt(val))}
                        defaultValue={`${field.value}`}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map(item => (
                                <SelectItem
                                    key={item.value}
                                    value={`${item.value}`}
                                >
                                    <span
                                        className={cn(
                                            'flex items-center gap-2'
                                        )}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormSelect;
