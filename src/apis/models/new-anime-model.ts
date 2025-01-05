export interface NewAnimeCreateReq {
    id: number;
    update_day: number;
    update_time: string;
}

export interface NewAnimeListReq {
    page?: number;
    pageSize?: number;
    update_day?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface NewAnimeItem {
    id: number;
    aid: number;
    update_day: number;
    update_time: string;
    title: string;
    description: string;
    cover_url: string;
    status: number;
    remark: string | null;
    created_at: string;
    latest_video: {
        id: number;
        episode: number;
    };
}

export interface NewAnimeListRes {
    count: number;
    rows: NewAnimeItem[];
}

export interface NewAnimeDeleteReq {
    id: number;
}
