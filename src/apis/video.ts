import { HttpClient } from '@/lib/request';
import {
    VideoListReq,
    VideoListRes,
    VideoCreateReq,
    VideoDeleteReq,
    VideoDetailReq,
    VideoDetailRes
} from '@/apis/models/video-model';

const prefix = '/v1/api/anime';

export const getVideoList = (params: VideoListReq) => {
    return HttpClient.post<VideoListRes>(`${prefix}/list`, params);
};

export const videoCreate = (params: VideoCreateReq) => {
    return HttpClient.post(`${prefix}/admin_create`, params);
};

export const videoDelete = (params: VideoDeleteReq) => {
    return HttpClient.post(`${prefix}/admin_delete`, params);
};

export const getVideoDetail = (params: VideoDetailReq) => {
    return HttpClient.post<VideoDetailRes>(`${prefix}/admin_detail`, params);
};
