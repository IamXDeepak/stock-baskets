import { BaseApiService } from './base';
import { API_ENDPOINTS } from '../../config/api';
import type {
    Mandate,
    CreateMandateRequest,
    UpdateMandateRequest,
    PaginationParams,
    PaginatedResponse
} from '../../types/api';

export class MandateApiService extends BaseApiService {
    async getMandates(params?: PaginationParams) {
        return this.get<PaginatedResponse<Mandate>>(API_ENDPOINTS.MANDATE.LIST, params);
    }

    async getMandate(id: string) {
        return this.get<Mandate>(API_ENDPOINTS.MANDATE.GET(id));
    }

    async createMandate(data: CreateMandateRequest) {
        return this.post<Mandate>(API_ENDPOINTS.MANDATE.CREATE, data);
    }

    async updateMandate(id: string, data: UpdateMandateRequest) {
        return this.put<Mandate>(API_ENDPOINTS.MANDATE.UPDATE(id), data);
    }

    async deleteMandate(id: string) {
        return this.delete(API_ENDPOINTS.MANDATE.DELETE(id));
    }
}