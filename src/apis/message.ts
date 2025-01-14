import { HttpClient } from '@/lib/request';
import {
    MessageListReq,
    MessageListRes,
    MessageDeleteReq,
    MessageEditReq
} from '@/apis/models/message-model';

const prefix = '/v1/api/message';

export const getMessageList = (params: MessageListReq) => {
    return HttpClient.post<MessageListRes>(`${prefix}/admin/list`, params);
};

export const messageDelete = (params: MessageDeleteReq) => {
    return HttpClient.post(`${prefix}/admin/delete`, params);
};

export const messageEdit = (params: MessageEditReq) => {
    return HttpClient.post(`${prefix}/admin/edit`, params);
};
