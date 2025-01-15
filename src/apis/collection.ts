import { HttpClient } from '@/lib/request';
import {
    CollectionListReq,
    CollectionListRes,
    CollectionDeleteReq
} from '@/apis/models/collection-model';

const prefix = '/v1/api/collection';

export const getCollectionList = (params: CollectionListReq) => {
    return HttpClient.post<CollectionListRes>(`${prefix}/admin/list`, params);
};

export const collectionDelete = (params: CollectionDeleteReq) => {
    return HttpClient.post(`${prefix}/admin/delete`, params);
};
