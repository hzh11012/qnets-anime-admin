import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    CreateAxiosDefaults
} from 'axios';
import { getToken } from '@/lib/token';
import { LOGIN_URL } from '@/lib/config';

class RefresherAxiosRequest {
    public refresherAxiosInstance: AxiosInstance; //专门刷新token的axios实例
    public isRefreshing: boolean = false; // 是否正在刷新token
    public temporaryQueue: Array<Promise<any>> = []; // 暂存队列,当处于刷新token的时间中时,后续请求全部push进该队列中

    constructor(config: CreateAxiosDefaults) {
        this.refresherAxiosInstance = axios.create(config);

        this.interceptorsRequest();
        this.interceptorsResponse();
    }

    // 请求拦截器
    private interceptorsRequest() {
        this.refresherAxiosInstance.interceptors.request.use(
            config => {
                return config;
            },
            function (error) {
                return Promise.reject(error);
            }
        );
    }

    // 响应拦截器
    private interceptorsResponse() {
        this.refresherAxiosInstance.interceptors.response.use(
            response => {
                return response.data;
            },
            async error => {
                if (error.response?.status) {
                    this.temporaryQueue = [];
                    window.localStorage.clear();
                    window.location.reload();
                    window.location.href = `${LOGIN_URL}?redirect=${encodeURIComponent(window.location.href)}`;
                }
            }
        );
    }

    private request(axiosRequestConfig: AxiosRequestConfig): Promise<any> {
        return this.refresherAxiosInstance(axiosRequestConfig);
    }

    // 刷新短token的业务逻辑
    public async refresh(
        url = '/auth/api/sso/token_refresh'
    ): Promise<boolean> {
        try {
            const token = getToken('refresh_token');
            this.isRefreshing = true;
            await this.request({
                url,
                method: 'post',
                headers: {
                    Authorization: token
                }
            });
            Promise.allSettled(this.temporaryQueue);
            return Promise.resolve(true);
        } catch (error) {
            return Promise.resolve(false);
        } finally {
            // 标记刷新token完成
            this.isRefreshing = false;
        }
    }
}

export const RefresherHttpClient = new RefresherAxiosRequest({
    timeout: 30 * 1000
});
