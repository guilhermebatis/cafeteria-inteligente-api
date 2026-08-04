export interface StockMovement {
    id: number;
    ingredient: {
        name: string;
    };
    quantity: string;
    movement_type: string;
    reason: string;
    created_at: string;
}

export interface CreateStockMovement {
    quantity: number;
    reason: string;
}
