export interface NoticeRecordListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
    status?: number[];
}

export interface NoticeRecordItem {
    id: number;
    uid: number;
    nid: number;
    nickname: string;
    title: string;
    content: string;
    status: number;
    created_at: string;
}

export interface NoticeRecordListRes {
    count: number;
    rows: NoticeRecordItem[];
}

export interface NoticeRecordDeleteReq {
    id: number;
}
