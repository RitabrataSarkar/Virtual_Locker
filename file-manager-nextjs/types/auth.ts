export interface User {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: User;
}
