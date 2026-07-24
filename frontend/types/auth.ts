export interface LoginData {
    username: string;
    password: string;
}
export interface LoginResponse {
    access: string;
    refresh: string;
}
export interface MeResponse {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
}
