import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import GamingCarousel from './GamingCarousel'; 
import apiBase from '../config'; 

const Home = () => {
    // Keep the local state names as is for easy form handling
    const [formData, setFormData] = useState({ name: '', phone: '', issue: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // 🛠️ FIX: Format the data to match your Mongoose Model
            const dataToSubmit = {
                name: formData.name,
                contact: formData.phone, // Map 'phone' to 'contact'
                issue: formData.issue,
                device: "Laptop/Mobile"  // Provide the required 'device' field
            };

            await axios.post(`${apiBase}/api/services`, dataToSubmit);

            Swal.fire({
                title: 'Request Received!',
                text: 'An Expert Technician will call you shortly.',
                icon: 'success',
                confirmButtonColor: '#00aaff'
            });

            // Reset form
            setFormData({ name: '', phone: '', issue: '' });
        } catch (err) {
            console.error("Booking Error:", err.response?.data || err.message);
            Swal.fire('Error', 'Could not book service. Please check your connection.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-x-hidden bg-white">
            {/* --- 📱 MOBILE OPTIMIZED HERO SECTION --- */}
            <div 
                className="hero-section text-white py-5 shadow-lg" 
                style={{ 
                    backgroundImage: `url('/assets/new_banner.png')`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    minHeight: 'auto', // Responsive height
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {/* Dark Overlay for Readability */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)' }}></div>

                <div className="container position-relative py-4 py-md-5" style={{ zIndex: 2 }}>
                    <div className="row">
                        {/* Text Alignment: Center on Mobile, Left on Desktop */}
                        <div className="col-lg-8 text-center text-lg-start animate__animated animate__fadeInLeft">
                            <h1 className="fw-bold mb-2 main-title">EXPERT COMPUTERS</h1>
                            <h2 className="h4 h2-md mb-4 text-info fw-light subtitle-text">Delhi's Trusted Repair & Sales Hub</h2>
                            <p className="lead mb-4 mb-md-5 fs-6 fs-md-4 opacity-90 px-2 px-lg-0">
                                Specializing in Chip-Level Motherboard Repair & Premium Laptop Sales.
                            </p>
                            
                            {/* Buttons: Stacks on Mobile (d-grid), Inline on Desktop (d-md-flex) */}
                            <div className="d-grid d-md-flex justify-content-center justify-content-lg-start gap-3 px-4 px-md-0">
                                <Link to="/laptops" className="btn btn-primary btn-lg px-md-5 fw-bold rounded-pill shadow-sm py-3">
                                    View Catalog
                                </Link>
                                <a href="#repair-form" className="btn btn-outline-light btn-lg px-md-5 fw-bold rounded-pill py-3">
                                    Book Repair
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- GAMING CAROUSEL --- */}
            <GamingCarousel />

            {/* --- MAIN CONTENT --- */}
            <div className="container my-4 my-md-5 py-2">
                <div className="row g-4 g-lg-5 align-items-start">
                    
                    {/* LEFT: CORE EXPERTISE */}
                    <div className="col-md-7 animate__animated animate__fadeInUp">
                        <h2 className="fw-bold mb-4 border-bottom pb-2">Our Core Expertise</h2>
                        <div className="row g-3">
                            <div className="col-12 col-sm-6">
                                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift transition-all bg-light">
                                    <div className="mb-2 fs-1 text-center text-sm-start">💻</div>
                                    <h4 className="fw-bold h5 text-center text-sm-start">Premium Sales</h4>
                                    <p className="text-muted small mb-0 text-center text-sm-start">Certified refurbished laptops at unbeatable prices in Delhi.</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift transition-all bg-light">
                                    <div className="mb-2 fs-1 text-center text-sm-start">🔧</div>
                                    <h4 className="fw-bold h5 text-center text-sm-start">Expert Repairs</h4>
                                    <p className="text-muted small mb-0 text-center text-sm-start">Motherboard repair, screen replacement, and data recovery.</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Mobile Optimized Trust Banner */}
                        <div className="mt-4 mt-md-5 p-3 p-md-4 bg-primary bg-opacity-10 rounded-4 border-start border-primary border-5 shadow-sm text-center text-sm-start">
                            <h6 className="fw-bold mb-2 text-primary"><i className="bi bi-patch-check-fill me-2"></i>Why Choose Us?</h6>
                            <p className="mb-0 text-secondary small px-1 px-sm-0">
                                3-month warranty on all laptop sales and a 'No-Fix, No-Fee' policy for repairs.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: SERVICE FORM (Stacks on Mobile) */}
                    <div className="col-md-5" id="repair-form">
                        <div className="card p-3 p-md-4 shadow-lg border-0 rounded-4 animate__animated animate__fadeInRight bg-white mx-1 mx-md-0 border-top border-info border-5">
                            <div className="text-center mb-3">
                                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-2 small fw-bold">QUICK BOOKING</span>
                                <h3 className="fw-bold h4">Instant Repair Request</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="small fw-bold mb-1 text-muted">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control py-3 border-0 bg-light rounded-3" 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})} 
                                        required 
                                        placeholder="Enter your name" 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="small fw-bold mb-1 text-muted">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        className="form-control py-3 border-0 bg-light rounded-3" 
                                        value={formData.phone} 
                                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                                        required 
                                        placeholder="Active WhatsApp number" 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="small fw-bold mb-1 text-muted">Issue Details</label>
                                    <textarea 
                                        className="form-control border-0 bg-light rounded-3" 
                                        rows="3" 
                                        value={formData.issue} 
                                        onChange={e => setFormData({...formData, issue: e.target.value})} 
                                        required 
                                        placeholder="Briefly describe the problem..."
                                    ></textarea>
                                </div>
                                <button className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm mt-2" disabled={loading}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Connecting...</>
                                    ) : (
                                        'Book Expert Service'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- 📟 CUSTOM HOME CSS --- */}
            <style>{`
                .main-title {
                    font-size: calc(2.2rem + 2.5vw);
                    line-height: 1.1;
                    letter-spacing: -1px;
                }
                .subtitle-text {
                    font-size: calc(1rem + 1vw);
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                
                /* Prevent horizontal scroll from animations */
                .overflow-x-hidden {
                    overflow-x: hidden !important;
                }

                @media (max-width: 768px) {
                    .hero-section {
                        text-align: center;
                    }
                    .main-title {
                        font-size: 2.2rem;
                    }
                    .subtitle-text {
                        font-size: 1.1rem;
                    }
                    .card {
                        border-radius: 20px !important;
                    }
                    /* Vital fix for iOS safari auto-zooming on input focus */
                    input, textarea, select {
                        font-size: 16px !important;
                    }
                    .container {
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                    .btn-lg {
                        font-size: 1.1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;