// src/pages/LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

import { FaSearch, FaDollarSign, FaStar } from "react-icons/fa";

 const icons = [<FaSearch size={40} />, <FaDollarSign size={40} />, <FaStar size={40} />];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff" }}>

      {/* NAVBAR */}
      <nav
        style={{
          padding: "18px 8%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          background: "#fff"
        }}
      >
        <h3 style={{ fontWeight: 700 }}>E-Compare</h3>

        <div>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 18px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              background: "transparent",
              marginRight: "10px"
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "8px 18px",
              borderRadius: "12px",
              border: "none",
              background: "#c7f000",
              fontWeight: 600
            }}
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* HERO */}
<section
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",   // ✅ changed from space-between
    gap: "80px",                    // ✅ controlled spacing instead
    padding: "60px 8%"
  }}
>
  {/* IMAGE COLLAGE */}
   <div
    style={{
      display: "grid",
      gridTemplateColumns: "260px 180px",  // wider left column
      gridTemplateRows: "180px 260px",     // proportional bottom row
      gap: "16px",
      width: "550px",   // overall width bigger
      height: "460px",  // maintain square-ish
      overflow: "hidden"
    }}
  >
    <div
      style={{
        backgroundImage: `url("/assets/1.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 20
      }}
    />
    <div
      style={{
        backgroundImage: `url("/assets/2.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 16
      }}
    />
    <div
      style={{
        backgroundImage: `url("/assets/3.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 16
      }}
    />
    <div
      style={{
        backgroundImage: `url("/assets/4.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 20
      }}
    />
  </div>

  {/* TEXT CONTENT */}
  <div style={{ maxWidth: "480px" }}>
    <h1 style={{ fontSize: "42px", fontWeight: 700 }}>
      Compare prices. Shop with confidence.
    </h1>

    <p style={{ color: "#666", marginTop: "16px", lineHeight: "1.6" }}>
      Find the best deals across all your favorite stores — no more endless searching or switching 
      tabs. Save time, save money, and shop smarter with real-time comparisons from Amazon, 
      Flipkart, and more. Whether it’s electronics, fashion, or 
      home essentials, we have got you covered. E-Compare brings everything you need into one place,
       so your next purchase is always the best deal.
    </p>

    <div style={{ marginTop: "28px" }}>
      <button style={primaryBtn} onClick={() => navigate("/signup")}>
        Start now
      </button>
    </div>
  </div>
</section>


      {/* SHOP SMARTER */}
      <section style={{ padding: "60px 8%" }}>
        <h2 style={sectionTitle}>Shop smarter, compare instantly</h2>
        <p style={sectionDesc}>
          Welcome to a new era of online shopping — where every choice is easy, every deal is clear,
          and every product is just a click away. Compare prices, features, and reviews from all your
          favourite stores in one friendly place. Join a community that shops with confidence,
          saves time, and always finds the best value. Your next great find is waiting — let’s discover it together.
        </p>

        <div style={{ marginTop: "20px" }}>
  <button
    style={highlightTab}
    onClick={() => {
      const faqSection = document.getElementById("faq");
      faqSection?.scrollIntoView({ behavior: "smooth" });
    }}
  >
    How it works
  </button>
</div>


  {<section>
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginTop: "50px"
  }}>
    {[
      {
        title: "Smart Search",
        desc: "Find exactly what you need across multiple stores in one easy search."
      },
      {
        title: "Best Deals",
        desc: "Compare prices instantly and never miss out on amazing discounts."
      },
      {
        title: "Verified Ratings",
        desc: "See authentic reviews and ratings to make confident buying decisions."
      }
    ].map((feature, index) => (
      <div style={featureCard} key={index}>
        <div>{icons[index]}</div>
        <h4>{feature.title}</h4>
        <p style={featureDesc}>{feature.desc}</p>
        
      </div>
    ))}
  </div>
</section> }


      </section>

      {/* CAROUSEL */}
      
      <section style={{ padding: "40px 8%"}}>
        <div style={carouselBox}>
          <div style={carouselTrack}>

      <div id="carouselExampleFade" class="carousel slide carousel-fade">
  <div class="carousel-inner">
    <div class="carousel-item active">
       <img style={carouselImg} class="d-block w-100" src="/assets/11.jpg" />
    </div>
    <div class="carousel-item">
      <img style={carouselImg} class="d-block w-100" src="/assets/12.jpg" />
    </div>
    <div class="carousel-item">
      <img style={carouselImg} class="d-block w-100" src="/assets/13.jpg" />
    </div>
    <div class="carousel-item">
      <img style={carouselImg} class="d-block w-100" src="/assets/14.jpg" />
    </div>
    <div class="carousel-item">
      <img style={carouselImg} class="d-block w-100" src="/assets/15.jpg" />
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
 </div>
        </div>
      </section>

      {/* FAQ */}
      <div id="faq">
      <section style={{ padding: "60px 8%" }}>
        <small style={{ color: "#999", textTransform: "uppercase" }}>
          YOUR QUESTIONS, ANSWERED
        </small>

        <h2 style={{ fontSize: "34px", fontWeight: "700", marginTop: "12px" }}>
          Smarter shopping starts with clarity
        </h2>

        <p style={{ maxWidth: "600px", color: "#666", margin: "12px 0 40px" }}>
          Wondering how to get the most out of our platform? Explore answers to common questions
          and see how easy it is to compare products, prices, and quality — all in one place.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "40px"
        }}>
          {faqItems.map((q, i) => (
            <div key={i} style={faqItem}>
              <div style={verticalLine}></div>
              <div>
                <h5 style={{ fontSize: "16px" }}>{q.title}</h5>
                <p style={{ fontSize: "14px", color: "#666" }}>{q.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
</div>
    </div>
  );
}

const imgCard = {
  width: "160px",
  height: "160px",
  background: "#ececec",
  borderRadius: "20px"
};

const primaryBtn = {
  background: "#c7f000",
  border: "none",
  padding: "12px 26px",
  borderRadius: "12px",
  marginRight: "12px",
  fontWeight: 600
};

const outlineBtn = {
  border: "1px solid #ddd",
  background: "transparent",
  padding: "12px 26px",
  borderRadius: "12px"
};

const sectionTitle = {
  fontSize: "36px",
  fontWeight: 700
};

const sectionDesc = {
  maxWidth: "760px",
  fontSize: "15px",
  color: "#666",
  marginTop: "10px"
};

const highlightTab = {
  background: "#c7f000",
  padding: "6px 16px",
  borderRadius: "20px",
  border: "none",
  marginRight: "10px",
  fontSize: "13px"
};

const tabBtn = {
  background: "#f5f5f5",
  padding: "6px 16px",
  borderRadius: "20px",
  border: "1px solid #e5e5e5",
  fontSize: "13px"
};

const featureCard = {
  background: "#f6f6f6",
  padding: "24px",
  borderRadius: "20px"
};

const featureDesc = {
  fontSize: "14px",
  color: "#666",
  margin: "12px 0"
};

const carouselBox = {
  borderRadius: "22px",
  overflow: "hidden"
};

const carouselTrack = {
  display: "flex",
  animation: "slide 12s infinite"
};

const carouselImg = {
  width: "100%",
  flexShrink: 0
};

const faqItem = {
  display: "flex",
  gap: "16px"
};

const verticalLine = {
  width: "2px",
  background: "#e2e2e2"
};

const faqItems = [
  { title: "How does comparison actually work?", desc: "Just type in what you’re looking for and we’ll show options instantly." },
  { title: "Do I need to sign up?", desc: "No sign-up needed – browse freely." },
  { title: "Which stores are included?", desc: "We bring together trusted online stores." },
  { title: "Is my information protected?", desc: "We keep your data safe and secure." },
  { title: "Can I watch for price drops?", desc: "Get notified when prices fall." },
  { title: "How can I get help?", desc: "Our support team is always ready to help." }
];
