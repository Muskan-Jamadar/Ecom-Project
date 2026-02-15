import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DealsHomePage() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/deal-categories")
      .then(res => setCards(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container my-4">

      <h3 className="mb-3">🔥 Top deals on fashion</h3>
      <div className="d-flex gap-3 overflow-auto mb-5">
        {cards.slice(0, 4).map((c, i) => (
          <DealCard
            key={i}
            data={c}
            onClick={() => navigate(`/search?category=${c.category}`)}
          />
        ))}
      </div>

      <h3 className="mb-3">💰 Budget deals</h3>
      <div className="d-flex gap-3 overflow-auto">
        {cards.slice(4, 8).map((c, i) => (
          <DealCard
            key={i}
            data={c}
            onClick={() => navigate(`/search?category=${c.category}`)}
          />
        ))}
      </div>

    </div>
  );
}

function DealCard({ data, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        minWidth: "220px",
        cursor: "pointer",
        textAlign: "center"
      }}
    >
      <img
        src={data.image || "/placeholder.png"}
        alt={data.category}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
          borderRadius: "20px"
        }}
      />
      <h6 className="mt-2">{data.category}</h6>
      <p className="fw-bold mb-0">From ₹{data.from_price}</p>
      <p className="text-success small">Min. {data.min_discount}% Off</p>
    </div>
  );
}
