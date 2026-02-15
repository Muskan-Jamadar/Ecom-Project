import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [recommendations, setRecommendations] = useState([]);

  // ⭐ Fetch recommendations from backend
  useEffect(() => {
    if (wishlist.length > 0) {
      fetch("http://localhost:5000/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wishlist: wishlist, // ✅ sending wishlist to backend
          cart: [],
          search_history: [],
          purchases: [],
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.recommendations) {
            setRecommendations(data.recommendations);
          } else {
            setRecommendations(data);
          }
        })
        .catch((err) => console.error("Error fetching recommendations:", err));
    }
  }, [wishlist]);

  // ⭐ RatingStars Component
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={{ color: "#FFD700", fontSize: "14px" }}>★</span>
        ))}
        {halfStar && <span style={{ color: "#FFD700", fontSize: "14px" }}>☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} style={{ color: "#ccc", fontSize: "14px" }}>★</span>
        ))}
        <span style={{ marginLeft: "5px", fontSize: "13px", color: "#555" }}>
          {rating ? rating.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f5f7", padding: "20px" }}>
      <h2 className="mb-4">❤️ My Wishlist ({wishlist.length})</h2>

      {/* Wishlist Section */}
      {wishlist.length === 0 ? (
        <div className="text-center text-muted fs-5">Your wishlist is empty.</div>
      ) : (
        <>
          <div className="row">
            {wishlist.map((product, idx) => (
              <div key={idx} className="col-md-6 col-sm-12 mb-4">
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.product_name || product.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <h6 style={{ fontSize: "14px", marginBottom: "5px" }}>
                    {product.product_name || product.name}
                  </h6>
                  <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>
                    Platform: {product.platform}
                  </p>
                  <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                    {product.discount && (
                      <span style={{ color: "green", fontWeight: "bold", marginRight: "5px" }}>
                        {product.discount}% OFF
                      </span>
                    )}
                    {product.original_price && (
                      <span style={{ textDecoration: "line-through", marginRight: "5px" }}>
                        ₹{product.original_price}
                      </span>
                    )}
                    <span style={{ fontWeight: "bold", color: "#007bff" }}>
                      ₹{product.final_price || product.price}
                    </span>
                  </div>
                  {product.rating && <RatingStars rating={product.rating} />}
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromWishlist(product.url, product.platform)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Wishlist */}
          <div
            style={{
              marginTop: "30px",
              textAlign: "right",
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h5>Total Items: {wishlist.length}</h5>
            <button className="btn btn-warning btn-lg mt-2" onClick={clearWishlist}>
              Clear Wishlist
            </button>
          </div>
        </>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>🔎 Recommended for You</h3>
          <div className="row">
            {recommendations.map((product, idx) => (
              <div key={idx} className="col-md-4 col-sm-6 mb-4">
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.product_name}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <h6 style={{ fontSize: "14px", marginBottom: "5px" }}>
                    {product.product_name}
                  </h6>
                  <span style={{ fontWeight: "bold", color: "#007bff" }}>
                    ₹{product.final_price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
