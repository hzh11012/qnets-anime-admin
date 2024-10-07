import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
    color: string;
}

const Color = ({ className, color }: ColorPickerProps) => {
    const colorComp = (
        <>
            <i
                className={cn(
                    'inline-block align-middle w-4 h-4 border rounded'
                )}
                style={{
                    backgroundColor: color
                }}
            ></i>
            <span className={cn('inline-block ml-2 align-middle')}>
                {color}
            </span>
        </>
    );

    return <div className={cn('inline-block', className)}>{colorComp}</div>;
};

export default Color;
