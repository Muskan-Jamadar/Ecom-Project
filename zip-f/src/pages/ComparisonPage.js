// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// export default function ComparePage() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [productData, setProductData] = useState(null);

//   const location = useLocation();

//   const getQueryParams = () => {
//     const params = new URLSearchParams(location.search);
//     return {
//       product_name: params.get("product_name") || "",
//       brand: params.get("brand") || "",
//     };
//   };

//   useEffect(() => {
//     const fetchComparison = async () => {
//       const { product_name, brand } = getQueryParams();
//       if (!product_name || !brand) {
//         setError("Product name or brand missing");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(
//           `http://localhost:5000/compare?product_name=${encodeURIComponent(
//             product_name
//           )}&brand=${encodeURIComponent(brand)}`
//         );
//         const data = await res.json();

//         if (res.ok) {
//           setProductData(data.results);
//         } else {
//           setError(data.error || "Failed to fetch comparison");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComparison();
//   }, [location.search]);

//  const handleAddToCart = (product) => {
//   const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//   cart.push({ ...product, inStock: true }); // ensure inStock true
//   localStorage.setItem("cart", JSON.stringify(cart));
//   // No alert, it will just add immediately
// };

//   const handleAddToWishlist = (product) => {
//     const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
//     wishlist.push(product);
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//     alert("Added to wishlist!");
//   };

//   const RatingStars = ({ rating }) => {
//     const fullStars = Math.floor(rating);
//     const emptyStars = 5 - fullStars;
//     return (
//       <div style={{ display: "flex", gap: "2px", fontSize: "14px" }}>
//         {[...Array(fullStars)].map((_, i) => (
//           <span key={i} style={{ color: "#FFD700" }}>★</span>
//         ))}
//         {[...Array(emptyStars)].map((_, i) => (
//           <span key={i + fullStars} style={{ color: "#ccc" }}>★</span>
//         ))}
//         <span style={{ marginLeft: "5px", color: "#555", fontSize: "13px" }}>
//           {rating ? rating.toFixed(1) : "0.0"}
//         </span>
//       </div>
//     );
//   };

//   if (loading) return <div>Loading comparison...</div>;
//   if (error) return <div style={{ color: "red" }}>{error}</div>;
//   if (!productData) return null;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>{productData.product_name} - {productData.brand}</h2>
//       <img
//         src={productData.image || "/placeholder.png"}
//         alt={productData.product_name}
//         style={{ width: "250px", height: "250px", objectFit: "contain", marginBottom: "20px" }}
//       />

//       <h4>Cheapest Platform: {productData.cheapest_platform} - ₹{productData.cheapest_price}</h4>

//       <div style={{
//   display: "flex",
//   flexWrap: "nowrap",   // ❗ Force single row
//   overflowX: "auto",    // ❗ Enable horizontal scrolling
//   gap: "20px",
//   marginTop: "20px",
//   paddingBottom: "10px"
// }}>

//         {productData.platforms.map((p, idx) => (
//           <div key={idx} style={{
//   border: "1px solid #ccc",
//   borderRadius: "12px",
//   padding: "15px",
//   width: "300px",
//   boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  
//   // FIX TEXT OVERFLOW:
//   overflow: "hidden",
//   wordWrap: "break-word",
//   textOverflow: "ellipsis"
// }}>

//             <h5>{p.platform}</h5>
//             <img
//               src={p.image || "/placeholder.png"}
//               alt={productData.product_name}
//               style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "10px" }}
//             />

//             <p><strong>Product:</strong> {productData.product_name}</p>
//             <p><strong>Brand:</strong> {productData.brand}</p>
//             <p><strong>Description:</strong> {p.description}</p>
//             {p.rating && <RatingStars rating={p.rating} />}
//             <p><strong>Price:</strong> ₹{p.price || "-"}</p>
//             <p><strong>Final Price:</strong> ₹{p.final_price || "-"}</p>
//             <p><strong>Discount:</strong> {p.discount || 0}%</p>

//             <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//               {p.url && (
//   <a
//     href={p.url}
//     target="_blank"
//     rel="noreferrer"
//     className="btn btn-success btn-sm"
//     style={{ width: "100%", textAlign: "center" }}
//   >
//     Buy Now
//   </a>
// )}

//               <button onClick={() => handleAddToCart(p)} className="btn btn-primary btn-sm">Add to Cart</button>
//               <button onClick={() => handleAddToWishlist(p)} className="btn btn-warning btn-sm">Add to Wishlist</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }










// import React, { useEffect, useState, useRef } from "react";
// import { useLocation } from "react-router-dom";

// export default function ComparePage() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [productData, setProductData] = useState(null);

//   const location = useLocation();
//   const scrollRef = useRef(null);

//   const getQueryParams = () => {
//     const params = new URLSearchParams(location.search);
//     return {
//       product_name: params.get("product_name") || "",
//       brand: params.get("brand") || "",
//     };
//   };

//   useEffect(() => {
//     const fetchComparison = async () => {
//       const { product_name, brand } = getQueryParams();
//       if (!product_name || !brand) {
//         setError("Product name or brand missing");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(
//           `http://localhost:5000/compare?product_name=${encodeURIComponent(
//             product_name
//           )}&brand=${encodeURIComponent(brand)}`
//         );
//         const data = await res.json();

//         if (res.ok) {
//           setProductData(data.results);
//         } else {
//           setError(data.error || "Failed to fetch comparison");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComparison();
//   }, [location.search]);

//   const handleAddToCart = (product) => {
//     const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//     cart.push({ ...product, inStock: true });
//     localStorage.setItem("cart", JSON.stringify(cart));
//   };

//   const handleAddToWishlist = (product) => {
//     const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
//     wishlist.push(product);
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//     alert("Added to wishlist!");
//   };

//   const RatingStars = ({ rating }) => {
//     const fullStars = Math.floor(rating);
//     const emptyStars = 5 - fullStars;
//     return (
//       <div style={{ display: "flex", gap: "2px", fontSize: "14px", alignItems: "center" }}>
//         {[...Array(fullStars)].map((_, i) => (
//           <span key={i} style={{ color: "#FFD700" }}>★</span>
//         ))}
//         {[...Array(emptyStars)].map((_, i) => (
//           <span key={i + fullStars} style={{ color: "#ccc" }}>★</span>
//         ))}
//         <span style={{ marginLeft: "5px", color: "#555", fontSize: "13px" }}>
//           {rating ? rating.toFixed(1) : "0.0"}
//         </span>
//       </div>
//     );
//   };

//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
//     }
//   };

//   if (loading) return <div>Loading comparison...</div>;
//   if (error) return <div style={{ color: "red" }}>{error}</div>;
//   if (!productData) return null;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ marginBottom: "10px" }}>{productData.product_name} - {productData.brand}</h2>
      

//       <h4 style={{ marginBottom: "20px" }}>
//         Cheapest Platform: {productData.cheapest_platform} - ₹{productData.cheapest_price}
//       </h4>

//       <div style={{ position: "relative" }}>
//         {/* Left Arrow */}
//         <button
//           onClick={() => scroll("left")}
//           style={{
//             position: "absolute",
//             left: 0,
//             top: "40%",
//             zIndex: 10,
//             background: "#fff",
//             border: "1px solid #ccc",
//             borderRadius: "50%",
//             width: "35px",
//             height: "35px",
//             cursor: "pointer",
//           }}
//         >{"<"}</button>

//         {/* Right Arrow */}
//         <button
//           onClick={() => scroll("right")}
//           style={{
//             position: "absolute",
//             right: 0,
//             top: "40%",
//             zIndex: 10,
//             background: "#fff",
//             border: "1px solid #ccc",
//             borderRadius: "50%",
//             width: "35px",
//             height: "35px",
//             cursor: "pointer",
//           }}
//         >{">"}</button>

//         {/* Platform Cards */}
//         <div
//           ref={scrollRef}
//           style={{
//             display: "flex",
//             gap: "20px",
//             overflowX: "auto",
//             paddingBottom: "10px",
//             scrollBehavior: "smooth",
//           }}
//         >
//           {productData.platforms.map((p, idx) => (
//             <div key={idx} style={{
//               flex: "0 0 300px",
//               backgroundColor: "#f9f9f9",
//               borderRadius: "15px",
//               boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//               padding: "15px",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "space-between",
//             }}>
//               <h5>{p.platform}</h5>
//               <img
//                 src={p.image || "/placeholder.png"}
//                 alt={productData.product_name}
//                 style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "10px", borderRadius: "10px" }}
//               />
//               <p><strong>Description:</strong> {p.description}</p>
//               {p.rating && <RatingStars rating={p.rating} />}
//               <p><strong>Price:</strong> ₹{p.price || "-"}</p>
//               <p><strong>Final Price:</strong> ₹{p.final_price || "-"}</p>
//               <p><strong>Discount:</strong> {p.discount || 0}%</p>
//               <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
//                 {p.url && <a href={p.url} target="_blank" className="btn btn-success">Buy Now</a>}
//                 <button onClick={() => handleAddToCart(p)} className="btn btn-primary">Add to Cart</button>
//                 <button onClick={() => handleAddToWishlist(p)} className="btn btn-warning">Add to Wishlist</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }









// import React, { useEffect, useState, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import Sentiment from "sentiment";

// const sentiment = new Sentiment();

// export default function ComparePage() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [productData, setProductData] = useState(null);

//   const location = useLocation();
//   const scrollRef = useRef(null);

//   const getQueryParams = () => {
//     const params = new URLSearchParams(location.search);
//     return {
//       product_name: params.get("product_name") || "",
//       brand: params.get("brand") || "",
//     };
//   };

//   useEffect(() => {
//     const fetchComparison = async () => {
//       const { product_name, brand } = getQueryParams();
//       if (!product_name || !brand) {
//         setError("Product name or brand missing");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(
//           `http://localhost:5000/compare?product_name=${encodeURIComponent(
//             product_name
//           )}&brand=${encodeURIComponent(brand)}`
//         );
//         const data = await res.json();

//         if (res.ok) {
//           setProductData(data.results);
//         } else {
//           setError(data.error || "Failed to fetch comparison");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComparison();
//   }, [location.search]);

//   const handleAddToCart = (product) => {
//     const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//     cart.push({ ...product, inStock: true });
//     localStorage.setItem("cart", JSON.stringify(cart));
//   };

//   const handleAddToWishlist = (product) => {
//     const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
//     wishlist.push(product);
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//     alert("Added to wishlist!");
//   };

//   const RatingStars = ({ rating }) => {
//     const fullStars = Math.floor(rating);
//     const emptyStars = 5 - fullStars;
//     return (
//       <div style={{ display: "flex", gap: "2px", fontSize: "14px", alignItems: "center" }}>
//         {[...Array(fullStars)].map((_, i) => (
//           <span key={i} style={{ color: "#FFD700" }}>★</span>
//         ))}
//         {[...Array(emptyStars)].map((_, i) => (
//           <span key={i + fullStars} style={{ color: "#ccc" }}>★</span>
//         ))}
//         <span style={{ marginLeft: "5px", color: "#555", fontSize: "13px" }}>
//           {rating ? rating.toFixed(1) : "0.0"}
//         </span>
//       </div>
//     );
//   };

//   const getSentimentStats = (reviews) => {
//     if (!reviews || reviews.length === 0) return { positive: 0, neutral: 0, negative: 0 };
//     const counts = { positive: 0, neutral: 0, negative: 0 };
//     reviews.forEach((r) => {
//       const reviewText = typeof r === "string" ? r : r.text || "";
//       const result = sentiment.analyze(reviewText);
//       if (result.score > 0) counts.positive++;
//       else if (result.score < 0) counts.negative++;
//       else counts.neutral++;
//     });
//     const total = reviews.length;
//     return {
//       positive: Math.round((counts.positive / total) * 100),
//       neutral: Math.round((counts.neutral / total) * 100),
//       negative: Math.round((counts.negative / total) * 100),
//     };
//   };

//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
//     }
//   };

//   if (loading) return <div>Loading comparison...</div>;
//   if (error) return <div style={{ color: "red" }}>{error}</div>;
//   if (!productData) return null;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ marginBottom: "10px" }}>{productData.product_name} - {productData.brand}</h2>
//       <h4 style={{ marginBottom: "20px" }}>
//         Cheapest Platform: {productData.cheapest_platform} - ₹{productData.cheapest_price}
//       </h4>

//       <div style={{ position: "relative" }}>
//         {/* Left Arrow */}
//         <button
//           onClick={() => scroll("left")}
//           style={{
//             position: "absolute",
//             left: 0,
//             top: "40%",
//             zIndex: 10,
//             background: "#f0f0f0",
//             border: "1px solid #ccc",
//             borderRadius: "50%",
//             width: "35px",
//             height: "35px",
//             cursor: "pointer",
//           }}
//         >{"<"}</button>

//         {/* Right Arrow */}
//         <button
//           onClick={() => scroll("right")}
//           style={{
//             position: "absolute",
//             right: 0,
//             top: "40%",
//             zIndex: 10,
//             background: "#f0f0f0",
//             border: "1px solid #ccc",
//             borderRadius: "50%",
//             width: "35px",
//             height: "35px",
//             cursor: "pointer",
//           }}
//         >{">"}</button>

//         {/* Platform Cards */}
//         <div
//           ref={scrollRef}
//           style={{
//             display: "flex",
//             gap: "20px",
//             overflowX: "auto",
//             paddingBottom: "10px",
//             scrollBehavior: "smooth",
//           }}
//         >
//           {productData.platforms.map((p, idx) => {
//             const sentimentStats = getSentimentStats(p.reviews);
//             return (
//               <div key={idx} style={{
//                 flex: "0 0 300px",
//                 backgroundColor: "#fafafa",
//                 borderRadius: "15px",
//                 boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//                 padding: "15px",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}>
//                 <h5>{p.platform}</h5>
//                 <img
//                   src={p.image || "/placeholder.png"}
//                   alt={productData.product_name}
//                   style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "10px", borderRadius: "10px" }}
//                 />
//                 <p><strong>Description:</strong> {p.description}</p>
//                 {p.rating && <RatingStars rating={p.rating} />}
//                 <p><strong>Price:</strong> ₹{p.price || "-"}</p>
//                 <p><strong>Final Price:</strong> ₹{p.final_price || "-"}</p>
//                 <p><strong>Discount:</strong> {p.discount || 0}%</p>

//                 {/* Sentiment Bar */}
//                 <div style={{ marginTop: "10px" }}>
//                   <h6>Review Sentiment</h6>
//                   <div style={{ display: "flex", gap: "5px", fontSize: "12px" }}>
//                     <div style={{ color: "green" }}>Positive: {sentimentStats.positive}%</div>
//                     <div style={{ color: "orange" }}>Neutral: {sentimentStats.neutral}%</div>
//                     <div style={{ color: "red" }}>Negative: {sentimentStats.negative}%</div>
//                   </div>
//                 </div>

//                 <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
//                   {p.url && <a href={p.url} target="_blank" className="btn" style={{ backgroundColor: "#b2dfdb", color: "#000" }}>Buy Now</a>}
//                   <button onClick={() => handleAddToCart(p)} className="btn" style={{ backgroundColor: "#ffe0b2", color: "#000" }}>Add to Cart</button>
//                   <button onClick={() => handleAddToWishlist(p)} className="btn" style={{ backgroundColor: "#d1c4e9", color: "#000" }}>Add to Wishlist</button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState, useRef } from "react";
// import { useLocation } from "react-router-dom";

// export default function ComparePage() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [productData, setProductData] = useState(null);
//   const [reviewAnalysis, setReviewAnalysis] = useState({});

//   const location = useLocation();
//   const scrollRef = useRef(null);

//   const getQueryParams = () => {
//     const params = new URLSearchParams(location.search);
//     return {
//       product_name: params.get("product_name") || "",
//       brand: params.get("brand") || "",
//     };
//   };

//   useEffect(() => {
//     const fetchComparison = async () => {
//       const { product_name, brand } = getQueryParams();
//       if (!product_name || !brand) {
//         setError("Product name or brand missing");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(
//           `http://localhost:5000/compare?product_name=${encodeURIComponent(
//             product_name
//           )}&brand=${encodeURIComponent(brand)}`
//         );
//         const data = await res.json();

//         if (res.ok) {
//           setProductData(data.results);

//           // ✅ FETCH AI REVIEW ANALYSIS
//           try {
//             const sentimentRes = await fetch("http://localhost:5000/api/analyze-reviews");
//             const sentimentData = await sentimentRes.json();

//             const map = {};

//             sentimentData.forEach(file => {
//               file.rows?.forEach(row => {
//                 if (row.product_name) {
//                   map[row.product_name.toLowerCase()] = row.sentimentAnalysis;
//                 }
//               });
//             });

//             setReviewAnalysis(map);
//           } catch (e) {
//             console.log("Sentiment fetch failed", e);
//           }
//         } else {
//           setError(data.error || "Failed to fetch comparison");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComparison();
//   }, [location.search]);

//   const handleAddToCart = (product) => {
//     const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//     cart.push({ ...product, inStock: true });
//     localStorage.setItem("cart", JSON.stringify(cart));
//   };

//   const handleAddToWishlist = (product) => {
//     const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
//     wishlist.push(product);
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//     alert("Added to wishlist!");
//   };

//   const RatingStars = ({ rating }) => {
//     const fullStars = Math.floor(rating);
//     const emptyStars = 5 - fullStars;
//     return (
//       <div style={{ display: "flex", gap: "2px", fontSize: "14px", alignItems: "center" }}>
//         {[...Array(fullStars)].map((_, i) => (
//           <span key={i} style={{ color: "#FFD700" }}>★</span>
//         ))}
//         {[...Array(emptyStars)].map((_, i) => (
//           <span key={i + fullStars} style={{ color: "#ccc" }}>★</span>
//         ))}
//         <span style={{ marginLeft: "5px", color: "#555", fontSize: "13px" }}>
//           {rating ? rating.toFixed(1) : "0.0"}
//         </span>
//       </div>
//     );
//   };

//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
//     }
//   };

//   if (loading) return <div>Loading comparison...</div>;
//   if (error) return <div style={{ color: "red" }}>{error}</div>;
//   if (!productData) return null;

//   const sentiment = reviewAnalysis[productData.product_name?.toLowerCase()];

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ marginBottom: "10px" }}>
//         {productData.product_name} - {productData.brand}
//       </h2>

//       <h4 style={{ marginBottom: "20px" }}>
//         Cheapest Platform: {productData.cheapest_platform} - ₹{productData.cheapest_price}
//       </h4>

//       {/* ✅ Top Review Analysis Section */}
//       {sentiment && (
//         <div style={{
//           marginBottom: "25px",
//           padding: "15px",
//           background: "#eef6ff",
//           borderRadius: "12px",
//           fontSize: "15px",
//           maxWidth: "400px"
//         }}>
//           <h4 style={{ marginBottom: "10px" }}>AI Review Summary</h4>
//           <p>✅ Positive: {sentiment.positive}%</p>
//           <p>😐 Neutral: {sentiment.neutral}%</p>
//           <p>❌ Negative: {sentiment.negative}%</p>
//         </div>
//       )}

//       <div style={{ position: "relative" }}>
//         <button
//           onClick={() => scroll("left")}
//           style={{
//             position: "absolute",
//             left: 0,
//             top: "40%",
//             zIndex: 10,
//             background: "#fff",
//             border: "1px solid #ccc",
//             borderRadius: "50%",
//             width: "35px",
//             height: "35px",
//             cursor: "pointer",
//           }}
//         >{"<"}</button>

//         <button
//           onClick={() => scroll("right")}
//           style={{
//             position: "absolute",
//             right: 0,
//             top: "40%",
//             zIndex: 10,
//             background: "#fff",
//             border: "1px solid #ccc",
//             borderRadius: "50%",
//             width: "35px",
//             height: "35px",
//             cursor: "pointer",
//           }}
//         >{">"}</button>

//         <div
//           ref={scrollRef}
//           style={{
//             display: "flex",
//             gap: "20px",
//             overflowX: "auto",
//             paddingBottom: "10px",
//             scrollBehavior: "smooth",
//           }}
//         >
//           {productData.platforms.map((p, idx) => (
//             <div key={idx} style={{
//               flex: "0 0 300px",
//               backgroundColor: "#f9f9f9",
//               borderRadius: "15px",
//               boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//               padding: "15px",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "space-between",
//             }}>
//               <h5>{p.platform}</h5>
//               <img
//                 src={p.image || "/placeholder.png"}
//                 alt={productData.product_name}
//                 style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "10px", borderRadius: "10px" }}
//               />
//               <p><strong>Description:</strong> {p.description}</p>
//               {p.rating && <RatingStars rating={p.rating} />}
//               <p><strong>Price:</strong> ₹{p.price || "-"}</p>
//               <p><strong>Final Price:</strong> ₹{p.final_price || "-"}</p>
//               <p><strong>Discount:</strong> {p.discount || 0}%</p>

//               {/* ✅ AI Review Analysis inside Card */}
//               {sentiment && (
//                 <div style={{
//                   marginTop: "10px",
//                   padding: "10px",
//                   background: "#eef6ff",
//                   borderRadius: "10px",
//                   fontSize: "14px"
//                 }}>
//                   <p><strong>AI Review Analysis:</strong></p>
//                   <p>Positive: {sentiment.positive}%</p>
//                   <p>Neutral: {sentiment.neutral}%</p>
//                   <p>Negative: {sentiment.negative}%</p>
//                 </div>
//               )}

//               <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
//                 {p.url && <a href={p.url} target="_blank" className="btn btn-success">Buy Now</a>}
//                 <button onClick={() => handleAddToCart(p)} className="btn btn-primary">Add to Cart</button>
//                 <button onClick={() => handleAddToWishlist(p)} className="btn btn-warning">Add to Wishlist</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useState, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// export default function ComparePage() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [productData, setProductData] = useState(null);
//   const [reviewAnalysis, setReviewAnalysis] = useState({});
//   const [recommendationMessage, setRecommendationMessage] = useState("");
//   const [tips, setTips] = useState([]);

//   const location = useLocation();
//   const scrollRef = useRef(null);

//   const { addToCart } = useCart();
//   const { addToWishlist } = useWishlist();

//   const getQueryParams = () => {
//     const params = new URLSearchParams(location.search);
//     return {
//       product_name: params.get("product_name") || "",
//       brand: params.get("brand") || "",
//     };
//   };

//   useEffect(() => {
//     const fetchComparison = async () => {
//       const { product_name, brand } = getQueryParams();
//       if (!product_name || !brand) {
//         setError("Product name or brand missing");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(
//           `http://localhost:5000/compare?product_name=${encodeURIComponent(
//             product_name
//           )}&brand=${encodeURIComponent(brand)}`
//         );
//         const data = await res.json();

//         if (res.ok) {
//           setProductData(data.results);

//           // Fetch review analysis
//           const sentimentRes = await fetch("http://localhost:5000/api/analyze-reviews");
//           const sentimentData = await sentimentRes.json();
//           const map = {};
//           sentimentData.forEach(file => {
//             file.rows?.forEach(row => {
//               if (row.product_name && row.sentimentAnalysis) {
//                 map[row.product_name.toLowerCase()] = row.sentimentAnalysis;
//               }
//             });
//           });
//           setReviewAnalysis(map);

//           // Recommendation message
//           const cheapestPlatform = data.results.cheapest_platform;
//           const cheapestPrice = data.results.cheapest_price;
//           const bestRatingPlatform = data.results.platforms.reduce(
//             (a, b) => (b.rating || 0) > (a.rating || 0) ? b : a,
//             data.results.platforms[0]
//           );

//           const sentimentScores = data.results.platforms.map((p) => {
//             const s = map[data.results.product_name?.toLowerCase()] || {};
//             return { platform: p.platform, positive: s.positive || 0 };
//           });

//           const bestSentiment = sentimentScores.reduce(
//             (a, b) => (b.positive > a.positive ? b : a),
//             sentimentScores[0] || { platform: "", positive: 0 }
//           );

//           setRecommendationMessage(
//             `💡 Recommendation: Buy on ${bestRatingPlatform.platform} for best rating (${bestRatingPlatform.rating}⭐) and ${cheapestPlatform} for lowest price (₹${cheapestPrice}). Platform with happiest users: ${bestSentiment.platform} (${bestSentiment.positive}%)`
//           );

//           // Dynamic AI Tips
//           const avgPrice = data.results.platforms.reduce((sum, p) => sum + (p.effective_price || 0), 0) / data.results.platforms.length;
//           const dynamicTips = [];
//           const priceDiff = avgPrice - cheapestPrice;
//           if (priceDiff > 0) {
//             dynamicTips.push(`💡 Tip: ${cheapestPlatform} is ₹${priceDiff.toFixed(0)} cheaper than average across platforms.`);
//           }
//           if (bestSentiment.platform) {
//             dynamicTips.push(`💡 Tip: Users on ${bestSentiment.platform} are happiest (${bestSentiment.positive}%).`);
//           }
//           setTips(dynamicTips);

//         } else {
//           setError(data.error || "Failed to fetch comparison");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComparison();
//   }, [location.search]);

//   // ==========================
//   // Toast helper
//   // ==========================
//   const showToast = (message, bgColor = "#4caf50") => {
//     const toast = document.createElement("div");
//     toast.innerText = message;
//     toast.style.position = "fixed";
//     toast.style.top = "20px";
//     toast.style.right = "20px";
//     toast.style.padding = "12px 20px";
//     toast.style.backgroundColor = bgColor;
//     toast.style.color = "#fff";
//     toast.style.fontSize = "14px";
//     toast.style.borderRadius = "8px";
//     toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
//     toast.style.zIndex = 9999;
//     document.body.appendChild(toast);
//     setTimeout(() => toast.remove(), 4000);
//   };

//   // ==========================
//   // Handlers
//   // ==========================
//   const handleCartClick = (product) => {
//     addToCart(product);
//     showToast("✅ Added to cart!");
//   };

//   const handleWishlistClick = (product) => {
//     addToWishlist(product);
//     showToast("💖 Added to wishlist!", "#ff9800");
//   };

//   const RatingStars = ({ rating }) => {
//     const fullStars = Math.floor(rating);
//     const emptyStars = 5 - fullStars;
//     return (
//       <div style={{ display: "flex", gap: "2px", fontSize: "14px", alignItems: "center" }}>
//         {[...Array(fullStars)].map((_, i) => <span key={i} style={{ color: "#FFD700" }}>★</span>)}
//         {[...Array(emptyStars)].map((_, i) => <span key={i + fullStars} style={{ color: "#ccc" }}>★</span>)}
//         <span style={{ marginLeft: "5px", color: "#555", fontSize: "13px" }}>
//           {rating ? rating.toFixed(1) : "0.0"}
//         </span>
//       </div>
//     );
//   };

//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
//     }
//   };

//   if (loading) return <div>Loading comparison...</div>;
//   if (error) return <div style={{ color: "red" }}>{error}</div>;
//   if (!productData) return null;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ marginBottom: "10px" }}>
//         {productData.product_name} - {productData.brand}
//       </h2>

//       {/* {recommendationMessage && (
//         <div style={{ background: "#eef6ff", padding: "10px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px" }}>
//           {recommendationMessage}
//         </div>
//       )}

//       {tips.length > 0 && (
//         <div style={{ background: "#f0f8ff", padding: "10px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px" }}>
//           {tips.map((tip, idx) => <p key={idx}>{tip}</p>)}
//         </div>
//       )} */}

//       <h4 style={{ marginBottom: "20px" }}>
//         Cheapest Platform: {productData.cheapest_platform} - ₹{productData.cheapest_price}
//       </h4>

//       <div style={{ position: "relative" }}>
//         <button onClick={() => scroll("left")} style={{ position: "absolute", left: 0, top: "40%", zIndex: 10, background: "#fff", border: "1px solid #ccc", borderRadius: "50%", width: "35px", height: "35px", cursor: "pointer" }}>{"<"}</button>
//         <button onClick={() => scroll("right")} style={{ position: "absolute", right: 0, top: "40%", zIndex: 10, background: "#fff", border: "1px solid #ccc", borderRadius: "50%", width: "35px", height: "35px", cursor: "pointer" }}>{">"}</button>

//         <div ref={scrollRef} style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "10px", scrollBehavior: "smooth" }}>
//           {productData.platforms.map((p, idx) => {
//             const sentiment = reviewAnalysis[productData.product_name?.toLowerCase()];
//             return (
//               <div key={idx} style={{ flex: "0 0 300px", backgroundColor: "#f9f9f9", borderRadius: "15px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", padding: "15px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
//                 <h5>{p.platform}</h5>
//                 <img src={p.image || "/placeholder.png"} alt={productData.product_name} style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "10px", borderRadius: "10px" }} />
//                 <p><strong>Description:</strong> {p.description}</p>
//                 {p.rating && <RatingStars rating={p.rating} />}
//                 <p><strong>Price:</strong> ₹{p.price || "-"}</p>
//                 <p><strong>Final Price:</strong> ₹{p.final_price || "-"}</p>
//                 <p><strong>Discount:</strong> {p.discount || 0}%</p>

//                 {sentiment && (
//                   <div style={{ marginTop: "10px", padding: "10px", background: "#eef6ff", borderRadius: "10px", fontSize: "14px" }}>
//                     <p><strong>AI Review Analysis:</strong></p>
//                     <p>Positive: {sentiment.positive}%</p>
//                     <p>Neutral: {sentiment.neutral}%</p>
//                     <p>Negative: {sentiment.negative}%</p>
//                   </div>
//                 )}

//                 <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
//                   {p.url && <a href={p.url} target="_blank" className="btn btn-success">Buy Now</a>}
//                   <button onClick={() => handleCartClick(p)} className="btn btn-primary">Add to Cart</button>
//                   <button onClick={() => handleWishlistClick(p)} className="btn btn-warning">Add to Wishlist</button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ComparePage() {
  const [loadingCompare, setLoadingCompare] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState("");
  const [productData, setProductData] = useState(null);
  const [reviewAnalysis, setReviewAnalysis] = useState({});
  const [tips, setTips] = useState([]);
  const [recommendationMessage, setRecommendationMessage] = useState("");

  const location = useLocation();
  const scrollRef = useRef(null);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      product_name: params.get("product_name") || "",
      brand: params.get("brand") || "",
    };
  };

  // -------------------- Fetch comparison --------------------
  useEffect(() => {
    const fetchComparison = async () => {
      const { product_name, brand } = getQueryParams();
      if (!product_name || !brand) {
        setError("Product name or brand missing");
        setLoadingCompare(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/compare?product_name=${encodeURIComponent(
            product_name
          )}&brand=${encodeURIComponent(brand)}`
        );
        const data = await res.json();
        if (res.ok) {
          setProductData(data.results);
        } else {
          setError(data.error || "Failed to fetch comparison");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCompare(false);
      }
    };
    fetchComparison();
  }, [location.search]);

  // -------------------- Fetch reviews per platform --------------------
  useEffect(() => {
    if (!productData?.product_name || !productData.platforms?.length) return;

    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const platformQuery = productData.platforms.map(p => p.platform).join(",");
        const res = await fetch(
          `http://localhost:5000/api/analyze-reviews?product_name=${encodeURIComponent(productData.product_name)}&platforms=${encodeURIComponent(platformQuery)}`
        );
        const sentimentData = await res.json();

        const map = {};
        sentimentData.forEach(file => {
          file.rows?.forEach(row => {
            if (row.product_name && row.platform && row.sentimentAnalysis) {
              const key = `${row.product_name.toLowerCase()}_${row.platform.toLowerCase()}`;
              map[key] = row.sentimentAnalysis;
              // Add AI summary from backend if available
              if (row.ai_summary) {
                map[key].ai_summary = row.ai_summary;
              }
            }
          });
        });

        setReviewAnalysis(map);
      } catch (err) {
        console.error("Failed to fetch review analysis:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [productData]);

  // -------------------- Handlers --------------------
  const showToast = (message, bgColor = "#4caf50") => {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.padding = "12px 20px";
    toast.style.backgroundColor = bgColor;
    toast.style.color = "#fff";
    toast.style.fontSize = "14px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    toast.style.zIndex = 9999;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const handleCartClick = (product) => {
    addToCart(product);
    showToast("✅ Added to cart!");
  };

  const handleWishlistClick = (product) => {
    addToWishlist(product);
    showToast("💖 Added to wishlist!", "#ff9800");
  };

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div style={{ display: "flex", gap: "2px", fontSize: "14px", alignItems: "center" }}>
        {[...Array(fullStars)].map((_, i) => <span key={i} style={{ color: "#FFD700" }}>★</span>)}
        {[...Array(emptyStars)].map((_, i) => <span key={i + fullStars} style={{ color: "#ccc" }}>★</span>)}
        <span style={{ marginLeft: "5px", color: "#555", fontSize: "13px" }}>{rating ? rating.toFixed(1) : "0.0"}</span>
      </div>
    );
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  // -------------------- Render --------------------
  if (loadingCompare) return <div>Loading comparison...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!productData) return null;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{productData.product_name} - {productData.brand}</h2>

      {recommendationMessage && (
        <div style={{ background: "#eef6ff", padding: "10px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px" }}>
          {recommendationMessage}
        </div>
      )}

      {tips.length > 0 && (
        <div style={{ background: "#f0f8ff", padding: "10px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px" }}>
          {tips.map((tip, idx) => <p key={idx}>{tip}</p>)}
        </div>
      )}

      <h4>Cheapest Platform: {productData.cheapest_platform} - ₹{productData.cheapest_price}</h4>

      {/* ================= Horizontal Scroll with Arrows ================= */}
      <div className="compare-scroll-wrapper" style={{ position: "relative" }}>
        <button
          className="scroll-btn left"
          onClick={() => scroll("left")}
          style={{
            position: "absolute",
            left: 0,
            top: "45%",
            zIndex: 10,
            background: "#fff",
            border: "none",
            fontSize: "22px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          ❮
        </button>

        <div ref={scrollRef} style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          scrollBehavior: "smooth",
          padding: "10px 40px"
        }}>
          {productData.platforms.map((p, idx) => {
            const key = `${productData.product_name.toLowerCase()}_${p.platform.toLowerCase()}`;
            const sentiment = reviewAnalysis[key];
            return (
              <div key={idx} style={{ flex: "0 0 300px", backgroundColor: "#f9f9f9", borderRadius: "15px", padding: "15px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <h5>{p.platform}</h5>
                <img src={p.image || "/placeholder.png"} alt={productData.product_name} style={{ width: "100%", height: "150px", objectFit: "contain", marginBottom: "10px", borderRadius: "10px" }} />
                <p><strong>Description:</strong> {p.description}</p>
                {p.rating && <RatingStars rating={p.rating} />}
                <p><strong>Price:</strong> ₹{p.price || "-"}</p>
                <p><strong>Final Price:</strong> ₹{p.final_price || "-"}</p>
                <p><strong>Discount:</strong> {p.discount || 0}%</p>

                {loadingReviews ? (
                  <p>Loading review analysis...</p>
                ) : sentiment ? (
                  <>
                    <div style={{ marginTop: "10px", padding: "10px", background: "#eef6ff", borderRadius: "10px", fontSize: "14px" }}>
                      <p><strong>AI Review Analysis:</strong></p>
                      <p>Positive: {sentiment.positive}%</p>
                      <p>Neutral: {sentiment.neutral}%</p>
                      <p>Negative: {sentiment.negative}%</p>
                    </div>

                    {sentiment.ai_summary && (
                      <div style={{ marginTop: "10px", padding: "10px", background: "#dff0d8", borderRadius: "10px", fontSize: "14px" }}>
                        <p><strong>AI Summary:</strong></p>
                        <p>{sentiment.ai_summary}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p>No review analysis available.</p>
                )}

                {/* Buttons aligned in same row */}
                <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "space-between" }}>
                  {p.url && <a href={p.url} target="_blank" className="btn btn-success" style={{ flex: 1, textAlign: "center" }}>Buy Now</a>}
                  <button onClick={() => handleCartClick(p)} className="btn btn-primary" style={{ flex: 1 }}>Add to Cart</button>
                  <button onClick={() => handleWishlistClick(p)} className="btn btn-warning" style={{ flex: 1 }}>Add to Wishlist</button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="scroll-btn right"
          onClick={() => scroll("right")}
          style={{
            position: "absolute",
            right: 0,
            top: "45%",
            zIndex: 10,
            background: "#fff",
            border: "none",
            fontSize: "22px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          ❯
        </button>
      </div>
    </div>
  );
}
