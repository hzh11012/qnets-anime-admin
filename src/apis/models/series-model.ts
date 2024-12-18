export interface SeriesListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface SeriesItem {
    id: number;
    name: string;
    created_at: string;
}

export interface SeriesListRes {
    count: number;
    rows: SeriesItem[];
}

export interface SeriesDeleteReq {
    id: number;
}

export interface SeriesCreateReq {
    name: string;
}
