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
}

export interface AddItemToOrder {
    product_id: number;
    quantity: number;
}

export interface IcraseItemQuantity {
    product_id: number;
    quantity: number;
}

export interface DecreaseItemQuantity {
    product_id: number;
    quantity: number;
}

export interface Payment {
    method: string;
}
