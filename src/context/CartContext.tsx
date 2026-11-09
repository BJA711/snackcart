"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Coupon, DeliveryCalculation, Product } from "@/types";
import { calculateCartTotals } from "@/lib/pricing";

interface CartContextType {
  items: CartItem[];
  coupon: Coupon | null;
  totals: DeliveryCalculation;
  itemCount: number;
  isHydrated: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon | null) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "snackcart_v1_cart";
const COUPON_STORAGE_KEY = "snackcart_v1_coupon";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);

      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch {
      // Ignore storage parse errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (coupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // Storage quota or disabled
    }
  }, [items, coupon, isHydrated]);

  const addToCart = (product: Product, quantity = 1) => {
    if (quantity <= 0) return;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product_id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(
          next[existingIndex].quantity + quantity,
          product.stock_quantity || 99
        );
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          product, // refresh product details
        };
        return next;
      } else {
        return [
          ...prev,
          {
            product_id: product.id,
            product,
            quantity: Math.min(quantity, product.stock_quantity || 99),
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product_id === productId) {
          const maxQty = item.product.stock_quantity || 99;
          return {
            ...item,
            quantity: Math.min(quantity, maxQty),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  };

  const applyCoupon = (newCoupon: Coupon | null) => {
    setCoupon(newCoupon);
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const totals = calculateCartTotals(
    items.map((i) => ({
      price_in_paise: i.product.price_in_paise,
      quantity: i.quantity,
    })),
    coupon
  );

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        coupon,
        totals,
        itemCount,
        isHydrated,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

