import { post, get } from './api';
import { LoginData, LoginResponse, MeResponse } from '../types/auth';
const AuthService = {
    login(data: LoginData) {
        return post<LoginResponse>('/api/token/', data);
    },
    me() {
        return get<MeResponse>('/api/users/me/');
    },
};

export default AuthService;
