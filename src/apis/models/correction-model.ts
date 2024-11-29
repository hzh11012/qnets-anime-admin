export interface CorrectionListReq {
    page?: number;
    pageSize?: number;
    status?: number[];
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface CorrectionDeleteReq {
    id: number;
}

export interface CorrectionEditReq extends CorrectionDeleteReq {
    message: string;
    status: number;
}
