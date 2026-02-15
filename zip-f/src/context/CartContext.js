import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create Context
const CartContext = createContext();

// 2. Provider Component
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add item to cart (avoid duplicates if same url/platform already exists)
  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.some(
        (p) => p.url === item.url && p.platform === item.platform
      );
      if (exists) return prev; // don’t duplicate
      return [...prev, item];
    });
  };

  // ✅ Remove item from cart (using url + platform as unique identifier)
  const removeFromCart = (product) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.url === product.url &&
            item.platform === product.platform
          )
      )
    );
  };

  // ✅ Clear entire cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 3. Custom hook to use cart
export function useCart() {
  return useContext(CartContext);
}
