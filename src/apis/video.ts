import { HttpClient } from '@/lib/request';
import {
    VideoListReq,
    VideoListRes,
    VideoCreateReq,
    VideoEditReq,
    VideoDeleteReq,
    VideoDetailReq,
    VideoDetailRes,
    EpisodeCreateReq,
    EpisodeDeleteReq
} from '@/apis/models/video-model';

const prefix = '/v1/api/anime';
const episode_prefix = '/v1/api/video';

export const getVideoList = (params: VideoListReq) => {
    return HttpClient.post<VideoListRes>(`${prefix}/list`, params);
};

export const videoCreate = (params: VideoCreateReq) => {
    return HttpClient.post(`${prefix}/admin/create`, params);
};

export const videoDelete = (params: VideoDeleteReq) => {
    return HttpClient.post(`${prefix}/admin/delete`, params);
};

export const videoEdit = (params: VideoEditReq) => {
    return HttpClient.post(`${prefix}/admin/edit`, params);
};

export const getVideoDetail = (params: VideoDetailReq) => {
    return HttpClient.post<VideoDetailRes>(`${prefix}/admin/detail`, params);
};

export const episodeCreate = (params: EpisodeCreateReq) => {
    return HttpClient.post(`${episode_prefix}/admin/create`, params);
};

export const episodeDelete = (params: EpisodeDeleteReq) => {
    return HttpClient.post(`${episode_prefix}/admin/delete`, params);
};
