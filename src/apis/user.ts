import { HttpClient } from '@/lib/request';
import { UserListReq } from './models/user-model';

export const getUserList = (params: UserListReq) => {
    return HttpClient.post<any>('/v1/api/user/list', params);
};
