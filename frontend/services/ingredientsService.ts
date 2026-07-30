import { post, get, update, remove } from './api';
import { Ingredient } from '@/types/ingredients';

const IngredientsService = {
    getingredients() {
        return get<Ingredient[]>('/api/ingredients/');
    },
};
export default IngredientsService;
