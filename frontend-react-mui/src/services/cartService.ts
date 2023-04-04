// src/services/cartService.ts
import { CartItem } from '../types/cart';
import api from '../utils/api';

export const getCartItems = async (): Promise<CartItem[]> => {
  const response = await api.get<CartItem[]>('/cart');
  return response.data;
};

export const addOrUpdateCartItem = async (productId: number, quantity: number): Promise<CartItem> => {
  const response = await api.post<CartItem>('/cart/items', { productId, quantity });
  return response.data;
};

export const removeCartItem = async (itemId: number): Promise<void> => {
  await api.delete(`/cart/items/${itemId}`);
};
