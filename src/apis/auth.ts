import { HttpClient } from '@/lib/request';
import { ILogin } from '@/apis/models/auth-model';

export const getUserInfo = () => {
    return HttpClient.get('/v1/api/admin/info');
};

export const postUserLogin = (params: ILogin) => {
    return HttpClient.post('/v1/api/admin/login', { ...params });
};
