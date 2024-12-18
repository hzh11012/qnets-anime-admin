import { HttpClient } from '@/lib/request';
import {
    SeriesListReq,
    SeriesListRes,
    SeriesCreateReq,
    SeriesDeleteReq
} from '@/apis/models/series-model';

const prefix = '/v1/api/series';

export const getSeriesList = (params: SeriesListReq) => {
    return HttpClient.post<SeriesListRes>(`${prefix}/admin_list`, params);
};

export const seriesDelete = (params: SeriesDeleteReq) => {
    return HttpClient.post(`${prefix}/admin_delete`, params);
};

export const seriesCreate = (params: SeriesCreateReq) => {
    return HttpClient.post(`${prefix}/admin_create`, params);
};
