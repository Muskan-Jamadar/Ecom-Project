// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ user }) {
  const location = useLocation();

  // Define which routes should be protected
  const protectedPaths = ["/search", "/compare", "/deals"];

  // If user is not logged in and tries to access protected routes → redirect to login
  if (!user && protectedPaths.includes(location.pathname)) {
    return <Navigate to="/login" />;
  }

  // Otherwise, allow the page to render
  return <Outlet />;
}
