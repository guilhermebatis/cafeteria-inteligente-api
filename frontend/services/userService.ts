import { post, get, update, remove } from './api';
import { User, CreateUser, UpdateUser, DisableUser } from '@/types/users';

const UserService = {
    getUsers() {
        return get<User[]>('/api/users/');
    },
    createUser(data: CreateUser) {
        return post<User>('/api/users/', data);
    },
    updateUser(id: number, data: UpdateUser) {
        return update<User>(`/api/users/${id}/`, data);
    },
    disableUser(id: number, data: DisableUser) {
        return update<User>(`/api/users/${id}/`, data);
    },
};

export default UserService;
