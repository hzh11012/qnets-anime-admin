export interface UserListReq {
    page?: number;
    pageSize?: number;
    scope?: number[];
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface UserDeleteReq {
    id: number;
}

export interface UserEditReq extends UserDeleteReq {
    nickname: string;
    avatar?: string | null;
    scope: number;
}
