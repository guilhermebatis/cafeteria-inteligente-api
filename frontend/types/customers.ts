export interface Customer {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    email: string;
    is_active: boolean;
}

export interface CreateCustomer {
    name: string;
    cpf: string;
    phone: string;
    email: string;
    is_active: boolean;
}

export interface UpdateCustomer {
    name: string;
    cpf: String;
    phone: string;
    email: string;
    is_active: Boolean;
}

export interface ToggleCustomer {
    is_active: Boolean;
}
