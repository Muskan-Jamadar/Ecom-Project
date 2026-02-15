import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  const cardStyle = {
    borderRadius: "16px",
    padding: "40px 30px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  };

  const inputStyle = {
    borderRadius: "8px",
    padding: "12px 15px",
    fontSize: "16px",
  };

  const buttonStyle = {
    borderRadius: "8px",
    background: "#c7f000",
    color: "#333",
    fontWeight: "600",
    padding: "12px",
    fontSize: "16px",
    border: "none",
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
    padding: "20px",
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", maxWidth: "450px" }}>
        <div style={cardStyle}>
          <h3 className="mb-4 text-center" style={{ fontWeight: "700", color: "#333" }}>
            Create Account
          </h3>
          {error && (
            <div className="alert alert-danger" style={{ borderRadius: "8px" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: "500" }}>Username</label>
              <input
                type="text"
                className="form-control"
                style={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: "500" }}>Email</label>
              <input
                type="email"
                className="form-control"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: "500" }}>Password</label>
              <input
                type="password"
                className="form-control"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <p className="text-center mt-3" style={{ color: "#666", fontSize: "14px" }}>
            Already have an account? <span style={{ color: "#4A90E2", cursor: "pointer" }} onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}
