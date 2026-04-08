// src/components/ProductCard.js
import React from "react";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const inCart = cartItems.some((item) => item.id === product.id);

  const handleCartClick = () => {
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="product-price">₹{product.price.toLocaleString()}</p>
      <button
        className={`cart-btn ${inCart ? "in-cart" : ""}`}
        onClick={handleCartClick}
      >
        {inCart ? "In Cart" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
