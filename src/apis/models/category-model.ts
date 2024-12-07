export interface VideoCategoryListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface VideoCategoryItem {
    id: number;
    category: string;
    created_at: string;
}

export interface VideoCategoryListRes {
    count: number;
    rows: VideoCategoryItem[];
}

export interface VideoCategoryDeleteReq {
    id: number;
}

export interface VideoCategoryCreateReq {
    category: string;
}
