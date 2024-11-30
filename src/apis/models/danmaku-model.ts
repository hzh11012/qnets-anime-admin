export interface DanmakuListReq {
    page?: number;
    pageSize?: number;
    keyword?: string;
}

export interface DanmakuDeleteReq {
    id: string;
}
