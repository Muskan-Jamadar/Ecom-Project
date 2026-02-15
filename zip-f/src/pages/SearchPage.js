// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import VoiceAssistant from "../components/VoiceAssistant";
// import Recommendations from "../components/Recommendations";

// <div style={{
//   background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)", // landing page gradient
//   color: "#fff",
//   padding: "20px 30px",
//   borderRadius: "16px",
//   textAlign: "center",
//   fontSize: "1.8rem",
//   fontWeight: "700",
//   marginBottom: "25px",
//   boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
//   transition: "all 0.3s ease",
//   fontFamily: "'Poppins', sans-serif", // match landing page
// }}
// onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)"}
// onMouseLeave={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"}
// >
//   🛒 Welcome to My E-Commerce Shop
// </div>


// export default function SearchPage() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [viewAll, setViewAll] = useState(false);
//   const [recommendations, setRecommendations] = useState([]);
//   const [recommendationLabel, setRecommendationLabel] = useState("🔥 Recommended For You");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [rating, setRating] = useState("");
//   const [sort, setSort] = useState("");
//   const [category, setCategory] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [brand, setBrand] = useState("");
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState([]);

//   const navigate = useNavigate();

//   // Load categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/categories");
//         const data = await res.json();
//         setCategories(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Load saved state
//   useEffect(() => {
//     const savedQuery = localStorage.getItem("searchQuery");
//     const savedResults = JSON.parse(localStorage.getItem("searchResults") || "[]");
//     const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
//     const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

//     if (savedQuery) setQuery(savedQuery);
//     if (savedResults.length > 0) setResults(savedResults);
//     setCart(savedCart);
//     setWishlist(savedWishlist);
//   }, []);

//   // Fetch recommendations
//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/recommendations", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             search_history: JSON.parse(localStorage.getItem("searchHistory") || "[]"),
//             cart,
//             wishlist,
//             purchases: JSON.parse(localStorage.getItem("purchases") || "[]")
//           }),
//         });
//         const data = await res.json();
//         const recs = data.recommendations || [];
//         setRecommendationLabel(data.message?.toLowerCase().includes("trending") ? "🔥 Trending Products" : "🔥 Recommended For You");
//         setRecommendations(recs);
//       } catch (err) {
//         console.error("Error fetching recommendations:", err);
//         setRecommendations([]);
//         setRecommendationLabel("🔥 Recommended For You");
//       }
//     };
//     fetchRecommendations();
//   }, [cart, wishlist]);

//   // ----------------------------- SEARCH FUNCTION -----------------------------
//   const runSearch = async () => {
//     let url = `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`;
//     if (minPrice) url += `&min_price=${minPrice}`;
//     if (maxPrice) url += `&max_price=${maxPrice}`;
//     if (rating) url += `&min_rating=${rating}`;
//     if (sort) url += `&sort=${sort}`;
//     if (category) url += `&category=${encodeURIComponent(category)}`;
//     if (brand) url += `&brand=${encodeURIComponent(brand)}`;

//     try {
//       const res = await fetch(url);
//       const data = await res.json();
//       const finalResults = Array.isArray(data) ? data : [];
//       setResults(finalResults);

//       localStorage.setItem("searchQuery", query);
//       localStorage.setItem("searchResults", JSON.stringify(finalResults));

//       const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
//       if (!history.includes(query)) {
//         localStorage.setItem("searchHistory", JSON.stringify([query, ...history].slice(0, 20)));
//       }
//     } catch (err) {
//       console.error("Error fetching search results:", err);
//       setResults([]);
//     }
//   };

//   // ----------------------------- CLEAR FILTERS -----------------------------
//   const clearFilters = () => {
//     setMinPrice("");
//     setMaxPrice("");
//     setRating("");
//     setSort("");
//     setCategory("");
//     setBrand("");
//     runSearch();
//   };

//   // ----------------------------- NAVIGATE TO COMPARE -----------------------------
//   const handleCompare = (product) => {
//     const productName = product.product_name || product.short_name || "";
//     const brandName = product.brand || "";
//     if (!productName || !brandName) return;
//     navigate(`/compare?product_name=${encodeURIComponent(productName)}&brand=${encodeURIComponent(brandName)}`);
//   };

//   const RatingStars = ({ rating }) => {
//     const fullStars = Math.floor(rating || 0);
//     const emptyStars = 5 - fullStars;
//     return (
//       <div style={{ display: "flex", gap: "2px", fontSize: "14px" }}>
//         {[...Array(fullStars)].map((_, i) => <span key={i} style={{ color: "#FFD700" }}>★</span>)}
//         {[...Array(emptyStars)].map((_, i) => <span key={i + fullStars} style={{ color: "#ccc" }}>★</span>)}
//         <span style={{ marginLeft: "5px", color: "#555", fontSize: "13px" }}>{rating ? rating.toFixed(1) : "0.0"}</span>
//       </div>
//     );
//   };

//   return (
//     <div style={{ minHeight: "100vh", padding: "20px 30px", backgroundColor: "#f4f5f7" }}>
//       {/* Header */}
//       <div style={{
//         backgroundColor: "#007bff",
//         color: "#fff",
//         padding: "15px 30px",
//         borderRadius: "10px",
//         textAlign: "center",
//         fontSize: "1.5rem",
//         fontWeight: "600",
//         marginBottom: "20px",
//       }}>
//         🛒 Welcome to My E-Commerce Shop
//       </div>

//       {/* Categories */}
//       <div className="mb-3" style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
//         {categories.map((c, i) => (
//           <button
//             key={i}
//             className={`btn ${category === c ? "btn-primary" : "btn-outline-primary"}`}
//             onClick={() => { setCategory(c); runSearch(); }}
//           >
//             {c}
//           </button>
//         ))}
//       </div>

//       {/* Search Bar */}
//       <div className="input-group mb-4">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search for products..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && runSearch()}
//         />
//         <button className="btn btn-primary" onClick={runSearch}>Search</button>
//       </div>

//       {/* Voice Assistant */}
//       <div className="text-center mb-4">
//         <VoiceAssistant
//           setQuery={setQuery}
//           setCategory={setCategory}
//           setMinPrice={setMinPrice}
//           setMaxPrice={setMaxPrice}
//           setRating={setRating}
//           setSort={setSort}
//           runSearch={runSearch}
//         />
//       </div>

//       <div className="row">
//         {/* Sidebar Filters */}
//         <div className="col-md-3 mb-4">
//           <div className="card p-3 shadow-sm" style={{ position: "sticky", top: "20px", borderRadius: "12px" }}>
//             <h5>Filters</h5>
//             <div className="mb-3">
//               <label className="form-label">Brand</label>
//               <input type="text" className="form-control" value={brand} onChange={(e) => setBrand(e.target.value)} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Min Price</label>
//               <input type="number" className="form-control" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Max Price</label>
//               <input type="number" className="form-control" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Min Rating</label>
//               <select className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
//                 <option value="">All</option>
//                 <option value="1">⭐ 1+</option>
//                 <option value="2">⭐ 2+</option>
//                 <option value="3">⭐ 3+</option>
//                 <option value="4">⭐ 4+</option>
//               </select>
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Sort By</label>
//               <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
//                 <option value="">Default</option>
//                 <option value="price_asc">Price: Low to High</option>
//                 <option value="price_desc">Price: High to Low</option>
//                 <option value="discount_desc">Discount: High to Low</option>
//                 <option value="rating_desc">Rating: High to Low</option>
//               </select>
//             </div>
//             <button className="btn btn-primary w-100 mb-2" onClick={runSearch}>Apply Filters</button>
//             <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>Clear Filters</button>
//           </div>
//         </div>

//         {/* Search Results */}
//         <div className="col-md-9">
//           <div className="row">
//             {results.length > 0 ? (
//               <>
//                 {(() => {
//                   const realTimeProducts = results.filter(p => p.is_real_time);
//                   const otherProducts = results.filter(p => !p.is_real_time);

//                   const displayedRealTime = viewAll ? realTimeProducts : realTimeProducts.slice(0, 4);
//                   const displayedOther = viewAll ? otherProducts : otherProducts.slice(0, 8 - displayedRealTime.length);
//                   const displayed = [...displayedRealTime, ...displayedOther];

//                   return displayed.map((p, idx) => (
//                     <div key={idx} className="col-md-6 col-sm-12 mb-4">
//                       <div
//                         style={{
//                           backgroundColor: p.is_real_time ? "#fffbe6" : "#fff",
//                           borderRadius: "12px",
//                           padding: "12px",
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//                           cursor: "pointer",
//                           position: "relative",
//                           border: p.is_real_time ? "1px solid #ffd700" : "1px solid transparent",
//                         }}
//                         onClick={() => handleCompare(p)}
//                       >
//                         <img
//                           src={p.image || "/placeholder.png"}
//                           alt={p.product_name}
//                           style={{ width: "100%", height: "180px", objectFit: "contain", borderRadius: "8px", marginBottom: "10px" }}
//                           onError={(e) => { e.target.src = "/placeholder.png"; }}
//                         />
//                         <h6 style={{ fontSize: "14px", marginBottom: "5px" }}>
//                           {p.product_name} {p.is_real_time && <span style={{ color: "#ff9800", fontSize: "12px" }}>★ Real-time</span>}
//                         </h6>
//                         <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginTop: "5px" }}>
//                           <span>₹{p.final_price || p.price}</span>
//                           {p.rating && <RatingStars rating={p.rating} />}
//                         </div>
//                       </div>
//                     </div>
//                   ));
//                 })()}
//                 {results.length > 8 && (
//                   <div className="col-12 text-center mt-3">
//                     <button className="btn btn-outline-primary" onClick={() => setViewAll(!viewAll)}>
//                       {viewAll ? "Show Less" : "View All"}
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="col-12 text-center text-muted">No products. Try searching.</div>
//             )}
//           </div>

//           {/* Recommendations */}
//           {recommendations.length > 0 && (
//             <Recommendations products={recommendations} label={recommendationLabel} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import VoiceAssistant from "../components/VoiceAssistant";
// import Recommendations from "../components/Recommendations";

// export default function SearchPage() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [viewAll, setViewAll] = useState(false);
//   const [recommendations, setRecommendations] = useState([]);
//   const [recommendationLabel, setRecommendationLabel] = useState("🔥 Recommended For You");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [rating, setRating] = useState("");
//   const [sort, setSort] = useState("");
//   const [category, setCategory] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [brand, setBrand] = useState("");
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState([]);

//   const navigate = useNavigate();
//   const categoryScrollRef = useRef(null);

//   // ✅ FETCH CATEGORIES – same logic
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/categories");
//         const data = await res.json();
//         setCategories(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // ✅ LOAD SAVED STATE – unchanged
//   useEffect(() => {
//     const savedQuery = localStorage.getItem("searchQuery");
//     const savedResults = JSON.parse(localStorage.getItem("searchResults") || "[]");
//     const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
//     const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

//     if (savedQuery) setQuery(savedQuery);
//     if (savedResults.length > 0) setResults(savedResults);
//     setCart(savedCart);
//     setWishlist(savedWishlist);
//   }, []);

//   // ✅ SEARCH LOGIC – unchanged
//   const runSearch = async () => {
//     let url = `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`;
//     if (minPrice) url += `&min_price=${minPrice}`;
//     if (maxPrice) url += `&max_price=${maxPrice}`;
//     if (rating) url += `&min_rating=${rating}`;
//     if (sort) url += `&sort=${sort}`;
//     if (category) url += `&category=${encodeURIComponent(category)}`;
//     if (brand) url += `&brand=${encodeURIComponent(brand)}`;

//     try {
//       const res = await fetch(url);
//       const data = await res.json();
//       setResults(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error fetching search results:", err);
//       setResults([]);
//     }
//   };

//   // ✅ CARD SCROLL BUTTONS
//   const scrollLeft = () => {
//     categoryScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     categoryScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
//   };

//   return (
//     <div style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "20px" }}>

//       {/* ✅ SEARCH BAR BELOW NAVBAR */}
//       <div className="d-flex justify-content-center mb-4">
//         <div className="input-group" style={{ maxWidth: "600px" }}>
//           <input
//             type="text"
//             className="form-control rounded-start"
//             placeholder="Search for products..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && runSearch()}
//           />
//           <button className="btn btn-primary rounded-end" onClick={runSearch}>
//             Search
//           </button>
//         </div>
//       </div>

//       {/* ✅ CATEGORY SECTION WITH ARROWS */}
//       <div style={{ position: "relative", marginBottom: "30px" }}>
//         <button
//   onClick={scrollLeft}
//   style={{
//     position: "absolute",
//     left: "-10px",
//     top: "40%",
//     zIndex: 10,
//     background: "#ffffff",
//     border: "none",
//     width: "42px",
//     height: "42px",
//     borderRadius: "50%",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//     fontSize: "18px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
//   }}
// >
//   ❮
// </button>


//         <div
//           ref={categoryScrollRef}
//           style={{
//             display: "flex",
//             overflowX: "hidden",
//             scrollBehavior: "smooth",
//             gap: "16px",
//             padding: "0 40px"
//           }}
//         >
//           {categories.map((c, i) => (
//   <div
//     key={i}
//     onClick={() => { setCategory(c); runSearch(); }}
//     style={{
//       minWidth: "200px",
//       cursor: "pointer",
//       textAlign: "center"
//     }}
//   >
//     <div
//       style={{
//         width: "200px",
//         height: "140px",

//         // ✅ Correct path to your public/assets folder
//         backgroundImage: `url(/assets/card-${i + 1}.jpg)`,

//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         borderRadius: "12px"
//       }}
//     ></div>

//     {/* Backend name stays */}
//     <div style={{ marginTop: "8px", fontWeight: "500" }}>
//       {c}
//     </div>
//   </div>
// ))}
//         </div>

//         <button
//   onClick={scrollRight}
//   style={{
//     position: "absolute",
//     right: "-10px",
//     top: "40%",
//     zIndex: 10,
//     background: "#ffffff",
//     border: "none",
//     width: "42px",
//     height: "42px",
//     borderRadius: "50%",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//     fontSize: "18px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
//   }}
// >
//   ❯
// </button>

//       </div>

//       {/* ✅ RESULTS (NO "No products found" text now) */}
//       <div className="row">
//         {results.map((p, idx) => (
//           <div key={idx} className="col-md-3 mb-4">
//             <div
//               onClick={() =>
//                 navigate(`/compare?product_name=${encodeURIComponent(p.product_name || "")}`)
//               }
//               style={{
//                 cursor: "pointer",
//                 borderRadius: "12px",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//                 padding: "10px",
//                 background: "#fff"
//               }}
//             >
//               <img
//                 src={p.image || "/placeholder.png"}
//                 alt={p.product_name}
//                 style={{
//                   width: "100%",
//                   height: "180px",
//                   objectFit: "contain"
//                 }}
//               />
//               <h6 style={{ fontSize: "14px", marginTop: "10px" }}>
//                 {p.product_name}
//               </h6>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ✅ Recommendations untouched */}
//       {recommendations.length > 0 && (
//         <Recommendations products={recommendations} label={recommendationLabel} />
//       )}
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import VoiceAssistant from "../components/VoiceAssistant";
// import Recommendations from "../components/Recommendations";

// const getImageSrc = (index) => {
//   // returns the first valid-looking image URL
//   // since we can't check existence synchronously, just try jpg first, fallback handled in <img>
//   return `/assets/card-${index + 1}.jpg`;
// };


// export default function SearchPage() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [viewAll, setViewAll] = useState(false);
//   const [recommendations, setRecommendations] = useState([]);
//   const [recommendationLabel, setRecommendationLabel] = useState("🔥 Recommended For You");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [rating, setRating] = useState("");
//   const [sort, setSort] = useState("");
//   const [category, setCategory] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [brand, setBrand] = useState("");
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState([]);

//   const navigate = useNavigate();
//   const categoryScrollRef = useRef(null);

//   // ✅ FETCH CATEGORIES
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/categories");
//         const data = await res.json();
//         setCategories(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // ✅ LOAD SAVED STATE
//   useEffect(() => {
//     const savedQuery = localStorage.getItem("searchQuery");
//     const savedResults = JSON.parse(localStorage.getItem("searchResults") || "[]");
//     const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
//     const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

//     if (savedQuery) setQuery(savedQuery);
//     if (savedResults.length > 0) setResults(savedResults);
//     setCart(savedCart);
//     setWishlist(savedWishlist);
//   }, []);

//   // ✅ SEARCH FUNCTION
//   const runSearch = async () => {
//     let url = `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`;
//     if (minPrice) url += `&min_price=${minPrice}`;
//     if (maxPrice) url += `&max_price=${maxPrice}`;
//     if (rating) url += `&min_rating=${rating}`;
//     if (sort) url += `&sort=${sort}`;
//     if (category) url += `&category=${encodeURIComponent(category)}`;
//     if (brand) url += `&brand=${encodeURIComponent(brand)}`;

//     try {
//       const res = await fetch(url);
//       const data = await res.json();
//       setResults(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error fetching search results:", err);
//       setResults([]);
//     }
//   };

//   // ✅ CLEAR FILTERS
//   const clearFilters = () => {
//     setMinPrice("");
//     setMaxPrice("");
//     setRating("");
//     setSort("");
//     setBrand("");
//     runSearch();
//   };

//   // ✅ CATEGORY SCROLL
//   const scrollLeft = () => {
//     categoryScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     categoryScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
//   };

//   return (
//     <div style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "20px" }}>

//       {/* ✅ SEARCH BAR */}
//       <div className="d-flex justify-content-center mb-4">
//         <div className="input-group" style={{ maxWidth: "600px" }}>
//           <input
//             type="text"
//             className="form-control rounded-start"
//             placeholder="Search for products..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && runSearch()}
//           />
//           <button className="btn btn-primary rounded-end" onClick={runSearch}>
//             Search
//           </button>
//         </div>
//       </div>

//       {/* ✅ CATEGORY CAROUSEL */}
//       <div style={{ position: "relative", marginBottom: "30px" }}>
//         <button
//           onClick={scrollLeft}
//           style={{
//             position: "absolute",
//             left: "-10px",
//             top: "40%",
//             zIndex: 10,
//             background: "#fff",
//             border: "none",
//             width: "42px",
//             height: "42px",
//             borderRadius: "50%",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//             fontSize: "18px",
//             cursor: "pointer",
//           }}
//         >
//           ❮
//         </button>

//         <div
//           ref={categoryScrollRef}
//           style={{
//             display: "flex",
//             overflowX: "hidden",
//             scrollBehavior: "smooth",
//             gap: "16px",
//             padding: "0 40px",
//           }}
//         >
//           {/* {categories.map((c, i) => (
//             <div
//               key={i}
//               onClick={() => { setCategory(c); runSearch(); }}
//               style={{
//                 minWidth: "200px",
//                 cursor: "pointer",
//                 textAlign: "center",
//               }}
//             >
//               <div
//                 style={{
//                   width: "200px",
//                   height: "140px",
//                   backgroundImage: `url(/assets/card-${i + 1}.jpg)`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                   borderRadius: "12px",
//                 }}
//               ></div>

//               <div style={{ marginTop: "8px", fontWeight: "500" }}>
//                 {c}
//               </div>
//             </div>
//           ))} */}
// const exts = ["jpg", "jpeg", "png", "webp"]; // possible extensions


// {categories.map((c, i) => (
//   <div
//     key={i}
//     onClick={() => { setCategory(c); runSearch(); }}
//     style={{
//       minWidth: "200px",
//       cursor: "pointer",
//       textAlign: "center",
//     }}
//   >
//     <img
//       src={getImageSrc(i)}
//       alt={c}
//       style={{
//         width: "200px",
//         height: "140px",
//         borderRadius: "12px",
//         objectFit: "cover",
//       }}
//       onError={(e) => {
//         // try other extensions if jpg fails
//         for (let ext of exts) {
//           if (!e.target.src.includes(ext)) {
//             e.target.src = `/assets/card-${i + 1}.${ext}`;
//             break;
//           }
//         }
//       }}
//     />

//     <div style={{ marginTop: "8px", fontWeight: "500" }}>{c}</div>
//   </div>
// ))}


//         </div>

//         <button
//           onClick={scrollRight}
//           style={{
//             position: "absolute",
//             right: "-10px",
//             top: "40%",
//             zIndex: 10,
//             background: "#fff",
//             border: "none",
//             width: "42px",
//             height: "42px",
//             borderRadius: "50%",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//             fontSize: "18px",
//             cursor: "pointer",
//           }}
//         >
//           ❯
//         </button>
//       </div>

//       {/* ✅ MAIN LAYOUT: FILTERS + RESULTS */}
//       <div className="row">

//         {/* ✅ FILTER SIDEBAR */}
//         <div className="col-md-3 mb-4">
//           <div className="card p-3 shadow-sm" style={{ position: "sticky", top: "20px", borderRadius: "12px" }}>
//             <h5>Filters</h5>

//             <div className="mb-3">
//               <label className="form-label">Brand</label>
//               <input type="text" className="form-control" value={brand} onChange={(e) => setBrand(e.target.value)} />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Min Price</label>
//               <input type="number" className="form-control" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Max Price</label>
//               <input type="number" className="form-control" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Min Rating</label>
//               <select className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
//                 <option value="">All</option>
//                 <option value="1">⭐ 1+</option>
//                 <option value="2">⭐ 2+</option>
//                 <option value="3">⭐ 3+</option>
//                 <option value="4">⭐ 4+</option>
//               </select>
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Sort By</label>
//               <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
//                 <option value="">Default</option>
//                 <option value="price_asc">Price: Low to High</option>
//                 <option value="price_desc">Price: High to Low</option>
//                 <option value="discount_desc">Discount: High to Low</option>
//                 <option value="rating_desc">Rating: High to Low</option>
//               </select>
//             </div>

//             <button className="btn btn-primary w-100 mb-2" onClick={runSearch}>Apply Filters</button>
//             <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>Clear Filters</button>
//           </div>
//         </div>

//         {/* ✅ RESULTS */}
//         <div className="col-md-9">
//   <div className="row">
//     {results.map((p, idx) => (
//       <div key={idx} className="col-md-4 mb-4">
//         <div
//           onClick={() =>
//             navigate(
//               `/compare?product_name=${encodeURIComponent(p.product_name)}&brand=${encodeURIComponent(p.brand)}`
//             )
//           }
//           style={{
//             cursor: "pointer",
//             borderRadius: "12px",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//             padding: "10px",
//             background: "#fff",
//           }}
//         >
//           <img
//             src={p.image || "/placeholder.png"}
//             alt={p.product_name}
//             style={{
//               width: "100%",
//               height: "180px",
//               objectFit: "contain",
//             }}
//           />
//           <h6 style={{ fontSize: "14px", marginTop: "10px" }}>
//             {p.product_name}
//           </h6>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>

//           </div>
//         </div>

    

    
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import VoiceAssistant from "../components/VoiceAssistant";

export default function SearchPage() {
  const {
    query,
    setQuery,
    results,
    setResults,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    rating,
    setRating,
    sort,
    setSort,
    category,
    setCategory,
  } = useSearch();

  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState("");

  const navigate = useNavigate();
  const categoryScrollRef = useRef(null);
  const resultsRef = useRef(null);

  // 👇 images from public/assets (NO import needed)
// 👇 images from public/assets (NO import needed)
const getImageSrc = (index) => `/assets/card-${index + 1}.jpg`;


  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  /* ================= SEARCH ================= */
  const runSearch = async () => {
    if (!query && !category) return;

    let url = `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`;
    if (minPrice) url += `&min_price=${minPrice}`;
    if (maxPrice) url += `&max_price=${maxPrice}`;
    if (rating) url += `&min_rating=${rating}`;
    if (sort) url += `&sort=${sort}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (brand) url += `&brand=${encodeURIComponent(brand)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  useEffect(() => {
    runSearch();
  }, [query, minPrice, maxPrice, rating, sort, category, brand]);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setSort("");
    setBrand("");
    setCategory("");
  };

  const handleCategoryClick = (c) => {
    setCategory(c);
    runSearch();
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollLeft = () =>
    categoryScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    categoryScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: "20px" }}>
      {/* ================= VOICE ================= */}
      {/* <VoiceAssistant
        setQuery={(q) => {
          setQuery(q);
          runSearch();
        }}
        setMinPrice={(p) => setMinPrice(p)}
        setMaxPrice={(p) => setMaxPrice(p)}
        setRating={(r) => setRating(r)}
        setSort={(s) => setSort(s)}
        setCategory={(c) => setCategory(c)}
      /> */}

      {/* ================= SEARCH BAR ================= */}
      <div className="d-flex justify-content-center mb-4">
        <div className="input-group" style={{ maxWidth: "600px" }}>
          <input
            className="form-control"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
          <button className="btn btn-primary" onClick={runSearch}>
            Search
          </button>
        </div>
      </div>

      {/* ================= CATEGORY CAROUSEL (UPDATED UI) ================= */}
      <div className="category-carousel-wrapper">
        <button className="carousel-btn left" onClick={scrollLeft}>
          ❮
        </button>

        <div className="category-carousel" ref={categoryScrollRef}>
          {categories.map((c, i) => (
            <div
              key={i}
              className={`category-card ${
                category === c ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(c)}
            >
              <img
                src={getImageSrc(i)}
                alt={c}
                onError={(e) => (e.target.src = "/assets/placeholder.png")}
              />
              <div className="category-overlay">
                <span>{c}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-btn right" onClick={scrollRight}>
          ❯
        </button>
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="row">
        {/* FILTERS */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm sticky-top">
            <h5>Filters</h5>

            <input
              className="form-control mb-2"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <select
              className="form-select mb-2"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="3">⭐ 2+</option>
              <option value="3">⭐ 3+</option>
              <option value="4">⭐ 4+</option>
            </select>

            <select
              className="form-select mb-3"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
              <option value="rating_desc">Rating ↓</option>
            </select>

            <button className="btn btn-primary w-100 mb-2" onClick={runSearch}>
              Apply
            </button>
            <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
              Clear
            </button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="col-md-9" ref={resultsRef}>
          <div className="row">
            {results.map((p, i) => (
              <div key={i} className="col-md-4 mb-4">
                <div
                  className="card p-2 shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(
                      `/compare?product_name=${encodeURIComponent(
                        p.product_name
                      )}&brand=${encodeURIComponent(p.brand)}`
                    )
                  }
                >
                  <img
                    src={p.image || "/assets/placeholder.png"}
                    alt={p.product_name}
                    style={{ height: "180px", objectFit: "contain" }}
                  />
                  <h6 className="mt-2">{p.product_name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

