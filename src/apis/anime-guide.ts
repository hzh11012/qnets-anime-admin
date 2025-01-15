import { HttpClient } from '@/lib/request';
import {
    AnimeGuideCreateReq,
    AnimeGuideListReq,
    AnimeGuideListRes,
    AnimeGuideDeleteReq
} from '@/apis/models/anime-guide-model';

const prefix = '/v1/api/anime_guide';

export const animeGuideCreate = (params: AnimeGuideCreateReq) => {
    return HttpClient.post(`${prefix}/admin/create`, params);
};

export const getAnimeGuideList = (params: AnimeGuideListReq) => {
    return HttpClient.post<AnimeGuideListRes>(`${prefix}/list`, params);
};

export const animeGuideDelete = (params: AnimeGuideDeleteReq) => {
    return HttpClient.post(`${prefix}/admin/delete`, params);
};
