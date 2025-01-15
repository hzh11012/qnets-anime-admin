export interface RatingListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface RatingItem {
    id: number;
    user_id: number;
    anime_id: number;
    nickname: string;
    score: number;
    content: string;
    anime: {
        name: string;
        cover_url: string;
        status: number;
        type: number;
        remark?: string;
    };
    created_at: string;
}

export interface RatingListRes {
    count: number;
    rows: RatingItem[];
}

export interface RatingDeleteReq {
    id: number;
}
