import { createBrowserRouter, RouteObject, redirect } from 'react-router-dom';
import { ADMIN_SCOPE, LOGIN_URL } from '@/lib/config';
import { getUserInfo } from '@/apis/auth';
import { userStore } from '@/store/user';
import Layout from '@/layout';
import Exception404 from '@/pages/404';

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
                path: 'video/',
                children: [
                    {
                        index: true,
                        path: 'index',
                        lazy: async () => ({
                            Component: (await import('@/pages/video/index'))
                                .default
                        })
                    },
                    {
                        index: true,
                        path: 'category',
                        lazy: async () => ({
                            Component: (await import('@/pages/category/index'))
                                .default
                        })
                    },
                    {
                        index: true,
                        path: 'danmaku',
                        lazy: async () => ({
                            Component: (await import('@/pages/danmaku/index'))
                                .default
                        })
                    },
                    {
                        index: true,
                        path: 'correction',
                        lazy: async () => ({
                            Component: (
                                await import('@/pages/correction/index')
                            ).default
                        })
                    }
                ]
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
