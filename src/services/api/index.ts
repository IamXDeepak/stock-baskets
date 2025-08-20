import { AuthApiService } from './auth';
import { DashboardApiService } from './dashboard';
import { SubscriptionApiService } from './subscription';
import { MandateApiService } from './mandate';
import { BasketsApiService } from './baskets';


// Create service instances
export const authApi = new AuthApiService();
export const dashboardApi = new DashboardApiService();
export const subscriptionApi = new SubscriptionApiService();
export const mandateApi = new MandateApiService();
export const basketsApi = new BasketsApiService();

// Export types
export type { ApiResponse, ApiError } from '../../types/api';

// Export services
export {
    AuthApiService,
    DashboardApiService,
    SubscriptionApiService,
    MandateApiService,
    BasketsApiService,
};

// Default export with all services
const apiServices = {
    auth: authApi,
    dashboard: dashboardApi,
    subscription: subscriptionApi,
    mandate: mandateApi,
    baskets: basketsApi,
};

export default apiServices;