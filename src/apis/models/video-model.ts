export interface VideoListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
    searchType?: string;
    type?: number[];
    status?: number[];
    year?: number[];
    month?: number[];
    category?: number[];
}

interface Category {
    label: string;
    value: number;
}

export interface VideoItem {
    id: number;
    series_id: number;
    name: string;
    description: string;
    cover_url: string;
    banner_url: string;
    year: number;
    month: number;
    remark?: string;
    status: number;
    type: number;
    cv?: string;
    director?: string;
    created_at: string;
    categories: Category[];
    is_anime_guide: number;
    is_swiper: number;
}

export interface VideoListRes {
    count: number;
    rows: VideoItem[];
}

export interface VideoDeleteReq {
    id: number;
}

export interface VideoCreateReq {
    series_id: number;
    name: string;
    description: string;
    cover_url: string;
    banner_url: string;
    remark?: string;
    status: number;
    season: number;
    season_name?: string;
    type: number;
    director?: string;
    cv?: string;
    year: number;
    month: number;
    category: number[];
}

export interface VideoDetailReq extends VideoDeleteReq {}

export interface VideoDetailRes {
    id: number;
    series_id: number;
    name: string;
    description: string;
    cover_url: string;
    banner_url: string;
    year: number;
    month: number;
    remark?: string;
    status: number;
    season: number;
    season_name?: string;
    score: string;
    score_count: number;
    play_count: string;
    collection_count: number;
    type: number;
    cv?: string;
    director?: string;
    created_at: string;
    categories: { id: number; name: string }[];
    related: {
        id: number;
        name: string;
        status: number;
        type: number;
        year: string;
        month: number;
        cv?: string;
        director?: string;
        cover_url: string;
        banner_url: string;
    }[];
    videos: {
        id: number;
        title: string;
        episode: number;
        url: string;
        play_count: number;
    }[];
}

export interface EpisodeCreateReq {
    id: number;
    title: string;
    episode: number;
    url: string;
}

export interface EpisodeDeleteReq extends VideoDeleteReq {}

export interface VideoEditReq extends VideoCreateReq {
    id: number;
}
