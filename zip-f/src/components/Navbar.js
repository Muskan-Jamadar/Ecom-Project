import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaClipboardList,
  FaShoppingCart,
  FaMicrophone,
  FaTags,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar({ user, onLogout }) {
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const [listening, setListening] = useState(false);

  // 🔊 Listen to voice assistant events
  useEffect(() => {
    const handler = (e) => setListening(e.detail);
    window.addEventListener("voice-listening", handler);
    return () => window.removeEventListener("voice-listening", handler);
  }, []);

  const handleMicClick = () => {
    if (window.startVoiceSearch) {
      window.startVoiceSearch();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-transparent py-3">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-3 text-dark mb-1" to="/search">
          E-Compare
        </Link>

        {/* Hamburger */}
        {user && (
          <button
            className="navbar-toggler border-0 mb-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        {/* Nav links */}
        <div id="nav" className="collapse navbar-collapse justify-content-center">
          {user && (
            <ul className="navbar-nav d-flex flex-row align-items-center gap-3 ms-auto">

              {/* Deals */}
              <li className="nav-item">
                <NavLink className="nav-link text-dark" to="/deals">
                  <FaTags size={20} />
                </NavLink>
              </li>

              {/* 🎤 MIC WITH LISTENING INDICATOR */}
              <li className="nav-item position-relative">
                <button
                  onClick={handleMicClick}
                  className="btn p-0 border-0 bg-transparent nav-link"
                >
                  <FaMicrophone
                    size={20}
                    className={listening ? "mic-listening" : ""}
                  />
                </button>

                {listening && (
                  <span className="listening-text">Listening…</span>
                )}
              </li>

              {/* Cart */}
              <li className="nav-item">
                <NavLink className="nav-link position-relative text-dark" to="/cart">
                  <FaShoppingCart size={20} />
                  {cart.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cart.length}
                    </span>
                  )}
                </NavLink>
              </li>

              {/* Wishlist */}
              <li className="nav-item">
                <NavLink
                  className="nav-link position-relative text-dark"
                  to="/wishlist"
                >
                  <FaClipboardList size={20} />
                  {wishlist.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {wishlist.length}
                    </span>
                  )}
                </NavLink>
              </li>

              {/* Logout */}
              <li className="nav-item">
                <button
                  className="btn btn-danger btn-sm px-3"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
