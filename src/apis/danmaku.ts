import { HttpClient } from '@/lib/request';
import {
    DanmakuListReq,
    DanmakuDeleteReq,
    DanmakuListRes
} from '@/apis/models/danmaku-model';

const prefix = '/v1/api/danmaku';

export const getDanmakuList = (params: DanmakuListReq) => {
    return HttpClient.post<DanmakuListRes>(`${prefix}/list`, params);
};

export const danmakuDelete = (params: DanmakuDeleteReq) => {
    return HttpClient.post(`${prefix}/delete`, params);
};
