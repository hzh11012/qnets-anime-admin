import { HttpClient } from '@/lib/request';
import {
    VideoCategoryListReq,
    VideoCategoryListRes,
    VideoCategoryDeleteReq,
    VideoCategoryCreateReq
} from '@/apis/models/category-model';

const prefix = '/v1/api/category';

export const getVideoCategoryList = (params: VideoCategoryListReq) => {
    return HttpClient.post<VideoCategoryListRes>(
        `${prefix}/admin/list`,
        params
    );
};

export const videoCategoryDelete = (params: VideoCategoryDeleteReq) => {
    return HttpClient.post(`${prefix}/admin/delete`, params);
};

export const videoCategoryCreate = (params: VideoCategoryCreateReq) => {
    return HttpClient.post(`${prefix}/admin/create`, params);
};
