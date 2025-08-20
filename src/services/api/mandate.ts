import { BaseApiService } from './base';
import { API_ENDPOINTS } from '../../config/api';
import type {
    Mandate,
    UpdateMandateRequest,
} from '../../types/api';

export class MandateApiService extends BaseApiService {
    async updateMandate(id: string, data: UpdateMandateRequest) {
        return this.put<Mandate>(API_ENDPOINTS.MANDATE.UPDATE(id), data);
    }
}