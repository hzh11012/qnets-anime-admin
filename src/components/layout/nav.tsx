import React from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import useCheckActiveNav from '@/hooks/use-check-active-nav';
import type { SideLink } from '@/links';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
    isCollapsed: boolean;
    links: SideLink[];
    closeNav: () => void;
}

interface NavLinkProps extends SideLink {
    subLink?: boolean;
    closeNav: () => void;
    closeIcon?: boolean;
}

// NavLink 展开的一级菜单样式
function NavLink({
    title,
    icon,
    closeIcon = false,
    label,
    href,
    closeNav,
    subLink = false
}: NavLinkProps) {
    const { checkIsActive } = useCheckActiveNav();
    const { t } = useTranslation();
    return (
        <Link
            to={href}
            onClick={closeNav}
            className={cn(
                buttonVariants({
                    variant: checkIsActive(href) ? 'secondary' : 'ghost',
                    size: 'default'
                }),
                'h-12 justify-start text-wrap secondary shadow-none px-6 mx-2',
                subLink && 'h-12 w-full mx-0 pl-8'
            )}
            aria-current={checkIsActive(href) ? 'page' : undefined}
        >
            {!closeIcon && <div className={cn('mr-2')}>{icon}</div>}
            {t(title)}
            {label && (
                <div
                    className={cn(
                        'ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground'
                    )}
                >
                    {label}
                </div>
            )}
        </Link>
    );
}

// NavLinkDropdown 多级菜单样式
function NavLinkDropdown({
    title,
    href,
    icon,
    label,
    sub,
    closeNav
}: NavLinkProps) {
    const { checkIsActive } = useCheckActiveNav();
    const { t } = useTranslation();

    /* Open collapsible by default
     * if one of child element is active */
    const isChildActive = !!sub?.find(s => checkIsActive(href + s.href));

    return (
        <Collapsible defaultOpen={isChildActive} className={cn('mx-2')}>
            <CollapsibleTrigger
                className={cn(
                    buttonVariants({ variant: 'ghost', size: 'default' }),
                    'group h-12 w-full text-wrap justify-start secondary shadow-none pl-6'
                )}
            >
                <div className={cn('mr-2')}>{icon}</div>
                {t(title)}
                {label && (
                    <div
                        className={cn(
                            'ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground'
                        )}
                    >
                        {label}
                    </div>
                )}
                <span
                    className={cn(
                        'ml-auto group-data-[state="open"]:rotate-90 transition-[--tw-rotate]'
                    )}
                >
                    <ChevronRight size={18} />
                </span>
            </CollapsibleTrigger>
            <CollapsibleContent className={cn('collapsibleDropdown')} asChild>
                <ul>
                    {sub!.map(sublink => {
                        const childLink = href + sublink.href;
                        return (
                            <li key={sublink.title} className={cn('my-1')}>
                                <NavLink
                                    {...sublink}
                                    href={childLink}
                                    subLink
                                    closeIcon={false}
                                    closeNav={closeNav}
                                />
                            </li>
                        );
                    })}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    );
}

// NavLinkIcon 点击缩放的一级菜单
function NavLinkIcon({ title, icon, label, href }: NavLinkProps) {
    const { checkIsActive } = useCheckActiveNav();
    const { t } = useTranslation();

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <Link
                    to={href}
                    className={cn(
                        buttonVariants({
                            variant: checkIsActive(href)
                                ? 'secondary'
                                : 'ghost',
                            size: 'icon'
                        }),
                        'h-10 w-10'
                    )}
                >
                    {icon}
                    <span className={cn('sr-only')}>{t(title)}12312</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent
                side="right"
                className={cn('flex items-center gap-4')}
            >
                {t(title)}
                {label && (
                    <span className={cn('ml-auto text-muted-foreground')}>
                        {label}
                    </span>
                )}
            </TooltipContent>
        </Tooltip>
    );
}

// NavLinkIconDropdown 点击缩放菜单时候的样式
function NavLinkIconDropdown({ title, href, icon, label, sub }: NavLinkProps) {
    const { checkIsActive } = useCheckActiveNav();
    const isChildActive = !!sub?.find(s => checkIsActive(href + s.href));
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={isChildActive ? 'secondary' : 'ghost'}
                            size="icon"
                            className={cn('h-10 w-10')}
                        >
                            {icon}
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent
                    side="right"
                    sideOffset={12}
                    className={cn('flex items-center gap-4')}
                >
                    {t(title)}{' '}
                    {label && (
                        <span className={cn('ml-auto text-muted-foreground')}>
                            {label}
                        </span>
                    )}
                    <ChevronRight size={16} />
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" sideOffset={12}>
                <DropdownMenuLabel>
                    {t(title)} {label ? `(${label})` : ''}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sub!.map(sublink => {
                    const childLink = href + sublink.href;
                    return (
                        <DropdownMenuItem
                            key={`${sublink.title}-${sublink.href}`}
                            asChild
                        >
                            <Link
                                to={childLink}
                                className={cn(
                                    `${
                                        checkIsActive(childLink)
                                            ? 'bg-secondary'
                                            : 'cursor-pointer h-10'
                                    }`
                                )}
                            >
                                {sublink.icon}
                                <span className={cn('ml-2 max-w-52 text-wrap')}>
                                    {t(sublink.title)}
                                </span>
                                {sublink.label && (
                                    <span className={cn('ml-auto text-xs')}>
                                        {sublink.label}
                                    </span>
                                )}
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Nav({
    links,
    isCollapsed,
    className,
    closeNav
}: NavProps) {
    const renderLink = ({ sub, ...rest }: SideLink) => {
        const key = `${rest.title}-${rest.href}`;
        if (isCollapsed && sub)
            return (
                <NavLinkIconDropdown
                    {...rest}
                    sub={sub}
                    key={key}
                    closeNav={closeNav}
                />
            );

        if (isCollapsed)
            return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />;

        if (sub)
            return (
                <NavLinkDropdown
                    {...rest}
                    sub={sub}
                    key={key}
                    closeNav={closeNav}
                />
            );

        return (
            <NavLink
                {...rest}
                key={key}
                closeIcon={false}
                closeNav={closeNav}
            />
        );
    };
    return (
        <div
            data-collapsed={isCollapsed}
            className={cn(
                'group border-b bg-background py-2 transition-[max-height,padding] data-[collapsed=true]:py-2 md:border-none',
                className
            )}
        >
            <TooltipProvider delayDuration={0}>
                <nav
                    className={cn(
                        'grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'
                    )}
                >
                    {links.map(renderLink)}
                </nav>
            </TooltipProvider>
        </div>
    );
}
