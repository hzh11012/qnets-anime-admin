import { HttpClient } from '@/lib/request';
import {
    CorrectionListReq,
    CorrectionListRes,
    CorrectionDeleteReq,
    CorrectionEditReq
} from '@/apis/models/correction-model';

const prefix = '/v1/api/correct';

export const getCorrectionList = (params: CorrectionListReq) => {
    return HttpClient.post<CorrectionListRes>(`${prefix}/admin_list`, params);
};

export const correctionDelete = (params: CorrectionDeleteReq) => {
    return HttpClient.post(`${prefix}/admin_delete`, params);
};

export const correctionEdit = (params: CorrectionEditReq) => {
    return HttpClient.post(`${prefix}/admin_edit`, params);
};
