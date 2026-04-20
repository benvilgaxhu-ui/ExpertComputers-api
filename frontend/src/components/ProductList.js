import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import apiBase from '../config'; // Use the relative path to your config file

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    // 🚀 Strict category list as requested
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
        if (!img) return 'https://via.placeholder.com/300x200?text=Expert+Computers';
        return img.startsWith('http') ? img : `${apiBase}${img}`;
    };

    if (loading) return (
        <div className="text-center mt-5 py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Scanning Inventory...</p>
        </div>
    );

    return (
        /* 🚀 container-fluid + px-md-5 removes side space and uses full screen width on laptops */
        <div className="container-fluid px-3 px-md-5 py-3 py-md-4">
            
            {/* --- SEARCH & FILTER SECTION --- */}
            <div className="row mb-3 mb-md-4 justify-content-center">
                <div className="col-lg-6 col-md-8">
                    {/* Search Bar */}
                    <div className="input-group shadow-sm rounded-pill overflow-hidden border mb-3 mb-md-4">
                        <span className="input-group-text bg-white border-0 ps-3 ps-md-4">
                            <i className="bi bi-search text-primary"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 py-2 py-md-3 shadow-none" 
                            placeholder="Search brand or model..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Scroller */}
                    <div className="d-flex gap-2 overflow-auto pb-2 justify-content-start justify-content-md-center hide-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`btn rounded-pill px-3 px-md-4 fw-bold transition-all text-nowrap ${
                                    activeCategory === cat ? 'btn-primary shadow' : 'btn-light text-muted border'
                                }`}
                                style={{ fontSize: '0.85rem' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- PRODUCT GRID --- */}
            {/* 🚀 col-6 for mobile (2 items) | col-md-4 for laptop (exactly 3 items) */}
            <div className="row g-2 g-md-4 product-grid-row">
                {filteredProducts.map(p => (
                    <div key={p._id} className="col-6 col-md-4 animate__animated animate__fadeInUp">
                        {/* Wrapper Link leads directly to the product details/checkout page */}
                        <Link to={`/product/${p._id}`} className="text-decoration-none h-100 d-block">
                            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative product-card hover-lift transition-all bg-white">
                                
                                {/* Category Badge */}
                                <span className="badge bg-dark-subtle text-dark position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill" style={{zIndex: 10, fontSize: '0.6rem'}}>
                                    {p.category}
                                </span>

                                {/* Discount Badge */}
                                {p.mrp > p.price && (
                                    <span className="badge bg-danger position-absolute top-0 start-0 m-2 shadow-sm px-2 py-1 rounded-pill" style={{zIndex: 10, fontSize: '0.7rem'}}>
                                        {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                                    </span>
                                )}

                                {/* Image Container - Responsive heights for 2/3 column balance */}
                                <div className="p-2 p-md-4 bg-white text-center d-flex align-items-center justify-content-center" style={{ height: '140px', mdHeight: '240px' }}>
                                    <img 
                                        src={resolveImage(p.images?.[0])} 
                                        className="img-fluid" 
                                        alt={p.name}
                                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                
                                <div className="card-body p-2 p-md-3 d-flex flex-column">
                                    <span className="text-primary fw-bold text-uppercase mb-1" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{p.brand}</span>
                                    
                                    {/* Name - Truncated for uniform grid height */}
                                    <h6 className="fw-bold text-dark mb-2 mobile-title-truncate" style={{ fontSize: '0.95rem', lineHeight: '1.3', height: '40px', overflow: 'hidden' }}>
                                        {p.name}
                                    </h6>

                                    <div className="mb-2 mb-md-3">
                                        <div className="d-flex flex-wrap align-items-center gap-1">
                                            <span className="text-primary fw-bold fs-5 fs-md-4">
                                                ₹{p.price.toLocaleString('en-IN')}
                                            </span>
                                            {p.mrp > p.price && (
                                                <small className="text-muted text-decoration-line-through" style={{ fontSize: '0.8rem' }}>
                                                    ₹{p.mrp.toLocaleString('en-IN')}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* 🚀 DIRECT BUY: Action leads straight to payment flow on details page */}
                                    <div className="mt-auto">
                                        <button 
                                            className="btn btn-primary w-100 fw-bold py-2 shadow-sm rounded-3 mb-2"
                                            style={{ fontSize: '0.85rem' }}
                                        >
                                            Buy Now
                                        </button>
                                        <div className="text-center">
                                            <span className="text-muted small fw-bold" style={{ fontSize: '0.7rem' }}>
                                                View Specs <i className="bi bi-arrow-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-5">
                    <i className="bi bi-layers-half display-1 text-muted"></i>
                    <h3 className="mt-4 text-muted">No items found in "{activeCategory}"</h3>
                    <button className="btn btn-primary rounded-pill mt-3" onClick={() => {setActiveCategory('All'); setSearchTerm('');}}>
                        Reset All Filters
                    </button>
                </div>
            )}

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .product-card {
                    transition: all 0.3s ease;
                    border: 1px solid #f2f2f2 !important;
                }

                .hover-lift:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
                    border-color: #00aaff !important;
                }

                @media (max-width: 576px) {
                    .mobile-title-truncate {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    .product-card {
                        border-radius: 15px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductList;