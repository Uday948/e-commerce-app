import api from "./client";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

export const getProducts = () => api.get<Product[]>("/products/").then((r) => r.data);
export const getProduct = (id: number) => api.get<Product>(`/products/${id}`).then((r) => r.data);
