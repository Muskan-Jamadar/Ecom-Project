import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch results
  const fetchResults = async (params) => {
    try {
      const res = await fetch(`http://localhost:5000/api/search?${params.toString()}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setResults([]);
    }
  };

  // Run search when query params change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQuery(q);
    fetchResults(params);
  }, [location.search]);

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (rating) params.set("rating", rating);
    if (sort) params.set("sort", sort);
    if (category) params.set("category", category);
    navigate(`/results?${params.toString()}`);
  };

  const handleCompare = (product) => {
    const key = `${product.short_name}_${product.platform}`;
    navigate(`/compare?key=${encodeURIComponent(key)}`);
  };

  const runSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    navigate(`/results?${params.toString()}`);
  };

  return (
    <div className="container-fluid mt-4">
      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-md-8 offset-md-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
            />
            <button className="btn btn-primary" onClick={runSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3 mb-4">
          <div className="card p-3 shadow-sm" style={{ borderRadius: "12px" }}>
            <h5>Filters</h5>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Min Price</label>
              <input
                type="number"
                className="form-control"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Max Price</label>
              <input
                type="number"
                className="form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Min Rating</label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">All</option>
                <option value="1">⭐ 1+</option>
                <option value="2">⭐ 2+</option>
                <option value="3">⭐ 3+</option>
                <option value="4">⭐ 4+</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Sort By</label>
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="discount_desc">Discount: High to Low</option>
                <option value="rating_desc">Rating: High to Low</option>
              </select>
            </div>

            <button className="btn btn-primary w-100" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="col-md-9">
          <h4 className="mb-3">Search Results</h4>
          <div className="row">
            {results.length > 0 ? (
              results.map((p, idx) => (
                <div
                  className="col-sm-6 col-md-4 mb-4"
                  key={idx}
                  onClick={() => handleCompare(p)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow-sm">
                    <img
                      src={p.image || "/placeholder.png"}
                      alt={p.product_name}
                      style={{ height: "200px", objectFit: "contain" }}
                    />
                    <div className="card-body text-center">
                      <h6>{p.product_name}</h6>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-muted">No products found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
