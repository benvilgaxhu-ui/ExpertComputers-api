import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";

// 🧠 Same data as in Products.jsx (you can later move this to a shared file)
const products = [
  {
    id: 1,
    name: "Acer Predator Helios 300",
    price: "₹1,20,000",
    specs: "i7 10th Gen | RTX 3060 | 16GB RAM | 1TB SSD",
    description:
      "A high-performance gaming laptop with strong thermals, RGB keyboard, and a blazing-fast 144 Hz display.",
    image:
      "https://imgs.search.brave.com/Z-vDee2fflk3RFuDrJeNaZe_p6kzaJWhTsr_4OYfzQw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/LnNtYXJ0cHJpeC5j/b20vcngtaTcwb3hR/b1hhLXc0MjAtaDQy/MC9hY2VyLXByZWRh/dG9yLWhlbGlvcy53/ZWJw",
  },
  {
    id: 2,
    name: "Asus TUF Gaming F15",
    price: "₹95,000",
    specs: "i5 11th Gen | RTX 3050 | 16GB RAM | 512GB SSD",
    description:
      "Durable and powerful, built for everyday gaming with a tough MIL-STD design.",
    image:
      "https://imgs.search.brave.com/ELzPRrqaA_QXU33PqGck_zqGTaQmWclhkc4WXJe6Xak/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kbGNk/bndlYmltZ3MuYXN1/cy5jb20vZmlsZXMv/bWVkaWEvZGZlOTI1/ZDgtNGQ2Mi00Zjk4/LWFmOTctYWExMGFl/ZDhiYWFhL3YxL2lt/YWdlcy9tb2JpbGUv/a3Yva3YuanBn",
  },
  {
    id: 3,
    name: "HP Omen 16",
    price: "₹1,35,000",
    specs: "Ryzen 7 5800H | RTX 3070 | 16GB RAM | 1TB SSD",
    description:
      "Smooth performance, stunning visuals, and great build quality for hardcore gamers.",
    image:
      "https://imgs.search.brave.com/-kTBTA57VvzR2L8Dk-oF5uqsjQ7-SHo4rFug9iYhfAg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9qcC5l/eHQuaHAuY29tL2Nv/bnRlbnQvZGFtL2pw/LWV4dC1ocC1jb20v/anAvamEvZWMvZ2Ft/aW5nL3BlcnNvbmFs/L29tZW5fMTZfYW0v/aW1hZ2VzL3ZyMjAy/Ml9tYWluX3Byb2R1/Y3QucG5n",
  },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-details">
        <h2>Product not found 🚫</h2>
        <button className="back-button" onClick={() => navigate("/products")}>
          🔙 Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-details">
      <div className="details-container">
        <div className="image-section">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="info-section">
             <div>
      <h1>Product Details Page</h1>
      <p>Product ID: {id}</p>
    </div>
          <h1>{product.name}</h1>
          <p className="price">{product.price}</p>
          <p className="specs">{product.specs}</p>
          <p className="description">{product.description}</p>

          <button className="buy-button">🛒 Buy Now</button>
          <button
            className="back-button"
            onClick={() => navigate("/products")}
          >
            🔙 Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
