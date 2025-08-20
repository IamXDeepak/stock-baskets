import { BaseApiService } from './base';
import { API_ENDPOINTS } from '../../config/api';
import type {
    BasketsResponse,
    BasketResponse,
    SubscriptionRequest,
    SubscriptionResponse,
    InvestmentsResponse
} from '../../types/api';

export class DashboardApiService extends BaseApiService {

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