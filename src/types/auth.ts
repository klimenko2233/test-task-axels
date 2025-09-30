export interface User {
    id: string;
    name: string;
    isOnline: boolean;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export interface UserCredo {
    name: string;
    password: string;
}