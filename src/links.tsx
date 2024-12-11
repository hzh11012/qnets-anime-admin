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
    Tags,
    ListVideo,
    ContactRound,
    Star
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
                icon: <Tags size={18} />
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
        title: 'menu.user',
        label: '',
        href: '/user',
        icon: <Users2 size={18} />,
        sub: [
            {
                title: 'menu.user.list',
                label: '',
                href: '/index',
                icon: <ContactRound size={18} />
            },
            {
                title: 'menu.user.collection',
                label: '',
                href: '/collection',
                icon: <ChartColumnStacked size={18} />
            },
            {
                title: 'menu.user.score',
                label: '',
                href: '/score',
                icon: <Star size={18} />
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
