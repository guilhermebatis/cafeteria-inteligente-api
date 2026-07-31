import { post, get, update, remove } from './api';
import { Ingredient, CreateIngredient, UpdateIngredient } from '@/types/ingredients';

const IngredientsService = {
    getIngredients() {
        return get<Ingredient[]>('/api/ingredients/');
    },
    addIngredients(data: CreateIngredient) {
        return post<Ingredient>('/api/ingredients/', data);
    },
    deleteIngredients(id: number) {
        return remove(`/api/ingredients/${id}/`);
    },
    updateIngredient(id: number, data: UpdateIngredient) {
        return update<Ingredient>(`/api/ingredients/${id}/`, data);
    },
};
export default IngredientsService;
