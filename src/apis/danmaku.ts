import { HttpClient } from '@/lib/request';
import { DanmakuListReq, DanmakuDeleteReq } from '@/apis/models/danmaku-model';

export const getDanmakuList = (params: DanmakuListReq) => {
    return HttpClient.post('/v1/api/danmaku/list', params);
};

export const danmakuDelete = (params: DanmakuDeleteReq) => {
    return HttpClient.post('/v1/api/danmaku/delete', params);
};
