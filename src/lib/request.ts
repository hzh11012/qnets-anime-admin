import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CreateAxiosDefaults,
    InternalAxiosRequestConfig
} from 'axios';
import { userStore } from '@/store/user';
import { toast } from '@/hooks/use-toast';

interface ApiRequest<T = any> {
    data: T;
    message: string;
    code: number;
}

class Request {
    public instance: AxiosInstance;

    private readonly abortControllerMap: Map<string, AbortController>;

    constructor(config: CreateAxiosDefaults) {
        this.instance = axios.create(config);

        this.abortControllerMap = new Map();

        // 请求拦截器
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = userStore.getState().token;
                if (token && config.headers)
                    config.headers['Authorization'] = token;

                const controller = new AbortController();
                const url = config.url || '';
                config.signal = controller.signal;
                this.abortControllerMap.set(url, controller);

                return config;
            },
            Promise.reject
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                const url = response.config.url || '';
                this.abortControllerMap.delete(url);

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
            err => {
                toast({
                    description: err.response.data.msg || 'failed',
                    duration: 1500
                });

                // 权限不够，直接重定向到登录页
                if (
                    err.response?.status === 401 ||
                    err.response?.status === 403
                ) {
                    window.localStorage.clear();
                    window.location.reload();
                    window.location.href = `${window.location.origin}/login`;
                }

                return Promise.reject(err);
            }
        );
    }

    get<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiRequest<T>> {
        return this, this.instance.get(url, config);
    }

    post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiRequest<T>> {
        return this, this.instance.post(url, data, config);
    }
}

export const HttpClient = new Request({
    timeout: 30 * 1000
});
