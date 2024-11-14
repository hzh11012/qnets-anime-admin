import { createBrowserRouter, RouteObject, redirect } from 'react-router-dom';
import Layout from '@/layout';
import Exception404 from '@/pages/404';
import { ADMIN_SCOPE, LOGIN_URL } from '@/lib/config';
import { getUserInfo } from '@/apis/auth';
import { userStore } from '@/store/user';

const tokenLoader = async () => {
    const { data } = await getUserInfo();
    userStore.setState({
        userInfo: data
    });
    if (!data?.scope || data?.scope < ADMIN_SCOPE) {
        return redirect(
            `${LOGIN_URL}/?redirect=${encodeURIComponent(window.location.href)}`
        );
    }
    return null;
};

const staticRoutes: RouteObject[] = [
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
            }
        ]
    },
    {
        path: '*',
        Component: Exception404
    }
];

const router = createBrowserRouter(staticRoutes);

export default router;
