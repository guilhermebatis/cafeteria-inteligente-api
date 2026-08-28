export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface CreateProduct {
    name: string;
    description: string;
    price: number;
    is_available: boolean;
    category_id: number;
    barcode: number;
    image?: string;
}

export interface UpdateProduct {
    name: string;
    description: string;
    price: number;
    is_available: boolean;
    category_id: number;
    barcode: number;
    image?: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    is_available: boolean;
    category: Category;
    ingredients: ProductIngredient[];
    barcode: string;
    image: string;
}

export interface Ingredient {
    id: number;
    name: string;
    unit: string;
}

export interface ProductIngredient {
    ingredient: Ingredient;
    quantity: string;
}

export interface UpdateIngredient {
    ingredient_id: number;
    quantity: number;
}
