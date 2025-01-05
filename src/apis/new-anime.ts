import { HttpClient } from '@/lib/request';
import {
    NewAnimeCreateReq,
    NewAnimeListReq,
    NewAnimeListRes,
    NewAnimeDeleteReq
} from '@/apis/models/new-anime-model';

const prefix = '/v1/api/new_anime';

export const newAnimeCreate = (params: NewAnimeCreateReq) => {
    return HttpClient.post(`${prefix}/admin_create`, params);
};

export const getNewAnimeList = (params: NewAnimeListReq) => {
    return HttpClient.post<NewAnimeListRes>(`${prefix}/list`, params);
};

export const newAnimeDelete = (params: NewAnimeDeleteReq) => {
    return HttpClient.post(`${prefix}/admin_delete`, params);
};
