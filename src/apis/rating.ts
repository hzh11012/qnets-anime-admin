import { HttpClient } from '@/lib/request';
import {
    RatingListReq,
    RatingListRes,
    RatingDeleteReq
} from '@/apis/models/rating-model';

const prefix = '/v1/api/rating';

export const getRatingList = (params: RatingListReq) => {
    return HttpClient.post<RatingListRes>(`${prefix}/admin_list`, params);
};

export const ratingDelete = (params: RatingDeleteReq) => {
    return HttpClient.post(`${prefix}/admin_delete`, params);
};
