import * as React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('relative flex h-full w-full flex-col', className)}
            {...props}
        />
    )
);
Layout.displayName = 'Layout';

interface LayoutHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const LayoutHeader = React.forwardRef<HTMLDivElement, LayoutHeaderProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex flex-none items-center gap-4 p-4 md:px-4',
                className
            )}
            {...props}
        />
    )
);

LayoutHeader.displayName = 'LayoutHeader';

interface LayoutBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const LayoutBody = React.forwardRef<HTMLDivElement, LayoutBodyProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex-1 overflow-hidden px-4 py-4 md:px-4',
                className
            )}
            {...props}
        />
    )
);
LayoutBody.displayName = 'LayoutBody';

export { Layout, LayoutHeader, LayoutBody };
