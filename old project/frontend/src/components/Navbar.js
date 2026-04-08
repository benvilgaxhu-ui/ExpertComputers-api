import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { cartItems } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MyShop</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart" className="cart-link">
          🛒 Cart <span className="cart-count">{cartItems.length}</span>
        </Link>
      </div>
    </nav>
  );
}
