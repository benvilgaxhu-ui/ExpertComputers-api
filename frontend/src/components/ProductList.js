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
    const categories = ['All', 'Gaming', 'Business', 'Student', 'Parts', 'Accessories'];

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

    const handleWhatsAppInquiry = (e, p) => {
        // 🚀 CRITICAL: Stops the card click from opening the product details
        e.preventDefault(); 
        e.stopPropagation(); 
        
        const phoneNumber = "919319199300"; 
        const message = `Hi Expert Computers! 👋 I'm interested in:
💻 *${p.name}*
💰 Price: ₹${p.price.toLocaleString('en-IN')}
🔗 Link: ${window.location.origin}/product/${p._id}`;

        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

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
        <div className="container py-4">
            
            {/* --- SEARCH & FILTER SECTION --- */}
            <div className="row mb-4 justify-content-center">
                <div className="col-lg-8">
                    <div className="input-group shadow-sm rounded-pill overflow-hidden border mb-4">
                        <span className="input-group-text bg-white border-0 ps-4">
                            <i className="bi bi-search text-primary"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 py-3" 
                            placeholder="Search by brand or model..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="d-flex gap-2 overflow-auto pb-3 justify-content-md-center">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`btn rounded-pill px-4 fw-bold transition-all ${
                                    activeCategory === cat ? 'btn-primary shadow' : 'btn-light text-muted'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- PRODUCT GRID --- */}
            <div className="row g-4">
                {filteredProducts.map(p => (
                    <div key={p._id} className="col-md-6 col-lg-4 animate__animated animate__fadeInUp">
                        {/* 🚀 WRAPPER LINK: Makes the entire card clickable */}
                        <Link to={`/product/${p._id}`} className="text-decoration-none">
                            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative product-card hover-lift transition-all">
                                
                                {/* Category Badge */}
                                <span className="badge bg-dark-subtle text-dark position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill" style={{zIndex: 10, fontSize: '0.7rem'}}>
                                    {p.category}
                                </span>

                                {/* Discount Badge (Handles MRP 0) */}
                                {p.mrp > p.price && (
                                    <span className="badge bg-danger position-absolute top-0 start-0 m-3 shadow-sm px-3 py-2 rounded-pill" style={{zIndex: 10}}>
                                        {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                                    </span>
                                )}

                                <div className="p-3 bg-white text-center" style={{ height: '220px' }}>
                                    <img 
                                        src={resolveImage(p.images?.[0])} 
                                        className="img-fluid" 
                                        alt={p.name}
                                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                
                                <div className="card-body d-flex flex-column">
                                    <span className="text-primary small fw-bold text-uppercase">{p.brand}</span>
                                    <h6 className="fw-bold text-dark mb-3" style={{ height: '40px', overflow: 'hidden' }}>{p.name}</h6>

                                    <div className="mb-4">
                                        <h4 className="text-primary fw-bold mb-0 d-inline">
                                            ₹{p.price.toLocaleString('en-IN')}
                                        </h4>
                                        
                                        {/* 🚀 MRP Fix: Only show if higher than sale price */}
                                        {p.mrp > p.price && (
                                            <small className="text-muted text-decoration-line-through ms-2">
                                                ₹{p.mrp.toLocaleString('en-IN')}
                                            </small>
                                        )}
                                    </div>
                                    
                                    <div className="mt-auto d-grid gap-2">
                                        <button 
                                            onClick={(e) => handleWhatsAppInquiry(e, p)}
                                            className="btn btn-success fw-bold py-2 shadow-sm rounded-3"
                                        >
                                            <i className="bi bi-whatsapp me-2"></i> Buy on WhatsApp
                                        </button>
                                        
                                        <span className="btn btn-outline-secondary btn-sm py-2 rounded-3 text-muted border-0">
                                            View Details →
                                        </span>
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
        </div>
    );
};

export default ProductList;