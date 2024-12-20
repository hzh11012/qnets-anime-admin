export interface VideoListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
    searchType?: string;
    type?: number[];
    status?: number[];
    year?: string[];
    month?: number[];
    category?: number[];
}

interface Category {
    label: string;
    value: number;
}

export interface VideoItem {
    id: number;
    sid: number;
    name: string;
    description: string;
    cover_url: string;
    banner_url: string;
    year: string;
    month: number;
    remark?: string;
    status: number;
    type: number;
    cv?: string;
    director?: string;
    created_at: string;
    category: Category[];
}

export interface VideoListRes {
    count: number;
    rows: VideoItem[];
}

export interface VideoDeleteReq {
    id: number;
}

export interface VideoCreateReq {
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
    year: string;
    month: number;
    category: number[];
}

export interface VideoDetailReq extends VideoDeleteReq {}

export interface VideoDetailRes {
    id: number;
    sid: number;
    name: string;
    description: string;
    cover_url: string;
    banner_url: string;
    year: string;
    month: number;
    remark?: string;
    status: number;
    season: number;
    season_name?: string;
    type: number;
    cv?: string;
    director?: string;
    created_at: string;
    categories: { id: number; category: string }[];
    related: {
        id: number;
        name: string;
        status: number;
        type: number;
        cover_url: string;
    }[];
    video: {}[];
}
