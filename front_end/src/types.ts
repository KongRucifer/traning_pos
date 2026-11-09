// Shapes of the data the API returns (same as the DB tables)

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number; // ກີບ
  stock: number;
  categoryId: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number; // price at time of sale
  product: Product;
}

export interface Order {
  id: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

// Cart only lives in the browser (React state) until checkout
export interface CartItem {
  product: Product;
  quantity: number;
}
