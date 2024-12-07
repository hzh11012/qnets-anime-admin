import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CreateAxiosDefaults
} from 'axios';
import { getToken } from '@/lib/token';
import { toast } from '@/hooks/use-toast';
import { RefresherHttpClient } from '@/lib/refresherRequest';
import { LOGIN_URL } from '@/lib/config';

interface ApiRequest<T = any> {
    data: T;
    message?: string;
    msg?: string;
    code?: number;
    errorCode?: number;
}

class AxiosRequest {
    private axiosInstance: AxiosInstance;

    constructor(config: CreateAxiosDefaults) {
        this.axiosInstance = axios.create(config);

        this.interceptorsRequest();
        this.interceptorsResponse();
    }

    // 请求拦截器
    private interceptorsRequest() {
        this.axiosInstance.interceptors.request.use(config => {
            const token = getToken('access_token');
            if (token && config.headers)
                config.headers['Authorization'] = token;

            return config;
        }, Promise.reject);
    }

    // 响应拦截器
    private interceptorsResponse() {
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // 特殊处理damaku的接口
                if (
                    response.data.code !== 200 &&
                    !response.config.url?.includes('danmaku')
                ) {
                    toast({
                        description: response.data.msg || 'failed',
                        duration: 1500
                    });
                    return Promise.reject(response.data);
                }

                return response.data;
            },
            async error => {
                // 当状态码为401时，调用刷新token的方法
                if (error.response?.status === 401) {
                    if (!(await RefresherHttpClient.refresh())) {
                        window.location.reload();
                        window.location.href = `${LOGIN_URL}?redirect=${encodeURIComponent(window.location.href)}`;
                    }

                    return Promise.reject({
                        ...error,
                        isRefresh: true
                    });
                }

                toast({
                    description: error.response.data.msg || 'failed',
                    duration: 1500
                });

                return Promise.reject({
                    ...error,
                    isRefresh: false
                });
            }
        );
    }

    async request<T>(
        axiosRequestConfig: AxiosRequestConfig,
        retryCount: number = 0 // 添加重试计数器参数
    ): Promise<ApiRequest<T>> {
        // 当正在刷新token,将当前请求放入暂存队列中
        if (RefresherHttpClient.isRefreshing) {
            return new Promise((resolve, reject) => {
                RefresherHttpClient.temporaryQueue.push(
                    this.axiosInstance(axiosRequestConfig)
                        .then((res: any) => resolve(res))
                        .catch(reject)
                ); // 最后会在promise.allSettled处执行
            });
        }
        return new Promise(resolve => {
            this.axiosInstance(axiosRequestConfig)
                .catch(error => {
                    // 出现非200状态的错误，就重新发请求，最多重试一次
                    if (retryCount < 1 && error.isRefresh) {
                        return this.request(axiosRequestConfig, retryCount + 1);
                    } else {
                        resolve(error);
                    }
                })
                .then((res: any) => resolve(res));
        });
    }

    async get<T>(
        url: string,
        config: AxiosRequestConfig = {}
    ): Promise<ApiRequest<T>> {
        const res = await this.request<T>({
            ...config,
            url,
            method: 'get'
        });
        return res;
    }

    async post<T>(
        url: string,
        body?: object,
        config?: AxiosRequestConfig
    ): Promise<ApiRequest<T>> {
        const res = await this.request<T>({
            ...config,
            url,
            method: 'post',
            data: body
        });
        return res;
    }
}

export const HttpClient = new AxiosRequest({
    timeout: 30 * 1000
});
