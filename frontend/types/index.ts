export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  is_available: boolean;
  category: Category;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: Product;
}

export interface Order {
  id: number;
  customer?: Customer | null;
  total_price: string;
  items: OrderItem[];
  created_at: Date;
}

export interface Customer {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    email: string;
    is_active: boolean;
}
