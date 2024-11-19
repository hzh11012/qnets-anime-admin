export interface UserListReq {
    page?: number;
    pageSize?: number;
    scope?: number[];
    order?: string;
    orderBy?: string;
    keyword?: string;
}
