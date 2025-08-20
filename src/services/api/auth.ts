import { BaseApiService } from './base';
import { API_ENDPOINTS } from '../../config/api';
import type {
    SendOtpRequest,
    VerifyOtpRequest,
    LoginRequest,
    LoginResponse,
    SendOtpResponse,
    VerifyOtpResponse
} from '../../types/api';

export class AuthApiService extends BaseApiService {
    async sendOtp(data: SendOtpRequest) {
        return this.post<SendOtpResponse>(API_ENDPOINTS.AUTH.SEND_OTP, data, { skipAuth: true });
    }

    async verifyOtp(data: VerifyOtpRequest) {
        return this.post<VerifyOtpResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, data, { skipAuth: true });
    }

    async login(data: LoginRequest) {
        return this.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data, { skipAuth: true });
    }

    async logout() {
        return this.post(API_ENDPOINTS.AUTH.LOGOUT);
    }

    async refreshToken(refreshToken: string) {
        return this.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken }, { skipAuth: true });
    }

    async getProfile() {
        return this.get(API_ENDPOINTS.AUTH.PROFILE);
    }
}