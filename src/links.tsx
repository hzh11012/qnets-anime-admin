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
    Star,
    Mail,
    BookOpenText,
    LayoutList
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
        href: '/',
        icon: <LayoutDashboard size={18} />
    },
    {
        title: 'menu.new_anime',
        href: '/new-anime',
        icon: <LayoutList size={18} />
    },
    {
        title: 'menu.swiper',
        href: '/swiper',
        icon: <Images size={18} />
    },
    {
        title: 'menu.notice',
        href: '/notice',
        icon: <Bell size={18} />
    },
    {
        title: 'menu.video',
        href: '/video',
        icon: <Tv2 size={18} />,
        sub: [
            {
                title: 'menu.video.series',
                href: '/series',
                icon: <BookOpenText size={18} />
            },
            {
                title: 'menu.video.list',
                href: '',
                icon: <ListVideo size={18} />
            },
            {
                title: 'menu.video.category',
                href: '/category',
                icon: <Tags size={18} />
            },
            {
                title: 'menu.video.danmaku',
                href: '/danmaku',
                icon: <Tv size={18} />
            },
            {
                title: 'menu.video.correction',
                href: '/correction',
                icon: <MailWarning size={18} />
            }
        ]
    },
    {
        title: 'menu.user',
        href: '/user',
        icon: <Users2 size={18} />,
        sub: [
            {
                title: 'menu.user.list',
                href: '',
                icon: <ContactRound size={18} />
            },
            {
                title: 'menu.user.collection',
                href: '/collection',
                icon: <ChartColumnStacked size={18} />
            },
            {
                title: 'menu.user.rating',
                href: '/rating',
                icon: <Star size={18} />
            },
            {
                title: 'menu.user.notice-record',
                href: '/notice-record',
                icon: <Mail size={18} />
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
