import { HttpClient } from '@/lib/request';
import {
    UserListReq,
    UserListRes,
    UserDeleteReq,
    UserEditReq
} from '@/apis/models/user-model';

const prefix = '/v1/api/user';

export const getUserList = (params: UserListReq) => {
    return HttpClient.post<UserListRes>(`${prefix}/admin/list`, params);
};

export const userDelete = (params: UserDeleteReq) => {
    return HttpClient.post(`${prefix}/admin/delete`, params);
};

export const userEdit = (params: UserEditReq) => {
    return HttpClient.post(`${prefix}/admin/edit`, params);
};
