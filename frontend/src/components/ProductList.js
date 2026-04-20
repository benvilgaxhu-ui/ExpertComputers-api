import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import apiBase from '../config'; 

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Gaming', 'Apple', 'Business', 'Parts', 'Accessories'];

    useEffect(() => {
        axios.get(`${apiBase}/api/products`)
            .then(res => {
                setProducts(res.data);
                setFilteredProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let results = products;
        if (activeCategory !== 'All') {
            results = results.filter(p => p.category === activeCategory);
        }
        if (searchTerm) {
            results = results.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredProducts(results);
    }, [searchTerm, activeCategory, products]);

    const resolveImage = (img) => {
        if (!img) return 'https://via.placeholder.com/600x400?text=Expert+Computers';
        return img.startsWith('http') ? img : `${apiBase}${img}`;
    };

    // 🚀 Navigate directly to checkout/details page for address and scanner
    const handleBuyNow = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/product/${productId}`);
    };

    if (loading) return (
        <div className="text-center mt-5 py-5">
            <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}></div>
            <p className="mt-3 fw-bold text-primary">Loading Expert Inventory...</p>
        </div>
    );

    return (
        /* 🚀 container-fluid removes the gaps from sides */
        <div className="container-fluid px-2 px-md-4 py-4 bg-white">
            
            {/* --- SEARCH & FILTER SECTION --- */}
            <div className="row mb-5 justify-content-center">
                <div className="col-lg-6 col-md-10">
                    <div className="input-group shadow-sm rounded-pill overflow-hidden border border-2 mb-4">
                        <span className="input-group-text bg-white border-0 ps-4">
                            <i className="bi bi-search text-primary fs-5"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 py-3 shadow-none" 
                            placeholder="Search by brand, model or specs..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="d-flex gap-2 overflow-auto pb-2 justify-content-start justify-content-md-center hide-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`btn rounded-pill px-4 fw-bold transition-all text-nowrap ${
                                    activeCategory === cat ? 'btn-primary shadow' : 'btn-light text-muted border'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- PRODUCT GRID --- */}
            {/* 🚀 col-12 for 1 item on mobile | col-md-4 for 3 items on laptop */}
            <div className="row g-4">
                {filteredProducts.map(p => (
                    <div key={p._id} className="col-12 col-md-4 animate__animated animate__fadeInUp">
                        <Link to={`/product/${p._id}`} className="text-decoration-none h-100 d-block">
                            <div className="card h-100 border-0 shadow rounded-4 overflow-hidden position-relative product-card-hover">
                                
                                {/* Status Badges */}
                                <div className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2" style={{zIndex: 5}}>
                                    <span className="badge bg-dark px-3 py-2 rounded-pill shadow-sm" style={{fontSize: '0.75rem'}}>
                                        {p.category}
                                    </span>
                                    {p.mrp > p.price && (
                                        <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm fw-bold">
                                            {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                                        </span>
                                    )}
                                </div>

                                {/* 🚀 MASSIVE IMAGE CONTAINER */}
                                <div className="image-box bg-white d-flex align-items-center justify-content-center p-3">
                                    <img 
                                        src={resolveImage(p.images?.[0])} 
                                        className="main-img transition-all" 
                                        alt={p.name}
                                    />
                                </div>
                                
                                <div className="card-body p-4 d-flex flex-column">
                                    <span className="text-primary fw-bold text-uppercase small mb-2" style={{ letterSpacing: '2px' }}>
                                        {p.brand}
                                    </span>
                                    
                                    {/* 🚀 NO TRUNCATION: Full Title Shown */}
                                    <h5 className="fw-bold text-dark mb-3 lh-base">
                                        {p.name}
                                    </h5>

                                    <div className="mb-4 d-flex align-items-baseline gap-2">
                                        <span className="fs-3 fw-bolder text-primary">
                                            ₹{p.price.toLocaleString('en-IN')}
                                        </span>
                                        {p.mrp > p.price && (
                                            <span className="text-muted text-decoration-line-through fs-6">
                                                ₹{p.mrp.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-auto pt-3 border-top">
                                        {/* 🚀 BUY NOW: Direct link to Address/Scanner flow */}
                                        <button 
                                            onClick={(e) => handleBuyNow(e, p._id)}
                                            className="btn btn-primary w-100 py-3 fw-bold shadow-sm rounded-3 mb-3 fs-5"
                                        >
                                            Buy Now
                                        </button>
                                        <div className="text-center">
                                            <span className="text-muted fw-bold small">
                                                VIEW FULL SPECIFICATIONS <i className="bi bi-chevron-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Custom Styles for Professional UI */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                /* 🚀 Responsive Image Heights */
                .image-box {
                    height: 380px; /* Laptop size */
                }

                @media (max-width: 768px) {
                    .image-box {
                        height: 300px; /* Mobile size */
                    }
                }

                .main-img {
                    max-height: 100%;
                    max-width: 100%;
                    object-fit: contain;
                }

                .product-card-hover {
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    border: 1px solid #f0f0f0 !important;
                }

                .product-card-hover:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0, 150, 255, 0.12) !important;
                    border-color: #0096FF !important;
                }

                .product-card-hover:hover .main-img {
                    transform: scale(1.08);
                }

                .btn-primary {
                    background-color: #0096FF !important;
                    border: none;
                }

                .btn-primary:hover {
                    background-color: #007acc !important;
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default ProductList;