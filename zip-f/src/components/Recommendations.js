import React from "react";
import { useNavigate } from "react-router-dom";

export default function Recommendations({ products, label = "🔥 Recommended For You" }) {
  const navigate = useNavigate();

  const handleClick = (product) => {
    const key = `${product.product_name}_${product.platform}`;
    navigate(`/compare?key=${encodeURIComponent(key)}`);
  };

  if (!products || products.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h4 style={{ marginBottom: "20px", fontWeight: 600 }}>{label}</h4>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "15px",
          paddingBottom: "10px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
            div::-webkit-scrollbar { display: none; }
          `}
        </style>

        {products.map((p, idx) => (
          <div
            key={idx}
            style={{
              minWidth: "180px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
            }}
            onClick={() => handleClick(p)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={p.image || "/placeholder.png"}
              alt={p.product_name}
              style={{ width: "100%", height: "140px", objectFit: "contain", marginBottom: "10px" }}
              onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
            />
            <h6
              style={{
                fontSize: "0.9rem",
                fontWeight: "500",
                textAlign: "center",
                height: "40px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {p.product_name}
            </h6>
            <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#2874f0", marginTop: "5px" }}>
              ₹{p.final_price}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#f4b400", marginTop: "2px" }}>
              {"⭐".repeat(Math.round(p.rating || 4))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
