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
  total_price: string;
  items: OrderItem[];
}

