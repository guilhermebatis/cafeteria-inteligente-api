import { post, get, update, remove } from './api';
import { Product, UpdateProduct, CreateProduct, UpdateIngredient } from '../types/products';

const ProductService = {
    getProducts(search?: string, category?: number) {
        const params = new URLSearchParams();

        if (search) {
            params.append('search', search);
        }
        if (category) {
            params.append('category', String(category));
        }

        return get<Product[]>(`/api/products/?${params}`);
    },

    createProduct(data: CreateProduct) {
        return post<Product>('/api/products/', data);
    },

    updateProduct(id: number, data: UpdateProduct) {
        return update<Product>(`/api/products/${id}/`, data);
    },

    deleteProduct(id: number) {
        return remove<Product>(`/api/products/${id}/`);
    },

    updateIngredient(id: number, data: UpdateIngredient) {
        return update<Product>(`/api/products/${id}/update_ingredient/`, data);
    },

    addIngredient(id: number, data: UpdateIngredient) {
        return post(`/api/products/${id}/add_ingredient/`, data);
    },

    deleteIngredient(id: number, data: { ingredient_id: number }) {
        return post<Product>(`/api/products/${id}/remove_ingredient/`, data);
    },
    searchProducts(barcode: string) {
        return get<Product>(`/api/products/by_barcode/?barcode=${barcode}`);
    },
};

export default ProductService;
