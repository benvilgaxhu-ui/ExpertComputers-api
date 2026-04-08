import React from "react";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { cartItems, removeFromCart } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.name} (x{item.qty})</span>
              <span>₹{item.price * item.qty}</span>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <h3>Total: ₹{total}</h3>
        </div>
      )}
    </div>
  );
}
