export interface AnnouncementListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface AnnouncementItem {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export interface AnnouncementListRes {
    count: number;
    rows: AnnouncementItem[];
}

export interface AnnouncementDeleteReq {
    id: number;
}

export interface AnnouncementCreateReq {
    title: string;
    content: string;
}
