import { HttpClient } from '@/lib/request';
import {
    NoticeRecordListReq,
    NoticeRecordListRes,
    NoticeRecordDeleteReq
} from '@/apis/models/notice-record-model';

const prefix = '/v1/api/notice_record';

export const getNoticeRecordList = (params: NoticeRecordListReq) => {
    return HttpClient.post<NoticeRecordListRes>(`${prefix}/admin_list`, params);
};

export const noticeRecordDelete = (params: NoticeRecordDeleteReq) => {
    return HttpClient.post(`${prefix}/admin_delete`, params);
};
