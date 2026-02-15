import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);

  // Filter only in-stock items
  const inStockCart = cart.filter(product => product.inStock !== false);

  // ⭐ RatingStars Component
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating || 0);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={{ color: "#FFD700", fontSize: "14px" }}>★</span>
        ))}
        {halfStar && <span style={{ color: "#FFD700", fontSize: "14px" }}>☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} style={{ color: "#ccc", fontSize: "14px" }}>★</span>
        ))}
        <span style={{ marginLeft: "5px", color: "#555", fontSize: "13px" }}>
          {rating ? rating.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  // Fetch recommendations based on last product category
  useEffect(() => {
    if (inStockCart.length === 0) return;
    const lastCategory = inStockCart[inStockCart.length - 1]?.category;

    fetch(`http://localhost:5000/api/recommendations?category=${lastCategory}`)
      .then(res => res.json())
      .then(data => setRecommendations(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching recommendations:", err));
  }, [inStockCart]);

  // Calculate total price
  const totalPrice = inStockCart.reduce(
    (sum, product) => sum + (product.final_price || product.price || 0),
    0
  );

  // Open individual product link
  const handleBuyNow = (product) => {
    if (product.url) window.open(product.url, "_blank");
  };

  // Buy all products
  const handleBuyAll = () => {
    if (inStockCart.length === 0) return;

    const confirmBuy = window.confirm(
      `Proceed to buy all ${inStockCart.length} items? This will open their respective platforms.`
    );
    if (!confirmBuy) return;

    inStockCart.forEach(product => {
      if (product.url) window.open(product.url, "_blank");
    });

    clearCart();
  };
  
  
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f5f7", padding: "20px 40px" }}>
      <h4 className="mb-3">🛒 My Cart ({inStockCart.length})</h4>

      {inStockCart.length === 0 ? (
        <div className="text-center text-muted fs-5">
          Your cart is empty or all products are out of stock.
        </div>
      ) : (
        <>
          <div className="row">
            {inStockCart.map((product, idx) => (
              <div
                key={idx}
                className="col-12 mb-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                {/* Product Image */}
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.product_name || product.name}
                  style={{ width: "100px", height: "100px", objectFit: "contain", borderRadius: "8px", marginRight: "15px" }}
                  onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
                />

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                  <h6 style={{ marginBottom: "5px" }}>{product.product_name || product.name}</h6>
                  <p style={{ marginBottom: "5px", color: "#555" }}>Platform: {product.platform}</p>
                  {product.rating && <RatingStars rating={product.rating} />}
                  {(product.price || product.final_price) && (
                    <p style={{ fontWeight: "bold", color: "#007bff" }}>₹{product.final_price || product.price}</p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button className="btn btn-primary btn-sm" onClick={() => handleBuyNow(product)}>Buy Now</button>
                  <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(product)}>Remove</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => alert("Saved for later!")}>Save for later</button>
                </div>
              </div>
            ))}
          </div>

          {/* Price Details */}
          <div className="card p-3 mt-4 shadow-sm" style={{ borderRadius: "12px", backgroundColor: "#fff" }}>
            <h6>Price Details</h6>
            <hr />
            <p>Total Items: {inStockCart.length}</p>
            <p>Total Amount: ₹{totalPrice}</p>
          </div>

          {/* Recommended Products */}
          {recommendations.length > 0 && (
            <div className="mt-5">
              <h4>🔥 Recommended For You</h4>
              <div style={{ display: "flex", overflowX: "auto", gap: "15px", padding: "10px 0" }}>
                {recommendations.map((p, i) => (
                  <div
                    key={i}
                    className="card shadow-sm"
                    style={{ minWidth: "180px", borderRadius: "12px", textAlign: "center", flex: "0 0 auto", padding: "10px" }}
                  >
                    <img
                      src={p.image || "/placeholder.png"}
                      alt={p.product_name}
                      style={{ height: "120px", objectFit: "contain", marginBottom: "10px" }}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
                    />
                    <h6 style={{ fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.product_name}
                    </h6>
                    <p style={{ color: "#007bff", fontWeight: "bold" }}>₹{p.final_price || p.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sticky Checkout Bar */}
          <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#fff",
            borderTop: "1px solid #ddd",
            padding: "15px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
          }}>
            <h6 style={{ margin: 0 }}>₹{totalPrice}</h6>
            <button className="btn btn-success" onClick={handleBuyAll}>Place Order</button>
          </div>
        </>
      )}
    </div>
  );
}
