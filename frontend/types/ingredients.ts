export interface Ingredient {
    id: number;
    name: string;
    stock_quantity: number;
    minimum_stock: number;
    unit: string;
}

export interface CreateIngredient {
    name: string;
    stock_quantity: number;
    minimum_stock: number;
    unit: string;
}

export interface UpdateIngredient {
    name: string;
    stock_quantity: number;
    minimum_stock: number;
    unit: string;
}
