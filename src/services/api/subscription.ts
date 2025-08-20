import { BaseApiService } from './base';
import { API_ENDPOINTS } from '../../config/api';
import type { SubscribeRequest } from '../../types/api';

export class SubscriptionApiService extends BaseApiService {
    async subscribe(data: SubscribeRequest) {
        return this.post(API_ENDPOINTS.SUBSCRIPTION.SUBSCRIBE, data);
    }

    async graphData(basketId: string, period: string) {
        return this.get(`/api/baskets/${basketId}/chart/${period}`)
    }
}