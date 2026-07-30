import { post, get, update, remove } from './api';
import { Product, UpdateProduct, CreateProduct, UpdateIngredient } from '../types/products';

const ProductService = {
    getProducts() {
        return get<Product[]>('/api/products/');
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
};

export default ProductService;
