export interface SwiperCreateReq {
    id: number;
}

export interface SwiperListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface SwiperItem {
    id: number;
    anime_id: number;
    title: string;
    description: string;
    banner_url: string;
    type: number;
    created_at: string;
}

export interface SwiperListRes {
    count: number;
    rows: SwiperItem[];
}

export interface SwiperDeleteReq {
    id: number;
}
