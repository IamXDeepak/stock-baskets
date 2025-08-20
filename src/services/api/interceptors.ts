import { API_CONFIG } from "../../config/api";
import type { ApiResponse, ApiError } from "../../types/api";

export interface RequestConfig extends RequestInit {
    url: string;
    retry?: number;
    skipAuth?: boolean;
}

export class ApiInterceptor {
    private static instance: ApiInterceptor;
    private baseURL: string;
    private timeout: number;

    private constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    static getInstance(): ApiInterceptor {
        if (!ApiInterceptor.instance) {
            ApiInterceptor.instance = new ApiInterceptor();
        }
        return ApiInterceptor.instance;
    }

    async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
        const { url, retry = 0, skipAuth = false, ...fetchConfig } = config;

        // Build full URL
        const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

        // Prepare headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...fetchConfig.headers,
        };

        // Add auth token if not skipped
        if (!skipAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(fullUrl, {
                ...fetchConfig,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle different response types
            if (!response.ok) {
                await this.handleErrorResponse(response);
            }

            // Parse response
            const contentType = response.headers.get('content-type');
            let data: T;

            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else {
                data = (await response.text()) as unknown as T;
            }

            return {
                data,
                success: true,
                status: response.status,
            };

        } catch (error) {
            clearTimeout(timeoutId);

            // Handle network errors and retries
            if (retry < API_CONFIG.RETRY_ATTEMPTS && this.shouldRetry(error)) {
                await this.delay(API_CONFIG.RETRY_DELAY * (retry + 1));
                return this.request({ ...config, retry: retry + 1 });
            }

            throw this.handleError(error);
        }
    }

    private async handleErrorResponse(response: Response): Promise<never> {
        let errorData: any = {};

        try {
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                errorData = await response.json();
            } else {
                errorData = { message: await response.text() };
            }
        } catch {
            errorData = { message: response.statusText };
        }

        // Handle specific status codes
        switch (response.status) {
            case 401:
                this.handleUnauthorized();
                break;
            case 403:
                this.handleForbidden();
                break;
            case 500:
                this.handleServerError();
                break;
        }

        const apiError: ApiError = {
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            code: errorData.code,
            details: errorData.details,
        };

        throw apiError;
    }

    private handleError(error: any): ApiError {
        if (error.name === 'AbortError') {
            return {
                message: 'Request timeout',
                status: 408,
                code: 'TIMEOUT',
            };
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
            return {
                message: 'Network error. Please check your connection.',
                status: 0,
                code: 'NETWORK_ERROR',
            };
        }

        if (error.status) {
            return error; // Already an ApiError
        }

        return {
            message: error.message || 'An unexpected error occurred',
            status: 500,
            code: 'UNKNOWN_ERROR',
        };
    }

    private shouldRetry(error: any): boolean {
        // Retry on network errors and 5xx status codes
        return (
            error.name === 'AbortError' ||
            (error instanceof TypeError && error.message.includes('fetch')) ||
            (error.status >= 500 && error.status < 600)
        );
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private getAuthToken(): string | null {
        return localStorage.getItem('token');
    }

    private handleUnauthorized(): void {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Dispatch custom event for auth state change
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    private handleForbidden(): void {
        // Handle forbidden access
        console.warn('Access forbidden');
    }

    private handleServerError(): void {
        // Handle server errors
        console.error('Server error occurred');
    }
}