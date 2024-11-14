import { HttpClient } from '@/lib/request';

export const getUserInfo = () => {
    return HttpClient.get('/v1/api/user/info');
};
