import { post, get } from './api';

interface LoginData {
    username: string;
    password: string;
}
interface LoginResponse {
    access: string;
    refresh: string;
}

const AuthService = {
    login(data: LoginData) {
        return post<LoginResponse>('/api/token/', data);
    },
    me() {},
    logout() {},
};

export default AuthService;
