import { post, get, update, remove } from './api';
import { Customer, CreateCustomer, UpdateCustomer, ToggleCustomer } from '@/types/customers';
import { Order } from '@/types/orders';
const CustomersService = {
    getCustomers() {
        return get<Customer[]>('/api/customers/');
    },
    createCustomer(data: CreateCustomer) {
        return post<Customer>('/api/customers/', data);
    },
    updateCustomer(id: number, data: UpdateCustomer) {
        return update<Customer>(`/api/customers/${id}/`, data);
    },
    toggleCustomer(id: number, data: ToggleCustomer) {
        return update<Customer>(`/api/customers/${id}/`, data);
    },
    deleteCustomer(id: number) {
        return remove<Customer>(`/api/customers/${id}/`);
    },
    orderCustomer(id: number) {
        return get<Order[]>(`/api/customers/${id}/orders/`);
    },
};

export default CustomersService;
