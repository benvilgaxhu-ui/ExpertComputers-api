import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  // ✅ Load products from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("adminProducts");
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  // ✅ Save products to localStorage every time they change
  useEffect(() => {
    localStorage.setItem("adminProducts", JSON.stringify(products));
  }, [products]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add new product
  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert("Please fill all fields!");
      return;
    }

    const updatedList = [
      ...products,
      { id: Date.now(), ...newProduct },
    ];
    setProducts(updatedList);
    setNewProduct({ name: "", price: "", image: "" });
  };

  // ✅ Delete product
  const handleDelete = (id) => {
    const updatedList = products.filter((p) => p.id !== id);
    setProducts(updatedList);
  };

  return (
    <div className="admin-page">
      <h1>🛠 Admin Panel</h1>

      {/* 🧩 Add New Product Form */}
      <div className="form-section">
        <input
          type="text"
          name="name"
          placeholder="Laptop Name"
          value={newProduct.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={handleChange}
        />
        <button onClick={handleAdd}>➕ Add Laptop</button>
      </div>

      {/* 🧱 Product Grid */}
      <div className="admin-products">
        {products.length === 0 ? (
          <p>No laptops added yet ⚡</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="admin-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">{product.price}</p>
              <button onClick={() => handleDelete(product.id)}>
                🗑 Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
