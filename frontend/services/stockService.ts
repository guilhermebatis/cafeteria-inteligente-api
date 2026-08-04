import { post, get, update, remove } from './api';
import { StockMovement, CreateStockMovement } from '@/types/stocks';

const StockService = {
    getStockMovements() {
        return get<StockMovement[]>('/api/stock-movements/');
    },
    addStockMovement(ingredientId: number, data: CreateStockMovement) {
        return post<StockMovement>(`/api/ingredients/${ingredientId}/add_stock/`, data);
    },
};

export default StockService;
