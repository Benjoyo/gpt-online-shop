// src/types/cart.ts
export interface CartProduct {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
}
  
export interface CartItem {
    id: number;
    product: CartProduct;
    quantity: number;
}
  