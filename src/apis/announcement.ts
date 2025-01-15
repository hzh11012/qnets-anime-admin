import { HttpClient } from '@/lib/request';
import {
    AnnouncementCreateReq,
    AnnouncementListReq,
    AnnouncementListRes,
    AnnouncementDeleteReq
} from '@/apis/models/announcement-model';

const prefix = '/v1/api/announcement';

export const announcementCreate = (params: AnnouncementCreateReq) => {
    return HttpClient.post(`${prefix}/admin/create`, params);
};

export const getAnnouncementList = (params: AnnouncementListReq) => {
    return HttpClient.post<AnnouncementListRes>(`${prefix}/admin/list`, params);
};

export const announcementDelete = (params: AnnouncementDeleteReq) => {
    return HttpClient.post(`${prefix}/admin/delete`, params);
};
