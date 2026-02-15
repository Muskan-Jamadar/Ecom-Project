// import React, { createContext, useContext, useState, useEffect } from "react";

// const SearchContext = createContext();

// export function SearchProvider({ children }) {
//   const [results, setResults] = useState([]);
//   const [lastQuery, setLastQuery] = useState("");

//   // Load previous results from localStorage
//   useEffect(() => {
//     const savedResults = JSON.parse(localStorage.getItem("searchResults")) || [];
//     const savedQuery = localStorage.getItem("lastQuery") || "";
//     setResults(savedResults);
//     setLastQuery(savedQuery);
//   }, []);

//   // Save results whenever they change
//   useEffect(() => {
//     localStorage.setItem("searchResults", JSON.stringify(results));
//     localStorage.setItem("lastQuery", lastQuery);
//   }, [results, lastQuery]);

//   return (
//     <SearchContext.Provider value={{ results, setResults, lastQuery, setLastQuery }}>
//       {children}
//     </SearchContext.Provider>
//   );
// }

// export function useSearch() {
//   return useContext(SearchContext);
// }


import React, { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState(""); // ✅ add category

  // 🔁 Restore search state on refresh (without results)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("searchState") || "{}");
      if (saved.query) setQuery(saved.query);
      if (saved.minPrice) setMinPrice(saved.minPrice);
      if (saved.maxPrice) setMaxPrice(saved.maxPrice);
      if (saved.rating) setRating(saved.rating);
      if (saved.sort) setSort(saved.sort);
      if (saved.category) setCategory(saved.category); // ✅ restore category
    } catch (err) {
      console.warn("Failed to load search state:", err);
    }
  }, []);

  // 💾 Persist only lightweight state
  useEffect(() => {
    try {
      localStorage.setItem(
        "searchState",
        JSON.stringify({
          query,
          minPrice,
          maxPrice,
          rating,
          sort,
          category, // ✅ save category
        })
      );
    } catch (err) {
      console.warn("Failed to save search state:", err);
    }
  }, [query, minPrice, maxPrice, rating, sort, category]);

  return (
    <SearchContext.Provider
      value={{
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
        setCategory, // ✅ expose setter
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
