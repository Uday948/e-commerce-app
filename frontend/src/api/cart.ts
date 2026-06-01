import api from "./client";

export interface CartItem {
  product_id: number;
  quantity: number;
}

export interface Cart {
  session_id: string;
  items: CartItem[];
}

const SESSION_KEY = "cart_session";

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export const getCart = (sessionId: string) =>
  api.get<Cart>(`/cart/${sessionId}`).then((r) => r.data);

export const addToCart = (product_id: number, quantity = 1) =>
  api.post<Cart>("/cart/", { session_id: getSessionId(), product_id, quantity }).then((r) => r.data);

export const removeFromCart = (product_id: number) =>
  api.delete<Cart>("/cart/", { data: { session_id: getSessionId(), product_id } }).then((r) => r.data);
