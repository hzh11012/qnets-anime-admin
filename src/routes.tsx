import { createBrowserRouter, RouteObject, redirect } from 'react-router-dom';
import Layout from '@/layout';
import Exception404 from '@/pages/404';
import { getToken } from '@/lib/token';

const tokenLoader = () => {
    const token = getToken();
    if (!token) {
        return redirect('/login');
    }
    return null;
};

const redirectLoader = () => {
    const token = getToken();
    if (token) {
        return redirect('/');
    }
    return null;
};

const staticRoutes: RouteObject[] = [
    {
        path: '/login',
        loader: redirectLoader,
        lazy: async () => ({
            Component: (await import('@/pages/login/index')).default
        })
    },
    {
        path: '/',
        loader: tokenLoader,
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
                index: true,
                path: 'video/danmaku',
                lazy: async () => ({
                    Component: (await import('@/pages/danmaku/index')).default
                })
            },
            {
                path: '*',
                Component: Exception404
            }
        ]
    }
];

const router = createBrowserRouter(staticRoutes);

export default router;
