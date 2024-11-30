import { useTheme } from '@/components/custom/theme-provider';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Moon, Sun, Tv2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('rounded-full')}
                >
                    {theme === 'light' && (
                        <Sun
                            className={cn(
                                'h-[1.2rem] w-[1.2rem] rotate-0 scale-100'
                            )}
                        />
                    )}
                    {theme === 'dark' && (
                        <Moon
                            className={cn(
                                'h-[1.2rem] w-[1.2rem] rotate-0 scale-100'
                            )}
                        />
                    )}
                    {theme === 'system' && (
                        <Tv2
                            className={cn(
                                'h-[1.2rem] w-[1.2rem] rotate-0 scale-100'
                            )}
                        />
                    )}
                    <span className={cn('sr-only')}>Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
                <DropdownMenuItem
                    className={cn('cursor-pointer')}
                    onClick={() => setTheme('light')}
                >
                    <Sun size={16} />
                    <span className={cn('pl-2')}>{t('theme.light')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={cn('cursor-pointer')}
                    onClick={() => setTheme('dark')}
                >
                    <Moon size={16} />
                    <span className={cn('pl-2')}>{t('theme.dark')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={cn('cursor-pointer')}
                    onClick={() => setTheme('system')}
                >
                    <Tv2 size={16} />
                    <span className={cn('pl-2')}>{t('theme.system')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeToggle;
