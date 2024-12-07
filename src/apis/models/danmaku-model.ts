export interface DanmakuListReq {
    page?: number;
    pageSize?: number;
    keyword?: string;
}

export interface DanmakuItem {
    id: string;
    ip: string;
    color: string;
    content: string;
    del_id: string;
    source: string;
    time_dot: string;
    created_at: string;
}

export interface DanmakuListRes {
    count: number;
    rows: DanmakuItem[];
}

export interface DanmakuDeleteReq {
    id: string;
}
