import {
    LayoutDashboard,
    Images,
    Bell,
    Tv2,
    ChartColumnStacked,
    Tv,
    MailWarning,
    Users2,
    Bolt,
    Shield,
    ListVideo
} from 'lucide-react';

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
        icon: <Images size={18} />
    },
    {
        title: 'menu.notice',
        label: '',
        href: '/notice',
        icon: <Bell size={18} />
    },
    {
        title: 'menu.video',
        label: '',
        href: '/video',
        icon: <Tv2 size={18} />,
        sub: [
            {
                title: 'menu.video.list',
                label: '',
                href: '/index',
                icon: <ListVideo size={18} />
            },
            {
                title: 'menu.video.category',
                label: '',
                href: '/category',
                icon: <ChartColumnStacked size={18} />
            },
            {
                title: 'menu.video.danmaku',
                label: '',
                href: '/danmaku',
                icon: <Tv size={18} />
            },
            {
                title: 'menu.video.correction',
                label: '',
                href: '/correction',
                icon: <MailWarning size={18} />
            }
        ]
    },
    {
        title: 'menu.system.permission',
        label: '',
        href: '/permissions',
        icon: <Shield size={18} />,
        sub: [
            {
                title: 'menu.system.permission.user',
                label: '',
                href: '/users',
                icon: <Users2 size={18} />
            }
        ]
    },
    {
        title: 'menu.system.settings',
        label: '',
        href: '/settings',
        icon: <Bolt size={18} />
    }
];
