import { createBrowserRouter, RouteObject, redirect } from 'react-router-dom';
import Layout from '@/layout';
import Exception404 from '@/pages/404';
import { ADMIN_SCOPE, LOGIN_URL } from '@/lib/config';
import { getUserInfo } from '@/apis/auth';
import { userStore } from '@/store/user';

const tokenLoader = async () => {
    const { data, code, errorCode } = await getUserInfo();
    if (!code && errorCode === 10005) {
        // 禁止访问
        return redirect('/404');
    }
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
            },
            {
                index: true,
                path: 'video/correction',
                lazy: async () => ({
                    Component: (await import('@/pages/correction/index'))
                        .default
                })
            },
            {
                index: true,
                path: 'permissions/users',
                lazy: async () => ({
                    Component: (await import('@/pages/user/index')).default
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
