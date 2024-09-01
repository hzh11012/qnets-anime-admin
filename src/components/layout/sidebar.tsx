import {
    Dispatch,
    HTMLAttributes,
    SetStateAction,
    useEffect,
    useState
} from 'react';
import { cn } from '@/lib/utils';
import { Layout, LayoutHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { AlignJustify, ChevronsLeft, Sprout, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Nav from '@/components/layout/nav';
import { links } from '@/links';

interface SidebarProps extends HTMLAttributes<HTMLElement> {
    isCollapsed: boolean;
    setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
    const [navOpened, setNavOpened] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (navOpened) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [navOpened]);

    return (
        <aside
            className={cn(
                `fixed left-0 right-0 top-0 z-50 w-full border-r transition-[width] md:bottom-0 md:right-auto md:h-svh ${
                    isCollapsed ? 'md:w-14' : 'md:w-56'
                }`,
                className
            )}
        >
            {/* Overlay in mobile */}
            <div
                onClick={() => setNavOpened(false)}
                className={cn(
                    `absolute inset-0 ${
                        navOpened ? 'h-svh' : 'h-0'
                    } w-full md:hidden`
                )}
            />

            <Layout>
                <LayoutHeader
                    className={cn(
                        'sticky top-0 justify-between px-4 py-3 md:px-4 bg-background'
                    )}
                >
                    <div
                        className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}
                    >
                        <Sprout
                            className={`${isCollapsed ? 'h-6 w-6' : 'h-8 w-8'}`}
                        />
                        <div
                            className={`flex flex-col justify-end truncate ${
                                isCollapsed ? 'invisible w-0' : 'visible w-auto'
                            }`}
                        >
                            <span className="font-medium">
                                {t('menu.title')}
                            </span>
                            <span className="text-xs">
                                {t('menu.subtitle')}
                            </span>
                        </div>
                    </div>

                    {/* Toggle Button in mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        aria-label="Toggle Navigation"
                        aria-controls="sidebar-menu"
                        aria-expanded={navOpened}
                        onClick={() => setNavOpened(prev => !prev)}
                    >
                        {navOpened ? <X /> : <AlignJustify />}
                    </Button>
                </LayoutHeader>

                <Nav
                    id="sidebar-menu"
                    className={`h-full flex-1 overflow-auto scrollbar-hide ${
                        navOpened
                            ? 'max-h-nav'
                            : 'max-h-0 py-0 md:max-h-nav md:py-2'
                    }`}
                    closeNav={() => setNavOpened(false)}
                    isCollapsed={isCollapsed}
                    links={links}
                />

                <Button
                    onClick={() => setIsCollapsed(prev => !prev)}
                    size="icon"
                    variant="outline"
                    className="absolute -right-3 top-16 -translate-y-3 hidden rounded-full md:inline-flex h-6 w-6"
                >
                    <ChevronsLeft
                        className={`h-4 w-4 ${isCollapsed ? 'rotate-180' : ''}`}
                    />
                </Button>
            </Layout>
        </aside>
    );
};

export { Sidebar };
