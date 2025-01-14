import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectEmpty,
    MultiSelectItem,
    MultiSelectList,
    MultiSelectSearch,
    MultiSelectTrigger,
    MultiSelectValue
} from '@/components/ui/multiple-select';
import { cn } from '@/lib/utils';
import type { Control, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface FormMultiSelectProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: string;
    label: string;
    required?: boolean;
    maxDisplay?: number;
    options: {
        label: string;
        value: number;
    }[];
}

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
    control,
    name,
    label,
    required,
    maxDisplay = 3,
    options
}) => {
    const { t } = useTranslation();

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
                    <MultiSelect
                        onValueChange={val =>
                            field.onChange(val?.length ? val : undefined)
                        }
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <MultiSelectTrigger>
                                <MultiSelectValue maxDisplay={maxDisplay} />
                            </MultiSelectTrigger>
                        </FormControl>
                        <MultiSelectContent>
                            <MultiSelectSearch />
                            <MultiSelectList>
                                {options.map(item => (
                                    <MultiSelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </MultiSelectItem>
                                ))}
                                <MultiSelectEmpty>
                                    {t('table.toolbar.result_empty')}
                                </MultiSelectEmpty>
                            </MultiSelectList>
                        </MultiSelectContent>
                    </MultiSelect>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormMultiSelect;
