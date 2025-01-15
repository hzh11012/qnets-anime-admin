import { createBrowserRouter, RouteObject, redirect } from 'react-router-dom';
import { ADMIN_SCOPE, LOGIN_URL } from '@/lib/config';
import { getUserInfo } from '@/apis/auth';
import { userStore } from '@/store/user';
import Layout from '@/layout';
import Exception404 from '@/pages/404';
import { getVideoDetail } from '@/apis/video';
import { Loading } from '@/components/custom/loading';

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

const videoDetailLoader = async ({ params }: { params: any }) => {
    const { id } = params;
    const { data, code, errorCode } = await getVideoDetail({ id: Number(id) });
    if (!code || errorCode) {
        // 禁止访问
        return redirect('/404');
    }
    return data;
};

const staticRoutes: RouteObject[] = [
    {
        path: '/',
        loader: tokenLoader,
        element: <Layout />,
        hydrateFallbackElement: <Loading />,
        children: [
            {
                index: true,
                path: '',
                lazy: async () => ({
                    Component: (await import('@/pages/dashboard/index')).default
                })
            },
            {
                path: 'anime-guide',
                lazy: async () => ({
                    Component: (await import('@/pages/anime-guide/index')).default
                })
            },
            {
                path: 'swiper',
                lazy: async () => ({
                    Component: (await import('@/pages/swiper/index')).default
                })
            },
            {
                path: 'announcement',
                lazy: async () => ({
                    Component: (await import('@/pages/announcement/index')).default
                })
            },
            {
                path: 'message',
                lazy: async () => ({
                    Component: (await import('@/pages/message/index')).default
                })
            },
            {
                path: 'video/',
                children: [
                    {
                        path: 'series',
                        lazy: async () => ({
                            Component: (await import('@/pages/series/index'))
                                .default
                        })
                    },
                    {
                        index: true,
                        path: '',
                        lazy: async () => ({
                            Component: (await import('@/pages/video/index'))
                                .default
                        })
                    },
                    {
                        path: 'detail/:id',
                        loader: videoDetailLoader,
                        lazy: async () => ({
                            Component: (
                                await import('@/pages/video/detail/index')
                            ).default
                        })
                    },
                    {
                        path: 'category',
                        lazy: async () => ({
                            Component: (await import('@/pages/category/index'))
                                .default
                        })
                    },
                    {
                        path: 'danmaku',
                        lazy: async () => ({
                            Component: (await import('@/pages/danmaku/index'))
                                .default
                        })
                    }
                ]
            },
            {
                path: 'user/',
                children: [
                    {
                        index: true,
                        path: '',
                        lazy: async () => ({
                            Component: (await import('@/pages/user/index'))
                                .default
                        })
                    },
                    {
                        path: 'collection',
                        lazy: async () => ({
                            Component: (
                                await import('@/pages/collection/index')
                            ).default
                        })
                    },
                    {
                        path: 'rating',
                        lazy: async () => ({
                            Component: (await import('@/pages/rating/index'))
                                .default
                        })
                    }
                ]
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
