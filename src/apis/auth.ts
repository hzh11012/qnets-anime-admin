import { HttpClient } from '@/lib/request';
import { InfoRes } from '@/apis/models/auth-model';

export const getUserInfo = () => {
    return HttpClient.get<InfoRes>('/v1/api/user/info');
};

export const logout = () => {
    return HttpClient.post('/auth/api/sso/sms_logout');
};
