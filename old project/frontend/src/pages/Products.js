import React from "react";
import { useCart } from "../context/CartContext";
import "./Products.css";

const products = [
  { id: 1, name: "Product 1", price: 499, img: "https://via.placeholder.com/150" },
  { id: 2, name: "Product 2", price: 799, img: "https://via.placeholder.com/150" },
  { id: 3, name: "Product 3", price: 999, img: "https://via.placeholder.com/150" },
];

export default function Products() {
  const { addToCart } = useCart();

  return (
    <div className="products-page">
      <h2>Products</h2>
      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={p.img} alt={p.name} />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button className="add-btn" onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
