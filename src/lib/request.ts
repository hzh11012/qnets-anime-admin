import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CreateAxiosDefaults,
    InternalAxiosRequestConfig
} from 'axios';

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
                if (config.url !== '/login') {
                    // todo
                }

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
                if (response.data.code !== 0) {
                    return Promise.reject(response.data);
                }

                return response.data;
            },
            err => {
                if (
                    err.response?.status === 401 ||
                    err.response?.status === 403
                ) {
                    // todo redirect login
                }

                if (err.response?.status > 400) {
                    // todo toast
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
