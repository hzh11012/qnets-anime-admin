export interface CorrectionListReq {
    page?: number;
    pageSize?: number;
    status?: number[];
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface CorrectionItem {
    id: number;
    uid: number;
    status: number;
    nickname: string;
    message: string;
    created_at: string;
}

export interface CorrectionListRes {
    count: number;
    rows: CorrectionItem[];
}

export interface CorrectionDeleteReq {
    id: number;
}

export interface CorrectionEditReq extends CorrectionDeleteReq {
    message: string;
    status: number;
}
