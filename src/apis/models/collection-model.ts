export interface CollectionListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface CollectionItem {
    id: number;
    user_id: number;
    anime_id: number;
    nickname: string;
    anime: {
        name: string;
        cover_url: string;
        status: number;
        type: number;
        remark?: string;
    };
    created_at: string;
}

export interface CollectionListRes {
    count: number;
    rows: CollectionItem[];
}

export interface CollectionDeleteReq {
    id: number;
}
