import { post, get, update, remove } from './api';
import { Category } from '@/types/categories';
const CategoryServices = {
    getCategory() {
        return get<Category[]>('/api/categories/');
    },
};
export default CategoryServices;
