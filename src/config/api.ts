export const API_CONFIG = {
    BASE_URL: import.meta.env.DEV ? '/api' : 'http://3.7.225.218:1337',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        SEND_OTP: '/send-otp',
        VERIFY_OTP: '/verify-otp',
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        REFRESH_TOKEN: '/api/auth/refresh',
        PROFILE: '/api/auth/profile',
    },
    DASHBOARD: {
        STATS: '/api/dashboard/stats',
        RECENT_ACTIVITY: '/api/dashboard/activity',
        BASKETS: '/baskets',
    },
    INVESTMENTS: {
        LIST: '/investments', // http://3.7.225.218:1337/investments
        SUBSCRIBE: (basketId: string) => `/investments/${basketId}/subscribe`,
    },
    BASKETS: {
        LIST: '/baskets',
        GET: (id: string) => `/basket/${id}`,
    },
    SUBSCRIPTION: {
        PLANS: '/api/subscription/plans',
        SUBSCRIBE: '/api/subscription/subscribe',
        CANCEL: '/api/subscription/cancel',
        CURRENT: '/api/subscription/current',
    },
    MANDATE: {
        LIST: '/api/mandates',
        CREATE: '/api/mandates',
        GET: (id: string) => `/api/mandates/${id}`,
        UPDATE: (id: string) => `/api/mandates/${id}`,
        DELETE: (id: string) => `/api/mandates/${id}`,
    },
} as const;