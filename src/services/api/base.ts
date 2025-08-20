import { ApiInterceptor } from './interceptors';
import type { RequestConfig } from './interceptors';
import type { ApiResponse } from '../../types/api';

export class BaseApiService {
    protected api: ApiInterceptor;

    constructor() {
        this.api = ApiInterceptor.getInstance();
    }

    protected async get<T>(
        url: string,
        params?: Record<string, any>,
        config?: Omit<RequestConfig, 'url' | 'method'>
    ): Promise<ApiResponse<T>> {
        const queryString = params ? this.buildQueryString(params) : '';
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        return this.api.request<T>({
            url: fullUrl,
            method: 'GET',
            ...config,
        });
    }

    protected async post<T>(
        url: string,
        data?: any,
        config?: Omit<RequestConfig, 'url' | 'method'>
    ): Promise<ApiResponse<T>> {
        return this.api.request<T>({
            url,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    protected async put<T>(
        url: string,
        data?: any,
        config?: Omit<RequestConfig, 'url' | 'method'>
    ): Promise<ApiResponse<T>> {
        return this.api.request<T>({
            url,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    protected async patch<T>(
        url: string,
        data?: any,
        config?: Omit<RequestConfig, 'url' | 'method'>
    ): Promise<ApiResponse<T>> {
        return this.api.request<T>({
            url,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    protected async delete<T>(
        url: string,
        config?: Omit<RequestConfig, 'url' | 'method'>
    ): Promise<ApiResponse<T>> {
        return this.api.request<T>({
            url,
            method: 'DELETE',
            ...config,
        });
    }

    private buildQueryString(params: Record<string, any>): string {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });

        return searchParams.toString();
    }
}
