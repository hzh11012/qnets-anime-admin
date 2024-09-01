import { createBrowserRouter, RouteObject } from 'react-router-dom';

import Layout from '@/layout';
import Exception404 from '@/pages/404';

const staticRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                path: '',
                lazy: async () => ({
                    Component: (await import('@/pages/dashboard/index')).default
                })
            },
            {
                path: '*',
                Component: Exception404
            }
        ]
    },
    {
        path: '/video',
        element: <Layout />,
        children: [
            {
                index: true,
                path: 'danmaku',
                lazy: async () => ({
                    Component: (await import('@/pages/danmaku/index')).default
                })
            }
        ]
    }
];

const router = createBrowserRouter(staticRoutes);

export default router;
