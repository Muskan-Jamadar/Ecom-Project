// src/components/CategorySidebar.js
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function CategorySidebar({ category, setCategory }) {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({}); // track expanded state for subcategories

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        // transform string list to object for subcategories
        const formatted = data.map((cat) =>
          typeof cat === "string" ? { name: cat, subcategories: [] } : cat
        );
        setCategories(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleExpand = (name) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActive = (name) => category === name;

  return (
    <div className="category-sidebar border-end pe-3">
      <h5 className="fw-bold mb-3">Categories</h5>
      <ul className="list-unstyled">
        {categories.map((cat, idx) => (
          <li key={idx} className="mb-2">
            <div
              className={`d-flex justify-content-between align-items-center py-1 px-2 rounded ${
                isActive(cat.name) ? "bg-warning text-dark fw-bold" : "hover-bg"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (cat.subcategories.length) toggleExpand(cat.name);
                else setCategory(cat.name);
              }}
            >
              <span>{cat.name}</span>
              {cat.subcategories.length > 0 &&
                (expanded[cat.name] ? <FaChevronUp /> : <FaChevronDown />)}
            </div>

            {/* Subcategories */}
            {cat.subcategories.length > 0 && expanded[cat.name] && (
              <ul className="list-unstyled ms-3 mt-1">
                {cat.subcategories.map((sub, i) => (
                  <li
                    key={i}
                    className={`py-1 px-2 rounded ${
                      isActive(sub) ? "bg-warning text-dark fw-bold" : "hover-bg"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setCategory(sub)}
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Extra CSS */}
      <style>
        {`
          .hover-bg:hover {
            background-color: rgba(255,215,0,0.2);
          }
        `}
      </style>
    </div>
  );
}
