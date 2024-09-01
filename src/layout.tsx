import useIsCollapsed from '@/hooks/use-is-collapsed';
import { Sidebar } from '@/components/layout/sidebar';
import { cn } from '@/lib/utils';
// import { useTranslation } from 'react-i18next';
import { LayoutBody, LayoutHeader } from '@/components/layout';
import Language from '@/components/layout/language';
import { ThemeToggle } from '@/components/layout/theme-switch';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useIsCollapsed();
    // const { t } = useTranslation();

    return (
        <div
            className={cn(
                'relative h-full overflow-hidden bg-gray-50 dark:bg-black'
            )}
        >
            <Sidebar
                className="bg-background"
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />
            <main
                id="content"
                className={`flex flex-col overflow-x-hidden pt-16 transition-[margin] md:overflow-y-auto md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-56'} h-full`}
            >
                <div className={`relative w-full h-16 overflow-hidden`}>
                    <LayoutHeader className="fixed w-full h-16 z-10 border-b md:top-0 lg:top-0 right-0 bg-background">
                        <div className="ml-auto flex items-center space-x-4">
                            <Language />
                            <ThemeToggle />
                        </div>
                    </LayoutHeader>
                </div>

                <LayoutBody className="flex flex-col">
                    <div className="flex-1 space-y-5">
                        <Outlet />
                    </div>
                </LayoutBody>
            </main>
        </div>
    );
};

export default Layout;
