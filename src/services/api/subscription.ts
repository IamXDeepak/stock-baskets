import { BaseApiService } from './base';
import { API_ENDPOINTS } from '../../config/api';
import type { SubscriptionPlan, SubscribeRequest } from '../../types/api';

export class SubscriptionApiService extends BaseApiService {
    async getPlans() {
        return this.get<SubscriptionPlan[]>(API_ENDPOINTS.SUBSCRIPTION.PLANS);
    }

    async subscribe(data: SubscribeRequest) {
        return this.post(API_ENDPOINTS.SUBSCRIPTION.SUBSCRIBE, data);
    }

    async getCurrentSubscription() {
        return this.get(API_ENDPOINTS.SUBSCRIPTION.CURRENT);
    }

    async cancelSubscription() {
        return this.post(API_ENDPOINTS.SUBSCRIPTION.CANCEL);
    }
}