export interface Holding {
    symbol: string;
    name: string;
    weight: number;
    price: number;
    changePct: number;
}

export interface Basket {
    id: string;
    name: string;
    risk: 'Low' | 'Medium' | 'High';
    label: string;
    oneDayChangePct: number;
    currentValue: number;
    description: string;
    holdings: Holding[];
}

interface Subscription {
    period: string;
    units: number;
    amount: number;
    date: string;
}

interface Investment {
    userMobile: string;
    basketId: string;
    units: number;
    totalInvested: number;
    subscriptions: Subscription[];
    mandate: any;
}

interface InvestmentsResponse {
    status: string;
    code: number;
    data: Investment[];
}

export interface BasketsResponse {
    status: string;
    code: number;
    count: number;
    data: Basket[];
}

export interface BasketResponse {
    status: string;
    code: number;
    data: Basket[];
}

export interface SubscriptionRequest {
    period: 'daily' | 'weekly' | 'monthly';
    units: number;
}

export interface SubscriptionResponse {
    status: string;
    code: number;
    data: Array<{
        basketId: string;
        units: number;
        period: string;
        amount: number;
        mandate: any;
    }>;
}

export interface InvestmentSubscriptionRequest {
    period: 'daily' | 'weekly' | 'monthly';
    units: number;
}

export interface InvestmentSubscriptionResponse {
    status: string;
    code: number;
    data: Array<{
        basketId: string;
        units: number;
        period: string;
        amount: number;
        mandate: any;
    }>;
}

// Update existing DashboardStats interface
export interface DashboardStats {
    totalRevenue: number;
    activeUsers: number;
    growthRate: number;
    analytics: number;
}



export interface SendOtpResponse {
    status: string;
    code: number;
    data: Array<{
        otp: string;
    }>;
}

export interface VerifyOtpResponse {
    status: string;
    code: number;
    data: Array<{
        accessToken: string;
    }>;
}

export interface Holding {
    symbol: string;
    name: string;
    weight: number;
    price: number;
    changePct: number;
}

export interface Basket {
    id: string;
    name: string;
    risk: 'Low' | 'Medium' | 'High';
    label: string;
    oneDayChangePct: number;
    currentValue: number;
    description: string;
    holdings: Holding[];
}

export interface BasketsResponse {
    status: string;
    code: number;
    count: number;
    data: Basket[];
}







export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
    status: number;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
    details?: any;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}


// Auth related types
export interface LoginRequest {
    mobile: string;
    otp?: string;
}

export interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
        mobile: string;
    };
    token: string;
    refreshToken?: string;
}

export interface SendOtpRequest {
    mobile: string;
}

export interface VerifyOtpRequest {
    mobile: string;
    otp: string;
}

// Dashboard types
export interface DashboardStats {
    totalRevenue: number;
    activeUsers: number;
    growthRate: number;
    analytics: number;
}

// Subscription types
export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: 'monthly' | 'yearly';
    features: string[];
    popular?: boolean;
}

export interface SubscribeRequest {
    planId: string;
    paymentMethodId?: string;
}

// Mandate types
export interface Mandate {
    id: string;
    title: string;
    description?: string;
    amount: number;
    currency: string;
    status: 'active' | 'pending' | 'expired' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    nextBillingDate?: string;
}

export interface CreateMandateRequest {
    title: string;
    description?: string;
    amount: number;
    currency?: string;
}

export interface UpdateMandateRequest extends Partial<CreateMandateRequest> {
    status?: Mandate['status'];
}

