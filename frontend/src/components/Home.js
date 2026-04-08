import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// 🚀 Dynamic Carousel Import
import GamingCarousel from './GamingCarousel'; 

const Home = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', issue: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('${apiBase}/api/services', formData);
            Swal.fire({
                title: 'Request Received!',
                text: 'An Expert Technician will call you shortly.',
                icon: 'success',
                confirmButtonColor: '#0d6efd'
            });
            setFormData({ name: '', phone: '', issue: '' });
        } catch (err) {
            Swal.fire('Error', 'Could not book service. Try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* --- HERO SECTION WITH OVERLAY --- */}
            <div 
                className="hero-section text-white py-5 shadow-lg" 
                style={{ 
                    backgroundImage: `url('/assets/new_banner.png')`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    minHeight: '550px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {/* Dark Overlay for Readability */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.65)' }}></div>

                <div className="container position-relative" style={{ zIndex: 2 }}>
                    <div className="row">
                        <div className="col-lg-8 animate__animated animate__fadeInLeft">
                            <h1 className="display-2 fw-bold mb-2">EXPERT COMPUTERS</h1>
                            <h2 className="h1 mb-4 text-info fw-light">Delhi's Trusted Repair & Sales Hub</h2>
                            <p className="lead mb-5 fs-4 opacity-90">Specializing in Chip-Level Motherboard Repair & Premium Laptop Sales.</p>
                            <div className="d-flex gap-3">
                                <Link to="/laptops" className="btn btn-primary btn-lg px-5 fw-bold rounded-pill shadow">View Catalog</Link>
                                <a href="#repair-form" className="btn btn-outline-light btn-lg px-5 fw-bold rounded-pill">Book Repair</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 🚀 THE CHANGING TILE (GAMING CAROUSEL) --- */}
            {/* This is placed exactly in the white space you circled */}
            <GamingCarousel />

            {/* --- MAIN CONTENT --- */}
            <div className="container my-5 py-2">
                <div className="row g-5 align-items-center">
                    
                    {/* LEFT: CORE EXPERTISE */}
                    <div className="col-md-7 animate__animated animate__fadeInUp">
                        <h2 className="fw-bold mb-4 border-bottom pb-2">Our Core Expertise</h2>
                        <div className="row g-4">
                            <div className="col-sm-6">
                                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift transition-all">
                                    <div className="mb-3 fs-1">💻</div>
                                    <h4 className="fw-bold">Premium Sales</h4>
                                    <p className="text-muted small mb-0">Brand new and certified refurbished laptops at unbeatable prices in Delhi.</p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift transition-all">
                                    <div className="mb-3 fs-1">🔧 Chip-Level Repair</div>
                                    <h4 className="fw-bold">Expert Repairs</h4>
                                    <p className="text-muted small mb-0">Advanced motherboard repair, screen replacement, and professional data recovery.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-5 p-4 bg-light rounded-4 border-start border-primary border-5">
                            <h5 className="fw-bold"><i className="bi bi-patch-check-fill text-primary me-2"></i>Why Choose Us?</h5>
                            <p className="mb-0 text-secondary">We provide 1-year warranty on all laptop sales and a 'No-Fix, No-Fee' policy for motherboard repairs.</p>
                        </div>
                    </div>

                    {/* RIGHT: SERVICE FORM */}
                    <div className="col-md-5" id="repair-form">
                        <div className="card p-4 shadow-lg border-0 rounded-4 animate__animated animate__fadeInRight">
                            <div className="text-center mb-4">
                                <span className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill mb-2">QUICK BOOKING</span>
                                <h3 className="fw-bold">Instant Repair Request</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="small fw-bold mb-1">Full Name</label>
                                    <input type="text" className="form-control py-2 border-0 bg-light" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Enter your name" />
                                </div>
                                <div className="mb-3">
                                    <label className="small fw-bold mb-1">Phone (WhatsApp preferred)</label>
                                    <input type="tel" className="form-control py-2 border-0 bg-light" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required placeholder="e.g. 9319199300" />
                                </div>
                                <div className="mb-3">
                                    <label className="small fw-bold mb-1">Issue Details</label>
                                    <textarea className="form-control border-0 bg-light" rows="3" value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} required placeholder="Tell us what's wrong with your device..."></textarea>
                                </div>
                                <button className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm mt-2" disabled={loading}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Connecting...</>
                                    ) : (
                                        'Book Expert Service Now'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;