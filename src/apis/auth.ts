import { HttpClient } from '@/lib/request';

export const getUserInfo = () => {
    return HttpClient.get<any>('/v1/api/user/info');
};

export const logout = () => {
    return HttpClient.post<any>('/auth/api/sso/sms_logout');
};
