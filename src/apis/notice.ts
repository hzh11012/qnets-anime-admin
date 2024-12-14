import { HttpClient } from '@/lib/request';
import {
    NoticeCreateReq,
    NoticeListReq,
    NoticeListRes,
    NoticeDeleteReq
} from '@/apis/models/notice-model';

const prefix = '/v1/api/notice';

export const noticeCreate = (params: NoticeCreateReq) => {
    return HttpClient.post(`${prefix}/admin_create`, params);
};

export const getNoticeList = (params: NoticeListReq) => {
    return HttpClient.post<NoticeListRes>(`${prefix}/admin_list`, params);
};

export const noticeDelete = (params: NoticeDeleteReq) => {
    return HttpClient.post(`${prefix}/admin_delete`, params);
};
