import { Coupon } from './coupon';

export interface OrderItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        barcode: string;
        price: number;
    };
}

export interface Order {
    id: number;
    total_price: number;
    created_at: string;
    customer: {
        id: number;
        name: string;
        cpf: string;
        phone: string;
        email: string;
        is_active: boolean;
    };
    items: OrderItem[];
    coupon?: Coupon;
}

export interface AddItemToOrder {
    product_id: number;
    quantity: number;
}

export interface IncreaseItemQuantity {
    product_id: number;
    quantity: number;
}

export interface DecreaseItemQuantity {
    product_id: number;
    quantity: number;
}

export type PaymentMethod = 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Payment {
    id: number;
    order: number;
    method: PaymentMethod;
    status: PaymentStatus;
    amount_received: number;
}

export interface PaymentInput {
    method: PaymentMethod;
    amount_received?: number;
}

export interface PaymentResponse {
    payment: Payment;
    change_money: number;
}
