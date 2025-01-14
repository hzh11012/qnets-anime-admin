export interface MessageListReq {
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    type?: number[];
    status?: number[];
    keyword?: string;
}

export interface MessageItem {
    id: number;
    user_id: number;
    nickname: string;
    content: string;
    reply_content?: string;
    type: number;
    status: number;
    created_at: string;
}

export interface MessageListRes {
    count: number;
    rows: MessageItem[];
}

export interface MessageDeleteReq {
    id: number;
}

export interface MessageEditReq extends MessageDeleteReq {
    reply_content: string;
    status: number;
}
