import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add item (avoid duplicates)
  const addToWishlist = (item) => {
    setWishlist((prev) => {
      const exists = prev.find(
        (p) => p.url === item.url && p.platform === item.platform
      );
      if (exists) return prev; // don’t add duplicates
      return [...prev, item];
    });
  };

  // Remove item using url + platform (unique combo)
  const removeFromWishlist = (url, platform) => {
    setWishlist((prev) =>
      prev.filter((p) => !(p.url === url && p.platform === platform))
    );
  };

  // Clear all
  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
