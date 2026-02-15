// import React, { useState, useEffect, useCallback } from "react";
// import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import VoiceAssistant from "./components/VoiceAssistant";

// import LandingPage from "./pages/LandingPage";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import SearchPage from "./pages/SearchPage";
// import ComparisonPage from "./pages/ComparisonPage";
// import DealsPage from "./pages/DealsPage";
// import CartPage from "./pages/CartPage";
// import WishlistPage from "./pages/WishlistPage";

// import ProtectedRoute from "./components/ProtectedRoute";

// export default function App() {
//   const [user, setUser] = useState(null);

//   // 🔍 Search & filter state (GLOBAL)
//   const [query, setQuery] = useState("");
//   const [category, setCategory] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [rating, setRating] = useState("");
//   const [sort, setSort] = useState("relevance");

//   const navigate = useNavigate();
//   const location = useLocation();

//   // ----------------------------------
//   // LOAD SAVED USER
//   // ----------------------------------
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser && savedUser !== "undefined") {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch {
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   // ----------------------------------
//   // LOGOUT
//   // ----------------------------------
//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/", { replace: true });
//   };

//   // ----------------------------------
//   // HIDE NAVBAR / VOICE ON PUBLIC PAGES
//   // ----------------------------------
//   const hideComponents = ["/", "/login", "/signup"].includes(location.pathname);

//   // ----------------------------------
//   // 🔑 SEARCH TRIGGER (NO NAVIGATION)
//   // ----------------------------------
//   const runSearch = useCallback(() => {
//     // ❌ DO NOT NAVIGATE ANYWHERE
//     // SearchPage listens to state changes and fetches results
//     // This keeps everything on /search
//   }, []);

//   return (
//     <div>
//       {!hideComponents && <Navbar user={user} onLogout={handleLogout} />}

//       {!hideComponents && (
//         <VoiceAssistant
//           setQuery={setQuery}
//           setCategory={setCategory}
//           setMinPrice={setMinPrice}
//           setMaxPrice={setMaxPrice}
//           setRating={setRating}
//           setSort={setSort}
//           runSearch={runSearch}
//           onLogout={handleLogout}
//         />
//       )}

//       <div className="container mt-4">
//         <Routes>
//           {/* ---------------- PUBLIC ---------------- */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<LoginPage setUser={setUser} />} />
//           <Route path="/signup" element={<SignupPage />} />

//           {/* ---------------- PROTECTED ---------------- */}
//           <Route element={<ProtectedRoute user={user} />}>
//             <Route
//               path="/search"
//               element={
//                 <SearchPage
//                   query={query}
//                   setQuery={setQuery}
//                   category={category}
//                   setCategory={setCategory}
//                   minPrice={minPrice}
//                   setMinPrice={setMinPrice}
//                   maxPrice={maxPrice}
//                   setMaxPrice={setMaxPrice}
//                   rating={rating}
//                   setRating={setRating}
//                   sort={sort}
//                   setSort={setSort}
//                 />
//               }
//             />

//             <Route path="/compare" element={<ComparisonPage />} />
//             <Route path="/deals" element={<DealsPage />} />
//             <Route path="/cart" element={<CartPage />} />
//             <Route path="/wishlist" element={<WishlistPage />} />
//           </Route>

//           {/* ---------------- FALLBACK ---------------- */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import VoiceAssistant from "./components/VoiceAssistant";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SearchPage from "./pages/SearchPage";
import ComparisonPage from "./pages/ComparisonPage";
import DealsPage from "./pages/DealsPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { useSearch } from "./context/SearchContext";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔍 SEARCH CONTEXT (GLOBAL)
  const {
    setQuery,
    setMinPrice,
    setMaxPrice,
    setRating,
    setSort,
    setCategory,
  } = useSearch();

  /* LOAD USER */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/", { replace: true });
  };

  const hideComponents = ["/", "/login", "/signup"].includes(
    location.pathname
  );

  return (
    <div>
      {!hideComponents && (
        <Navbar user={user} onLogout={handleLogout} />
      )}

      {/* ✅ SINGLE GLOBAL VOICE ASSISTANT */}
      {!hideComponents && (
        <VoiceAssistant
          setQuery={setQuery}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          setRating={setRating}
          setSort={setSort}
          setCategory={setCategory}
          onLogout={handleLogout}
        />
      )}

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
