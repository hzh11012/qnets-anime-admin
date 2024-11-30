import { HttpClient } from '@/lib/request';
import {
    VideoCategoryListReq,
    VideoCategoryDeleteReq,
    VideoCategoryCreateReq
} from '@/apis/models/category-model';

export const getVideoCategoryList = (params: VideoCategoryListReq) => {
    return HttpClient.post<any>('/v1/api/video_category/admin_list', params);
};

export const videoCategoryDelete = (params: VideoCategoryDeleteReq) => {
    return HttpClient.post<any>('/v1/api/video_category/admin_delete', params);
};

export const videoCategoryCreate = (params: VideoCategoryCreateReq) => {
    return HttpClient.post<any>('/v1/api/video_category/admin_create', params);
};
