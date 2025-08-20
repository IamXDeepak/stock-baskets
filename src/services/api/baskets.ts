import { BaseApiService } from './base';
import { API_ENDPOINTS } from '../../config/api';
import type { BasketsResponse, Basket } from '../../types/api';

export class BasketsApiService extends BaseApiService {
    async getAllBaskets() {
        return this.get<BasketsResponse>(API_ENDPOINTS.DASHBOARD.BASKETS);
    }

    async getBasket(id: string) {
        return this.get<Basket>(`/baskets/${id}`);
    }

    async investInBasket(basketId: string, amount: number) {
        return this.post(`/baskets/${basketId}/invest`, { amount });
    }
}