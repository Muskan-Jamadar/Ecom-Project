// import React from "react";
// import ReactDOM from "react-dom/client";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "./index.css"; 
// <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>



// import { CartProvider } from "./context/CartContext";
// import { WishlistProvider } from "./context/WishlistContext";


// import App from "./App";
// import { BrowserRouter } from "react-router-dom";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <CartProvider>
//     <WishlistProvider>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </WishlistProvider>
//   </CartProvider>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SearchProvider } from "./context/SearchContext"; // ✅ import SearchProvider

import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <WishlistProvider>
        <SearchProvider> {/* ✅ Wrap your app in SearchProvider */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SearchProvider>
      </WishlistProvider>
    </CartProvider>
  </React.StrictMode>
);
