// src/contexts/CartContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { addOrUpdateCartItem, getCartItems, removeCartItem } from "../services/cartService";
import { CartItem } from "../types/cart";

interface CartContextData {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, productId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextData | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const items = await getCartItems();
      setCartItems(items);
    };

    fetchCart();
  }, []);

  const clearCart = () => {
    setCartItems([]);
  };

  const addToCart = async (productId: number, quantity: number) => {
    const updatedCartItem = await addOrUpdateCartItem(productId, quantity);
    setCartItems((prevItems) => [...prevItems, updatedCartItem]);
  };

  const removeFromCart = async (itemId: number) => {
    await removeCartItem(itemId);
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = async (itemId: number, productId: number, newQuantity: number) => {
    const updatedCartItem = await addOrUpdateCartItem(productId, newQuantity);
    setCartItems((prevItems) => {
      return prevItems.map((item) => (item.id === itemId ? updatedCartItem : item));
    });
  };  

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
