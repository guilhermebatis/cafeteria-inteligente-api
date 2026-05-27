interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  is_available: boolean;
  category: Category;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: Product;
}

interface Order {
  id: number;
  total_price: string;
  items: OrderItem[];
}
