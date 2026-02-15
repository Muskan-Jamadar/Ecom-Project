// src/components/CategoryBar.js
import React, { useEffect, useState } from "react";

// Import images (adjust path as needed)
import mobilesImg from "../assets/categories/mobiles.png";
import electronicsImg from "../assets/categories/electronics.png";
import clothingImg from "../assets/categories/clothing.png";
import footwearImg from "../assets/categories/footwear.png";
import beautyImg from "../assets/categories/beauty.png";
import toysImg from "../assets/categories/toys.png";
import sportsImg from "../assets/categories/sports.png";
// ... import other category images

// Map categories to images
const CATEGORY_IMAGES = {
  "Mobiles & Accessories": mobilesImg,
  Electronics: electronicsImg,
  Clothing: clothingImg,
  Footwear: footwearImg,
  "Beauty & Personal Care": beautyImg,
  "Toys & Games": toysImg,
  "Sports & Fitness": sportsImg,
  // add remaining categories
};

export default function CategoryBar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setCategories(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        padding: "10px 0",
        gap: "15px",
        scrollbarWidth: "thin",
      }}
    >
      {categories.map((cat) => (
        <div
          key={cat}
          style={{
            minWidth: "90px",
            flex: "0 0 auto",
            textAlign: "center",
            padding: "8px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onClick={() => alert(`Clicked category: ${cat}`)}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <img
            src={CATEGORY_IMAGES[cat] || "https://via.placeholder.com/50"}
            alt={cat}
            style={{ width: "50px", height: "50px", objectFit: "contain" }}
          />
          <div style={{ fontSize: "12px", marginTop: "5px" }}>{cat}</div>
        </div>
      ))}
    </div>
  );
}
