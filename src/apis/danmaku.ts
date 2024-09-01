import { HttpClient } from '@/lib/request';
import { DanmakuListReq } from '@/apis/models/danmaku-model';

export const DanmakuList = (params: DanmakuListReq) => {
    return HttpClient.get('/danmaku/', { params });
};
