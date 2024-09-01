import { LayoutDashboard } from 'lucide-react';

export interface NavLink {
    title: string;
    label?: string;
    href: string;
    icon?: JSX.Element;
}

export interface SideLink extends NavLink {
    sub?: NavLink[];
}

export const links: SideLink[] = [
    {
        title: 'menu.dashboard',
        label: '',
        href: '/',
        icon: <LayoutDashboard size={18} />
    },
    {
        title: 'menu.swiper',
        label: '',
        href: '/swiper',
        icon: <LayoutDashboard size={18} />
    },
    {
        title: 'menu.notice',
        label: '',
        href: '/notice',
        icon: <LayoutDashboard size={18} />
    },
    {
        title: 'menu.video',
        label: '',
        href: '/video',
        icon: <LayoutDashboard size={18} />,
        sub: [
            {
                title: 'menu.video.list',
                label: '',
                href: '/index',
                icon: <LayoutDashboard size={18} />
            },
            {
                title: 'menu.video.categorize',
                label: '',
                href: '/categorize',
                icon: <LayoutDashboard size={18} />
            },
            {
                title: 'menu.video.danmaku',
                label: '',
                href: '/danmaku',
                icon: <LayoutDashboard size={18} />
            },
            {
                title: 'menu.video.correction',
                label: '',
                href: '/correction',
                icon: <LayoutDashboard size={18} />
            }
        ]
    },
    {
        title: 'menu.system.permission',
        label: '',
        href: '/permissions',
        icon: <LayoutDashboard size={18} />,
        sub: [
            {
                title: 'menu.system.permission.user',
                label: '',
                href: '/users',
                icon: <LayoutDashboard size={18} />
            },
            {
                title: 'menu.system.permission.role',
                label: '',
                href: '/roles',
                icon: <LayoutDashboard size={18} />
            }
        ]
    },
    {
        title: 'menu.system.settings',
        label: '',
        href: '/settings',
        icon: <LayoutDashboard size={18} />
    }
];
