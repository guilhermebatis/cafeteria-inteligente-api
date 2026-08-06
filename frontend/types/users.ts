export interface User {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
}

export interface CreateUser {
    username: string;
    email: string;
    password: string;
    is_staff: boolean;
    is_active: boolean;
}

export interface UpdateUser {
    username: string;
    email: string;
    password: string;
    is_staff: boolean;
    is_active: boolean;
}

export interface DisableUser {
    is_active: boolean;
}
