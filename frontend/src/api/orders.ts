import api from "./client";

export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export const placeOrder = (items: { product_id: number; quantity: number }[]) =>
  api.post<Order>("/orders/", { items }).then((r) => r.data);
