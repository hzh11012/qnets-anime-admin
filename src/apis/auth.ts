import { HttpClient } from '@/lib/request';

export const getUserInfo = () => {
    return HttpClient.get<any>('/v1/api/user/info');
};
