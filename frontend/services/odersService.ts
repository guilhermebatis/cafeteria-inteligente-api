import { post, get, update, remove } from './api';
import {
    Order,
    AddItemToOrder,
    IncreaseItemQuantity,
    DecreaseItemQuantity,
    Payment,
    PaymentInput,
    PaymentResponse,
} from '@/types/orders';

const orderService = {
    getOrderId(id: number) {
        return get<Order>(`/api/orders/${id}/`);
    },
    createCurrentOrder() {
        return post<Order>(`/api/orders/create_current/`, {});
    },
    getCurrentOrder() {
        return get<Order>(`/api/orders/current/`);
    },
    addProductToOrder(orderId: number, data: AddItemToOrder) {
        return post<Order>(`/api/orders/${orderId}/add_item/`, data);
    },
    removeProductFromOrder(orderId: number, productId: number) {
        return remove<Order>(`/api/orders/${orderId}/remove_item/`, { product_id: productId });
    },
    increaseProductQuantity(orderId: number, data: IncreaseItemQuantity) {
        return update<Order>(`/api/orders/${orderId}/update_item/`, data);
    },
    decreaseProductQuantity(orderId: number, data: DecreaseItemQuantity) {
        return update<Order>(`/api/orders/${orderId}/update_item/`, data);
    },
    finalizeOrder(orderId: number) {
        return post<Order>(`/api/orders/${orderId}/finalize/`, {});
    },
    payment(orderId: number, data: PaymentInput) {
        return post<PaymentResponse>(`/api/orders/${orderId}/pay/`, data);
    },
    approvePayment(orderId: number, paymentId: number) {
        return post<Payment>(`/api/orders/${orderId}/approve_payment/`, { payment_id: paymentId });
    },
    setCustomerToOrder(orderId: number, customerId: number) {
        return update<Order>(`/api/orders/${orderId}/set_customer/`, { customer: customerId });
    },
    Checkout(orderId: number, data: {}) {
        return post<Order>(`/api/orders/${orderId}/checkout/`, data);
    },
    setHistory() {
        return get<Order[]>(`/api/orders/history/`);
    },
};

export default orderService;
