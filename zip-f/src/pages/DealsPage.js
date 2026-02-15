// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";
// import { useNavigate } from "react-router-dom";

// export default function DealsPage() {
//   const { addToCart } = useCart();
//   const { addToWishlist } = useWishlist();
//   const [deals, setDeals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDeals = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:5000/top-deals");
//         const items = res.data.items || [];

//         const normalizedItems = items.map((item) => ({
//           ...item,
//           product_name: item.product_name || "Unknown Product",
//           brand: item.brand || "Unknown Brand",
//         }));

//         setDeals(normalizedItems);
//       } catch (err) {
//         console.error("Error fetching deals:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDeals();
//   }, []);

//   const getCategory = (item) =>
//     item.category || item.main_category || item.product_category || "Others";

//   const getDiscount = (item) =>
//     item.discount ?? item.discount_percent ?? 0;

//   const groupByCategory = (items) =>
//     items.reduce((acc, item) => {
//       const cat = getCategory(item);
//       if (!acc[cat]) acc[cat] = [];
//       acc[cat].push(item);
//       return acc;
//     }, {});

//   // 🔎 Compare handler
//   const handleCardClick = async (product) => {
//     if (!product.product_name || !product.brand) {
//       alert("Cannot compare: Product name or brand missing.");
//       return;
//     }

//     try {
//       const res = await axios.get("http://127.0.0.1:5000/compare", {
//         params: {
//           product_name: product.product_name,
//           brand: product.brand,
//         },
//       });

//       if (res.data.error) {
//         alert(res.data.error);
//         return;
//       }

//       navigate("/compare", { state: { compareData: res.data.results } });
//     } catch (err) {
//       console.error("Error fetching compare data:", err);
//       alert("Failed to fetch product comparison.");
//     }
//   };

//   if (loading) return <p className="text-center mt-5">Loading deals...</p>;
//   if (!deals.length)
//     return <p className="text-center mt-5">No deals available.</p>;

//   return (
//     <div style={{ padding: "40px 8%" }}>
//       <h2 style={{ fontSize: "32px", fontWeight: 700 }}>
//         Today’s Top Deals
//       </h2>
//       <p style={{ color: "#666", marginBottom: "30px" }}>
//         Best offers across categories with genuine discounts
//       </p>

//       {Object.entries(groupByCategory(deals)).map(([cat, items]) => (
//         <div key={cat} style={{ marginBottom: "50px" }}>
//           <h3 style={{ marginBottom: "20px" }}>{cat}</h3>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns:
//                 "repeat(auto-fill, minmax(220px, 1fr))",
//               gap: "24px",
//             }}
//           >
//             {items.map((item, idx) => (
//               <div
//                 key={`${item.product_url}-${idx}`}
//                 onClick={() => handleCardClick(item)}
//                 style={{
//                   cursor: "pointer",
//                   background: "#fff",
//                   borderRadius: "18px",
//                   boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
//                   padding: "16px",
//                   position: "relative",
//                 }}
//               >
//                 <span
//                   style={{
//                     position: "absolute",
//                     top: "14px",
//                     left: "14px",
//                     background: "#c7f000",
//                     padding: "4px 10px",
//                     borderRadius: "12px",
//                     fontSize: "12px",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {getDiscount(item)}% OFF
//                 </span>

//                 <img
//                   src={item.image || "/placeholder.png"}
//                   alt={item.product_name}
//                   style={{
//                     width: "100%",
//                     height: "160px",
//                     objectFit: "contain",
//                   }}
//                   onError={(e) =>
//                     (e.target.src = "/placeholder.png")
//                   }
//                 />

//                 <h6 style={{ marginTop: "10px", fontWeight: 600 }}>
//                   {item.product_name}
//                 </h6>
//                 <p
//                   style={{
//                     color: "#666",
//                     fontSize: "13px",
//                     margin: "2px 0 8px 0",
//                   }}
//                 >
//                   {item.brand}
//                 </p>

//                 <div style={{ margin: "8px 0" }}>
//                   <strong>₹{item.final_price}</strong>{" "}
//                   <span
//                     style={{
//                       textDecoration: "line-through",
//                       color: "#999",
//                       fontSize: "13px",
//                       marginLeft: "6px",
//                     }}
//                   >
//                     ₹{item.price}
//                   </span>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "6px",
//                     marginTop: "10px",
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   <a
//                     href={item.product_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="btn btn-success btn-sm"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     Buy
//                   </a>

//                   {/* ✅ Cart */}
//                   <button
//                     className="btn btn-primary btn-sm"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       addToCart({
//                         ...item,
//                         url: item.product_url,
//                         platform: "deals",
//                       });
//                     }}
//                   >
//                     Cart
//                   </button>

//                   {/* ✅ Wishlist */}
//                   <button
//                     className="btn btn-warning btn-sm"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       addToWishlist({
//                         ...item,
//                         url: item.product_url,
//                         platform: "deals",
//                       });
//                     }}
//                   >
//                     ❤️
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

export default function DealsPage() {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/top-deals");
        const items = res.data.items || [];

        const normalizedItems = items.map((item) => ({
          ...item,
          product_name: item.product_name || "Unknown Product",
          brand: item.brand || "Unknown Brand",
        }));

        setDeals(normalizedItems);
      } catch (err) {
        console.error("Error fetching deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const getCategory = (item) =>
    item.category || item.main_category || item.product_category || "Others";

  const getDiscount = (item) =>
    item.discount ?? item.discount_percent ?? 0;

  const groupByCategory = (items) =>
    items.reduce((acc, item) => {
      const cat = getCategory(item);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

  // ✅ SAME AS SEARCH PAGE
  const handleCardClick = (product) => {
    if (!product.product_name || !product.brand) return;

    navigate(
      `/compare?product_name=${encodeURIComponent(
        product.product_name
      )}&brand=${encodeURIComponent(product.brand)}`
    );
  };

  if (loading) return <p className="text-center mt-5">Loading deals...</p>;
  if (!deals.length)
    return <p className="text-center mt-5">No deals available.</p>;

  return (
    <div style={{ padding: "40px 8%" }}>
      <h2 style={{ fontSize: "32px", fontWeight: 700 }}>
        Today’s Top Deals
      </h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Best offers across categories with genuine discounts
      </p>

      {Object.entries(groupByCategory(deals)).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: "50px" }}>
          <h3 style={{ marginBottom: "20px" }}>{cat}</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {items.map((item, idx) => (
              <div
                key={`${item.product_url}-${idx}`}
                onClick={() => handleCardClick(item)}
                style={{
                  cursor: "pointer",
                  background: "#fff",
                  borderRadius: "18px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  padding: "16px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    background: "#c7f000",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {getDiscount(item)}% OFF
                </span>

                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.product_name}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "contain",
                  }}
                  onError={(e) =>
                    (e.target.src = "/placeholder.png")
                  }
                />

                <h6 style={{ marginTop: "10px", fontWeight: 600 }}>
                  {item.product_name}
                </h6>
                <p style={{ color: "#666", fontSize: "13px" }}>
                  {item.brand}
                </p>

                <div style={{ margin: "8px 0" }}>
                  <strong>₹{item.final_price}</strong>{" "}
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#999",
                      fontSize: "13px",
                      marginLeft: "6px",
                    }}
                  >
                    ₹{item.price}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginTop: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href={item.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Buy
                  </a>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        ...item,
                        url: item.product_url,
                        platform: "deals",
                      });
                    }}
                  >
                    Cart
                  </button>

                  <button
                    className="btn btn-warning btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWishlist({
                        ...item,
                        url: item.product_url,
                        platform: "deals",
                      });
                    }}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
