export interface NoticeListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface NoticeItem {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export interface NoticeListRes {
    count: number;
    rows: NoticeItem[];
}

export interface NoticeDeleteReq {
    id: number;
}

export interface NoticeCreateReq {
    title: string;
    content: string;
}
