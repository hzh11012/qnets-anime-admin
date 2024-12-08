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
    name: string;
    description: string;
    cover: string;
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
    cover: string;
    remark?: string;
    status: number;
    type: number;
    director?: string;
    cv?: string;
    year: string;
    month: number;
    category: number[];
}
