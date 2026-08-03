export interface OrderItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
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
