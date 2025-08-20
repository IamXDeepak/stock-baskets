import { AuthApiService } from './auth';
import { DashboardApiService } from './dashboard';
import { SubscriptionApiService } from './subscription';
import { MandateApiService } from './mandate';

// Create service instances
export const authApi = new AuthApiService();
export const dashboardApi = new DashboardApiService();
export const subscriptionApi = new SubscriptionApiService();
export const mandateApi = new MandateApiService();

// Export types
export type { ApiResponse, ApiError } from '../../types/api';

// Export services
export {
    AuthApiService,
    DashboardApiService,
    SubscriptionApiService,
    MandateApiService,
};

// Default export with all services
const apiServices = {
    auth: authApi,
    dashboard: dashboardApi,
    subscription: subscriptionApi,
    mandate: mandateApi,
};

export default apiServices;