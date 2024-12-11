export interface RatingListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface RatingItem {
    id: number;
    uid: number;
    aid: number;
    nickname: string;
    score: number;
    content: string;
    anime: {
        name: string;
        cover: string;
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
