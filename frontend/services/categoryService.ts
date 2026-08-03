import { post, get, update, remove } from './api';
import { Category, CreateCategory, UpdateCategory } from '@/types/categories';
const CategoryServices = {
    getCategory() {
        return get<Category[]>('/api/categories/');
    },
    createCategory(data: CreateCategory) {
        return post<Category>('/api/categories/', data);
    },
    deleteCategory(id: number) {
        return remove<Category>(`/api/categories/${id}/`);
    },
    updateCategory(id: number, data: UpdateCategory) {
        return update<Category>(`/api/categories/${id}/`, data);
    },
};

export default CategoryServices;
