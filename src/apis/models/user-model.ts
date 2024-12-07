export interface UserListReq {
    page?: number;
    pageSize?: number;
    scope?: number[];
    order?: string;
    orderBy?: string;
    keyword?: string;
}

export interface UserItem {
    id: number;
    nickname: string;
    phone: string;
    scope: number;
    avatar?: string;
    created_at: string;
}

export interface UserListRes {
    count: number;
    rows: UserItem[];
}

export interface UserDeleteReq {
    id: number;
}

export interface UserEditReq extends UserDeleteReq {
    nickname: string;
    avatar?: string | null;
    scope: number;
}
