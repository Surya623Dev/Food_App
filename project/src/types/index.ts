export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  user_id?: string;
  items_json: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered';
  delivery_address: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
}