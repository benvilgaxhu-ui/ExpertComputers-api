import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Expert Computers 💻</h1>
        <p>Buy Certified Refurbished Laptops at Affordable Prices</p>
        <Link to="/products" className="shop-btn">Shop Now</Link>
      </div>
    </div>
  );
}

export default Home;
