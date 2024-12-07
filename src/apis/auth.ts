import { HttpClient } from '@/lib/request';
import { InfoRes } from '@/apis/models/auth-model';

const prefix = '/v1/api/user';

export const getUserInfo = () => {
    return HttpClient.get<InfoRes>(`${prefix}/info`);
};

export const logout = () => {
    return HttpClient.post('/auth/api/sso/sms_logout');
};
