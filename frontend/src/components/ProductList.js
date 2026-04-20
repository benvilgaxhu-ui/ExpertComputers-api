import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import apiBase from '../config'; 

const ProductList = () => {
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

    const handleWhatsAppInquiry = (e, p) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        const phoneNumber = "919319199300"; 
        const message = `Hi Expert Computers! 👋 I'm interested in:\n💻 *${p.name}*\n💰 Price: ₹${p.price.toLocaleString('en-IN')}\n🔗 Link: ${window.location.origin}/product/${p._id}`;
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
        /* 🚀 container-fluid removes the side constraints, px-md-5 adds professional breathing room */
        <div className="container-fluid px-3 px-md-5 py-3 py-md-4">
            
            {/* SEARCH & FILTER */}
            <div className="row mb-4 justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="input-group shadow-sm rounded-pill overflow-hidden border mb-3">
                        <span className="input-group-text bg-white border-0 ps-3">
                            <i className="bi bi-search text-primary"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 py-2 shadow-none" 
                            placeholder="Search brand or model..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="d-flex gap-2 overflow-auto pb-2 justify-content-start justify-content-md-center hide-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`btn rounded-pill px-3 fw-bold transition-all text-nowrap ${
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
            {/* g-3 for tighter spacing, g-md-4 for desktop */}
            <div className="row g-3 g-md-4">
                {filteredProducts.map(p => (
                    /* 🚀 col-6 = 2 items on mobile | col-md-4 = 3 items on laptop/desktop */
                    <div key={p._id} className="col-6 col-md-4 animate__animated animate__fadeInUp">
                        <Link to={`/product/${p._id}`} className="text-decoration-none h-100 d-block">
                            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative product-card hover-lift bg-white">
                                
                                {/* Badge logic */}
                                <span className="badge bg-dark-subtle text-dark position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill" style={{zIndex: 10, fontSize: '0.6rem'}}>
                                    {p.category}
                                </span>

                                {p.mrp > p.price && (
                                    <span className="badge bg-danger position-absolute top-0 start-0 m-2 shadow-sm px-2 py-1 rounded-pill" style={{zIndex: 10, fontSize: '0.7rem'}}>
                                        {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                                    </span>
                                )}

                                {/* Image Box - Slightly taller for 3-column layout */}
                                <div className="p-2 p-md-4 bg-white text-center d-flex align-items-center justify-content-center" style={{ height: '180px', mdHeight: '260px' }}>
                                    <img 
                                        src={resolveImage(p.images?.[0])} 
                                        className="img-fluid" 
                                        alt={p.name}
                                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                
                                <div className="card-body p-3 d-flex flex-column">
                                    <span className="text-primary fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>{p.brand}</span>
                                    
                                    <h6 className="fw-bold text-dark mb-2 mobile-title-truncate" style={{ fontSize: '1rem', lineHeight: '1.3', height: '42px', overflow: 'hidden' }}>
                                        {p.name}
                                    </h6>

                                    <div className="mb-3">
                                        <div className="d-flex flex-wrap align-items-center gap-2">
                                            <span className="text-primary fw-bold fs-5">
                                                ₹{p.price.toLocaleString('en-IN')}
                                            </span>
                                            {p.mrp > p.price && (
                                                <small className="text-muted text-decoration-line-through">
                                                    ₹{p.mrp.toLocaleString('en-IN')}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <button 
                                            onClick={(e) => handleWhatsAppInquiry(e, p)}
                                            className="btn btn-success w-100 fw-bold py-2 shadow-sm rounded-3 mb-2"
                                        >
                                            <i className="bi bi-whatsapp me-2"></i> Buy
                                        </button>
                                        <div className="text-center">
                                            <span className="text-muted small fw-bold" style={{ fontSize: '0.75rem' }}>
                                                View Details <i className="bi bi-arrow-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .product-card {
                    transition: all 0.3s ease;
                    border: 1px solid #f0f0f0 !important;
                }

                .hover-lift:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
                    border-color: #00aaff !important;
                }

                @media (max-width: 576px) {
                    .mobile-title-truncate {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductList;