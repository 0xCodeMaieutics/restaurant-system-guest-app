"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface PriceOption {
  value: number;
  description?: string;
}

export interface CartItem {
  id: string; // Unique identifier: sectionName-itemName-priceIndex
  name: string;
  description: string;
  image?: string;
  price: number;
  priceDescription?: string;
  quantity: number;
  sectionName: string;
}

export enum OrderStatus {
  IDLE = "IDLE",
  ORDER_SUBMITTED = "ORDER_SUBMITTED",
}

// In-memory cache for order numbers
let orderNumberCounter = 23;
const order_prefix = "";
function generateOrderNumber(): string {
  const orderNumber = `${order_prefix}${orderNumberCounter}`;
  orderNumberCounter++;
  return orderNumber;
}

interface CartContextType {
  items: CartItem[];
  orderStatus: OrderStatus;
  orderNumber: string | null;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  submitOrder: () => void;
  resetOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.IDLE);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      setItems((prevItems) =>
        prevItems.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const submitOrder = useCallback(() => {
    if (items.length === 0) return;
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
    setOrderStatus(OrderStatus.ORDER_SUBMITTED);
  }, [items]);

  const resetOrder = useCallback(() => {
    setOrderStatus(OrderStatus.IDLE);
    setOrderNumber(null);
    setItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        orderStatus,
        orderNumber,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        submitOrder,
        resetOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
