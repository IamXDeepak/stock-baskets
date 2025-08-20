export interface User {
    id: string;
    name: string;
    email: string;
    mobile: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}