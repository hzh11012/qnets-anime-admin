import { VideoDetailRes } from '@/apis/models/video-model';
import { Layout } from '@/components/layout';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, formateNumber } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
    NavLink,
    useLoaderData,
    useNavigate,
    useParams
} from 'react-router-dom';
import VideoCreate from '@/pages/video/detail/video-create';
import EpisodeButton from '@/pages/video/detail/episode-button';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import AnimeEdit from './anime-edit';
import { getVideoCategoryList } from '@/apis/category';
import { getSeriesList } from '@/apis/series';

const VideoDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();
    const data = useLoaderData<VideoDetailRes>();

    //  0-即将上线 1-连载中 2-已完结
    const StatusMap: { [key: number]: string } = {
        0: t('video.status.coming'),
        1: t('video.status.serializing'),
        2: t('video.status.completed')
    };

    //  0-一月番 1-四月番 2-七月番 3-十月番
    const MonthMap: { [key: number]: string } = {
        0: t('video.month.jan'),
        1: t('video.month.apr'),
        2: t('video.month.jul'),
        3: t('video.month.oct')
    };

    //  0-剧场版 1-日番 2-美番 3-国番 4-里番
    const TypeMap: { [key: number]: string } = {
        0: t('video.type.ova'),
        1: t('video.type.japan'),
        2: t('video.type.american'),
        3: t('video.type.china'),
        4: t('video.type.hentai')
    };

    const [categoriesList, setCategoriesList] = useState<
        { label: string; value: number }[]
    >([]);

    const [seriesList, setSeriesList] = useState<
        { label: string; value: number }[]
    >([]);

    useRequest(getVideoCategoryList, {
        defaultParams: [
            {
                page: 1,
                pageSize: 999
            }
        ],
        onSuccess(data) {
            const { rows } = data.data;
            const res = rows.map(item => {
                return {
                    label: item.category,
                    value: item.id
                };
            });
            setCategoriesList(res);
        }
    });

    useRequest(getSeriesList, {
        defaultParams: [
            {
                page: 1,
                pageSize: 999
            }
        ],
        onSuccess(data) {
            const { rows } = data.data;
            const res = rows.map(item => {
                return {
                    label: item.name,
                    value: item.id
                };
            });
            setSeriesList(res);
        }
    });

    const handleRelatedClick = (id: number) => {
        navigate(`/video/detail/${id}`);
    };

    const handleRefresh = () => {
        navigate(`/video/detail/${id}`);
    };

    const {
        name,
        cover_url,
        score,
        score_count,
        collection_count,
        play_count,
        related,
        categories,
        status,
        year,
        month,
        type,
        cv,
        director,
        videos,
        description
    } = data;

    return (
        <Layout className={cn('h-full')}>
            <Card className={cn('border-none shadow-none h-full')}>
                <CardHeader>
                    <div
                        className={cn(
                            'flex items-center justify-between space-x-2'
                        )}
                    >
                        <Breadcrumb>
                            <BreadcrumbList className={cn('flex-nowrap')}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <NavLink
                                            to="/video"
                                            className={cn('text-nowrap')}
                                        >
                                            {t('menu.video.list')}
                                        </NavLink>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage
                                        className={cn('line-clamp-1')}
                                    >
                                        {name}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <AnimeEdit
                            aid={Number(id)}
                            series={seriesList}
                            onRefresh={handleRefresh}
                            {...data}
                            category={data.categories.map(item => item.id)}
                            categories={categoriesList}
                        />
                    </div>
                </CardHeader>
                <CardContent className={cn('md:space-y-6 space-y-4')}>
                    <div className={cn('flex md:gap-6 gap-4 max-h-[373px]')}>
                        <div className={cn('w-1/4 max-w-[280px] min-w-32')}>
                            <AspectRatio ratio={3 / 4}>
                                <img
                                    src={cover_url}
                                    loading="lazy"
                                    className={cn(
                                        'block rounded-md object-cover size-full brightness-90'
                                    )}
                                />
                            </AspectRatio>
                        </div>
                        <div className={cn('flex-1 space-y-3')}>
                            <h3
                                className={cn(
                                    'md:line-clamp-1 md:text-2xl text-lg line-clamp-1 break-all'
                                )}
                            >
                                {name}
                            </h3>
                            <div
                                className={cn(
                                    'gap-2 hidden md:flex leading-4 flex-wrap'
                                )}
                            >
                                {categories.map(item => {
                                    return (
                                        <Badge
                                            key={item.id}
                                            variant="secondary"
                                        >
                                            {item.category}
                                        </Badge>
                                    );
                                })}
                            </div>
                            <div
                                className={cn(
                                    'md:text-sm text-xs text-muted-foreground space-y-3'
                                )}
                            >
                                <div className={cn(' md:hidden')}>
                                    {categories.map((item, index) => {
                                        if (index === 0) {
                                            return item.category;
                                        }
                                        return `/${item.category}`;
                                    })}
                                </div>
                                <div>
                                    {TypeMap[type]}
                                    &nbsp;·&nbsp;
                                    {year}
                                    &nbsp;·&nbsp;
                                    {MonthMap[month]}
                                    &nbsp;·&nbsp;
                                    {StatusMap[status]}
                                </div>
                                {director && (
                                    <div className={cn('line-clamp-1')}>
                                        导演：{director}
                                    </div>
                                )}
                                {cv && (
                                    <div
                                        className={cn(
                                            'md:line-clamp-2 line-clamp-none'
                                        )}
                                    >
                                        声优：{cv}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={cn('xl:block hidden')}>
                            <div
                                className={cn(
                                    'rounded-md space-y-6 p-6 h-fit bg-muted'
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex items-center gap-2 text-3xl text-[#ffac2d] font-bold'
                                    )}
                                >
                                    {score || '0.0'}
                                    <span
                                        className={cn('text-sm text-primary')}
                                    >
                                        {t('video.detail.rating')}
                                    </span>
                                </div>
                                <div
                                    className={cn(
                                        'flex flex-col text-xs gap-2 text-muted-foreground'
                                    )}
                                >
                                    <span>
                                        {t('video.detail.play_count')}：
                                        {formateNumber(Number(play_count))}
                                    </span>
                                    <span>
                                        {t('video.detail.rating_count')}：
                                        {formateNumber(score_count)}
                                    </span>
                                    <span>
                                        {t('video.detail.collection_count')}：
                                        {formateNumber(collection_count)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={cn(
                            'md:text-sm text-xs text-muted-foreground'
                        )}
                    >
                        {t('video.detail.description')}：{description}
                    </div>
                    <div
                        className={cn(
                            'rounded-md p-4 h-fit bg-muted xl:hidden flex items-center justify-between'
                        )}
                    >
                        <div
                            className={cn(
                                'flex items-center gap-2 md:text-3xl text-2xl text-[#ffac2d] font-bold'
                            )}
                        >
                            {score || '0.0'}
                            <span
                                className={cn(
                                    'md:text-sm text-xs text-primary'
                                )}
                            >
                                {t('video.detail.rating')}
                            </span>
                        </div>
                        <div
                            className={cn(
                                'flex md:text-sm text-xs text-muted-foreground md:gap-4 gap-2'
                            )}
                        >
                            <div className={cn('flex flex-col items-center')}>
                                <span>{t('video.detail.play_count')}</span>
                                <span>{formateNumber(Number(play_count))}</span>
                            </div>
                            <div className={cn('flex flex-col items-center')}>
                                <span>{t('video.detail.rating_count')}</span>
                                <span>
                                    {formateNumber(Number(score_count))}
                                </span>
                            </div>
                            <div className={cn('flex flex-col items-center')}>
                                <span>
                                    {t('video.detail.collection_count')}
                                </span>
                                <span>
                                    {formateNumber(Number(collection_count))}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={cn('md:text-sm text-xs space-y-3')}>
                        <div
                            className={cn('flex items-center justify-between')}
                        >
                            <h3 className={cn('font-bold text-base')}>
                                {t('video.detail.episode')}
                            </h3>
                            <VideoCreate
                                aid={Number(id)}
                                onRefresh={handleRefresh}
                            />
                        </div>
                        {videos.length ? (
                            <ScrollArea
                                className={cn('max-h-[360px] md:max-h-[600px]')}
                            >
                                <div className={cn('flex flex-wrap gap-4')}>
                                    {videos.map(item => {
                                        return (
                                            <EpisodeButton
                                                onRefresh={handleRefresh}
                                                key={item.id}
                                                {...item}
                                            />
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div
                                className={cn(
                                    'inline-block text-muted-foreground'
                                )}
                            >
                                {t('video.detail.episode_empty')}
                            </div>
                        )}
                    </div>
                    {!!related.length && (
                        <div className={cn('md:text-sm text-xs space-y-3')}>
                            <h3 className={cn('font-bold text-base')}>
                                {t('video.detail.related_anime')}
                            </h3>
                            <ScrollArea
                                className={cn('max-h-[360px] md:max-h-[600px]')}
                            >
                                <div className={cn('space-y-4')}>
                                    {related.map(item => {
                                        const {
                                            id,
                                            name,
                                            year,
                                            month,
                                            director,
                                            cv,
                                            status,
                                            banner_url
                                        } = item;
                                        return (
                                            <div
                                                key={id}
                                                className={cn(
                                                    'flex gap-4 cursor-pointer'
                                                )}
                                                onClick={() =>
                                                    handleRelatedClick(id)
                                                }
                                            >
                                                <div className={cn('w-36')}>
                                                    <AspectRatio
                                                        ratio={16 / 10}
                                                    >
                                                        <img
                                                            src={banner_url}
                                                            loading="lazy"
                                                            className={cn(
                                                                'block rounded-md object-cover size-full brightness-90'
                                                            )}
                                                        />
                                                    </AspectRatio>
                                                </div>
                                                <div
                                                    className={cn(
                                                        'flex flex-1 flex-col justify-between text-sm leading-4'
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            'line-clamp-1 hover:text-[#1677ff]'
                                                        )}
                                                    >
                                                        {name}
                                                    </div>
                                                    <div
                                                        className={cn(
                                                            'text-xs text-muted-foreground space-y-2'
                                                        )}
                                                    >
                                                        <div
                                                            className={cn(
                                                                'line-clamp-1'
                                                            )}
                                                        >
                                                            {year}
                                                            &nbsp;·&nbsp;
                                                            {MonthMap[month]}
                                                            &nbsp;·&nbsp;
                                                            {StatusMap[status]}
                                                        </div>
                                                        {director && (
                                                            <div
                                                                className={cn(
                                                                    'line-clamp-1'
                                                                )}
                                                            >
                                                                {t(
                                                                    'video.detail.director'
                                                                )}
                                                                ：{director}
                                                            </div>
                                                        )}
                                                        {cv && (
                                                            <div
                                                                className={cn(
                                                                    'line-clamp-1'
                                                                )}
                                                            >
                                                                {t(
                                                                    'video.detail.cv'
                                                                )}
                                                                ：{cv}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Layout>
    );
};

export default VideoDetail;
