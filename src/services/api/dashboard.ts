import { BaseApiService } from './base';
import { API_ENDPOINTS } from '../../config/api';
import type {
    DashboardStats,
    BasketsResponse,
    BasketResponse,
    SubscriptionRequest,
    SubscriptionResponse,
    InvestmentsResponse
} from '../../types/api';

export class DashboardApiService extends BaseApiService {
    async getStats() {
        return this.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS);
    }

    async getRecentActivity() {
        return this.get(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITY);
    }

    // Get all baskets
    async getBaskets() {
        return this.get<BasketsResponse>(API_ENDPOINTS.DASHBOARD.BASKETS);
    }

    // Get individual basket details
    async getBasketDetails(basketId: string) {
        return this.get<BasketResponse>(`/basket/${basketId}`);
    }

    // Subscribe to basket with period and units only
    async subscribeToBasket(basketId: string, data: SubscriptionRequest) {
        return this.post<SubscriptionResponse>(`/investments/${basketId}/subscribe`, data);
    }

    async getInvestments() {
        return this.get<InvestmentsResponse>(API_ENDPOINTS.INVESTMENTS.LIST);
    }
}