import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data) {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        navigate("/search", { replace: true });
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  };

  const cardStyle = {
    borderRadius: "12px",
    padding: "40px 30px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    backgroundColor: "#fff",
  };

  const inputStyle = {
    borderRadius: "8px",
    padding: "12px 14px",
    fontSize: "15px",
    border: "1px solid #ddd",
    width: "100%",
    outline: "none",
    marginTop: "5px",
  };

  const buttonStyle = {
    borderRadius: "8px",
    backgroundColor: "#c7f000",
    color: "#333",
    fontWeight: "600",
    padding: "12px",
    fontSize: "16px",
    border: "none",
    width: "100%",
    cursor: "pointer",
  };

  const labelStyle = {
    fontWeight: 500,
    color: "#333",
    fontSize: "14px",
  };

  const footerTextStyle = {
    color: "#666",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "20px",
  };

  const footerLinkStyle = {
    color: "#4A90E2",
    cursor: "pointer",
    marginLeft: "5px",
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={cardStyle}>
          <h3 style={{ textAlign: "center", marginBottom: "30px", fontWeight: 700, color: "#333" }}>
            Login
          </h3>
          {error && (
            <div className="alert alert-danger" style={{ borderRadius: "8px" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <button type="submit" style={buttonStyle}>
              Login
            </button>
          </form>
          <p style={footerTextStyle}>
            Don't have an account?
            <span style={footerLinkStyle} onClick={() => navigate("/signup")}>
              Signup
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
