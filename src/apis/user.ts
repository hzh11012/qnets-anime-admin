import { HttpClient } from '@/lib/request';
import {
    UserListReq,
    UserDeleteReq,
    UserEditReq
} from '@/apis/models/user-model';

export const getUserList = (params: UserListReq) => {
    return HttpClient.post<any>('/v1/api/user/admin_list', params);
};

export const userDelete = (params: UserDeleteReq) => {
    return HttpClient.post<any>('/v1/api/user/admin_delete', params);
};

export const userEdit = (params: UserEditReq) => {
    return HttpClient.post<any>('/v1/api/user/admin_edit', params);
};
