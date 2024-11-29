import { HttpClient } from '@/lib/request';
import {
    CorrectionListReq,
    CorrectionDeleteReq,
    CorrectionEditReq
} from '@/apis/models/correction-model';

export const getCorrectionList = (params: CorrectionListReq) => {
    return HttpClient.post<any>('/v1/api/correct/admin_list', params);
};

export const correctionDelete = (params: CorrectionDeleteReq) => {
    return HttpClient.post<any>('/v1/api/correct/admin_delete', params);
};

export const correctionEdit = (params: CorrectionEditReq) => {
    return HttpClient.post<any>('/v1/api/correct/admin_edit', params);
};
