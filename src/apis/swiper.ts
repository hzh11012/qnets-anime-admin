import { HttpClient } from '@/lib/request';
import {
    SwiperCreateReq,
    SwiperListReq,
    SwiperListRes,
    SwiperDeleteReq
} from '@/apis/models/swiper-model';

const prefix = '/v1/api/anime_banner';

export const swiperCreate = (params: SwiperCreateReq) => {
    return HttpClient.post(`${prefix}/admin/create`, params);
};

export const getSwiperList = (params: SwiperListReq) => {
    return HttpClient.post<SwiperListRes>(`${prefix}/admin/list`, params);
};

export const swiperDelete = (params: SwiperDeleteReq) => {
    return HttpClient.post(`${prefix}/admin/delete`, params);
};
