export interface AnimeGuideCreateReq {
    id: number;
    update_day: number;
    update_time: string;
}

export interface AnimeGuideListReq {
    page?: number;
    pageSize?: number;
    update_day?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface AnimeGuideItem {
    id: number;
    anime_id: number;
    update_day: number;
    update_time: string;
    title: string;
    description: string;
    cover_url: string;
    status: number;
    remark: string | null;
    created_at: string;
    latest_video: {
        id: number;
        episode: number;
    };
}

export interface AnimeGuideListRes {
    count: number;
    rows: AnimeGuideItem[];
}

export interface AnimeGuideDeleteReq {
    id: number;
}
