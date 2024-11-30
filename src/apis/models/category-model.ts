export interface VideoCategoryListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface VideoCategoryDeleteReq {
    id: number;
}

export interface VideoCategoryCreateReq {
    category: string;
}
